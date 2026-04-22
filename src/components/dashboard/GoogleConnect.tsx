import { motion } from "motion/react";
import { Globe, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { toast } from "sonner";

interface GoogleConnectProps {
  vertical?: 'saude' | 'restaurante';
}

export function GoogleConnect({ vertical = 'saude' }: GoogleConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    setLoading(true);
    // Simula o fluxo de OAuth do Google
    setTimeout(() => {
      setIsConnected(true);
      setLoading(false);
      toast.success("Perfil do Google Maps conectado com sucesso!");
    }, 2000);
  };

  const isRestaurante = vertical === 'restaurante';
  const titleFont = isRestaurante ? "font-serif" : "font-heading";

  return (
    <div className="space-y-10 pb-20">
      <div className="space-y-1">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/60">Integração Oficial</span>
        <h2 className={cn("text-4xl", titleFont)}>Google Business Profile</h2>
        <p className="text-muted-foreground text-sm max-w-lg leading-relaxed">
          Conecte sua clínica ou restaurante ao Google Maps para capturar comentários e automatizar respostas com IA.
        </p>
      </div>

      {!isConnected ? (
        <Card className="bg-[#042121] border border-white/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] -mr-32 -mt-32" />
          <CardContent className="p-12 space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="w-24 h-24 rounded-[2rem] bg-white flex items-center justify-center p-5 shadow-2xl">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <div className="flex-1 text-center md:text-left space-y-4">
                <h3 className="text-2xl font-bold">Inicie sua Automação</h3>
                <p className="text-muted-foreground leading-relaxed max-w-xl">
                  Ao conectar sua conta, o Estrelize terá permissão para ler suas avaliações e publicar as respostas que você aprovar (ou automáticas se preferir).
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                   <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                     <ShieldCheck className="w-4 h-4" />
                     Conexão Segura SSL
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-black text-accent uppercase tracking-widest bg-accent/10 px-4 py-2 rounded-full border border-accent/20">
                     <Globe className="w-4 h-4" />
                     Google API v3
                   </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleConnect}
              disabled={loading}
              className="w-full h-16 bg-white text-black hover:bg-white/90 font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all hover:scale-[1.02] shadow-xl group"
            >
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
              ) : (
                <>
                  Entrar com Google Business
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          <Card className="bg-emerald-500/10 border border-emerald-500/20 p-8 flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold">Perfil Sincronizado</h3>
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Capturando comentários em tempo real
                </div>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Último Sync</p>
              <p className="text-sm font-bold italic">Agora mesmo</p>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-[#042121] border border-white/5 p-10 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold">Configurações de Resposta</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Defina se você deseja aprovar cada resposta da IA manualmente ou se prefere que o sistema responda automaticamente avaliações de 5 estrelas.
              </p>
              <div className="pt-4 flex gap-4">
                <Button variant="outline" className="flex-1 rounded-xl h-12 border-white/10 text-[10px] font-black uppercase tracking-widest">
                  Manual First
                </Button>
                <Button className="flex-1 rounded-xl h-12 bg-accent hover:bg-accent/90 text-white text-[10px] font-black uppercase tracking-widest">
                  Auto-Pilot (IA)
                </Button>
              </div>
            </Card>

            <Card className="bg-[#042121] border border-white/5 p-10 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <ExternalLink className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold">Visualização Pública</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Você pode ver como suas respostas aparecem para os clientes diretamente no Google Maps.
              </p>
              <Button variant="link" className="text-accent underline p-0 font-bold uppercase tracking-widest text-[10px]">
                Abrir meu perfil no Maps
              </Button>
            </Card>
          </div>

          <div className="flex justify-center pt-10">
            <Button 
              onClick={() => setIsConnected(false)}
              variant="ghost" 
              className="text-red-500/50 hover:text-red-500 text-[10px] font-black uppercase tracking-widest"
            >
              Desconectar Conta do Google
            </Button>
          </div>
        </div>
      )}

      {/* Benefits Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Captura Automática", desc: "Varremos seu perfil do Maps a cada 1 hora em busca de novos comentários." },
          { title: "Resposta com IA", desc: "Gemini 1.5 analisa o tom do cliente e gera uma resposta personalizada em segundos." },
          { title: "SEO Local Boost", desc: "Negócios que respondem rapidamente são priorizados pelo algoritmo do Google." },
        ].map((benefit, i) => (
          <div key={i} className="space-y-3">
             <div className="w-8 h-1 bg-accent/30 rounded-full" />
             <h5 className="font-bold">{benefit.title}</h5>
             <p className="text-muted-foreground text-xs leading-relaxed">{benefit.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
