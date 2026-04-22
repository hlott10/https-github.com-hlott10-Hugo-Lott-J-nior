import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface UsageContextType {
  autopilotEnabled: boolean;
  setAutopilotEnabled: (enabled: boolean) => void;
  usageCount: number;
  incrementUsage: () => void;
  maxUsage: number;
  isPro: boolean;
  setIsPro: (isPro: boolean) => void;
}

const UsageContext = createContext<UsageContextType | undefined>(undefined);

export function UsageProvider({ children }: { children: React.ReactNode }) {
  const [autopilotEnabled, setAutopilotEnabled] = useState(true);
  const [usageCount, setUsageCount] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const maxUsage = isPro ? 999999 : 10;

  // Persistir no localStorage para o demo ser mais "funcional"
  useEffect(() => {
    const savedUsage = localStorage.getItem('estrelize_usage');
    const savedAutopilot = localStorage.getItem('estrelize_autopilot');
    const savedIsPro = localStorage.getItem('estrelize_is_pro');
    
    if (savedUsage) setUsageCount(parseInt(savedUsage));
    if (savedAutopilot) setAutopilotEnabled(savedAutopilot === 'true');
    if (savedIsPro) setIsPro(savedIsPro === 'true');
  }, []);

  const handleSetIsPro = (val: boolean) => {
    setIsPro(val);
    localStorage.setItem('estrelize_is_pro', String(val));
  };

  const handleSetAutopilot = (enabled: boolean) => {
    setAutopilotEnabled(enabled);
    localStorage.setItem('estrelize_autopilot', String(enabled));
    if (enabled) {
      toast.success("Piloto Automático ativado!");
    } else {
      toast.info("Piloto Automático desativado.");
    }
  };

  const incrementUsage = () => {
    if (usageCount < maxUsage) {
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      localStorage.setItem('estrelize_usage', String(newCount));
      
      if (newCount === maxUsage) {
        toast.warning("Limite do plano gratuito atingido! (10/10)");
      }
    } else {
      toast.error("Limite de uso atingido. Faça upgrade para continuar.");
    }
  };

  return (
    <UsageContext.Provider value={{ 
      autopilotEnabled, 
      setAutopilotEnabled: handleSetAutopilot, 
      usageCount, 
      incrementUsage,
      maxUsage,
      isPro,
      setIsPro: handleSetIsPro
    }}>
      {children}
    </UsageContext.Provider>
  );
}

export function useUsage() {
  const context = useContext(UsageContext);
  if (context === undefined) {
    throw new Error('useUsage must be used within a UsageProvider');
  }
  return context;
}
