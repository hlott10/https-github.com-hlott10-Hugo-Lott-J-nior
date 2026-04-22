import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const faqs = [
  {
    question: "Como funciona a automação?",
    answer: "Após conectar sua conta do Google Business Profile, nossa IA monitora novas avaliações. Quando uma chega, ela analisa o conteúdo e gera uma resposta personalizada baseada no seu tom de voz e especialidade médica."
  },
  {
    question: "Preciso instalar algum software?",
    answer: "Não! O Estrelize Saúde é 100% online (SaaS). Você acessa tudo pelo navegador, de qualquer dispositivo."
  },
  {
    question: "Funciona para clínicas pequenas ou profissionais liberais?",
    answer: "Com certeza. Temos planos que atendem desde o médico que atende sozinho até grandes redes de laboratórios e clínicas."
  },
  {
    question: "A IA pode responder algo errado?",
    answer: "Nossa IA é treinada especificamente para o setor de saúde, seguindo diretrizes de ética e profissionalismo. Além disso, você pode configurar regras específicas e revisar as respostas se desejar."
  },
  {
    question: "Como isso melhora meu ranking no Google?",
    answer: "O algoritmo do Google valoriza estabelecimentos ativos. Responder 100% das avaliações de forma rápida e com palavras-chave relevantes (que nossa IA faz automaticamente) é um dos principais fatores de ranqueamento local."
  }
];

export function FAQ() {
  return (
    <section className="py-24 px-6 bg-white/[0.02]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-accent font-semibold mb-4 uppercase tracking-widest text-sm">FAQ</h2>
          <h3 className="text-3xl md:text-5xl font-bold mb-6">Dúvidas Frequentes</h3>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
              <AccordionTrigger className="text-left hover:text-accent transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
