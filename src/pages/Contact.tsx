import { LegalLayout } from "../components/LegalLayout";
import { SEO } from "../components/SEO";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Mail, Clock, ShieldCheck, MessageSquare, MapPin, ExternalLink } from "lucide-react";

export function Contact() {
  return (
    <LegalLayout title="Fale com o Estrelize Saúde" lastUpdated="13 de Abril de 2024">
      <SEO title="Contato" description="Entre em contato com a equipe do Estrelize Saúde" />
      
      <p className="text-xl text-muted-foreground mb-12">
        Estamos prontos para ajudar sua clínica a crescer através da reputação online.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Atendimento Geral</h3>
              <p className="text-muted-foreground mb-2">Tempo médio de resposta: até 24 horas</p>
              <a href="mailto:contato@estrelize.com.br" className="text-accent hover:underline font-medium">contato@estrelize.com.br</a>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Suporte Técnico</h3>
              <p className="text-muted-foreground mb-2">Dúvidas técnicas ou ajuda com a plataforma</p>
              <a href="mailto:suporte@estrelize.com.br" className="text-accent hover:underline font-medium">suporte@estrelize.com.br</a>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Comercial</h3>
              <p className="text-muted-foreground mb-2">Parcerias ou planos empresariais</p>
              <a href="mailto:comercial@estrelize.com.br" className="text-accent hover:underline font-medium">comercial@estrelize.com.br</a>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Horário de Atendimento</h3>
              <p className="text-muted-foreground">Segunda a Sexta</p>
              <p className="font-bold">09:00 às 18:00</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Operação Digital</h3>
              <p className="text-muted-foreground mb-1">Base: Brasil</p>
              <p className="text-sm text-muted-foreground">Atendimento 100% remoto para todo o território nacional.</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
          <h3 className="text-2xl font-bold mb-6">Envie uma Mensagem</h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome</label>
              <Input placeholder="Seu nome completo" className="bg-background/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="seu@email.com" className="bg-background/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Telefone</label>
              <Input placeholder="(00) 00000-0000" className="bg-background/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome da Clínica</label>
              <Input placeholder="Nome da sua clínica" className="bg-background/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mensagem</label>
              <Textarea placeholder="Como podemos ajudar?" className="bg-background/50 min-h-[120px]" />
            </div>
            <Button className="w-full bg-cta hover:bg-cta/90 text-white font-bold h-12 rounded-xl mt-4">
              Enviar Mensagem
            </Button>
          </form>
        </div>
      </div>
    </LegalLayout>
  );
}
