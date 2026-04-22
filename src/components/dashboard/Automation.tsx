import { useState } from "react";
import { motion } from "motion/react";
import { 
  Zap, 
  ShieldCheck, 
  MessageSquare, 
  Bell, 
  Settings2,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useUsage } from "../../lib/UsageContext";

export function Automation() {
  const { autopilotEnabled, setAutopilotEnabled } = useUsage();

  const handleSave = () => {
    toast.success("Configurações de automação salvas!");
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Automação Inteligente</h2>
        <p className="text-muted-foreground">Configure como nossa IA deve interagir com seus pacientes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Respostas Automáticas</CardTitle>
                  <CardDescription>Ative ou desative a automação global.</CardDescription>
                </div>
                <Switch 
                  checked={autopilotEnabled} 
                  onCheckedChange={setAutopilotEnabled} 
                  className="data-[state=checked]:bg-accent"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="space-y-0.5">
                    <Label className="text-base">Avaliações 5 Estrelas</Label>
                    <p className="text-xs text-muted-foreground">Responder automaticamente sem revisão.</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="space-y-0.5">
                    <Label className="text-base">Avaliações 3 e 4 Estrelas</Label>
                    <p className="text-xs text-muted-foreground">Gerar sugestão e aguardar aprovação.</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="space-y-0.5">
                    <Label className="text-base">Avaliações Negativas (1-2)</Label>
                    <p className="text-xs text-muted-foreground">Apenas notificar a equipe (Sem resposta automática).</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Tom de Resposta</CardTitle>
              <CardDescription>Defina a personalidade da IA para sua clínica.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Professional", "Humanized", "Formal Medical"].map((tone) => (
                  <button
                    key={tone}
                    className="p-4 rounded-xl border border-border bg-white/5 hover:border-accent transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-3 group-hover:bg-primary transition-colors">
                      <MessageSquare className="w-4 h-4 text-accent group-hover:text-white" />
                    </div>
                    <div className="font-bold text-sm mb-1">{tone === "Professional" ? "Profissional" : tone === "Humanized" ? "Humanizado" : "Formal Médico"}</div>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      {tone === "Professional" ? "Equilibrado e direto." : tone === "Humanized" ? "Caloroso e empático." : "Linguagem técnica e sóbria."}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-accent flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Diferencial Saúde
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nossa IA é treinada especificamente para o setor de saúde, respeitando o sigilo médico e as normas éticas.
              </p>
              <div className="space-y-2">
                {[
                  "Linguagem ética",
                  "Terminologia médica",
                  "Foco no acolhimento",
                  "Prevenção de conflitos"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-medium">
                    <CheckCircle2 className="w-3 h-3 text-cta" />
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button className="w-full bg-cta hover:bg-cta/90 text-white font-bold h-12" onClick={handleSave}>
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
}
