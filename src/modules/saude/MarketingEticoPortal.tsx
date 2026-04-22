import { motion } from "motion/react";
import { Stethoscope, Heart, ShieldCheck, Zap, ArrowRight, Star, MessageSquareCode, GraduationCap } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/landing/Navbar";
import { Footer } from "../../components/landing/Footer";

export function MarketingEticoPortal() {
  return (
    <div className="min-h-screen bg-[#021010] text-foreground selection:bg-teal-500/30 selection:text-teal-400">
      <Navbar />
      
      <main>
        {/* Hero Segment */}
        <section className="relative pt-40 pb-24 px-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 blur-[150px] -z-10 rounded-full" />
          
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-black uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                Ética & Crescimento Digital
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
                Autoridade Médica em <br />
                <span className="text-teal-400">Sincronia com a Ética</span>
              </h1>
              
              <p className="text-xl text-teal-100/60 max-w-3xl mx-auto font-light leading-relaxed">
                Desenvolva seu Branding Pessoal no Google seguindo rigorosamente as normas do CFM e ANS. Respostas automáticas inteligentes que humanizam seu atendimento.
              </p>

              <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/onboarding?vertical=medico">
                  <Button size="lg" className="h-16 px-10 text-xl bg-teal-500 hover:bg-teal-600 text-white font-black rounded-2xl group shadow-[0_0_40px_rgba(20,184,166,0.2)]">
                    Ativar Meu Consultório IA
                    <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button size="lg" variant="ghost" className="h-16 px-10 text-xl text-teal-400 hover:bg-teal-500/10 rounded-2xl">
                    Ver Exemplo de Resposta Ética
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Professional Features */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Preservamos sua <br /><span className="text-teal-400 italic">Integridade Profissional</span></h2>
              <div className="space-y-6">
                {[
                  { icon: MessageSquareCode, title: "Linguagem Adequada", desc: "Nossa IA é pré-configurada para evitar termos proibidos pelo código de ética médica." },
                  { icon: GraduationCap, title: "Foco em Expertise", desc: "Destaque suas titulações e especialidades de forma informativa e não mercantilista." },
                  { icon: Heart, title: "Humanização de Marca", desc: "Interaja com seus pacientes de forma empática e profissional 24 horas por dia." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-start p-4 rounded-3xl hover:bg-white/5 transition-colors">
                    <div className="mt-1 w-12 h-12 shrink-0 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-400">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-teal-500/20 blur-[100px] rounded-full" />
              <div className="relative glass border-teal-500/20 rounded-[2.5rem] p-8 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-10 h-10 rounded-full bg-teal-500/40" />
                    <div className="flex-1">
                      <div className="h-2 w-24 bg-white/20 rounded mb-2" />
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-teal-400 text-teal-400" />)}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-2xl">
                    <p className="text-sm italic text-teal-100/80 mb-4 font-light">"O melhor especialista que já consultei. Extremamente técnico!"</p>
                    <div className="pt-4 border-t border-teal-500/20">
                      <span className="text-[10px] font-black uppercase text-teal-400 tracking-widest block mb-2">Resposta Estrelize AI</span>
                      <p className="text-xs leading-relaxed text-teal-50/70">Agradecemos sinceramente pelo feedback positivo. Nosso compromisso é sempre pautado na ciência e no cuidado individualizado.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
