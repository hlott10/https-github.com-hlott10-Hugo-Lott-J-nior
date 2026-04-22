import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronLeft, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { loginWithGoogle } from "../../lib/supabase";
import { useAuth } from "../../lib/AuthContext";
import { toast } from "sonner";

export function Onboarding() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    reviewLink: "",
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("estrelize_onboarding_data");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing saved data", e);
      }
    }
  }, []);

  // Save to localStorage when formData changes
  useEffect(() => {
    const isNotEmpty = formData.businessName || formData.email || formData.reviewLink;
    if (isNotEmpty) {
      localStorage.setItem("estrelize_onboarding_data", JSON.stringify(formData));
    }
  }, [formData]);

  // If user is already logged in and we are at step 2, move to step 3
  useEffect(() => {
    if (user && step === 2) {
      const timer = setTimeout(() => {
        setStep(3);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [user, step]);

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else {
      localStorage.removeItem("estrelize_onboarding_data");
      navigate("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // 1. Obter a URL de autorização do nosso backend
      const response = await fetch('/api/auth/google/url');
      if (!response.ok) {
        throw new Error('Não foi possível obter a URL de conexão.');
      }
      const { url } = await response.json();

      // 2. Abrir o popup (direto para o Google, para evitar problemas de iframe)
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const authWindow = window.open(
        url,
        'google_auth_popup',
        `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=yes`
      );

      if (!authWindow) {
        toast.error("Popup bloqueado! Por favor, autorize popups para este site.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao iniciar conexão com Google.");
    }
  };

  // Listener para o sucesso do OAuth via popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validar origem básica (AI Studio previews terminam em .run.app)
      if (typeof event.data === 'object' && event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        console.log("✅ Google Auth Success via Message:", event.data);
        
        // Salvar os tokens temporariamente ou associar à clínica
        if (event.data.tokens) {
          localStorage.setItem("estrelize_google_tokens", JSON.stringify(event.data.tokens));
          toast.success("Google Business conectado com sucesso!");
          
          // Avançar passo após sucesso
          setTimeout(() => setStep(3), 1000);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
    else navigate("/saude");
  };

  return (
    <div className="min-h-screen bg-[#021616] text-white flex flex-col font-sans">
      {/* Header / Nav */}
      <div className="max-w-2xl mx-auto w-full pt-12 px-6">
        <button 
          onClick={prevStep}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          {step === 1 ? "Voltar" : "Voltar ao passo anterior"}
        </button>

        {/* Progress Bar */}
        <div className="space-y-4 mb-20">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6d5dfc]">Passo {step} de 3</span>
            <span className="text-[10px] font-black text-white/30">{step === 1 ? "33%" : step === 2 ? "67%" : "100%"}</span>
          </div>
          <h2 className="text-4xl font-heading">Inscrição Estrelize</h2>
          <div className="h-[2px] w-full bg-white/5 relative">
            <motion.div 
              initial={false}
              animate={{ width: `${(step / 3) * 100}%` }}
              className="absolute top-0 left-0 h-full bg-[#6d5dfc] shadow-[0_0_15px_rgba(109,93,252,0.5)]"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              {/* Business Name */}
              <div className="space-y-4">
                <h3 className="text-3xl font-heading">Qual o nome do seu negócio?</h3>
                <p className="text-gray-500 text-sm">Isso nos ajuda a personalizar as respostas da IA.</p>
                <div className="relative group">
                  <input 
                    type="text"
                    placeholder="Ex: Restaurante Sabor Local"
                    className="w-full bg-[#032525] border border-white/5 rounded-xl px-6 py-5 text-lg focus:outline-none focus:border-[#7C3AED]/50 transition-all"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-4">
                <h3 className="text-3xl font-heading">E o seu e-mail?</h3>
                <p className="text-gray-500 text-sm">Para enviarmos relatórios semanais.</p>
                <input 
                  type="email"
                  placeholder="Ex: contato@negocio.com"
                  className="w-full bg-[#032525] border border-white/5 rounded-xl px-6 py-5 text-lg focus:outline-none focus:border-[#7C3AED]/50 transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* Review Link */}
              <div className="space-y-4 pb-12">
                <h3 className="text-3xl font-heading">Link de Avaliação</h3>
                <p className="text-gray-500 text-sm italic italic">Opcional agora, mas essencial para o WhatsApp.</p>
                <input 
                  type="text"
                  placeholder="Ex: https://g.page/r/sua-empresa/review"
                  className="w-full bg-[#032525] border border-white/5 rounded-xl px-6 py-5 text-lg focus:outline-none focus:border-[#7C3AED]/50 transition-all"
                  value={formData.reviewLink}
                  onChange={(e) => setFormData({ ...formData, reviewLink: e.target.value })}
                />
              </div>

              <div className="pt-8 flex justify-center pb-24">
                <Button 
                  onClick={nextStep}
                  disabled={!formData.businessName || !formData.email}
                  className="w-full h-16 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-3xl font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:grayscale shadow-xl shadow-purple-500/20"
                >
                  Confirmar Dados <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          ) : step === 2 ? (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-6">
                <h3 className="text-3xl font-heading">Conectar Google Business</h3>
                <p className="text-gray-400 leading-relaxed">
                  Ao conectar, o Estrelize buscará automaticamente o seu link de avaliações e sincronizará suas mensagens.
                </p>
              </div>

              {/* Google Connection Box */}
              <div className="bg-[#032525]/30 border border-white/5 rounded-[2rem] p-12 flex flex-col items-center justify-center space-y-10 relative overflow-hidden">
                <div className="w-16 h-16 bg-[#021616] border border-white/5 rounded-2xl flex items-center justify-center p-3">
                  <svg width="100%" height="100%" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </div>

                <div className="space-y-6 w-full max-w-sm text-center">
                  <Button 
                    onClick={handleGoogleLogin}
                    className="w-full bg-[#6d5dfc] hover:bg-[#5b4be3] text-white h-16 rounded-2xl font-bold transition-all shadow-xl text-md"
                  >
                    Conectar Conta Google
                  </Button>
                  
                  <button 
                    onClick={() => setShowHelpModal(true)}
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6d5dfc] hover:text-white transition-colors block mx-auto underline underline-offset-4"
                  >
                    COMO CONSIGO ESSES DADOS?
                  </button>

                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-800">
                    CONEXÃO SEGURA VIA OAUTH 2.0
                  </p>
                </div>
              </div>

              <div className="pt-8 flex justify-center pb-24">
                <Button 
                  onClick={nextStep}
                  className="w-full h-16 bg-[#162727] text-gray-500 hover:text-white rounded-full font-bold flex items-center justify-center gap-3 transition-colors border border-white/5"
                >
                  Continuar <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-4xl font-heading">Tudo Pronto!</h3>
                <p className="text-gray-400 text-lg leading-relaxed max-w-sm mx-auto">
                  Sua clínica foi configurada com sucesso. Já estamos analisando seu perfil do Google.
                </p>
              </div>

              <div className="pt-8 flex justify-center pb-24">
                <Button 
                  onClick={() => navigate("/dashboard")}
                  className="w-full h-16 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-3xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-purple-500/20"
                >
                  Entrar no Dashboard <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelpModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#032525] border border-white/5 rounded-[2rem] p-10 overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setShowHelpModal(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors h-10 w-10 bg-[#021616] border border-white/5 rounded-xl flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-10">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6d5dfc]">Ajuda</span>
                  <h3 className="text-4xl font-heading tracking-tight">Como conectar?</h3>
                </div>

                <div className="space-y-8">
                  {[
                    { num: "01", title: "Use o e-mail correto", desc: "Você deve fazer login com o mesmo e-mail que gerencia seu negócio no Google Maps." },
                    { num: "02", title: "Autorize as permissões", desc: "Na tela do Google, marque todas as caixas de permissão para que possamos ler e responder suas avaliações." },
                    { num: "03", title: "Não tem um perfil?", desc: "Se você ainda não tem um Perfil da Empresa no Google, precisará criar um em business.google.com primeiro." },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-5">
                      <div className="w-10 h-10 rounded-xl bg-[#021616] border border-white/10 flex items-center justify-center shrink-0 text-[11px] font-bold text-[#6d5dfc]">
                        {item.num}
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-lg text-white/90 leading-tight">{item.title}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {item.num === "03" ? (
                            <>
                              Se você ainda não tem um Perfil da Empresa no Google, precisará criar um em{" "}
                              <a href="https://business.google.com" target="_blank" rel="noreferrer" className="text-white hover:text-[#6d5dfc] transition-colors underline underline-offset-4 decoration-[#6d5dfc]">
                                business.google.com
                              </a>{" "}
                              primeiro.
                            </>
                          ) : (
                            item.desc
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => setShowHelpModal(false)}
                  className="w-full h-16 bg-[#6d5dfc] hover:bg-[#5b4be3] text-white rounded-2xl font-bold transition-all text-lg shadow-xl shadow-purple-500/10"
                >
                  Entendi
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sticky Footer for Onboarding */}
      <div className="mt-auto py-8 text-center border-t border-white/5 opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] italic">
          DADOS DE AVALIAÇÕES FORNECIDOS POR GOOGLE MAPS © 2026
        </p>
      </div>
    </div>
  );
}
