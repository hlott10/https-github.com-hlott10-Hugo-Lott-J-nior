import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Star, CheckCircle2, ArrowRight, Play, Loader2, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import { useUsage } from "../../lib/UsageContext";
import { createCheckoutSession } from "../../lib/stripe";
import { useState } from "react";

export function Hero() {
  const { user } = useAuth();
  const { isPro } = useUsage();
  const [upgrading, setUpgrading] = useState(false);
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    if (!user) {
      navigate('/onboarding');
      return;
    }
    setUpgrading(true);
    await createCheckoutSession({
      planId: 'pro',
      cycle: 'monthly',
      userId: user.id,
      vertical: 'saude',
      email: user.email
    });
    setUpgrading(false);
  };
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/20 blur-[120px] -z-10 rounded-full" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-accent/10 blur-[100px] -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-accent text-xs font-semibold mb-6">
            <Star className="w-3 h-3 fill-accent" />
            <span>IA Especializada em Saúde</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
            Estrelize Saúde: Gestão Inteligente de <br />
            <span className="gradient-text">Avaliações no Google</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Responda automaticamente avaliações do Google, melhore seu ranking e atraia mais pacientes com inteligência artificial especializada na área da saúde.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button 
                    size="lg" 
                    className="h-14 px-8 text-lg bg-accent hover:bg-accent/90 text-[#021616] font-bold group"
                  >
                    Abrir Painel
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                {!isPro && (
                  <Button 
                    size="lg" 
                    onClick={handleUpgrade}
                    disabled={upgrading}
                    className="h-14 px-8 text-lg bg-cta hover:bg-cta/90 text-white font-bold group"
                  >
                    {upgrading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Zap className="mr-2 w-5 h-5 fill-current" />}
                    Assinar Plano Pro
                  </Button>
                )}
              </>
            ) : (
              <>
                <Link to="/onboarding">
                  <Button 
                    size="lg" 
                    className="h-14 px-8 text-lg bg-cta hover:bg-cta/90 text-white font-bold group"
                  >
                    Começar Agora
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-primary/30 hover:bg-primary/10 w-full sm:w-auto">
                    <Play className="mr-2 w-5 h-5 fill-current" />
                    Ver Demonstração
                  </Button>
                </Link>
              </>
            )}
          </div>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative glass rounded-3xl p-4 md:p-8 shadow-2xl border-white/5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            
            {/* Mockup Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Últimas Avaliações</h3>
                  <span className="text-xs text-muted-foreground">Atualizado agora</span>
                </div>
                
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5 text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-accent/20" />
                      <div>
                        <div className="text-sm font-medium">Paciente Satisfeito</div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className="w-3 h-3 fill-accent text-accent" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 italic">
                      "O atendimento na clínica foi excelente. O Dr. foi muito atencioso e a recepção muito ágil."
                    </p>
                    <div className="bg-primary/20 rounded-lg p-3 border border-primary/30">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-3 h-3 text-cta" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cta">Resposta da IA</span>
                      </div>
                      <p className="text-xs text-foreground/80">
                        Ficamos muito felizes com seu feedback! Nossa missão é oferecer um atendimento humanizado e de excelência. Esperamos vê-lo novamente em breve.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-6">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/5 text-left">
                  <div className="text-sm text-muted-foreground mb-1">Reputação Geral</div>
                  <div className="text-4xl font-bold text-accent">4.9</div>
                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-2xl p-6 border border-white/5 text-left">
                  <div className="text-sm text-muted-foreground mb-1">Taxa de Resposta</div>
                  <div className="text-4xl font-bold text-cta">100%</div>
                  <div className="w-full bg-white/10 h-2 rounded-full mt-4 overflow-hidden">
                    <div className="bg-cta h-full w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-cta/20 blur-2xl rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}
