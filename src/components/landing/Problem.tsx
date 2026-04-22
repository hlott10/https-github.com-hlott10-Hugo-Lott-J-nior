import { motion } from "motion/react";
import { XCircle, AlertCircle, Clock, TrendingDown, Users } from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "Falta de tempo da recepção",
    description: "Sua equipe está focada no atendimento presencial e acaba deixando as avaliações online sem resposta."
  },
  {
    icon: TrendingDown,
    title: "Ranking baixo no Google",
    description: "O Google prioriza estabelecimentos que interagem com seus clientes. Sem respostas, sua clínica cai no ranking."
  },
  {
    icon: Users,
    title: "Perda de novos pacientes",
    description: "80% dos pacientes leem as avaliações antes de agendar. Uma avaliação sem resposta gera desconfiança."
  },
  {
    icon: AlertCircle,
    title: "Respostas pouco profissionais",
    description: "Respostas genéricas ou mal escritas podem prejudicar a imagem institucional da sua clínica."
  }
];

export function Problem() {
  return (
    <section id="problema" className="py-24 px-6 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-accent font-semibold mb-4 uppercase tracking-widest text-sm">O Desafio</h2>
          <h3 className="text-3xl md:text-5xl font-bold mb-6">Por que clínicas estão escolhendo o Estrelize?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ignorar as avaliações do Google é o erro mais comum (e caro) que profissionais da saúde cometem hoje em dia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <problem.icon className="w-6 h-6 text-destructive" />
              </div>
              <h4 className="text-xl font-bold mb-4">{problem.title}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
