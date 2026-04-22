import { motion } from "motion/react";
import { 
  Trophy, 
  TrendingUp, 
  Star, 
  MessageSquare, 
  Medal,
  Zap,
  Check,
  Lock,
  ChevronRight,
  Loader2,
  Sparkles,
  MessageCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useAuth } from "../../lib/AuthContext";
import { getMyClinic, Establishment } from "../../lib/establishments";
import { cn } from "../../lib/utils";

interface RankingProps {
  vertical?: 'saude' | 'restaurante';
}

export function Ranking({ vertical: forcedVertical }: RankingProps) {
  const { user } = useAuth();
  const [clinic, setClinic] = useState<Establishment | null>(null);
  const [loading, setLoading] = useState(true);

  const vertical = forcedVertical || (window.location.pathname.includes('restaurante') ? 'restaurante' : 'saude');
  const isRestaurante = vertical === 'restaurante';
  const titleFont = isRestaurante ? "font-serif" : "font-heading";

  useEffect(() => {
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const myData = await getMyClinic(user.id);
        setClinic(myData);
      } catch (err) {
        console.error("Erro ao carregar rankings:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  const achievements = [
    {
      id: 1,
      title: "Primeiros Passos",
      description: "Conectou sua conta do Google Business",
      unlocked: true,
      unlockedDate: "10/03/2026",
      icon: Zap,
      color: "text-[#7C3AED]"
    },
    {
      id: 2,
      title: "Mestre das Respostas",
      description: "Respondeu 50 avaliações com IA",
      unlocked: true,
      unlockedDate: "11/03/2026",
      icon: MessageCircle,
      color: "text-blue-400"
    },
    {
      id: 3,
      title: "Líder Local",
      description: "Alcançou o Top 1 da sua região",
      unlocked: false,
      icon: Trophy,
      color: "text-yellow-400"
    },
    {
      id: 4,
      title: "Influenciador",
      description: "Gerou 100 novas avaliações este mês",
      unlocked: false,
      icon: TrendingUp,
      color: "text-accent"
    }
  ];

  return (
    <div className="space-y-12 pb-24 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/60 italic font-medium">Gamificação</span>
        <h2 className={cn("text-5xl font-bold", titleFont)}>Suas Conquistas</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((achievement, i) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={cn(
              "bg-[#042121] border-none p-8 rounded-[2.5rem] relative group transition-all h-full",
              !achievement.unlocked && "opacity-40"
            )}>
              <div className="flex gap-6">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                  achievement.unlocked ? "bg-black/20" : "bg-black/40"
                )}>
                  <achievement.icon className={cn("w-6 h-6", achievement.unlocked ? achievement.color : "text-muted-foreground")} />
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-xl">{achievement.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{achievement.description}</p>
                  
                  {achievement.unlocked ? (
                    <div className="space-y-1">
                      <div className="text-[8px] font-black uppercase tracking-[0.2em] text-accent/60">Desbloqueado em</div>
                      <div className="text-[10px] font-bold text-accent">{achievement.unlockedDate}</div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      <Lock className="w-3 h-3" />
                      Bloqueado
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-[#042121] border-none p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-16 h-16 rounded-3xl bg-[#7C3AED] flex items-center justify-center text-white shadow-xl shadow-[#7C3AED]/30 shrink-0">
              <Trophy className="w-8 h-8 fill-white" />
            </div>
            
            <div className="flex-1 space-y-2 w-full">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-black italic text-lg uppercase tracking-tight">Próximo Nível: Especialista</h4>
                  <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Faltam 150 XP</p>
                </div>
                <div className="text-4xl font-black italic tracking-tighter">85%</div>
              </div>
              
              <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
                  className="h-full bg-gradient-to-r from-[#7C3AED] to-blue-500 relative"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:20px_20px]" />
                </motion.div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
