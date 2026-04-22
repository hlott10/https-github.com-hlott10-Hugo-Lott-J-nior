import { LegalLayout } from "../components/LegalLayout";
import { SEO } from "../components/SEO";

export function TermsOfUse() {
  return (
    <LegalLayout title="Termos de Uso" lastUpdated="13 de Abril de 2024">
      <SEO title="Termos de Uso" description="Termos de Uso do Estrelize Saúde" />
      
      <p>Bem‑vindo ao Estrelize Saúde. Ao acessar ou utilizar nossa plataforma, você concorda com estes Termos de Uso. Caso não concorde, recomendamos não utilizar nossos serviços.</p>

      <hr className="my-8 border-white/10" />

      <h2 className="text-2xl font-bold mb-4">1. Sobre o Serviço</h2>
      <p>O Estrelize Saúde é uma plataforma SaaS que permite clínicas, consultórios e profissionais da saúde gerenciar e responder avaliações do Google, além de acompanhar métricas de reputação online.</p>
      <p>O serviço inclui:</p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Monitoramento de avaliações</li>
        <li>Respostas automáticas com IA</li>
        <li>Relatórios de reputação</li>
        <li>Ranking de clínicas</li>
        <li>Diagnóstico de reputação</li>
      </ul>

      <hr className="my-8 border-white/10" />

      <h2 className="text-2xl font-bold mb-4">2. Uso da Plataforma</h2>
      <p>Ao utilizar o Estrelize Saúde, você concorda em:</p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Fornecer informações verdadeiras</li>
        <li>Não utilizar o sistema para fins ilegais</li>
        <li>Não tentar acessar dados de outros usuários</li>
        <li>Não interferir na operação da plataforma</li>
      </ul>

      <hr className="my-8 border-white/10" />

      <h2 className="text-2xl font-bold mb-4">3. Conta do Usuário</h2>
      <p>Para utilizar determinados recursos, pode ser necessário criar uma conta.</p>
      <p>O usuário é responsável por:</p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Manter suas credenciais seguras</li>
        <li>Todas as atividades realizadas na conta</li>
        <li>Atualizar suas informações</li>
      </ul>

      <hr className="my-8 border-white/10" />

      <h2 className="text-2xl font-bold mb-4">4. Integrações com Terceiros</h2>
      <p>O Estrelize Saúde integra-se com serviços de terceiros como Google Business Profile. Ao conectar sua conta, você autoriza o acesso às informações necessárias para funcionamento da plataforma.</p>
      <p>Não nos responsabilizamos por mudanças nas políticas ou serviços desses terceiros.</p>

      <hr className="my-8 border-white/10" />

      <h2 className="text-2xl font-bold mb-4">5. Planos e Pagamentos</h2>
      <p>O Estrelize Saúde oferece planos gratuitos e pagos.</p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Os valores podem ser alterados mediante aviso prévio</li>
        <li>O cancelamento pode ser feito a qualquer momento</li>
        <li>Não há garantia de resultados específicos</li>
      </ul>

      <hr className="my-8 border-white/10" />

      <h2 className="text-2xl font-bold mb-4">6. Cancelamento</h2>
      <p>Você pode cancelar sua conta a qualquer momento. Após o cancelamento, seu acesso poderá ser encerrado e os dados removidos conforme nossa política de retenção.</p>

      <hr className="my-8 border-white/10" />

      <h2 className="text-2xl font-bold mb-4">7. Limitação de Responsabilidade</h2>
      <p>O Estrelize Saúde não garante resultados específicos, como aumento de pacientes ou melhoria no ranking.</p>
      <p>O serviço é fornecido "como está".</p>

      <hr className="my-8 border-white/10" />

      <h2 className="text-2xl font-bold mb-4">8. Alterações nos Termos</h2>
      <p>Podemos atualizar estes termos a qualquer momento. As alterações entram em vigor após publicação.</p>

      <hr className="my-8 border-white/10" />

      <h2 className="text-2xl font-bold mb-4">9. Contato</h2>
      <p>Para dúvidas sobre estes Termos:</p>
      <p>Email: <a href="mailto:contato@estrelize.com.br" className="text-accent hover:underline">contato@estrelize.com.br</a></p>
    </LegalLayout>
  );
}
