import { motion } from "motion/react";
import { Brain, Heart, Zap, ShieldCheck } from "lucide-react";

const solutions = [
  {
    icon: Brain,
    title: "IA Especializada em Saúde",
    description: "Nossa inteligência artificial entende o contexto médico e utiliza terminologia adequada para cada especialidade."
  },
  {
    icon: Heart,
    title: "Tom Humanizado",
    description: "Respostas que não parecem robóticas. Mantemos a empatia e o profissionalismo que sua clínica exige."
  },
  {
    icon: Zap,
    title: "Automação Completa",
    description: "Recebeu uma avaliação? O Estrelize responde em segundos, 24 horas por dia, 7 dias por semana."
  },
  {
    icon: ShieldCheck,
    title: "Melhoria de Reputação",
    description: "Aumente sua nota média e mostre para novos pacientes que você se importa com cada feedback."
  }
];

export function Solution() {
  return (
    <section id="solucao" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/10 blur-[120px] -z-10 rounded-full" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-accent font-semibold mb-4 uppercase tracking-widest text-sm">A Solução</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-8">O Estrelize responde automaticamente por você</h3>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              Nossa plataforma foi desenhada para profissionais que não têm tempo a perder, mas que sabem que a reputação digital é o seu maior ativo.
            </p>
            
            <div className="space-y-6">
              {solutions.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cta/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-cta" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">{item.title}</h4>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden glass border-white/10 p-2">
              <img 
                src="https://picsum.photos/seed/medical-tech/800/800" 
                alt="Tecnologia Médica" 
                className="w-full h-full object-cover rounded-2xl opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              
              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-12 right-12 glass p-4 rounded-2xl border-white/20 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cta flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Status</div>
                    <div className="text-sm font-bold">IA Ativa</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
