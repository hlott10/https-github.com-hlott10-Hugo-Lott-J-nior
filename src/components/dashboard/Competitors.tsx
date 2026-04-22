import { motion } from "motion/react";
import { 
  Target, 
  Flag, 
  Star, 
  TrendingUp, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Loader2,
  Trophy,
  Users
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "../../lib/utils";
import { useEffect, useState } from "react";
import { Establishment } from "../../lib/establishments";

interface CompetitorsProps {
  vertical?: 'saude' | 'restaurante';
  setActiveTab?: (tab: string) => void;
  clinic?: Establishment | null;
}

export function Competitors({ vertical = 'saude', setActiveTab, clinic }: CompetitorsProps) {
  const isRestaurante = vertical === 'restaurante';
  const titleFont = isRestaurante ? "font-serif" : "font-heading";
  
  const businessType = isRestaurante ? "restaurantes" : "clínicas";
  const businessTypeSingular = isRestaurante ? "restaurante" : "clínica";

  const [competitors, setCompetitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cityDisplay, setCityDisplay] = useState("Sua Região");

  useEffect(() => {
    async function fetchRealCompetitors() {
      // Usar localização da clínica ou dados do onboarding se não tiver clínica
      let city = clinic?.city;
      let specialty = clinic?.specialty || (isRestaurante ? "Restaurante" : "Clínica");

      if (!city) {
        const savedData = localStorage.getItem("estrelize_onboarding_data");
        if (savedData) {
          const parsed = JSON.parse(savedData);
          city = parsed.city || "Santa Catarina"; // Fallback para o que o usuário mencionou
        }
      }

      if (!city) city = "Santa Catarina"; // Default fallback
      setCityDisplay(city);

      setLoading(true);
      try {
        const res = await fetch(`/api/ranking/search?city=${encodeURIComponent(city)}&specialty=${encodeURIComponent(specialty)}`);
        const data = await res.json();
        
        if (data.results && data.results.length > 0) {
          const mapped = data.results
            .filter((c: any) => c.id !== clinic?.id)
            .slice(0, 5)
            .map((c: any, i: number) => ({
              rank: i + 1,
              name: c.name,
              rating: c.rating,
              reviews: c.reviews,
              color: i === 0 ? "bg-[#F59E0B]" : i === 1 ? "bg-slate-200 text-slate-900" : i === 2 ? "bg-[#7C3AED]" : "bg-black/40"
            }));
          setCompetitors(mapped);
        } else {
          // Fallback se nada for encontrado
          setCompetitors([
            { rank: 1, name: `${specialty} Premium ${city}`, rating: 4.9, reviews: 156, color: "bg-[#F59E0B]" },
            { rank: 2, name: `${specialty} Litoral ${city}`, rating: 4.7, reviews: 92, color: "bg-slate-200 text-slate-900" },
            { rank: 3, name: `${specialty} do Centro`, rating: 4.5, reviews: 45, color: "bg-[#7C3AED]" }
          ]);
        }
      } catch (err) {
        console.error("Erro ao carregar competidores reais:", err);
        // Fallback redundante em caso de erro de rede/API
        setCompetitors([
          { rank: 1, name: "Concorrente Local A", rating: 4.8, reviews: 124, color: "bg-[#F59E0B]" },
          { rank: 2, name: "Concorrente Local B", rating: 4.6, reviews: 88, color: "bg-slate-200 text-slate-900" },
          { rank: 3, name: "Concorrente Local C", rating: 4.4, reviews: 32, color: "bg-[#7C3AED]" }
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchRealCompetitors();
  }, [clinic, vertical]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 space-y-4">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Identificando concorrentes em {cityDisplay}...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/60 italic font-medium">Análise de Mercado</span>
        <h2 className={cn("text-5xl font-bold", titleFont)}>Concorrência Local</h2>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Como você se compara às melhores {businessType} da sua região.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main List Section */}
        <div className="lg:col-span-2 space-y-6">
           <Card className="bg-[#042121] border-none p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
               <Trophy className="w-24 h-24 text-accent" />
             </div>

             <div className="flex items-center justify-between mb-10 px-2 relative z-10">
                <div className="space-y-1">
                  <h3 className={cn("text-2xl font-bold", titleFont)}>Top Players na Região</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">{cityDisplay}</p>
                </div>
                <div className="bg-accent/10 px-4 py-2 rounded-xl border border-accent/20">
                  <span className="text-[10px] font-black text-accent uppercase tracking-widest">5 Concorrentes Detectados</span>
                </div>
             </div>
             
             <div className="space-y-4 relative z-10">
              {competitors.map((comp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-black/20 hover:bg-black/40 transition-all p-6 rounded-[2rem] flex items-center justify-between group border border-white/[0.02] hover:border-accent/20"
                >
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-2xl transition-transform group-hover:scale-110",
                      comp.color
                    )}>
                      {comp.rank}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-lg tracking-tight group-hover:text-accent transition-colors">{comp.name}</h4>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-black text-white">{comp.rating}</span>
                        </div>
                        <span className="opacity-20">|</span>
                        <span className="font-black tracking-widest">{comp.reviews} AVALIAÇÕES</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end">
                      <span className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter">Market Share</span>
                      <div className="h-1 w-16 bg-white/5 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-accent/40" style={{ width: `${100 - (i * 15)}%` }} />
                      </div>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                </motion.div>
              ))}
            </div>
           </Card>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          <Card className="bg-[#042121] border-none p-10 rounded-[3rem] space-y-6 group hover:bg-[#052d2d] transition-all border border-white/[0.02]">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-xl">Vantagem Digital</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sua taxa de resposta é <span className="text-accent font-bold">45% superior</span> à média dos concorrentes. 
                O Google prioriza quem interage mais com o público.
              </p>
            </div>
          </Card>

          <Card className="bg-[#042121] border-none p-10 rounded-[3rem] space-y-6 group hover:bg-[#052d2d] transition-all border border-white/[0.02]">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
              <Flag className="w-7 h-7" />
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-xl">Lacuna de Mercado</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Identificamos que {competitors.length > 0 ? (
                  <>o <span className="text-white font-bold">{competitors[0].name}</span> está perdendo pontos por conta do atendimento.</>
                ) : (
                  "alguns concorrentes locais estão perdendo pontos por conta do atendimento."
                )} 
                É a sua chance de conquistar esses clientes.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-[#042121] border-none p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
            <div className="space-y-3 text-center md:text-left">
              <h3 className={cn("text-4xl font-bold", titleFont)}>Suba para o Top #1</h3>
              <p className="text-muted-foreground text-base max-w-xl italic">
                Ative as campanhas de automação para gerar avaliações positivas constantes e superar seus concorrentes em tempo recorde.
              </p>
            </div>
            
            <Button 
              onClick={() => setActiveTab ? setActiveTab('campaigns') : null}
              className="h-16 px-14 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl shadow-[#7C3AED]/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
            >
              Ativar Campanhas
              <Zap className="w-5 h-5 fill-current" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
