import { LegalLayout } from "../components/LegalLayout";
import { SEO } from "../components/SEO";

export function CookiePolicy() {
  return (
    <LegalLayout title="Política de Cookies" lastUpdated="13 de Abril de 2024">
      <SEO title="Política de Cookies" description="Política de Cookies do Estrelize Saúde" />
      
      <p>Esta Política explica como utilizamos cookies.</p>

      <hr className="my-8 border-white/10" />

      <h2 className="text-2xl font-bold mb-4">1. O que são Cookies</h2>
      <p>Cookies são pequenos arquivos armazenados no navegador para melhorar a experiência.</p>

      <hr className="my-8 border-white/10" />

      <h2 className="text-2xl font-bold mb-4">2. Como Utilizamos</h2>
      <p>Utilizamos cookies para:</p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Manter sessão</li>
        <li>Análise de uso</li>
        <li>Melhorar performance</li>
        <li>Personalização</li>
      </ul>

      <hr className="my-8 border-white/10" />

      <h2 className="text-2xl font-bold mb-4">3. Tipos de Cookies</h2>
      
      <h3 className="text-xl font-bold mb-2">Cookies Essenciais</h3>
      <p className="mb-4">Necessários para funcionamento da plataforma.</p>

      <h3 className="text-xl font-bold mb-2">Cookies de Performance</h3>
      <p className="mb-4">Coletam dados de uso.</p>

      <h3 className="text-xl font-bold mb-2">Cookies de Funcionalidade</h3>
      <p className="mb-4">Memorizam preferências.</p>

      <h3 className="text-xl font-bold mb-2">Cookies de Marketing</h3>
      <p className="mb-4">Podem ser usados para campanhas futuras.</p>

      <hr className="my-8 border-white/10" />

      <h2 className="text-2xl font-bold mb-4">4. Gerenciamento de Cookies</h2>
      <p>Você pode gerenciar cookies no seu navegador.</p>

      <hr className="my-8 border-white/10" />

      <h2 className="text-2xl font-bold mb-4">5. Alterações</h2>
      <p>Podemos atualizar esta política periodicamente.</p>

      <hr className="my-8 border-white/10" />

      <h2 className="text-2xl font-bold mb-4">6. Contato</h2>
      <p>Email: <a href="mailto:contato@estrelize.com.br" className="text-accent hover:underline">contato@estrelize.com.br</a></p>
    </LegalLayout>
  );
}
