import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { 
  Zap, 
  Check, 
  Star, 
  AlertCircle, 
  ChevronRight,
  Loader2,
  Sparkles,
  Globe,
  Settings as SettingsIcon,
  ShieldCheck
} from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { toast } from "sonner";
import { useAuth } from "../../lib/AuthContext";
import { getMyClinic, updateClinic, createClinic, Establishment } from "../../lib/establishments";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { createCheckoutSession } from "../../lib/stripe";

interface SettingsProps {
  vertical?: 'saude' | 'restaurante';
}

export function Settings({ vertical = 'saude' }: SettingsProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [tone, setTone] = useState("AMIGÁVEL");
  const [planPeriod, setPlanPeriod] = useState("MENSAL");
  const [googleConnected, setGoogleConnected] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const [clinic, setClinic] = useState<Partial<Establishment>>({
    name: "",
    website: "",
    vertical: vertical
  });

  const isRestaurante = vertical === 'restaurante';
  const titleFont = isRestaurante ? "font-serif" : "font-heading";

  useEffect(() => {
    async function load() {
      if (!user) {
        setFetching(false);
        return;
      }
      try {
        const data = await getMyClinic(user.id);
        if (data) {
          setClinic(data);
          // Sync tokens from DB to localStorage if available
          if ((data as any).metadata?.google_tokens) {
             localStorage.setItem('google_business_tokens', JSON.stringify((data as any).metadata.google_tokens));
             setGoogleConnected(true);
          } else if (localStorage.getItem('google_business_tokens')) {
             setGoogleConnected(true);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar configurações:", err);
      } finally {
        setFetching(false);
      }
    }
    load();
  }, [user]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) return;
      
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        const tokens = event.data.tokens;
        localStorage.setItem('google_business_tokens', JSON.stringify(tokens));
        setGoogleConnected(true);
        setGoogleLoading(false);
        toast.success("Google Business Profile conectado com sucesso!");
        
        // Save to database as well
        if (clinic.id) {
          updateClinic(clinic.id, { 
            ...clinic, 
            metadata: { ...clinic.metadata, google_tokens: tokens }
          } as any);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleConnectGoogle = async () => {
    setGoogleLoading(true);
    try {
      const response = await fetch('/api/auth/google/url');
      const { url } = await response.json();
      
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      window.open(
        url,
        'google_oauth',
        `width=${width},height=${height},left=${left},top=${top}`
      );
    } catch (error) {
      console.error("Erro ao iniciar OAuth:", error);
      toast.error("Erro ao conectar com o Google.");
      setGoogleLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (clinic.id) {
        await updateClinic(clinic.id, { ...clinic, ai_tone: tone });
      } else {
        const slug = clinic.name?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
        const newClinic = await createClinic({
          name: clinic.name || "",
          city: "Cidade Demo",
          state: "BR",
          specialty: isRestaurante ? "Restaurante" : "Saúde",
          google_rating: 0,
          review_count: 0,
          response_rate: 0,
          slug,
          user_id: user.id,
          vertical: vertical,
          ai_tone: tone
        } as any);
        setClinic(newClinic);
      }
      toast.success("Configurações atualizadas!");
    } catch (err) {
      console.error("Erro ao salvar:", err);
      toast.error("Erro ao salvar alterações.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para assinar.");
      return;
    }

    setLoading(true);
    const cycleMap: Record<string, string> = {
      "MENSAL": "monthly",
      "6 MESES": "semiannual",
      "12 MESES": "annual"
    };

    try {
      await createCheckoutSession({
        planId: 'pro',
        cycle: cycleMap[planPeriod],
        userId: user.id,
        vertical: vertical,
        email: user.email
      });
    } catch (err) {
      console.error("Erro handleSubscribe:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubscription = async () => {
    const customerId = (clinic.metadata as any)?.stripe_customer_id;
    if (!customerId) {
      toast.info("Nenhuma assinatura ativa encontrada para este perfil. Se você acabou de assinar, aguarde alguns instantes ou entre em contato com o suporte.", {
        duration: 5000
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/checkout/create-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          returnUrl: window.location.href
        })
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Erro ao carregar portal de cliente");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao verificar assinatura.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/60">Preferências</span>
        <h2 className={cn("text-5xl font-bold", titleFont)}>Configurações</h2>
        <p className="text-muted-foreground text-sm">Personalize como a IA interage com seus clientes.</p>
      </div>

      {/* Pricing Card */}
      <Card className="bg-[#042121] border-none p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-12 items-start relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center text-accent shrink-0">
            <Zap className="w-8 h-8 fill-accent" />
          </div>
          
          <div className="space-y-6 flex-1">
            <div className="space-y-2">
              <h3 className={cn("text-3xl font-bold", titleFont)}>Plano Estrelize</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">
                  {planPeriod === "MENSAL" ? "R$ 47,90" : 
                   planPeriod === "6 MESES" ? "R$ 239,90" : 
                   "R$ 397,90"}
                </span>
                <span className="text-muted-foreground text-sm">
                  {planPeriod === "MENSAL" ? "/mês" : 
                   planPeriod === "6 MESES" ? "/semestre" : 
                   "/ano"}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">Desbloqueie o poder total da IA</p>
            </div>

            <div className="flex bg-black/20 p-1 rounded-xl border border-white/5 w-fit">
              {["MENSAL", "6 MESES", "12 MESES"].map((period) => (
                <button 
                  key={period}
                  onClick={() => setPlanPeriod(period)}
                  className={cn(
                    "px-6 py-2 text-[10px] font-black rounded-lg transition-all",
                    planPeriod === period 
                      ? "bg-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/20" 
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  )}
                >
                  {period}
                </button>
              ))}
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Respostas ilimitadas com IA",
                "Análise de sentimento avançada",
                "Relatórios semanais por e-mail",
                "Suporte prioritário 24/7"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-accent" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <Button 
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full md:w-auto h-14 px-12 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-[#7C3AED]/30 transition-all hover:scale-105 active:scale-95"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Assinar Plano Pro
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
            
            <p 
              onClick={handleVerifySubscription}
              className="text-[10px] text-center md:text-left font-black uppercase tracking-widest text-muted-foreground/40 mt-4 cursor-pointer hover:text-white transition-all underline decoration-white/10"
            >
              Já assinou? clique aqui para verificar
            </p>
          </div>
        </div>
      </Card>

      {/* Response Rules */}
      <div className="space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/60">Automação Inteligente</span>
          <h3 className={cn("text-3xl font-bold", titleFont)}>Regras de Resposta</h3>
          <p className="text-muted-foreground text-sm">Defina quais avaliações a IA deve responder sozinha.</p>
        </div>

        <div className="space-y-4">
          {[
            { id: "stars-5", label: "Avaliações 5 Estrelas", sub: "Responder automaticamente com IA", icon: Star, color: "text-emerald-500" },
            { id: "stars-4", label: "Avaliações 4 Estrelas", sub: "Responder automaticamente com IA", icon: Star, color: "text-blue-500" },
            { id: "stars-1-3", label: "Avaliações 1 a 3 Estrelas", sub: "Sempre pedir aprovação manual", icon: AlertCircle, color: "text-orange-500" },
          ].map((rule) => (
            <Card key={rule.id} className="bg-[#042121] border-none p-6 rounded-[2rem] flex items-center justify-between group hover:bg-[#052d2d] transition-all">
              <div className="flex items-center gap-6">
                <div className={cn("w-12 h-12 rounded-xl bg-black/20 flex items-center justify-center transition-transform group-hover:scale-110", rule.color)}>
                  <rule.icon className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{rule.label}</h4>
                  <p className="text-xs text-muted-foreground">{rule.sub}</p>
                </div>
              </div>
              <Switch defaultChecked={rule.id !== "stars-1-3"} />
            </Card>
          ))}
        </div>
      </div>

      {/* General Settings Form */}
      <Card className="bg-[#042121] border-none p-10 rounded-[3rem] shadow-2xl">
        <div className="space-y-10">
          {/* Google Connection Section */}
          <div className="p-8 rounded-[2rem] bg-black/20 border border-white/5 space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity">
              <Globe className="w-24 h-24 text-accent" />
            </div>
            
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                googleConnected ? "bg-emerald-500/20 text-emerald-500" : "bg-accent/20 text-accent"
              )}>
                <Globe className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-lg">Google Business Profile</h4>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-black">Conexão Oficial Local</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
              Conecte sua conta do Google para que o Estrelize possa ler reviews em tempo real e responder automaticamente usando IA oficial.
            </p>

            {googleConnected ? (
              <div className="flex items-center gap-4 pt-2">
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  <Check className="w-3 h-3 mr-2" /> Conectado como {clinic.name || "Empresa"}
                </Badge>
                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={() => {
                  setGoogleConnected(false);
                  localStorage.removeItem('google_business_tokens');
                  if (clinic.id) {
                     updateClinic(clinic.id, { 
                       ...clinic, 
                       metadata: { ...clinic.metadata, google_tokens: null }
                     } as any);
                  }
                }}>
                  Desconectar
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleConnectGoogle}
                disabled={googleLoading}
                className="h-14 px-8 bg-black hover:bg-black/80 text-white border border-white/10 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
              >
                {googleLoading ? <Loader2 className="w-4 h-4 animate-spin text-accent" /> : <img src="https://www.google.com/favicon.ico" className="w-4 h-4" referrerPolicy="no-referrer" />}
                Conectar Conta Google
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              Nome do Negócio
            </Label>
            <Input 
              value={clinic.name}
              onChange={(e) => setClinic({...clinic, name: e.target.value})}
              placeholder={isRestaurante ? "Restaurante Sabor Local" : "Clínica Saúde Vital"}
              className="h-16 px-6 bg-black/20 border-white/5 rounded-2xl text-lg focus:border-accent/50 transition-all font-medium"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              Link de Avaliação do Google
            </Label>
            <Input 
              value={clinic.website}
              onChange={(e) => setClinic({...clinic, website: e.target.value})}
              placeholder="Ex: https://g.page/r/sua-empresa/review"
              className="h-16 px-6 bg-black/20 border-white/5 rounded-2xl text-lg focus:border-accent/50 transition-all font-medium"
            />
            <p className="text-[10px] text-muted-foreground italic">Dica: No seu Perfil da Empresa no Google, vá em "Solicitar avaliações" e copie o link curto.</p>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              Provedor de IA
            </Label>
            <Select defaultValue="openai">
              <SelectTrigger className="h-16 px-6 bg-black/20 border-white/5 rounded-2xl text-lg focus:border-accent/50 transition-all font-medium">
                <SelectValue placeholder="Selecione o motor de IA" />
              </SelectTrigger>
              <SelectContent className="bg-[#042121] border-white/10 rounded-2xl p-2">
                <SelectItem value="openai">OpenAI ChatGPT (GPT-4o-mini)</SelectItem>
                <SelectItem value="gemini">Google Gemini 1.5 Flash</SelectItem>
                <SelectItem value="anthropic">Anthropic Claude 3.5 Sonnet</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground italic">Nota: O uso da OpenAI requer uma chave de API configurada no servidor.</p>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              Personalidade da IA
            </Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="h-16 px-6 bg-black/20 border-white/5 rounded-2xl text-lg focus:border-accent/50 transition-all font-medium">
                <SelectValue placeholder="Selecione o tom de voz" />
              </SelectTrigger>
              <SelectContent className="bg-[#042121] border-white/10 rounded-2xl p-2 font-medium">
                <SelectItem value="AMIGÁVEL">Amigável</SelectItem>
                <SelectItem value="FORMAL">Formal</SelectItem>
                <SelectItem value="DIVERTIDO">Divertido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleSave}
            disabled={loading}
            className="w-full h-16 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-[#7C3AED]/30 transition-all hover:scale-105 active:scale-95"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            Salvar Alterações
          </Button>
        </div>
      </Card>
    </div>
  );
}
