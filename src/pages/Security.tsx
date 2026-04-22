import { LegalLayout } from "../components/LegalLayout";
import { SEO } from "../components/SEO";
import { Shield, Lock, Server, Globe, Users, CheckCircle } from "lucide-react";

export function Security() {
  return (
    <LegalLayout title="Segurança e Privacidade" lastUpdated="13 de Abril de 2024">
      <SEO title="Segurança" description="Saiba como protegemos seus dados no Estrelize Saúde" />
      
      <p className="text-xl text-muted-foreground mb-12">
        A segurança dos seus dados é prioridade no Estrelize Saúde. Utilizamos práticas modernas para garantir proteção e confiabilidade.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
            <Lock className="w-6 h-6 text-accent" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Proteção de Dados</h3>
          <p className="text-muted-foreground mb-4">Utilizamos criptografia e práticas de segurança para proteger suas informações.</p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-cta" /> Criptografia de dados</li>
            <li className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-cta" /> Conexão segura HTTPS</li>
            <li className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-cta" /> Proteção contra acessos não autorizados</li>
          </ul>
        </div>

        <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
            <Server className="w-6 h-6 text-accent" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Infraestrutura Segura</h3>
          <p className="text-muted-foreground mb-4">Nossa plataforma utiliza infraestrutura confiável e escalável.</p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-cta" /> Servidores seguros</li>
            <li className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-cta" /> Backup automático</li>
            <li className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-cta" /> Monitoramento contínuo</li>
          </ul>
        </div>

        <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
            <Globe className="w-6 h-6 text-accent" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Integrações Seguras</h3>
          <p className="text-muted-foreground mb-4">As integrações com serviços externos seguem padrões seguros e autorizados.</p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-cta" /> Google Business Profile</li>
            <li className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-cta" /> APIs oficiais</li>
          </ul>
        </div>

        <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
            <Users className="w-6 h-6 text-accent" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Controle de Acesso</h3>
          <p className="text-muted-foreground mb-4">Apenas usuários autorizados podem acessar dados da clínica.</p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-cta" /> Login seguro</li>
            <li className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-cta" /> Controle de permissões</li>
            <li className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-cta" /> Auditoria de acesso</li>
          </ul>
        </div>
      </div>

      <hr className="my-12 border-white/10" />

      <h2 className="text-3xl font-bold mb-6">Conformidade</h2>
      <p>Seguimos boas práticas de proteção de dados e privacidade em conformidade com as legislações vigentes.</p>

      <hr className="my-12 border-white/10" />

      <h2 className="text-3xl font-bold mb-6">Relatar Problema de Segurança</h2>
      <p>Caso identifique qualquer problema de segurança, por favor entre em contato imediatamente:</p>
      <p>Email: <a href="mailto:seguranca@estrelize.com.br" className="text-accent hover:underline font-bold">seguranca@estrelize.com.br</a></p>

      <hr className="my-12 border-white/10" />

      <h2 className="text-3xl font-bold mb-6">Atualizações de Segurança</h2>
      <p>Atualizamos continuamente nossa plataforma para garantir máxima proteção contra novas ameaças.</p>
    </LegalLayout>
  );
}
