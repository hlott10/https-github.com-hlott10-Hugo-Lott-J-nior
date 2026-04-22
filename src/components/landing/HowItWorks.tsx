import { motion } from "motion/react";
import { Link2, Sparkles, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Link2,
    title: "Conecte sua conta Google",
    description: "Em menos de 2 minutos, integre sua conta do Google Business Profile com nossa plataforma segura."
  },
  {
    icon: Sparkles,
    title: "IA responde automaticamente",
    description: "Nossa IA analisa o sentimento e o conteúdo de cada avaliação para gerar a resposta perfeita instantaneamente."
  },
  {
    icon: TrendingUp,
    title: "Seu ranking melhora",
    description: "Com 100% de taxa de resposta, o Google entende que sua clínica é relevante e te coloca no topo das buscas."
  }
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 px-6 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-accent font-semibold mb-4 uppercase tracking-widest text-sm">Passo a Passo</h2>
          <h3 className="text-3xl md:text-5xl font-bold mb-6">Simples, rápido e eficiente</h3>
        </div>

        <div className="relative">
          {/* Connector Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative z-10 text-center group"
              >
                <div className="w-20 h-20 rounded-3xl bg-surface border border-white/10 flex items-center justify-center mx-auto mb-8 group-hover:bg-primary transition-colors shadow-xl">
                  <step.icon className="w-10 h-10 text-accent group-hover:text-white transition-colors" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-cta flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>
                </div>
                <h4 className="text-2xl font-bold mb-4">{step.title}</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
