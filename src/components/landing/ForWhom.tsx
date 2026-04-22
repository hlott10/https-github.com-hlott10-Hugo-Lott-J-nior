import { motion } from "motion/react";
import { Stethoscope, Scissors, Heart, FlaskConical, Brain } from "lucide-react";

const categories = [
  { icon: Stethoscope, name: "Clínicas Médicas" },
  { icon: Heart, name: "Dentistas" },
  { icon: Brain, name: "Psicólogos" },
  { icon: FlaskConical, name: "Laboratórios" },
  { icon: Scissors, name: "Clínicas Estéticas" }
];

export function ForWhom() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-accent font-semibold mb-4 uppercase tracking-widest text-sm">Para Quem É</h2>
        <h3 className="text-3xl md:text-5xl font-bold mb-16">Solução completa para o setor da saúde</h3>
        
        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="px-8 py-6 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/50 transition-all flex flex-col items-center gap-4 min-w-[200px]"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <cat.icon className="w-8 h-8 text-accent" />
              </div>
              <span className="font-bold">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
