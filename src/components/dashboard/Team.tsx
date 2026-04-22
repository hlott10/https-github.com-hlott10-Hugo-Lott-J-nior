import { useState } from "react";
import { motion } from "motion/react";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Mail, 
  MoreVertical,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const teamMembers = [
  { name: "Dra. Helena Silva", email: "helena@clinica.com", role: "Administrador", status: "Ativo" },
  { name: "Marcos Souza", email: "marcos@clinica.com", role: "Marketing", status: "Ativo" },
  { name: "Patrícia Lima", email: "patricia@clinica.com", role: "Recepcionista", status: "Pendente" },
];

export function Team() {
  const handleInvite = () => {
    toast.success("Convite enviado para o novo membro!");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Equipe da Clínica</h2>
          <p className="text-muted-foreground">Gerencie quem tem acesso ao painel da sua clínica.</p>
        </div>
        <Button className="bg-cta hover:bg-cta/90 text-white font-bold" onClick={handleInvite}>
          <UserPlus className="w-4 h-4 mr-2" />
          Convidar Membro
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {teamMembers.map((member, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-card border-border hover:border-primary/30 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-accent">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold">{member.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {member.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="hidden md:block">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">Cargo</div>
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="w-3 h-3 text-accent" />
                        {member.role}
                      </div>
                    </div>

                    <div className="hidden md:block">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">Status</div>
                      <Badge variant={member.status === "Ativo" ? "default" : "secondary"} className={member.status === "Ativo" ? "bg-cta/20 text-cta border-cta/30" : "bg-white/5 text-muted-foreground"}>
                        {member.status === "Ativo" ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                        {member.status}
                      </Badge>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem className="hover:bg-white/5">Editar Permissões</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive hover:bg-destructive/10">Remover Acesso</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
