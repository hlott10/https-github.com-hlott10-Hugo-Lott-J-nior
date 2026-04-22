import { useState } from "react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Overview } from "../components/dashboard/Overview";
import { Inbox } from "../components/dashboard/Inbox";
import { Automation } from "../components/dashboard/Automation";
import { Ranking } from "../components/dashboard/Ranking";
import { Settings } from "../components/dashboard/Settings";
import { Reports } from "../components/dashboard/Reports";
import { Team } from "../components/dashboard/Team";
import { Competitors } from "../components/dashboard/Competitors";
import { Campaigns } from "../components/dashboard/Campaigns";
import { GenerateReviews } from "../components/dashboard/GenerateReviews";
import { ScrollArea } from "../components/ui/scroll-area";
import { Bell, Search, User as UserIcon, Info, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Toaster } from "../components/ui/sonner";
import { motion } from "motion/react";

export function Demo() {
  const [activeTab, setActiveTab] = useState("overview");
  const [vertical, setVertical] = useState<'saude' | 'restaurante'>('saude');

  // Mock user for demo
  const mockUser = {
    user_metadata: {
      full_name: vertical === 'saude' ? "Dr. Demo Saúde" : "Chef Demo Estrelize",
      avatar_url: vertical === 'saude' ? "https://picsum.photos/seed/doctor/100/100" : "https://picsum.photos/seed/chef/100/100"
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview vertical={vertical} />;
      case "inbox":
        return <Inbox vertical={vertical} />;
      case "generate":
        return <GenerateReviews vertical={vertical} />;
      case "automation":
        return <Automation />;
      case "ranking":
        return <Ranking />;
      case "reports":
        return <Reports />;
      case "team":
        return <Team />;
      case "campaigns":
        return <Campaigns vertical={vertical} />;
      case "competitors":
        return <Competitors vertical={vertical} />;
      case "settings":
        return <Settings vertical={vertical} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <div className="p-4 bg-white/5 rounded-full">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold">Em breve</h3>
            <p className="text-muted-foreground max-w-xs">Esta funcionalidade está sendo preparada para sua clínica.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Demo Banner */}
      <motion.div 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="absolute top-0 left-0 right-0 z-[60] h-10 bg-[#7C3AED] flex items-center justify-center gap-4 px-6 text-xs font-black uppercase tracking-[0.2em] shadow-lg"
      >
        <Sparkles className="w-4 h-4 fill-white animate-pulse" />
        Modo de Demonstração Interativa
        <div className="h-4 w-px bg-white/20 mx-2" />
        <span className="text-white/70">Dados Fictícios para fins de teste</span>
        
        <div className="flex bg-black/20 p-1 rounded-lg border border-white/5 ml-4">
          <button 
            onClick={() => setVertical('restaurante')}
            className={`px-3 py-1 rounded-md transition-all ${vertical === 'restaurante' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
          >
            Restaurante
          </button>
          <button 
            onClick={() => setVertical('saude')}
            className={`px-3 py-1 rounded-md transition-all ${vertical === 'saude' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
          >
            Saúde
          </button>
        </div>
      </motion.div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} vertical={vertical} />
      
      <div className="flex-1 flex flex-col min-w-0 pt-10 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <main className="p-12 max-w-7xl mx-auto w-full">
            <div className="mb-8 p-6 bg-accent/10 border border-accent/20 rounded-3xl flex items-start gap-4">
              <div className="p-3 bg-accent/20 rounded-2xl text-accent shrink-0">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Você está visualizando a demonstração</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Explore todas as funcionalidades da plataforma usando dados de exemplo. 
                  Para conectar sua clínica real com segurança via Google Business API, clique em "Começar Agora" na página principal.
                </p>
              </div>
            </div>
            {renderContent()}
          </main>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
