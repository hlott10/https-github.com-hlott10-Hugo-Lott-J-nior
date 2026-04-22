import { LegalLayout } from "../components/LegalLayout";
import { SEO } from "../components/SEO";

export function About() {
  return (
    <LegalLayout title="Sobre o Estrelize Saúde" lastUpdated="13 de Abril de 2024">
      <SEO title="Sobre Nós" description="Conheça a missão e a visão do Estrelize Saúde" />
      
      <p className="text-xl text-muted-foreground mb-8">
        O Estrelize Saúde é uma plataforma criada para ajudar clínicas, consultórios e profissionais da saúde a melhorar sua reputação online e atrair mais pacientes através da gestão inteligente de avaliações do Google.
      </p>

      <p>Nossa missão é transformar avaliações online em crescimento real para profissionais da saúde, utilizando inteligência artificial, automação e análise de reputação.</p>

      <hr className="my-12 border-white/10" />

      <h2 className="text-3xl font-bold mb-6">O Problema</h2>
      <p>A maioria das clínicas não responde avaliações online por falta de tempo ou estrutura. Isso gera perda de novos pacientes e impacto negativo na reputação.</p>
      <p>Além disso, muitos profissionais não sabem como melhorar sua presença digital ou acompanhar sua reputação online.</p>

      <hr className="my-12 border-white/10" />

      <h2 className="text-3xl font-bold mb-6">Nossa Solução</h2>
      <p>O Estrelize Saúde automatiza esse processo através de:</p>
      <ul className="list-disc pl-6 space-y-3 mb-8">
        <li>Monitoramento automático de avaliações</li>
        <li>Respostas inteligentes com IA</li>
        <li>Relatórios de reputação</li>
        <li>Ranking de clínicas</li>
        <li>Diagnóstico automático</li>
      </ul>

      <hr className="my-12 border-white/10" />

      <h2 className="text-3xl font-bold mb-6">Para Quem é o Estrelize Saúde</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          "Clínicas médicas",
          "Dentistas",
          "Psicólogos",
          "Clínicas estéticas",
          "Laboratórios",
          "Profissionais da saúde"
        ].map((item) => (
          <div key={item} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center font-medium">
            {item}
          </div>
        ))}
      </div>

      <hr className="my-12 border-white/10" />

      <h2 className="text-3xl font-bold mb-6">Nossa Visão</h2>
      <p>Acreditamos que clínicas com melhor atendimento merecem ser mais encontradas. Nosso objetivo é democratizar o acesso à reputação digital para profissionais da saúde.</p>

      <hr className="my-12 border-white/10" />

      <h2 className="text-3xl font-bold mb-6">Contato</h2>
      <p>Email: <a href="mailto:contato@estrelize.com.br" className="text-accent hover:underline">contato@estrelize.com.br</a></p>
    </LegalLayout>
  );
}
