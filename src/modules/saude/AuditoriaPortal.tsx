import { motion } from "motion/react";
import { ShieldCheck, BarChart3, Users, Zap, ArrowRight, Star, Activity, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/landing/Navbar";
import { Footer } from "../../components/landing/Footer";

export function AuditoriaPortal() {
  return (
    <div className="min-h-screen bg-[#021616] text-foreground selection:bg-accent/30 selection:text-accent">
      <Navbar />
      
      <main>
        {/* Hero Segment */}
        <section className="relative pt-40 pb-24 px-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-emerald-500/10 blur-[120px] -z-10 rounded-full" />
          
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                Auditoria de Reputação Digital
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
                O Padrão Ouro de <br />
                <span className="text-emerald-400 italic">Confiança para Clínicas</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
                Certifique a autenticidade das suas avaliações, elimine feedback falso e domine os rankings locais com auditoria em tempo real baseada em IA.
              </p>

              <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/onboarding?vertical=clinica">
                  <Button size="lg" className="h-16 px-10 text-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl group">
                    Iniciar Auditoria Hoje
                    <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/ranking">
                  <Button size="lg" variant="outline" className="h-16 px-10 text-xl border-white/10 hover:bg-white/5 rounded-2xl">
                    Ver Ranking de Cidades
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 px-6 border-y border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Analytics Avançado",
                desc: "Visualize tendências de sentimentos e pontos de fricção no atendimento em tempo real."
              },
              {
                icon: Search,
                title: "Detecção de Fraude",
                desc: "Algoritmos que identificam e auxiliam na remoção de avaliações maliciosas ou fakes."
              },
              {
                icon: Zap,
                title: "Resposta Imediata",
                desc: "IA treinada para responder dúvidas técnicas e elogios mantendo o tom da sua marca."
              }
            ].map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors group"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed italic">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
