import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Star, 
  MessageSquare, 
  Zap, 
  Send, 
  RotateCcw,
  X,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Search,
  Plus,
  Loader2
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { generateReviewResponse } from "../../lib/gemini";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import { useUsage } from "../../lib/UsageContext";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  status: "responded" | "pending";
  method: "auto-ia" | "manual";
  avatarColor: string;
}

const restauranteReviews: Review[] = [];

const saudeReviews: Review[] = [];

interface InboxProps {
  vertical?: 'saude' | 'restaurante';
  setActiveTab?: (tab: string) => void;
}

export function Inbox({ vertical: forcedVertical, setActiveTab: setDashboardTab }: InboxProps) {
  const { incrementUsage } = useUsage();
  const [inboxTab, setInboxTab] = useState("TUDO");
  const [automationActive, setAutomationActive] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [aiResponse, setAiResponse] = useState("");
  const [generating, setGenerating] = useState(false);
  const [tone, setTone] = useState("AMIGÁVEL");
  const [showToneDropdown, setShowToneDropdown] = useState(false);
  
  const tones = [
    { id: "AMIGÁVEL", label: "Amigável", description: "Cordial e caloroso" },
    { id: "PROFISSIONAL", label: "Profissional", description: "Ético e polido" },
    { id: "PRAGMÁTICO", label: "Pragmático", description: "Direto e focado em ROI" }
  ];
  
  // Real data state
  const [realReviews, setRealReviews] = useState<Review[]>([]);
  const [loadingReal, setLoadingReal] = useState(false);
  const [locationName, setLocationName] = useState<string | null>(null);

  // Determine vertical for font styling
  const currentVertical = forcedVertical || (window.location.pathname.includes('restaurante') ? 'restaurante' : 'saude');
  const isRestaurante = currentVertical === 'restaurante';
  const titleFont = isRestaurante ? "font-serif" : "font-heading";

  useEffect(() => {
    const fetchRealData = async () => {
      const tokensStr = localStorage.getItem('google_business_tokens');
      if (!tokensStr) return;

      setLoadingReal(true);
      try {
        const tokens = JSON.parse(tokensStr);
        
        // 1. Get Locations
        const locRes = await fetch('/api/google/locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tokens })
        });
        const locData = await locRes.json();
        
        if (locData.locations && locData.locations.length > 0) {
          const loc = locData.locations[0]; // Take first for now
          setLocationName(loc.name);

          // 2. Get Reviews
          const revRes = await fetch('/api/google/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tokens, locationName: loc.name })
          });
          const revData = await revRes.json();

          if (revData.reviews) {
            const mapped: Review[] = revData.reviews.map((gr: any) => {
              const ratingMap: Record<string, number> = { 'ONE': 1, 'TWO': 2, 'THREE': 3, 'FOUR': 4, 'FIVE': 5 };
              return {
                id: gr.reviewId,
                name: gr.reviewer?.displayName || "Cliente",
                rating: ratingMap[gr.starRating] || 5,
                comment: gr.comment || "(Sem comentário)",
                date: new Date(gr.createTime).toLocaleDateString('pt-BR'),
                status: gr.reviewReply ? "responded" : "pending",
                method: gr.reviewReply ? "auto-ia" : "manual",
                avatarColor: "bg-[#042121]"
              };
            });
            setRealReviews(mapped);
          }
        }
      } catch (err) {
        console.error("Error fetching real reviews:", err);
      } finally {
        setLoadingReal(false);
      }
    };

    fetchRealData();
  }, []);

  const defaultReviews = isRestaurante ? restauranteReviews : saudeReviews;
  const displayReviews = realReviews.length > 0 ? realReviews : defaultReviews;
  const pendingCount = displayReviews.filter(r => r.status === 'pending').length;

  const openAiModal = async (review: Review) => {
    setSelectedReview(review);
    setGenerating(true);
    try {
      const resp = await generateReviewResponse(
        review.comment,
        review.rating,
        isRestaurante ? "Estrelize Restaurante" : "Clínica Saúde Vital",
        tone
      );
      setAiResponse(resp);
    } catch (err) {
      toast.error("Erro ao gerar resposta.");
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerate = async (overrideTone?: string) => {
    if (!selectedReview) return;
    setGenerating(true);
    try {
      const resp = await generateReviewResponse(
        selectedReview.comment,
        selectedReview.rating,
        isRestaurante ? "Estrelize Restaurante" : "Clínica Saúde Vital",
        overrideTone || tone
      );
      setAiResponse(resp);
    } catch (err) {
      toast.error("Erro ao regenerar.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/60">Gerenciamento</span>
          <h2 className={cn("text-4xl", titleFont)}>Inbox de Avaliações</h2>
          <p className="text-muted-foreground text-sm max-w-lg leading-relaxed">
            Gerencie o que seus clientes estão dizendo em tempo real.
          </p>
        </div>
        
        <div className="flex bg-card p-1 rounded-xl border border-white/5">
          {["TUDO", "7 DIAS", "30 DIAS", "PERSONALIZADO"].map((tab) => (
            <button 
              key={tab}
              onClick={() => setInboxTab(tab)}
              className={cn(
                "px-6 py-2 text-[10px] font-black rounded-lg transition-all",
                inboxTab === tab 
                  ? "bg-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/20" 
                  : "text-muted-foreground hover:bg-white/5"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#042121] border-none group hover:bg-[#052d2d] transition-all p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-xl text-accent">
              <Star className="w-5 h-5 fill-accent" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Nota Média</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black">3.0</span>
                <span className="text-[10px] text-accent font-bold">+0.2</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-[#042121] border-none p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-xl text-accent">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Taxa de Resposta</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black">50%</span>
                <span className="text-[10px] text-muted-foreground font-medium italic">Meta 100%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-[#042121] border-none p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-xl text-accent">
                <Zap className="w-5 h-5 fill-accent" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Automação</p>
                <span className="text-sm font-black uppercase tracking-widest">Ativa</span>
              </div>
            </div>
            <button 
              onClick={() => setAutomationActive(!automationActive)}
              className={cn(
                "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all border",
                automationActive 
                  ? "bg-accent/20 text-accent border-accent/30" 
                  : "bg-white/5 text-muted-foreground border-white/10"
              )}
            >
              IA {automationActive ? "ON" : "OFF"}
            </button>
          </div>
        </Card>
      </div>

      {/* Alert Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-[#041212] border border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent/30" />
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-full border border-orange-500/30 flex items-center justify-center text-orange-500 bg-orange-500/10">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className={cn("text-lg font-bold flex items-center gap-2 italic", titleFont)}>
                <span className="text-orange-500">⚠️</span> {pendingCount} críticas pendentes
              </h4>
              <p className="text-muted-foreground text-sm">Responda rápido para proteger sua reputação local.</p>
            </div>
          </div>
          <Button 
            onClick={() => {
              const pending = displayReviews.find(r => r.status === 'pending');
              if (pending) openAiModal(pending);
            }}
            className="bg-transparent border border-white/10 hover:bg-white/5 text-white font-black uppercase tracking-[0.2em] text-[10px] h-12 px-8 rounded-xl transition-all hover:scale-105 active:scale-95"
          >
            Resolver Agora
          </Button>
        </Card>
      </motion.div>

      {/* Review Feed */}
      <div className="space-y-6">
        {loadingReal && (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="w-10 h-10 text-accent animate-spin" />
            <p className="text-muted-foreground text-sm animate-pulse">Sincronizando avaliações reais do Google...</p>
          </div>
        )}

        {!loadingReal && displayReviews.length > 0 ? displayReviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-[#042121] border border-white/5 hover:border-accent/30 transition-all group overflow-hidden">
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg border border-white/5", review.avatarColor)}>
                      {review.name.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <h4 className={cn("text-lg font-bold italic", titleFont)}>{review.name}</h4>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, starI) => (
                            <Star 
                              key={starI} 
                              className={cn("w-3 h-3", starI < review.rating ? "fill-orange-400 text-orange-400" : "text-white/10")} 
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-muted-foreground font-black tracking-widest">{review.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="flex gap-2">
                       {review.status === "responded" ? (
                         <>
                           <Badge variant="outline" className="bg-[#059669]/10 text-[#059669] border-[#059669]/20 text-[9px] font-black uppercase tracking-widest px-3 py-1">RESPONDIDA</Badge>
                           <Badge variant="outline" className="bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/20 text-[9px] font-black uppercase tracking-widest px-3 py-1">AUTO-IA</Badge>
                         </>
                       ) : (
                         <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-[9px] font-black uppercase tracking-widest px-3 py-1 flex items-center gap-1.5">
                           <AlertCircle className="w-3 h-3" /> APROVAÇÃO MANUAL
                         </Badge>
                       )}
                    </div>
                    <div className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 flex items-center gap-1.5 italic">
                      DADOS FORNECIDOS POR GOOGLE MAPS © 2026
                    </div>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground italic leading-relaxed">
                  "{review.comment}"
                </p>

                {review.status === "pending" && (
                  <Button 
                    onClick={() => openAiModal(review)}
                    className="h-12 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black uppercase tracking-widest text-[10px] px-8 rounded-xl shadow-lg shadow-[#7C3AED]/20 transition-all hover:scale-105"
                  >
                    <Zap className="w-4 h-4 mr-2 fill-white" />
                    Responder com IA
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )) : !loadingReal && (
          <div className="flex flex-col items-center justify-center p-20 space-y-4 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/5 text-muted-foreground/20">
              <MessageSquare className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold italic">Nenhuma avaliação pendente</h4>
              <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                Tudo em ordem! Suas avaliações reais do Google aparecerão aqui assim que forem sincronizadas.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* AI Reply Modal */}
      <AnimatePresence>
        {selectedReview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-[#042121] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setSelectedReview(null)}
                className="absolute top-8 right-8 p-3 hover:bg-white/5 rounded-2xl transition-all text-muted-foreground hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-8 mb-12">
                <div className="w-16 h-16 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-center text-2xl font-black">
                  {selectedReview.name.charAt(0)}
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/80">Ação Requerida</span>
                  <h3 className={cn("text-5xl font-bold", titleFont)}>Responder</h3>
                  <p className="text-muted-foreground text-sm font-medium">Para {selectedReview.name}</p>
                </div>
              </div>

              {/* Context Box */}
              <div className="p-8 rounded-[1.5rem] bg-black/20 border border-white/5 mb-10 relative group">
                <p className="text-muted-foreground italic leading-relaxed mb-6">
                  "{selectedReview.comment}"
                </p>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                   <div className="w-5 h-5 bg-white/10 flex items-center justify-center rounded-full">
                     <span className="text-[10px] text-white/50">G</span>
                   </div>
                   Google Maps • {selectedReview.date || "Há 1 dia"}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4 relative">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Tom</span>
                  <button 
                    onClick={() => setShowToneDropdown(!showToneDropdown)}
                    className="flex items-center gap-2 px-4 py-1.5 bg-black/20 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-accent hover:border-accent/50 transition-all"
                  >
                    {tones.find(t => t.id === tone)?.label}
                    <ChevronDown className={cn("w-3 h-3 transition-transform", showToneDropdown && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {showToneDropdown && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowToneDropdown(false)} 
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-full left-14 mb-2 w-48 bg-[#042121] border border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden"
                        >
                          <div className="p-2 space-y-1">
                            {tones.map((t) => (
                              <button
                                key={t.id}
                                onClick={() => {
                                  setTone(t.id);
                                  setShowToneDropdown(false);
                                  handleRegenerate(t.id);
                                }}
                                className={cn(
                                  "w-full text-left px-4 py-3 rounded-xl transition-all group",
                                  tone === t.id 
                                    ? "bg-accent/10 text-accent font-black" 
                                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                )}
                              >
                                <div className="text-[10px] uppercase tracking-widest">{t.label}</div>
                                <div className="text-[8px] opacity-60 font-medium">{t.description}</div>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
                <button 
                  onClick={() => handleRegenerate()}
                  disabled={generating}
                  className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-accent hover:opacity-70 transition-all"
                >
                  <RotateCcw className={cn("w-3 h-3", generating && "animate-spin")} />
                  Regerar
                </button>
              </div>

              {/* AI Draft Area */}
              <div className="relative mb-12">
                <div className="absolute -top-3 left-6 px-2 bg-[#042121] flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-accent" />
                </div>
                <div className="w-full min-h-[160px] p-8 rounded-[1.5rem] bg-[#010c0c] border border-accent/20 text-muted-foreground text-base leading-relaxed focus-within:border-accent transition-all">
                  {generating ? (
                    <div className="flex flex-col gap-3">
                      <div className="h-4 bg-white/5 rounded-full w-full animate-pulse" />
                      <div className="h-4 bg-white/5 rounded-full w-[90%] animate-pulse" />
                      <div className="h-4 bg-white/5 rounded-full w-[80%] animate-pulse" />
                    </div>
                  ) : (
                    aiResponse
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-6">
                <button 
                   onClick={() => setSelectedReview(null)}
                   className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-all"
                >
                  Descartar
                </button>
                <Button 
                  className="flex-1 max-w-[280px] h-14 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-[#7C3AED]/30 transition-all hover:scale-105 active:scale-95"
                  onClick={() => {
                    incrementUsage();
                    toast.success("Resposta enviada!");
                    setSelectedReview(null);
                  }}
                >
                  Enviar Agora
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <p className="text-[8px] text-center text-muted-foreground/40 font-medium italic mt-8">
                Ao responder, você concorda com as políticas de conteúdo do Google Business Profile.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
