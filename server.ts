import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
// Vite is imported dynamically in startServer to avoid issues in production
import Stripe from "stripe";
import cors from "cors";
import { google } from "googleapis";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Google OAuth Client
  const getGoogleAuth = (req: express.Request) => {
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers.host;
    // Removido /api/ para simplificar e bater com a config do Google do usuário
    const redirectUri = `${protocol}://${host}/auth/google/callback`;
    
    const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

    if (!clientId) console.warn("⚠️ GOOGLE_CLIENT_ID não está configurado!");
    if (!clientSecret) console.warn("⚠️ GOOGLE_CLIENT_SECRET não está configurado!");

    return new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );
  };

  // Stripe Client Lazy Init
  let stripeClient: Stripe | null = null;
  const getStripe = () => {
    if (!stripeClient) {
      const key = process.env.STRIPE_SECRET_KEY;
      if (!key) return null;
      stripeClient = new Stripe(key);
    }
    return stripeClient;
  };

  // 1. Logging and CORS
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      if (res.statusCode >= 400) {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
      }
    });
    next();
  });
  app.use(cors());

  app.get("/ping", (req, res) => res.send("pong"));
  app.get("/api/ping", (req, res) => res.json({ status: "pong" }));

  // 2. Stripe Webhook (MUST be before express.json())
  app.post("/api/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const stripe = getStripe();
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripe || !sig || !webhookSecret) {
      return res.status(400).send("Webhook configuration missing.");
    }

    try {
      const event = stripe.webhooks.constructEvent(req.body, sig as string, webhookSecret);
      
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`💰 Payment success: ${session.id} for user ${session.metadata?.userId}`);
      }
      
      res.json({ received: true });
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });

  // Regular Body Parser for standard API routes
  app.use(express.json());

  // Gemini AI Client Lazy Init
  let aiClient: any = null;
  const getAI = () => {
    if (!aiClient) {
      const key = process.env.GEMINI_API_KEY;
      if (!key) return null;
      aiClient = new GoogleGenAI(key as any);
    }
    return aiClient;
  };

  // 4. API Routes
  const apiRouter = express.Router();

  apiRouter.get("/health", (req, res) => {
    const stripe = getStripe();
    res.json({ 
      status: "ok", 
      environment: process.env.NODE_ENV || 'development',
      stripe: {
        configured: !!stripe,
        hasMonthly: !!process.env.STRIPE_PRICE_PRO_MONTHLY,
        hasSemi: !!process.env.STRIPE_PRICE_PRO_SEMIANNUAL,
        hasAnnual: !!process.env.STRIPE_PRICE_PRO_ANNUAL,
      }
    });
  });

  apiRouter.post("/ai/generate-review-response", async (req, res) => {
    const { reviewComment, rating, businessName, tone } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.status(500).json({ error: "Gemini API Key missing on server" });
    }

    const prompt = `
      Você é um assistente de IA especializado em gestão de reputação.
      Sua tarefa é escrever uma resposta profissional e ética para uma avaliação do Google.
      
      Dados da Avaliação:
      - Comentário do Cliente: "${reviewComment}"
      - Nota: ${rating} estrelas
      - Nome do Negócio: ${businessName}
      - Tom de voz desejado: ${tone}
      
      Instruções de Estilo por Tom:
      - AMIGÁVEL: Use linguagem calorosa, emojis, seja pessoal e acolhedor.
      - PROFISSIONAL: Use linguagem polida, formal na medida certa, foco em ética e excelência.
      - PRAGMÁTICO: Seja direto, conciso, focado em resolver problemas rapidamente e mencione eficiência ou ROI se apropriado.
      
      Diretrizes:
      1. Seja empático e profissional.
      2. Se a avaliação for positiva, agradeça e convide o cliente a voltar.
      3. Se a avaliação for negativa, seja diplomático, convide para uma conversa privada e evite discussões públicas.
      4. Respeite a privacidade do cliente.
      5. A resposta deve ser em Português do Brasil.
      6. Mantenha a resposta concisa (máximo 400 caracteres).
      
      Escreva apenas a resposta final.
    `;

    try {
      const model = ai.getGenerativeModel({ model: "gemini-3-flash-preview" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      res.json({ text: text || "Obrigado pelo seu feedback. Estamos sempre trabalhando para oferecer o melhor atendimento." });
    } catch (error: any) {
      console.error("❌ Gemini Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // Google Business Profile Auth Routes
  apiRouter.get("/auth/google/url", (req, res) => {
    const oauth2Client = getGoogleAuth(req);
    const scopes = [
      'https://www.googleapis.com/auth/business.manage',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      include_granted_scopes: true,
      prompt: 'consent'
    });

    res.json({ url });
  });

  app.get("/auth/google/callback", async (req, res) => {
    const { code } = req.query;
    const oauth2Client = getGoogleAuth(req);

    if (!code) return res.status(400).send("No code provided.");

    try {
      const { tokens } = await oauth2Client.getToken(code as string);
      console.log("✅ Google Auth Successful. Tokens acquired.");
      
      res.send(`
        <html>
          <body style="background: #010c0c; color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh;">
            <div style="text-align: center;">
              <h2 style="color: #14b8a6;">Conexão Bem-Sucedida!</h2>
              <p>O Google Business Profile foi conectado ao Estrelize.</p>
              <p>Esta janela fechará automaticamente...</p>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', tokens: ${JSON.stringify(tokens)} }, '*');
                setTimeout(() => window.close(), 2000);
              } else {
                window.location.href = '/onboarding';
              }
            </script>
          </body>
        </html>
      `);
    } catch (error: any) {
      console.error("❌ Google Auth Error:", error.message);
      res.status(500).send(`Auth Failed: ${error.message}`);
    }
  });

  // Fetch Google Business Profile Locations
  apiRouter.post("/google/locations", async (req, res) => {
    const { tokens } = req.body;
    if (!tokens) return res.status(401).json({ error: "Missing tokens" });

    const oauth2Client = getGoogleAuth(req);
    oauth2Client.setCredentials(tokens);

    try {
      const mybusinessbusinessinformation = google.mybusinessbusinessinformation({
        version: 'v1',
        auth: oauth2Client
      });

      const accountsResponse = await (mybusinessbusinessinformation.accounts as any).list();
      const accounts = (accountsResponse.data as any).accounts || [];
      
      if (accounts.length === 0) return res.json({ locations: [] });

      const locationsRes = await (mybusinessbusinessinformation.accounts.locations as any).list({
        parent: accounts[0].name,
        readMask: 'name,title,storefrontAddress,metadata'
      });

      res.json({ 
        locations: locationsRes.data.locations || [],
        account: accounts[0]
      });
    } catch (error: any) {
      console.error("❌ Error fetching Google locations:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // Fetch Reviews for a specific location
  apiRouter.post("/google/reviews", async (req, res) => {
    const { tokens, locationName } = req.body;
    if (!tokens || !locationName) return res.status(400).json({ error: "Missing parameters" });

    const oauth2Client = getGoogleAuth(req);
    oauth2Client.setCredentials(tokens);

    try {
      const mybusinessreviews = (google as any).mybusinessreviews({
        version: 'v1',
        auth: oauth2Client
      });

      const reviewsRes = await mybusinessreviews.accounts.locations.reviews.list({
        parent: locationName
      });

      res.json({ reviews: reviewsRes.data.reviews || [] });
    } catch (error: any) {
      console.error("❌ Error fetching Google reviews:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // Google Places Search for Ranking
  apiRouter.get("/ranking/search", async (req, res) => {
    const { city, specialty } = req.query;
    const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) return res.status(500).json({ error: "Google Maps API Key missing" });
    if (!city) return res.status(400).json({ error: "City is required" });

    try {
      const query = `${specialty || 'clínica'} em ${city}`;
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();

      if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
        throw new Error(data.error_message || data.status);
      }

      const results = (data.results || []).map((place: any) => ({
        id: place.place_id,
        name: place.name,
        rating: place.rating || 0,
        reviews: place.user_ratings_total || 0,
        address: place.formatted_address,
        specialty: (specialty as string || 'Saúde').toUpperCase(),
        slug: place.place_id
      }));

      res.json({ results });
    } catch (error: any) {
      console.error("❌ Google Places Search Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // Google Place Details for Clinic Profile
  apiRouter.get("/ranking/details", async (req, res) => {
    const { placeId } = req.query;
    const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) return res.status(500).json({ error: "Google Maps API Key missing" });
    if (!placeId) return res.status(400).json({ error: "Place ID is required" });

    try {
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,opening_hours,photos,reviews&key=${apiKey}&language=pt-BR`;
      
      const response = await fetch(detailsUrl);
      const data = await response.json();

      if (data.status !== "OK") {
        throw new Error(data.error_message || data.status);
      }

      const place = data.result;
      
      let imageUrl = null;
      if (place.photos && place.photos.length > 0) {
        imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`;
      }

      const reviews = (place.reviews || []).map((r: any) => ({
        author_name: r.author_name,
        rating: r.rating,
        text: r.text,
        relative_time_description: r.relative_time_description,
        profile_photo_url: r.profile_photo_url
      }));

      res.json({
        id: placeId,
        name: place.name,
        address: place.formatted_address,
        phone: place.formatted_phone_number || "(Não informado)",
        website: place.website || "N/A",
        google_rating: place.rating || 0,
        review_count: place.user_ratings_total || 0,
        image_url: imageUrl,
        opening_hours: place.opening_hours?.weekday_text || [],
        reviews: reviews
      });
    } catch (error: any) {
      console.error("❌ Google Place Details Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  apiRouter.post("/checkout/create-session", async (req, res) => {
    console.log("💳 [STRIPE] Chamada create-session recebida:", req.body);
    const stripe = getStripe();
    if (!stripe) return res.status(500).json({ error: "Stripe not configured" });

    const { planId, cycle, userId, vertical, email } = req.body;
    
    const pricingMap: any = {
      saude: {
        pro: {
          monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || "price_1TNfZMCHyaM2GGNAnNf4QfxA",
          semiannual: process.env.STRIPE_PRICE_PRO_SEMIANNUAL || "price_1TNfdPCHyaM2GGNANHBX02hV",
          annual: process.env.STRIPE_PRICE_PRO_ANNUAL || "price_1TNfePCHyaM2GGNAVDDG1E5T",
        }
      },
      restaurante: {
        pro: {
          monthly: process.env.STRIPE_PRICE_REST_MONTHLY || "price_rest_monthly_id",
          semiannual: process.env.STRIPE_PRICE_REST_SEMIANNUAL || "price_rest_semi_id",
          annual: process.env.STRIPE_PRICE_REST_ANNUAL || "price_rest_annual_id",
        }
      }
    };

    const vert = vertical || "saude";
    const priceId = pricingMap[vert]?.[planId]?.[cycle || "monthly"];
    if (!priceId) return res.status(400).json({ error: "Invalid plan or cycle" });

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        customer_email: email,
        metadata: { userId: userId || "anonymous", vertical: vertical || "saude" },
        success_url: `${req.headers.origin || 'https://' + req.headers.host}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin || 'https://' + req.headers.host}/dashboard?canceled=true`,
      });
      res.json({ url: session.url });
    } catch (e: any) {
      console.error("❌ Checkout Session Error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  apiRouter.post("/checkout/create-portal", async (req, res) => {
    const stripe = getStripe();
    if (!stripe) return res.status(500).json({ error: "Stripe not configured" });

    const { customerId, email, returnUrl } = req.body;
    
    try {
      let finalCustomerId = customerId;

      if (!finalCustomerId || !finalCustomerId.startsWith('cus_')) {
        if (!email) return res.status(400).json({ error: "Customer ID or Email is required" });
        
        const customers = await stripe.customers.list({ email, limit: 1 });
        if (customers.data.length > 0) {
          finalCustomerId = customers.data[0].id;
        } else {
          return res.status(404).json({ error: "Assinatura não encontrada para este email. Por favor, realize a assinatura primeiro." });
        }
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: finalCustomerId as string,
        return_url: returnUrl || `${req.headers.origin}/dashboard`,
      });
      res.json({ url: session.url });
    } catch (e: any) {
      console.error("Portal Error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  apiRouter.get("/debug-dist", (req, res) => {
    const dPath = path.join(process.cwd(), "dist");
    const exists = fs.existsSync(dPath);
    const contents = exists ? fs.readdirSync(dPath) : [];
    res.json({ 
      exists, 
      path: dPath, 
      contents, 
      cwd: process.cwd(),
      env: process.env.NODE_ENV
    });
  });

  // Mount API Router
  app.use("/api", apiRouter);

  // API 404 Handler
  app.use("/api/*", (req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found on API server` });
  });

  // 5. Vite / Static serving
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom", // Manually handling the HTML
    });
    
    app.use(vite.middlewares);
    
    // SPA Fallback for Development
    app.get("*", async (req, res, next) => {
      // Skip API and other routes already handled
      if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/auth')) {
        return next();
      }

      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(__dirname, "index.html");
        if (!fs.existsSync(indexPath)) {
          console.error(`Index file not found at ${indexPath}`);
          return res.status(500).send("Internal Server Error: index.html missing");
        }
        let template = fs.readFileSync(indexPath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        if (vite) {
          vite.ssrFixStacktrace(e);
        }
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, "dist");
    // Serve static files from dist
    app.use(express.static(distPath));
    
    // Fallback for production SPA
    app.get("*", (req, res) => {
      // Skip API routes
      if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/auth')) {
        return res.status(404).json({ error: "API route not found" });
      }
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Production index.html missing. Please build the app.");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server on port ${PORT}`);
  });
}

startServer().catch(console.error);
