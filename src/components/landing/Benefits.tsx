import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

const benefits = [
  "Mais pacientes agendando consultas",
  "Melhor reputação digital do mercado",
  "Respostas automáticas em tempo real",
  "Economia drástica de tempo da equipe",
  "Mais autoridade para o profissional",
  "Melhoria no SEO local (Google Maps)",
  "IA treinada em ética e conduta médica",
  "Dashboard intuitivo e fácil de usar"
];

export function Benefits() {
  return (
    <section className="py-24 px-6 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-cta flex-shrink-0" />
                  <span className="text-sm font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-accent font-semibold mb-4 uppercase tracking-widest text-sm">Benefícios</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-8">Foque nos seus pacientes, nós cuidamos do Google</h3>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              O Estrelize Saúde não é apenas uma ferramenta de automação, é o seu braço direito na construção de uma marca médica forte e confiável.
            </p>
            <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 italic text-accent">
              "Desde que começamos a usar o Estrelize, nossa taxa de conversão de novos pacientes vindos do Google Maps aumentou em 40%."
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
