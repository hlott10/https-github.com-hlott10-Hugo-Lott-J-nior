import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  Send, 
  BarChart3, 
  Plus, 
  Search, 
  Calendar, 
  Phone,
  X,
  Loader2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  MessageSquare,
  Bot,
  Star
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "../../lib/utils";
import { toast } from "sonner";
import { useUsage } from "../../lib/UsageContext";
import { Badge } from "../ui/badge";
import { Establishment } from "../../lib/establishments";

interface CampaignsProps {
  vertical?: 'saude' | 'restaurante';
  clinic?: Establishment | null;
}

const mockCampaigns = [];

export function Campaigns({ vertical = 'saude', clinic }: CampaignsProps) {
  const { incrementUsage } = useUsage();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState(mockCampaigns);
  const [showTemplateSettings, setShowTemplateSettings] = useState(false);

  // Recuperar dados reais para empresa e link
  const getEmpresaData = () => {
    let name = clinic?.name;
    let link = clinic?.google_maps_url || ""; // Idealmente um link direto de review

    if (!name) {
      const savedData = localStorage.getItem("estrelize_onboarding_data");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        name = parsed.businessName;
        link = parsed.reviewLink;
      }
    }

    return {
      name: name || (vertical === 'restaurante' ? "Estrelize Restaurante" : "Clínica Estrelize"),
      link: link || "https://g.page/r/estrelize/review"
    };
  };

  const empresaData = getEmpresaData();
  const isRestaurante = vertical === 'restaurante';
  const titleFont = isRestaurante ? "font-serif" : "font-heading";

  const messageTemplate = isRestaurante 
    ? "Olá {nome}! Tudo bem? Gostamos muito de ter você conosco no {empresa}. Poderia nos ajudar com uma avaliação rápida sobre sua experiência? Isso nos ajuda muito! Link: {link}"
    : "Olá {nome}! Tudo bem? Esperamos que tenha tido um excelente atendimento na {empresa}. Poderia avaliar nossa clínica no Google? Sua opinião é fundamental para nós: {link}";

  const stats = [
    { label: "Clientes Cadastrados", value: clients.length.toString(), icon: Users, color: "text-accent" },
    { label: "Pedidos Enviados", value: (clients.filter(c => c.status === "Enviado").length).toString(), icon: Send, color: "text-blue-400" },
    { label: "Conversão", value: clients.length > 0 ? "32%" : "0.0%", icon: BarChart3, color: "text-emerald-400" },
  ];

  const handleCreateClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("clientName") as string;
    const phone = formData.get("clientPhone") as string;
    const dateValue = formData.get("serviceDate") as string;

    setTimeout(() => {
      incrementUsage();
      setLoading(false);
      setShowModal(false);
      toast.success("Cliente cadastrado! Campanha agendada para 24h.");
      setClients([{
        id: Math.random().toString(),
        name: name || "Novo Cliente",
        phone: phone || "Sem Telefone",
        date: dateValue ? new Date(dateValue).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : "Hoje",
        status: "Agendado",
        scheduled: "Em 24h"
      }, ...clients]);
    }, 1500);
  };

  const handleManualDispatch = (id: string) => {
    const client = clients.find(c => c.id === id);
    if (!client) return;

    // Clean phone number (remove spaces, dashes)
    const cleanPhone = client.phone.replace(/\D/g, '');
    
    // Process message template
    const finalMessage = messageTemplate
      .replace("{nome}", client.name)
      .replace("{empresa}", empresaData.name)
      .replace("{link}", empresaData.link);

    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          // Open WhatsApp in a new tab
          window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(finalMessage)}`, '_blank');
          resolve(true);
        }, 1500);
      }),
      {
        loading: 'Conectando ao motor de disparo WhatsApp...',
        success: () => {
          setClients(prev => prev.map(c => 
            c.id === id ? { ...c, status: "Enviado", scheduled: "Finalizado" } : c
          ));
          return "WhatsApp aberto com sucesso!";
        },
        error: 'Erro ao disparar.',
      }
    );
  };

  return (
    <div className="space-y-12 pb-24 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/60 italic font-medium">Campanhas Automáticas</span>
          <h2 className={cn("text-5xl font-bold", titleFont)}>Pedidos de Avaliação</h2>
          <p className="text-muted-foreground text-sm max-w-2xl">
            O sistema envia automaticamente o pedido 24h após o atendimento.
          </p>
        </div>
        
        <Button 
          onClick={() => setShowModal(true)}
          className="h-14 px-8 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-[#7C3AED]/30 transition-all hover:scale-105 active:scale-95 group"
        >
          <Sparkles className="w-4 h-4 mr-2 fill-white group-hover:rotate-12 transition-transform" />
          Novo Cliente
        </Button>
      </div>

      {/* Message Preview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-accent" />
              <h3 className="font-bold text-lg">Template de Disparo</h3>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => setShowTemplateSettings(!showTemplateSettings)}
              className="text-[10px] font-black uppercase tracking-widest text-accent hover:bg-accent/10"
            >
              {showTemplateSettings ? "Fechar Ajustes" : "Editar Mensagem"}
            </Button>
          </div>

          <AnimatePresence>
            {showTemplateSettings ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Card className="bg-[#042121] border-none p-8 rounded-[2rem] space-y-6">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      Personalize sua mensagem
                    </Label>
                    <textarea 
                      className="w-full h-32 bg-black/20 border border-white/5 rounded-2xl p-6 text-sm focus:border-accent/50 outline-none transition-all resize-none"
                      defaultValue={messageTemplate}
                    />
                    <div className="flex flex-wrap gap-2 text-[8px] font-black uppercase tracking-widest">
                      <span className="px-2 py-1 bg-white/5 rounded-md text-muted-foreground">{'{nome}'}</span>
                      <span className="px-2 py-1 bg-white/5 rounded-md text-muted-foreground">{'{empresa}'}</span>
                      <span className="px-2 py-1 bg-white/5 rounded-md text-muted-foreground">{'{link}'}</span>
                    </div>
                  </div>
                  <Button className="w-full h-12 bg-accent shadow-lg shadow-accent/20 font-black uppercase tracking-widest text-[10px]">
                    Salvar Template
                  </Button>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#071d1d] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8">
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black tracking-widest uppercase">Via WhatsApp</Badge>
                </div>
                
                <div className="flex gap-6 max-w-xl">
                  <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent shrink-0">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div className="space-y-4 pt-1">
                    <p className="text-muted-foreground text-sm italic leading-relaxed">
                      "Olá <span className="text-white font-bold">Hugo</span>! Tudo bem? Esperamos que tenha tido um excelente atendimento na <span className="text-white font-bold">{empresaData.name}</span>. Poderia avaliar nossa clínica no Google? Sua opinião é fundamental para nós: <span className="text-accent underline">{empresaData.link.replace('https://', '')}</span>"
                    </p>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                      <span>IA Gerada</span>
                      <span>•</span>
                      <span>Personalizável</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <div className="px-2">
            <h3 className="font-bold text-lg mb-1">Métricas de Envio</h3>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Plano Gratuito</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {stats.map((stat, i) => (
              <Card key={i} className="bg-[#042121] border-none p-6 rounded-3xl flex items-center justify-between group hover:bg-[#052d2d] transition-all">
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center", stat.color)}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</span>
                </div>
                <div className="text-2xl font-black">{stat.value}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Card className="bg-[#042121] border-none rounded-[3rem] shadow-2xl overflow-hidden min-h-[400px] flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-4 p-8 border-b border-white/5 bg-black/20">
          {["Cliente", "Telefone", "Atendimento", "Status"].map((header) => (
            <span key={header} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              {header}
            </span>
          ))}
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-x-auto min-h-[300px] flex flex-col">
          {clients.length > 0 ? (
            <div className="min-w-[800px]">
              {clients.map((client, i) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="grid grid-cols-4 p-8 border-b border-white/5 items-center hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent text-xs">
                      {client.name.charAt(0)}
                    </div>
                    <span className="font-bold text-sm">{client.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{client.phone}</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold">{client.date}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{client.scheduled}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <Badge className={cn(
                      "text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                      client.status === "Enviado" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                      client.status === "Agendado" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                      "bg-orange-500/10 text-orange-500 border-orange-500/20"
                    )}>
                      {client.status}
                    </Badge>
                    
                    {client.status === "Agendado" && (
                      <button 
                        onClick={() => handleManualDispatch(client.id)}
                        className="p-2 hover:bg-accent/10 rounded-lg text-accent transition-all group/btn"
                        title="Disparar Agora"
                      >
                        <Send className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-muted-foreground/40">
                <Users className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-lg">Nenhum cliente cadastrado</h4>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Cadastre seu primeiro cliente para iniciar o motor de disparos automáticos.
                </p>
              </div>
              <Button 
                onClick={() => setShowModal(true)}
                variant="ghost"
                className="text-accent hover:bg-accent/10 font-black uppercase tracking-widest text-[10px]"
              >
                Cadastrar agora
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Workflow Explanation */}
      <section className="space-y-8 pt-12">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED]">
            <Bot className="w-6 h-6" />
          </div>
          <h3 className={cn("text-3xl font-bold", titleFont)}>Como funciona o motor de disparo?</h3>
          <p className="text-muted-foreground text-sm max-w-xl">
            Nossa IA automatiza o ciclo completo desde o atendimento até a avaliação 5 estrelas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/5 hidden md:block z-0" />
          
          {[
            { step: 1, title: "Atendimento", desc: "Registro no POS ou manual", icon: Users },
            { step: 2, title: "Delay Inteligente", desc: "Aguardamos 24h para naturalidade", icon: Clock },
            { step: 3, title: "Disparo IA", desc: "Convite personalizado via WhatsApp", icon: MessageSquare },
            { step: 4, title: "Fidelização", desc: "Review 5 estrelas no Google", icon: Star },
          ].map((step, i) => (
            <div key={i} className="bg-[#042121] p-6 rounded-[2rem] border border-white/5 relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-[10px] font-black text-accent border border-accent/20">
                {step.step}
              </div>
              <div className="p-3 bg-white/5 rounded-xl text-muted-foreground">
                <step.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm tracking-tight">{step.title}</h4>
                <p className="text-[10px] text-muted-foreground leading-tight px-2">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal / Form */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#042121] rounded-[3rem] shadow-2xl overflow-hidden border border-white/5"
            >
              <form onSubmit={handleCreateClient} className="p-10 space-y-10">
                <div className="flex items-center justify-between">
                  <h3 className={cn("text-3xl font-bold", titleFont)}>Novo Cliente</h3>
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="p-3 hover:bg-white/5 rounded-2xl transition-all text-muted-foreground hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">
                      Nome do Cliente
                    </Label>
                    <Input 
                      required
                      name="clientName"
                      placeholder="Ex: Hugo Lott"
                      className="h-16 px-6 bg-black/20 border-white/5 rounded-2xl text-lg focus:border-accent/50 transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1 text-accent">
                      WhatsApp (com DDD)
                    </Label>
                    <Input 
                      required
                      name="clientPhone"
                      type="tel"
                      placeholder="11999999999"
                      className="h-16 px-6 bg-black/20 border-white/5 rounded-2xl text-lg focus:border-accent/50 transition-all font-medium font-mono"
                    />
                  </div>

                  <div className="space-y-3 relative">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">
                      Data do Atendimento
                    </Label>
                    <div className="relative">
                      <Input 
                        required
                        name="serviceDate"
                        type="date"
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="h-16 px-6 bg-black/20 border-white/5 rounded-2xl text-lg focus:border-accent/50 transition-all font-medium appearance-none block w-full"
                      />
                      <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    variant="outline"
                    className="h-16 border-white/5 hover:bg-white/5 text-muted-foreground font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    disabled={loading}
                    className="h-16 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-[#7C3AED]/20 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                    Cadastrar
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
