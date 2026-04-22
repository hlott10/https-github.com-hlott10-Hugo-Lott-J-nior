import { motion } from "motion/react";
import { Card, CardContent } from "../ui/card";
import { Trophy, Star, MessageSquare, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Star,
    label: "Média de Avaliações",
    value: "4.9",
    change: "+0.4 este mês",
    color: "text-accent"
  },
  {
    icon: MessageSquare,
    label: "Taxa de Resposta",
    value: "100%",
    change: "Meta atingida",
    color: "text-cta"
  },
  {
    icon: TrendingUp,
    label: "Crescimento Mensal",
    value: "+24%",
    change: "Novos pacientes",
    color: "text-blue-400"
  },
  {
    icon: Trophy,
    label: "Pontuação de Reputação",
    value: "98/100",
    change: "Nível Diamante",
    color: "text-yellow-400"
  }
];

export function Ranking() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cta/10 blur-[150px] -z-10 rounded-full" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-accent font-semibold mb-4 uppercase tracking-widest text-sm">Performance</h2>
          <h3 className="text-3xl md:text-5xl font-bold mb-6">Descubra como sua clínica está no ranking</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Acompanhe em tempo real as métricas que o Google utiliza para decidir quem aparece primeiro nas buscas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/5 border-white/5 hover:bg-white/10 transition-colors overflow-hidden relative">
                <div className={`absolute top-0 left-0 w-1 h-full bg-current ${stat.color}`} />
                <CardContent className="p-8">
                  <stat.icon className={`w-8 h-8 mb-6 ${stat.color}`} />
                  <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-xs font-medium opacity-80">{stat.change}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
