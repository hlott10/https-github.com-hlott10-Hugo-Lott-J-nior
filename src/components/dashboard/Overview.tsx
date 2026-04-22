import { motion } from "motion/react";
import { 
  Star, 
  MessageSquare, 
  TrendingUp, 
  QrCode,
  Copy,
  ExternalLink,
  Download,
  Sparkles,
  Trophy,
  Globe,
  MousePointerClick,
  CheckCircle2,
  Megaphone,
  Target,
  Zap,
  Info,
  BarChart2,
  Calendar,
  Settings as SettingsIcon,
  Search,
  ExternalLink as ExternalLinkIcon
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Card, CardContent } from "../ui/card";
import { useAuth } from "../../lib/AuthContext";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyClinic, Establishment } from "../../lib/establishments";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { QRCodeCanvas } from "qrcode.react";
import { createCheckoutSession } from "../../lib/stripe";
import { useUsage } from "../../lib/UsageContext";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Loader2 } from "lucide-react";

interface OverviewProps {
  vertical?: 'saude' | 'restaurante';
  setActiveTab?: (tab: string) => void;
}

export function Overview({ vertical: forcedVertical, setActiveTab }: OverviewProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isPro } = useUsage();
  const [clinic, setClinic] = useState<Establishment | null>(null);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleUpgrade = async () => {
    try {
      console.log("STEP 1: Button Clicked");
      
      let checkoutEmail = user?.email;
      let targetUserId = user?.id;

      if (!user) {
        console.log("STEP 1.5: No Auth User. Checking LocalStorage...");
        const savedData = localStorage.getItem("estrelize_onboarding_data");
        if (savedData) {
          const parsed = JSON.parse(savedData);
          checkoutEmail = parsed.email;
          targetUserId = "guest_" + (parsed.email || "unknown");
          console.log("STEP 1.6: Found Guest Email:", checkoutEmail);
        }
      }

      if (!checkoutEmail) {
        console.log("STEP 1.7: No Email anywhere. Redirecting to onboarding.");
        toast.info("Iniciando sua inscrição para o plano Pro...");
        navigate("/onboarding");
        return;
      }

      console.log("STEP 2: Proceeding with identity:", { targetUserId, checkoutEmail });
      setUpgrading(true);
      console.log("STEP 3: Loading set to true, calling Stripe...");
      
      const result = await createCheckoutSession({
        planId: 'pro',
        cycle: 'monthly',
        userId: targetUserId || "guest_default",
        vertical: forcedVertical || clinic?.vertical || 'saude',
        email: checkoutEmail
      });
      console.log("STEP 4: Stripe result:", result);
    } catch (err: any) {
      console.error("STEP ERROR:", err);
      toast.error("Erro ao iniciar assinatura: " + err.message);
    } finally {
      setUpgrading(false);
      console.log("STEP 5: Cleaning up loading state");
    }
  };

  const handleCopyLink = () => {
    setCopying(true);
    navigator.clipboard.writeText(reviewLink);
    toast.success("Link de avaliação copiado!");
    setTimeout(() => setCopying(false), 2000);
  };

  const handleDownloadQRCode = () => {
    const canvas = document.getElementById("clinic-qr-code") as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `qrcode-estrelize-${clinic?.name || "clinica"}.png`;
      link.href = url;
      link.click();
      toast.success("QR Code baixado com sucesso!");
    } else {
      toast.error("Erro ao gerar QR Code para download.");
    }
  };

  const handleTestLink = () => {
    window.open(reviewLink, '_blank');
  };

  const handleViewAchievements = () => {
    toast.info("Carregando sua jornada de conquistas...");
    setTimeout(() => {
      if (setActiveTab) setActiveTab('ranking');
    }, 1000);
  };

  useEffect(() => {
    async function load() {
      if (!user && !forcedVertical) {
        setLoading(false);
        return;
      }
      try {
        let data = user ? await getMyClinic(user.id) : null;
        
        // Se não houver dados no banco, tentar pegar do Onboarding para o nome
        if (!data) {
          const savedData = localStorage.getItem("estrelize_onboarding_data");
          if (savedData) {
            const parsed = JSON.parse(savedData);
            data = {
              name: parsed.businessName,
              google_rating: 0,
              review_count: 0,
              response_rate: 0,
              growth_rate: 0,
              vertical: (window.location.pathname.includes('restaurante') ? 'restaurante' : 'saude')
            } as any;
          }
        }

        const verticalFromUrl = forcedVertical || (window.location.pathname.includes('restaurante') ? 'restaurante' : 'saude');
        
        setClinic(data || {
          name: verticalFromUrl === 'saude' ? "Sua Clínica" : "Seu Restaurante",
          google_rating: 0,
          review_count: 0,
          response_rate: 0,
          growth_rate: 0,
          vertical: verticalFromUrl
        } as any);
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, forcedVertical]);

  const currentVertical = forcedVertical || clinic?.vertical || 'saude';
  const isRestaurante = currentVertical === 'restaurante';
  const titleFont = isRestaurante ? "font-serif" : "font-heading";

  const reviewLink = clinic?.google_maps_url || "https://g.page/r/estrelize/review";

  const sentimentData = [
    { name: 'Positivas', value: 75, color: '#10B981' },
    { name: 'Neutras', value: 15, color: '#F59E0B' },
    { name: 'Negativas', value: 10, color: '#EF4444' },
  ];

  const evolutionData = [
    { date: "2024-04-14", rating: 4.0 },
    { date: "2024-04-15", rating: 4.3 },
    { date: "2024-04-16", rating: 4.1 },
    { date: "2024-04-17", rating: 4.5 },
  ];

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

  return (
    <div className="space-y-8 pb-12">
      {/* Upgrade Banner for Free Users */}
      {!isPro && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#7C3AED] to-[#db2777] p-6 rounded-[2rem] shadow-2xl shadow-[#7C3AED]/20 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white relative border border-white/20">
                <Zap className="w-8 h-8 fill-current" />
                <div className="absolute -inset-2 border border-white/20 rounded-2xl animate-ping opacity-30" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black uppercase tracking-tight text-white leading-tight">Desbloqueie o Potencial Máximo</h3>
                <p className="text-white/80 text-sm max-w-md leading-relaxed italic">
                  Alcance o Top #1 local com automações ilimitadas, relatórios avançados e insights de IA exclusivos.
                </p>
              </div>
            </div>
            <Button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="h-14 px-10 bg-white text-[#7C3AED] hover:bg-white/90 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              {upgrading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Assinar Plano Pro
            </Button>
          </div>
        </motion.div>
      )}

      {/* Header Tabs */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/60">Dashboard de Crescimento</span>
          <h2 className={cn("text-4xl", titleFont)}>{isRestaurante ? "Sua Reputação Online" : "Visão Geral da Clínica"}</h2>
          <p className="text-muted-foreground text-sm">Métricas essenciais para o crescimento do seu negócio local.</p>
        </div>
        <div className="flex bg-card p-1 rounded-xl border border-white/5">
          {["30D", "90D", "365D"].map((period) => (
            <button 
              key={period}
              className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${period === "30D" ? "bg-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/20" : "text-muted-foreground hover:bg-white/5"}`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Main Score Area */}
      <Card className="bg-[#042121] border-none overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#14B8A6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardContent className="p-10 flex flex-col md:flex-row items-center gap-12">
          {/* Circular Score */}
          <div className="relative flex items-center justify-center w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96" cy="96" r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-white/5"
              />
              <motion.circle
                initial={{ strokeDashoffset: 552 }}
                animate={{ strokeDashoffset: 552 - (552 * 0.85) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                cx="96" cy="96" r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray="552"
                className="text-accent drop-shadow-[0_0_15px_rgba(20,184,166,0.5)]"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-black">45</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Score</span>
            </div>
          </div>

          {/* Text Info */}
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <h3 className={cn("text-3xl font-bold", titleFont)}>Excelente Performance!</h3>
              <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
                Seu negócio está acima da média da região. Continue respondendo rapidamente para manter seu score alto.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { label: `Média: ${clinic?.google_rating || 0} ★`, color: "bg-[#7C3AED]" },
                { label: `Respostas: ${Math.round((clinic?.response_rate || 0) * 100)}%`, color: "bg-[#059669]" },
                { label: `Volume: ${clinic?.review_count || 0}`, color: "bg-[#065f46]" }
              ].map((pill, i) => (
                <span key={i} className={`${pill.color} text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/10`}>
                  {pill.label}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Visualizações Maps", value: "2.4k", sub: "Alcance Orgânico", icon: Globe, color: "text-blue-400" },
          { label: "Cliques no Perfil", value: "312", sub: "Conversão Direta", icon: MousePointerClick, color: "text-emerald-400" },
          { label: "ROI Estimado", value: "R$ 4.2k", sub: "Atribuição Local", icon: TrendingUp, color: "text-accent" },
          { label: "Impacto no Ranking", value: "Top #3", sub: "Sua autoridade", icon: Trophy, color: "text-yellow-400" },
        ].map((stat, i) => (
          <Card key={i} className="bg-[#042121] border-none group hover:bg-[#052d2d] transition-all">
            <CardContent className="p-8 text-center space-y-4 relative">
              <div className={cn("absolute top-4 right-4 transition-colors opacity-20 group-hover:opacity-100", stat.color)}>
                <stat.icon className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
              <h4 className={cn("text-3xl font-black", titleFont)}>{stat.value}</h4>
              <p className="text-[9px] text-muted-foreground italic tracking-wide">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Growth Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-[#042121] border-none p-10 flex flex-col justify-between space-y-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <Megaphone className="w-6 h-6" />
            </div>
            <h3 className={cn("text-2xl font-bold", titleFont)}>Ativar Campanhas</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Dispare pedidos de avaliação automaticamente via WhatsApp para clientes que acabaram de ser atendidos.
            </p>
          </div>
          <Button 
            onClick={() => setActiveTab('campaigns')}
            className="w-full h-14 bg-accent hover:bg-accent/80 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-accent/20 transition-all hover:scale-[1.02]"
          >
            Configurar Automação
            <Zap className="w-4 h-4 ml-2 fill-current" />
          </Button>
        </Card>

        <Card className="bg-[#042121] border-none p-10 flex flex-col justify-between space-y-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED]">
              <Target className="w-6 h-6" />
            </div>
            <h3 className={cn("text-2xl font-bold", titleFont)}>Análise da Vizinhança</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Veja o mapa de calor de concorrência e descubra por que os pacientes estão escolhendo outros locais.
            </p>
          </div>
          <Button 
            onClick={() => setActiveTab('competitors')}
            variant="outline"
            className="w-full h-14 border-white/10 hover:bg-white/5 text-muted-foreground hover:text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all"
          >
            Ver Mapa de Concorrência
          </Button>
        </Card>
      </div>

      {/* Tools Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Review Link Card */}
        <Card className="bg-[#042121] border-none p-10 space-y-8 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className={cn("text-2xl font-bold", titleFont)}>Link de Avaliação</h3>
            <div className="p-3 bg-accent/10 rounded-xl text-accent">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
            Use este link direto para facilitar que seus clientes deixem uma avaliação no Google Maps.
          </p>
          <div className="space-y-6">
            <div className="flex items-center gap-2 p-2 bg-black/20 rounded-2xl border border-white/5 group focus-within:border-accent/50 transition-all">
              <input 
                readOnly
                value={reviewLink}
                className="bg-transparent border-none outline-none flex-1 px-4 text-sm font-mono text-muted-foreground"
              />
              <Button 
                onClick={handleCopyLink}
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 bg-white/5 rounded-xl hover:bg-white/10"
              >
                {copying ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="flex gap-4">
              <Button 
                onClick={handleTestLink}
                variant="outline" 
                className="flex-1 h-12 rounded-xl border-white/10 font-bold uppercase tracking-widest text-[10px] hover:bg-white/5"
              >
                <ExternalLinkIcon className="w-3 h-3 mr-2" />
                Testar Link
              </Button>
              <Button 
                onClick={() => setShowQRModal(true)}
                className="flex-1 h-12 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] font-bold uppercase tracking-widest text-[10px] transition-all active:scale-95"
              >
                Gerar QR Code
              </Button>
            </div>
          </div>
        </Card>

        {/* QR Code Preview Card */}
        <Card className="bg-[#042121] border-none p-10 flex flex-col items-center justify-center text-center space-y-6">
          <h3 className={cn("text-lg font-bold", titleFont)}>QR Code para {isRestaurante ? "Mesa" : "Consultório"}</h3>
          <div 
            onClick={() => setShowQRModal(true)}
            className="bg-white p-6 rounded-3xl shadow-2xl relative group cursor-pointer"
          >
            <QRCodeCanvas 
              id="clinic-qr-code-preview"
              value={reviewLink}
              size={128}
              level={"H"}
              includeMargin={false}
            />
            <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground leading-relaxed max-w-[240px]">
            Imprima este QR Code e coloque em suas mesas ou no balcão para aumentar suas avaliações em até 3x.
          </p>
          <Button 
            onClick={() => {
              setShowQRModal(true);
              setTimeout(handleDownloadQRCode, 500);
            }}
            variant="link" 
            className="text-accent underline decoration-accent/30 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] hover:text-accent/80"
          >
            <Download className="w-4 h-4" />
            Baixar QR Code (PNG)
          </Button>
        </Card>
      </div>

      {/* QR Code Modal */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="bg-[#042121] border-white/10 text-white max-w-md rounded-[2.5rem]">
          <DialogHeader className="space-y-4">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
              <QrCode className="w-6 h-6" />
            </div>
            <DialogTitle className="text-3xl font-heading">Kit de Crescimento</DialogTitle>
            <DialogDescription className="text-gray-400 text-lg">
              Este QR Code leva seus clientes direto para a página de avaliações do Google Maps.
            </DialogDescription>
          </DialogHeader>

          <div className="py-10 flex flex-col items-center gap-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-[0_0_50px_rgba(20,184,166,0.2)]">
              <QRCodeCanvas 
                id="clinic-qr-code"
                value={reviewLink}
                size={220}
                level={"H"}
                includeMargin={false}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button 
                variant="outline" 
                onClick={() => window.print()}
                className="h-14 rounded-2xl border-white/10 font-bold uppercase tracking-widest text-xs"
              >
                Imprimir Kit
              </Button>
              <Button 
                onClick={handleDownloadQRCode}
                className="h-14 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] font-bold uppercase tracking-widest text-xs"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar PNG
              </Button>
            </div>
            
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 text-center">
              DICA: COLOQUE PERTO DO CHECKOUT OU EM QUADROS NA PAREDE
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-[#042121] border-none p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Evolução da Nota</h3>
            <div className="p-2 bg-accent/10 rounded-lg text-accent">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="h-[300px] w-full min-w-0 flex items-center justify-center">
            {isMounted ? (
              <ResponsiveContainer width="100%" height={300} minWidth={0}>
                <LineChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="date" hide />
                  <YAxis hide domain={[0, 5]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#042F2E", border: "none", borderRadius: "12px", fontSize: "12px" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rating" 
                    stroke="#7C3AED" 
                    strokeWidth={4} 
                    dot={false}
                    animationDuration={2000}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-white/5 animate-pulse rounded-2xl" />
            )}
          </div>
        </Card>

        <Card className="bg-[#042121] border-none p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Sentimento do Cliente</h3>
          </div>
          <div className="flex items-center gap-8 h-[300px] w-full">
            <div className="flex-1 h-full min-w-0 flex items-center justify-center">
              {isMounted ? (
                <ResponsiveContainer width="100%" height={300} minWidth={0}>
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-40 h-40 bg-white/5 animate-pulse rounded-full" />
              )}
            </div>
            <div className="space-y-4 shrink-0 pr-8">
              {sentimentData.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-20">{item.name}</span>
                  <span className="text-[10px] font-black">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="bg-[#042121] border-none p-10 lg:col-span-2 flex items-center gap-8 group">
          <div className="p-5 bg-accent/10 rounded-2xl text-accent group-hover:scale-110 transition-transform">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-accent">Dica da IA</h4>
            <p className="text-lg text-muted-foreground italic leading-relaxed">
              {isRestaurante 
                ? "\"Suas avaliações de 4 estrelas costumam elogiar a comida, mas reclamar da demora. Focar na agilidade pode elevar sua nota para 4.8 em 30 dias.\""
                : "\"Seus pacientes elogiam muito a precisão do diagnóstico, mas mencionam a espera na recepção. Otimizar o check-in pode elevar sua nota para 4.9.\""}
            </p>
          </div>
        </Card>

        <Card className="bg-[#7C3AED] border-none p-10 flex flex-col justify-between space-y-8 shadow-2xl shadow-[#7C3AED]/30">
          <div className="space-y-4">
            <h4 className={cn("text-xl font-bold", titleFont)}>Status da Jornada</h4>
            <p className="text-white/70 text-sm leading-relaxed">
              Você está a poucos passos de se tornar a referência número #1 na sua {isRestaurante ? "categoria local" : "região clínica"}.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black tracking-widest uppercase">Nível 4: Especialista</span>
              <span className="text-[10px] font-black">85%</span>
            </div>
            <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-full bg-white shadow-[0_0_10px_white]"
              />
            </div>
          </div>

          <Button 
            onClick={handleViewAchievements}
            className="w-full h-12 bg-white/20 hover:bg-white/30 text-white font-bold uppercase tracking-widest text-[10px] border border-white/10 rounded-xl transition-all"
          >
            Ver Conquistas
          </Button>
        </Card>
      </div>
    </div>
  );
}
