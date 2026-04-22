import { motion } from "motion/react";
import { Card, CardContent } from "../ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dra. Ana Silva",
    role: "Diretora Clínica",
    specialty: "Clínica Médica",
    content: "O Estrelize mudou nossa rotina. Antes perdíamos horas respondendo avaliações ou simplesmente não respondíamos. Agora tudo é automático e profissional."
  },
  {
    name: "Dr. Henrique Martins",
    role: "Proprietário",
    specialty: "Odontologia",
    content: "Nossa clínica subiu para a primeira posição no Google Maps da região. Os pacientes comentam que viram nossas respostas atenciosas."
  },
  {
    name: "Dra. Juliana Costa",
    role: "Médica Esteta",
    specialty: "Clínica Estética",
    content: "A IA é impressionante, ela entende exatamente o tom que queremos passar. Recomendo para qualquer colega que queira crescer no digital."
  }
];

export function Testimonials() {
  return (
    <section className="py-24 px-6 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-accent font-semibold mb-4 uppercase tracking-widest text-sm">Prova Social</h2>
          <h3 className="text-3xl md:text-5xl font-bold mb-6">O que dizem os especialistas</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-surface border-white/5 relative overflow-hidden">
                <Quote className="absolute -top-4 -right-4 w-24 h-24 text-white/5 -rotate-12" />
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-8 italic leading-relaxed">
                    "{t.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/30" />
                    <div>
                      <div className="font-bold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role} • {t.specialty}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
