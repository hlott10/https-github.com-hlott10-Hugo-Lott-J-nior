import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Check, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import { createCheckoutSession } from "../../lib/stripe";

type BillingCycle = "monthly" | "semiannual" | "annual";

const plans = [
  {
    id: "free",
    name: "Plano Gratuito",
    description: "Para quem está começando.",
    prices: {
      monthly: "Grátis",
      semiannual: "Grátis",
      annual: "Grátis"
    },
    features: [
      "Até 10 respostas com IA por mês",
      "Conexão com 1 clínica",
      "Respostas manuais ilimitadas",
      "Suporte via e-mail"
    ],
    buttonText: "Começar grátis",
    highlight: false
  },
  {
    id: "pro",
    name: "Plano Pro",
    description: "Automação total para sua clínica.",
    prices: {
      monthly: { value: "47,90", label: "/ mês", subtext: "Cobrado mensalmente" },
      semiannual: { value: "43,11", label: "/ mês", subtext: "Cobrado semestralmente (R$ 258,66)" },
      annual: { value: "33,53", label: "/ mês", subtext: "Cobrado anualmente (R$ 402,36)" }
    },
    features: [
      "Respostas ilimitadas com IA",
      "Automação inteligente",
      "Histórico completo de avaliações",
      "Suporte prioritário via WhatsApp"
    ],
    buttonText: "Assinar Plano Pro",
    highlight: true,
    badge: "MAIS POPULAR"
  }
];

export function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  useEffect(() => {
    console.log("💎 Componente Pricing Montado [v1.0.1 - 13:30]");
  }, []);

  const handleCheckout = async (planId: string) => {
    console.log("🖱️ CLIQUE DETECTADO NO PLANO:", planId);
    
    if (planId === "free") {
      navigate("/onboarding");
      return;
    }

    let checkoutEmail = user?.email;
    let targetUserId = user?.id;

    if (!user) {
      console.log("👤 Usuário não logado no Pricing. Verificando LocalStorage...");
      const savedData = localStorage.getItem("estrelize_onboarding_data");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        checkoutEmail = parsed.email;
        targetUserId = "guest_" + (parsed.email || "unknown");
        console.log("👤 Encontrado e-mail de convidado:", checkoutEmail);
      }
    }

    if (!checkoutEmail) {
      console.log("⚠️ Nenhum e-mail disponível para checkout. Redirecionando para inscrição.");
      toast.info("Iniciando sua inscrição no Estrelize Pro...");
      navigate("/onboarding");
      return;
    }

    setLoadingPlan(planId);
    console.log("⏳ ESTADO LOADING DEFINIDO PARA:", planId);
    try {
      console.log("🚀 CHAMANDO createCheckoutSession...");
      const result = await createCheckoutSession({
        planId,
        cycle,
        userId: targetUserId || "guest_default",
        vertical: "saude",
        email: checkoutEmail
      });
      console.log("🏁 RESULTADO DO CHECKOUT NO COMPONENTE:", result);
    } catch (err) {
      console.error("❌ Erro handleCheckout:", err);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="planos" className="py-24 px-6 bg-[#021616]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-accent font-semibold mb-4 uppercase tracking-widest text-sm">Preços</h2>
          <h3 className="text-3xl md:text-5xl font-bold mb-6">O melhor custo-benefício para sua clínica</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const isPro = plan.name === "Plano Pro";
            const currentPrice = isPro ? plan.prices[cycle] : { value: "Grátis", label: "", subtext: "" };

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {plan.badge && (
                  <div className="absolute -top-4 right-8 z-10 bg-cta text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg">
                    {plan.badge}
                  </div>
                )}
                
                <Card className={`h-full border-2 transition-all duration-300 ${
                  plan.highlight 
                    ? 'bg-[#042F2E] border-cta shadow-2xl shadow-cta/10' 
                    : 'bg-[#042F2E]/50 border-white/5'
                } rounded-[40px] overflow-hidden`}>
                  <CardHeader className="p-10 pb-6">
                    <CardTitle className="text-3xl font-bold mb-2 font-heading">{plan.name}</CardTitle>
                    <CardDescription className="text-muted-foreground text-lg">{plan.description}</CardDescription>
                    
                    <div className="mt-10 mb-6">
                      {isPro ? (
                        <div className="space-y-6">
                          {/* Toggle */}
                          <div className="inline-flex p-1 bg-[#021616] rounded-2xl border border-white/5">
                            {(["monthly", "semiannual", "annual"] as const).map((c) => (
                              <button
                                key={c}
                                onClick={() => setCycle(c)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${
                                  cycle === c 
                                    ? "bg-cta text-white shadow-lg" 
                                    : "text-white/40 hover:text-white"
                                }`}
                              >
                                {c === "monthly" ? "MENSAL" : c === "semiannual" ? "6 MESES" : "12 MESES"}
                              </button>
                            ))}
                          </div>

                          <div className="flex flex-col">
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold">R$</span>
                              <span className="text-6xl font-black tracking-tighter">
                                {(currentPrice as any).value}
                              </span>
                              <span className="text-muted-foreground font-medium">
                                {(currentPrice as any).label}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground mt-2">
                              {(currentPrice as any).subtext}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-[140px] flex flex-col justify-end">
                          <span className="text-6xl font-black tracking-tighter">Grátis</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-10 pt-0 space-y-8">
                    <ul className="space-y-5">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-4 text-sm font-medium">
                          <div className="w-5 h-5 rounded-full bg-cta/10 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-cta" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {isPro && (
                      <div className="pt-6 border-t border-white/5">
                        <p className="text-[10px] font-black text-accent uppercase tracking-widest leading-relaxed">
                          MENOS DE R${(parseFloat((currentPrice as any).value.replace(',', '.')) / 30).toFixed(2).replace('.', ',')} POR DIA PARA GERENCIAR SUA REPUTAÇÃO.
                        </p>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="p-10 pt-0">
                    <Button 
                      disabled={loadingPlan === plan.id}
                      onClick={() => handleCheckout(plan.id)}
                      className={`w-full h-16 text-lg font-bold rounded-2xl transition-all ${
                        plan.highlight 
                          ? 'bg-cta hover:bg-cta/90 text-white shadow-xl shadow-cta/20' 
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {loadingPlan === plan.id ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        plan.buttonText
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
