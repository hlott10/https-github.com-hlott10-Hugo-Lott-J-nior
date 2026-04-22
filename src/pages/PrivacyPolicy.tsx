import { LegalLayout } from "../components/LegalLayout";
import { SEO } from "../components/SEO";

export function PrivacyPolicy() {
  return (
    <LegalLayout title="Política de Privacidade" lastUpdated="13 de Abril de 2024">
      <SEO title="Política de Privacidade" description="Política de Privacidade do Estrelize Saúde" />
      
      <p>Sua privacidade é importante para nós. Esta Política explica como coletamos, usamos e protegemos seus dados.</p>

      <hr className="my-8 border-white/10" />

      <h2 className="text-2xl font-bold mb-4">1. Dados Coletados</h2>
      <p>Podemos coletar:</p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Nome</li>
        <li>Email</li>
        <li>Telefone</li>
        <li>Nome da clínica</li>
        <li>Dados de avaliações públicas</li>
        <li>Dados de uso da plataforma</li>
      </ul>

      <hr className="my-8 border-white/10" />

      <h2 className="text-2xl font-bold mb-4">2. Como Usamos os Dados</h2>
      <p>Utilizamos os dados para:</p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Fornecer o serviço</li>
        <li>Melhorar a plataforma</li>
        <li>Enviar comunicações</li>
        <li>Gerar relatórios</li>
      </ul>

      <hr className="my-8 border-white/10" />

      <h2 className="text-2xl font-bold mb-4">3. Compartilhamento de Dados</h2>
      <p>Não vendemos seus dados.</p>
      <p>Podemos compartilhar com:</p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Provedores de infraestrutura</li>
        <li>Serviços de analytics</li>
        <li>Integrações autorizadas</li>
      </ul>

      <hr className="my-8 border-white/10" />

      <h2 className="text-2xl font-bold mb-4">4. Segurança</h2>
      <p>Adotamos medidas técnicas para proteger seus dados contra acesso não autorizado.</p>

      <hr className="my-8 border-white/10" />

      <h2 className="text-2xl font-bold mb-4">5. Retenção de Dados</h2>
      <p>Mantemos os dados enquanto sua conta estiver ativa ou conforme necessário para fins legais.</p>

      <hr className="my-8 border-white/10" />

      <h2 className="text-2xl font-bold mb-4">6. Direitos do Usuário</h2>
      <p>Você pode:</p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Solicitar acesso aos dados</li>
        <li>Corrigir dados</li>
        <li>Solicitar exclusão</li>
        <li>Revogar consentimento</li>
      </ul>

      <hr className="my-8 border-white/10" />

      <h2 className="text-2xl font-bold mb-4">7. Cookies</h2>
      <p>Utilizamos cookies para melhorar a experiência.</p>
      <p>Mais detalhes na Política de Cookies.</p>

      <hr className="my-8 border-white/10" />

      <h2 className="text-2xl font-bold mb-4">8. Contato</h2>
      <p>Email: <a href="mailto:contato@estrelize.com.br" className="text-accent hover:underline">contato@estrelize.com.br</a></p>
    </LegalLayout>
  );
}
