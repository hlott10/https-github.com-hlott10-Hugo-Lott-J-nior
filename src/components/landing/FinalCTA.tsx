import { motion } from "motion/react";
import { Button } from "../ui/button";
import { ArrowRight, Zap, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import { useUsage } from "../../lib/UsageContext";
import { createCheckoutSession } from "../../lib/stripe";
import { useState } from "react";

export function FinalCTA() {
  const { user } = useAuth();
  const { isPro } = useUsage();
  const [upgrading, setUpgrading] = useState(false);
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    console.log("🖱️ CLIQUE EM UPGRADE (FinalCTA)");
    if (!user) {
      console.log("👤 Usuário não logado, enviando para onboarding");
      navigate('/onboarding');
      return;
    }
    setUpgrading(true);
    console.log("🚀 Iniciando checkout via FinalCTA para usuário:", user.id);
    try {
      await createCheckoutSession({
        planId: 'pro',
        cycle: 'monthly',
        userId: user.id,
        vertical: 'saude',
        email: user.email
      });
    } catch (e) {
      console.error("❌ Erro no upgrade do FinalCTA:", e);
    } finally {
      setUpgrading(false);
    }
  };
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/10 -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-accent)_0%,_transparent_70%)] opacity-10 -z-10" />
      
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Comece a responder avaliações <br />
            <span className="gradient-text">automaticamente hoje</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Junte-se a centenas de clínicas que já automatizaram sua reputação digital e estão atraindo mais pacientes todos os dias.
          </p>
          {user && !isPro ? (
            <Button 
              size="lg" 
              onClick={handleUpgrade}
              disabled={upgrading}
              className="h-16 px-12 text-xl bg-cta hover:bg-cta/90 text-white font-bold group shadow-2xl shadow-cta/20"
            >
              {upgrading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Zap className="w-6 h-6 mr-2 fill-current" />}
              Assinar Plano Pro
            </Button>
          ) : user && isPro ? (
            <Link to="/dashboard">
              <Button 
                size="lg" 
                className="h-16 px-12 text-xl bg-accent hover:bg-accent/90 text-[#021616] font-bold group shadow-2xl shadow-accent/20"
              >
                Abrir Painel
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          ) : (
            <Link to="/onboarding">
              <Button 
                size="lg" 
                className="h-16 px-12 text-xl bg-cta hover:bg-cta/90 text-white font-bold group shadow-2xl shadow-cta/20"
              >
                Começar Agora
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
