import { motion } from "motion/react";
import { 
  BarChart2, 
  Inbox, 
  PlusCircle, 
  Megaphone, 
  Target, 
  Trophy, 
  Settings, 
  Utensils,
  Stethoscope,
  Sun,
  ChevronDown,
  Globe,
  Zap,
  Loader2,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useUsage } from "../../lib/UsageContext";
import { Switch } from "../ui/switch";
import { createCheckoutSession } from "../../lib/stripe";
import { useAuth } from "../../lib/AuthContext";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  vertical?: 'saude' | 'restaurante';
}

const menuItems = [
  { id: "overview", label: "Crescimento", icon: BarChart2 },
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "generate", label: "Gerar Avaliações", icon: PlusCircle },
  { id: "campaigns", label: "Campanhas", icon: Megaphone },
  { id: "competitors", label: "Concorrentes", icon: Target },
  { id: "ranking", label: "Rankings", icon: Trophy },
  { id: "reports", label: "Relatórios", icon: Globe },
  { id: "settings", label: "Configurações", icon: Settings },
];

export function Sidebar({ activeTab, setActiveTab, vertical = 'saude' }: SidebarProps) {
  const { autopilotEnabled, setAutopilotEnabled, usageCount, maxUsage } = useUsage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [upgrading, setUpgrading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const isRestaurante = vertical === 'restaurante';
  const BrandIcon = isRestaurante ? Utensils : Stethoscope;
  const brandBg = isRestaurante ? "bg-[#FF4500]" : "bg-accent";
  const brandShadow = isRestaurante ? "shadow-[#FF4500]/20" : "shadow-accent/20";
  const activeBgClass = isRestaurante 
    ? "bg-gradient-to-r from-[#FF4500] to-[#FF6347] shadow-[#FF4500]/20" 
    : "bg-gradient-to-r from-accent to-[#0D9488] shadow-accent/20";
  const userAvatarBg = isRestaurante ? "from-orange-400 to-orange-600" : "from-teal-400 to-teal-600";

  const handleUpgrade = async () => {
    try {
      console.log("SIDEBAR UPGRADE: Clicked");
      let checkoutEmail = user?.email;
      let targetUserId = user?.id;

      if (!user) {
        const savedData = localStorage.getItem("estrelize_onboarding_data");
        if (savedData) {
          const parsed = JSON.parse(savedData);
          checkoutEmail = parsed.email;
          targetUserId = "guest_" + (parsed.email || "unknown");
        }
      }

      if (!checkoutEmail) {
        toast.error("Para assinar o plano Pro, por favor, conecte sua conta ou preencha o formulário inicial.");
        return;
      }

      setUpgrading(true);
      await createCheckoutSession({
        planId: 'pro',
        cycle: 'monthly',
        userId: targetUserId || "guest_default",
        vertical: vertical,
        email: checkoutEmail
      });
    } catch (err: any) {
      console.error("Sidebar Upgrade Error:", err);
    } finally {
      setUpgrading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut();
    navigate(isRestaurante ? '/restaurante' : '/saude');
  };

  return (
    <div className="w-72 h-screen flex flex-col bg-background border-r border-white/5 relative z-50">
      {/* Brand Section */}
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(brandBg, brandShadow, "p-1.5 rounded-lg shadow-lg")}>
            <BrandIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-bold font-heading tracking-tight">
            Estrelize <span className="text-muted-foreground font-medium">{isRestaurante ? "Restaura..." : "Saúde"}</span>
          </span>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <Sun className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-4 px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all relative group",
              activeTab === item.id 
                ? cn(activeBgClass, "text-white shadow-xl") 
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
          >
            <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
            {item.label}
            {activeTab === item.id && (
              <motion.div 
                layoutId="active-pill"
                className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]"
              />
            )}
          </button>
        ))}
      </nav>

      {/* User / Business Info Section */}
      <div className="p-8 space-y-8 bg-black/10">
        <div 
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
        >
          <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center font-black shadow-lg", userAvatarBg)}>
            {isRestaurante ? "R" : "S"}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black truncate uppercase tracking-widest">{isRestaurante ? "Restaurante Sa..." : "Espaço Saúde"}</h4>
            <p className="text-[10px] text-muted-foreground truncate uppercase tracking-widest">{user?.email || "Demo@reputalocal.com"}</p>
          </div>
          <div className="relative">
            <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-[8px] flex items-center justify-center rounded-full text-white font-black border-2 border-[#010c0c]">
              0
            </span>
          </div>
        </div>

        {/* Features Status */}
        <div className="space-y-6">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#010c0c] border border-white/5 transition-all hover:border-white/10">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">Piloto Automático</span>
              <span className={cn("text-[8px] font-bold uppercase", autopilotEnabled ? "text-accent" : "text-gray-600")}>
                {autopilotEnabled ? "Ativado" : "Desativado"}
              </span>
            </div>
            <Switch 
              checked={autopilotEnabled} 
              onCheckedChange={setAutopilotEnabled}
              className="scale-75 data-[state=checked]:bg-accent"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <div className="space-y-0.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Uso dia mensal</span>
                <span className="text-[8px] font-bold text-gray-500 uppercase">Plano Grátis</span>
              </div>
              <span className={cn("text-[9px] font-black", usageCount >= maxUsage ? "text-red-500" : "text-foreground")}>
                {usageCount}/{maxUsage}
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(usageCount / maxUsage) * 100}%` }}
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  usageCount >= maxUsage ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-accent shadow-[0_0_10px_rgba(20,184,166,0.5)]"
                )}
              />
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={() => setActiveTab('settings')}
            className="w-full h-11 bg-accent/5 border-accent/20 hover:bg-accent/10 text-accent font-black uppercase tracking-[0.15em] text-[9px] rounded-xl transition-all group"
          >
            <Zap className="w-3 h-3 mr-2 fill-current" />
            Seja Pro
          </Button>

          <button 
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-red-400 transition-colors p-2"
          >
            {loggingOut ? <Loader2 className="w-3 h-3 animate-spin" /> : <LogOut className="w-3 h-3" />}
            Sair do Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
