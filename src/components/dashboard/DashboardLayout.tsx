import { Sidebar } from "./Sidebar";
import { Overview } from "./Overview";
import { Inbox } from "./Inbox";
import { Automation } from "./Automation";
import { Ranking } from "./Ranking";
import { Settings } from "./Settings";
import { Reports } from "./Reports";
import { Team } from "./Team";
import { Competitors } from "./Competitors";
import { Campaigns } from "./Campaigns";
import { GenerateReviews } from "./GenerateReviews";
import { GoogleConnect } from "./GoogleConnect";
import { ScrollArea } from "../ui/scroll-area";
import { Bell, Search, User as UserIcon, Share2, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../../lib/AuthContext";
import { Toaster } from "../ui/sonner";
import { useEffect, useState, useRef } from "react";
import { getMyClinic, Establishment } from "../../lib/establishments";

export function DashboardLayout() {
  const [activeTab, setActiveTab] = useState("overview");
  const [vertical, setVertical] = useState<'saude' | 'restaurante'>('saude');
  const [clinic, setClinic] = useState<Establishment | null>(null);
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [activeTab]);

  useEffect(() => {
    async function detect() {
      if (!user) return;
      try {
        const est = await getMyClinic(user.id);
        if (est) {
          setClinic(est);
          if (est.vertical) {
            setVertical(est.vertical as any);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    detect();
  }, [user]);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview vertical={vertical} setActiveTab={setActiveTab} />;
      case "inbox":
        return <Inbox vertical={vertical} setActiveTab={setActiveTab} />;
      case "connect":
        return <GoogleConnect vertical={vertical} />;
      case "generate":
        return <GenerateReviews vertical={vertical} clinic={clinic} />;
      case "automation":
        return <Automation />;
      case "ranking":
        return <Ranking vertical={vertical} />;
      case "reports":
        return <Reports vertical={vertical} />;
      case "team":
        return <Team />;
      case "campaigns":
        return <Campaigns vertical={vertical} clinic={clinic} />;
      case "competitors":
        return <Competitors vertical={vertical} setActiveTab={setActiveTab} clinic={clinic} />;
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
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} vertical={vertical} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <main className="p-12 max-w-7xl mx-auto w-full min-h-screen flex flex-col">
            <div className="flex-1">
              {renderContent()}
            </div>
            
            <footer className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 pb-12">
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 italic">
                DADOS DE AVALIAÇÕES FORNECIDOS POR GOOGLE MAPS © 2026
              </div>
              <div className="flex items-center gap-6 text-muted-foreground/30">
                <Share2 className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                <MapPin className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
              </div>
            </footer>
          </main>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
