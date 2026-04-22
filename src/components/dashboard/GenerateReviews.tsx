import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { 
  PlusCircle, 
  Copy, 
  Send, 
  QrCode, 
  Zap, 
  TrendingUp, 
  Download, 
  Printer,
  ExternalLink,
  MessageCircle,
  Sparkles
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "../../lib/utils";
import { toast } from "sonner";
import { useAuth } from "../../lib/AuthContext";
import { getMyClinic, Establishment } from "../../lib/establishments";
import { useUsage } from "../../lib/UsageContext";
import { QRCodeCanvas } from "qrcode.react";

interface GenerateReviewsProps {
  vertical?: 'saude' | 'restaurante';
  clinic?: Establishment | null;
}

export function GenerateReviews({ vertical: forcedVertical, clinic: propClinic }: GenerateReviewsProps) {
  const { user } = useAuth();
  const { incrementUsage } = useUsage();
  const [clinic, setClinic] = useState<Establishment | null>(propClinic || null);
  const [loading, setLoading] = useState(!propClinic);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    async function load() {
      if (propClinic) {
        setClinic(propClinic);
        setLoading(false);
        return;
      }
      if (!user && !forcedVertical) {
        setLoading(false);
        return;
      }
      try {
        const data = user ? await getMyClinic(user.id) : null;
        setClinic(data);
      } catch (err) {
        console.error("Erro ao carregar dados da clínica:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, forcedVertical, propClinic]);

  const currentVertical = forcedVertical || clinic?.vertical || 'saude';
  const isRestaurante = currentVertical === 'restaurante';
  const titleFont = isRestaurante ? "font-serif" : "font-heading";
  
  const getReviewLink = () => {
    if (clinic?.google_maps_url) return clinic.google_maps_url;
    
    // Fallback para onboarding
    const savedData = localStorage.getItem("estrelize_onboarding_data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.reviewLink) return parsed.reviewLink;
    }
    
    return "https://g.page/r/estrelize/review";
  };

  const reviewLink = getReviewLink();
  const isFallbackLink = reviewLink === "https://g.page/r/estrelize/review";

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const handleCopy = () => {
    setCopying(true);
    navigator.clipboard.writeText(reviewLink);
    incrementUsage();
    toast.success("Link copiado! Uso contabilizado.");
    setTimeout(() => setCopying(false), 2000);
  };

  const handleWhatsApp = () => {
    incrementUsage();
    const message = encodeURIComponent(`"Olá! Poderia avaliar nosso atendimento? Isso ajuda muito nosso negócio. Clique aqui para avaliar: ${reviewLink}"`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleDownloadQR = () => {
    const canvas = document.getElementById("generate-qr-canvas") as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `qrcode-estrelize-${clinic?.name || currentVertical}.png`;
      link.href = url;
      link.click();
      toast.success("QR Code baixado com sucesso!");
    } else {
      toast.error("Erro ao gerar QR Code para download.");
    }
  };

  const handlePrintPoster = () => {
    const canvas = document.getElementById("generate-qr-canvas") as HTMLCanvasElement;
    if (!canvas) {
      toast.error("Erro ao gerar QR Code para impressão.");
      return;
    }
    
    const qrDataUrl = canvas.toDataURL("image/png");
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const verticalName = isRestaurante ? "Restaurante" : "Saúde";
    const brandColor = isRestaurante ? "#FF4500" : "#14B8A6";

    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Cartaz - Estrelize</title>
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body { 
              font-family: 'Outfit', sans-serif; 
              display: flex; 
              flex-direction: column; 
              align-items: center; 
              justify-content: center; 
              height: 100vh; 
              margin: 0; 
              text-align: center;
              background: white;
              color: #333;
            }
            .container {
              max-width: 600px;
              padding: 40px;
              border: 2px solid #eee;
              border-radius: 40px;
            }
            .logo {
              font-size: 24px;
              font-weight: 700;
              margin-bottom: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
            }
            .logo span { color: ${brandColor}; }
            .badge {
              background: ${brandColor}22;
              color: ${brandColor};
              padding: 6px 16px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 2px;
              margin-bottom: 20px;
              display: inline-block;
            }
            h1 { font-size: 42px; margin: 0 0 16px; color: #111; }
            p { font-size: 18px; color: #666; margin-bottom: 40px; line-height: 1.5; }
            .qr-wrapper {
              padding: 20px;
              background: white;
              border: 1px solid #eee;
              border-radius: 24px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            }
            img { width: 300px; height: 300px; }
            .footer { margin-top: 50px; font-size: 14px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">Estrelize <span>${verticalName}</span></div>
            <div class="badge">Avalie nosso atendimento</div>
            <h1>Sua opinião é fundamental!</h1>
            <p>Escaneie o QR Code abaixo com a câmera do seu celular e conte como foi sua experiência no Google.</p>
            <div class="qr-wrapper">
              <img src="${qrDataUrl}" />
            </div>
            <div class="footer">Gerado por Estrelize ${verticalName} • Powered by Google</div>
          </div>
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-12 pb-24 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/60 italic font-medium">Gerar Avaliações</span>
        <h2 className={cn("text-5xl font-bold", titleFont)}>Cresça sua Reputação</h2>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Ferramentas simples para pedir avaliações aos seus clientes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Link Direto Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-[#042121] border-none rounded-[3rem] shadow-2xl relative overflow-hidden group h-full">
            {/* Warning Banner */}
            {isFallbackLink && (
              <div className="bg-[#F59E0B] text-black text-[10px] font-black uppercase tracking-widest text-center py-2 relative z-10">
                Link de Exemplo - Configure o seu nas configurações
              </div>
            )}
            
            <div className="p-10 flex flex-col items-center text-center space-y-8">
              <div className="w-16 h-16 rounded-3xl bg-black/20 flex items-center justify-center transition-transform group-hover:scale-110">
                <Zap className="w-8 h-8 text-[#7C3AED]" />
              </div>
              
              <div className="space-y-3">
                <h3 className={cn("text-3xl font-bold", titleFont)}>Link Direto</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px] mx-auto">
                  Envie este link diretamente para seus clientes via chat ou e-mail.
                </p>
              </div>

              <div className="w-full relative">
                <Input 
                  readOnly
                  value={reviewLink}
                  className="h-16 px-6 pr-14 bg-black/20 border-white/5 rounded-2xl text-xs font-mono text-muted-foreground focus:ring-0 cursor-default"
                />
                <button 
                  onClick={handleCopy}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-xl transition-all text-muted-foreground hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <Button 
                onClick={handleCopy}
                className="w-full h-16 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-[#7C3AED]/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                {copying ? "Copiado!" : "Copiar Link de Avaliação"}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* WhatsApp Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-[#042121] border-none rounded-[3rem] shadow-2xl relative overflow-hidden group h-full">
            {/* Warning Banner */}
            {isFallbackLink && (
              <div className="bg-[#F59E0B] text-black text-[10px] font-black uppercase tracking-widest text-center py-2 relative z-10">
                Link de Exemplo - Configure o seu nas configurações
              </div>
            )}
            
            <div className="p-10 flex flex-col items-center text-center space-y-8">
              <div className="w-16 h-16 rounded-3xl bg-black/20 flex items-center justify-center transition-transform group-hover:scale-110">
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
              
              <div className="space-y-3">
                <h3 className={cn("text-3xl font-bold", titleFont)}>WhatsApp</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px] mx-auto">
                  Envie uma mensagem pronta e personalizada para seus clientes.
                </p>
              </div>

              <div className="w-full p-6 bg-black/20 border border-white/5 rounded-[2rem] text-left">
                <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                  "Olá! Poderia avaliar nosso atendimento? Isso ajuda muito nosso negócio. Clique aqui para avaliar: <span className="text-accent underline">{reviewLink}</span>"
                </p>
              </div>

              <Button 
                onClick={handleWhatsApp}
                className="w-full h-16 bg-[#10B981] hover:bg-[#059669] text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-[#10B981]/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Enviar via WhatsApp
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* QR Code Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-[#042121] border-none p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="shrink-0 p-6 bg-white rounded-[2.5rem] shadow-2xl">
              <QRCodeCanvas 
                id="generate-qr-canvas"
                value={reviewLink}
                size={200}
                level={"H"}
                includeMargin={false}
              />
            </div>
            
            <div className="flex-1 space-y-8 text-center md:text-left">
              <div className="space-y-3">
                <h3 className={cn("text-4xl font-bold", titleFont)}>QR Code para Avaliações</h3>
                <p className="text-muted-foreground text-sm max-w-lg leading-relaxed">
                  Imprima este QR Code e coloque em mesas, balcões ou recepções. É a forma mais rápida do cliente te avaliar no local.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleDownloadQR}
                  variant="outline"
                  className="h-14 px-8 border-white/10 hover:bg-white/5 text-muted-foreground hover:text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar QR Code
                </Button>
                <Button 
                  onClick={handlePrintPoster}
                  className="h-14 px-8 bg-white text-black hover:bg-white/90 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-white/10 transition-all hover:scale-105"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir Cartaz
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
