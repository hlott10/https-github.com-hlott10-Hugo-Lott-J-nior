import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Stethoscope, Utensils, LogOut, User as UserIcon, Trophy, Menu, X, Mail, Loader2, ArrowRight, Eye } from "lucide-react";
import { loginWithGoogle, logout, signInWithEmail } from "../../lib/supabase";
import { useAuth } from "../../lib/AuthContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { cn } from "../../lib/utils";

export function Navbar() {
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const location = useLocation();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Check for placeholder keys
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
      toast.error("Configuração faltando: Você precisa adicionar as chaves do Supabase no menu Settings do AI Studio.");
      return;
    }
    
    setIsSending(true);
    try {
      await signInWithEmail(email);
      setEmailSent(true);
      toast.success("Link enviado! Verifique sua caixa de entrada.");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao enviar link. Verifique o email e tente novamente.");
    } finally {
      setIsSending(false);
    }
  };

  const handleGoogleLogin = async () => {
    // Check for placeholder keys
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
      toast.error("Configuração faltando: Você precisa adicionar as chaves do Supabase no menu Settings do AI Studio.");
      return;
    }

    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao iniciar login com Google.");
    }
  };

  const isRestaurante = location.pathname.startsWith("/restaurantes");
  const isSaude = location.pathname.startsWith("/saude") || location.pathname.startsWith("/ranking") || !isRestaurante;
  const isPortal = location.pathname === "/";

  // Don't show standard navbar on portal
  if (isPortal) return null;

  const verticalName = isRestaurante ? "Restaurantes" : "Saúde";
  const verticalPath = isRestaurante ? "/restaurantes" : "/saude";
  const accentColor = isRestaurante ? "text-orange-500" : "text-accent";
  const primaryBg = isRestaurante ? "bg-orange-500" : "bg-primary";
  const ctaBg = isRestaurante ? "bg-orange-500 hover:bg-orange-600" : "bg-cta hover:bg-cta/90";
  const BrandIcon = isRestaurante ? Utensils : Stethoscope;

  const navLinks = isRestaurante 
    ? [
        { name: "Como Funciona", href: "#como-funciona" },
        { name: "Preços", href: "#preços" },
        { name: "Rankings", href: "/ranking" },
      ]
    : [
        { name: "Problema", href: "#problema" },
        { name: "Solução", href: "#solucao" },
        { name: "Planos", href: "#planos" },
      ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (location.pathname === verticalPath) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass m-4 rounded-2xl"
      >
        <Link to={verticalPath} className="flex items-center gap-2">
          <div className={`${primaryBg} p-2 rounded-lg transition-colors`}>
            <BrandIcon className="w-6 h-6 text-white" />
          </div>
          <span className={cn("text-xl font-bold tracking-tighter", isRestaurante ? "font-serif italic" : "font-heading")}>
            Estrelize <span className={accentColor}>{verticalName}</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={`${verticalPath}/${link.href}`}
              onClick={(e) => handleNavClick(e as any, link.href)}
              className="hover:text-foreground transition-colors"
            >
              {link.name}
            </Link>
          ))}
          {isSaude && (
            <Link to="/ranking" className="flex items-center gap-1.5 text-accent hover:text-accent/80 transition-colors font-bold">
              <Trophy className="w-4 h-4" />
              Ranking
            </Link>
          )}
          <Link to="/demo" className="flex items-center gap-1.5 text-[#7C3AED] hover:text-[#7C3AED]/80 transition-colors font-black uppercase tracking-widest text-[10px]">
            <Eye className="w-4 h-4" />
            Visualizar Demo
          </Link>
          <Link to="/dashboard" className={cn("flex items-center gap-1.5 transition-colors font-black uppercase tracking-widest text-[10px]", isRestaurante ? "text-orange-500 hover:text-orange-600" : "text-accent hover:text-accent/80")}>
            <BrandIcon className="w-4 h-4" />
            Abrir Painel
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-4">
            {loading ? (
              <div className="w-24 h-10 bg-white/5 animate-pulse rounded-lg" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name || ""} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <UserIcon className="w-4 h-4" />
                  )}
                  <span className="text-xs font-medium hidden lg:inline">{user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => logout()} title="Sair">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : showEmailInput ? (
              <div className="flex items-center gap-2">
                {emailSent ? (
                  <div className="flex items-center gap-2 text-[10px] font-bold text-accent animate-pulse uppercase tracking-widest">
                    <Mail className="w-4 h-4" />
                    Link enviado! Veja seu email.
                  </div>
                ) : (
                  <form onSubmit={handleEmailLogin} className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                    <input 
                      type="email" 
                      placeholder="Seu melhor email" 
                      className="bg-transparent border-none outline-none text-xs px-3 w-40 h-8"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoFocus
                    />
                    <Button 
                      disabled={isSending}
                      size="sm"
                      className="h-8 bg-accent text-white font-bold text-[10px] rounded-lg"
                    >
                      {isSending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Enviar Link"}
                    </Button>
                  </form>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => {
                    setShowEmailInput(false);
                    setEmailSent(false);
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
            <>
                <Button 
                  variant="ghost" 
                  className="uppercase font-black tracking-[0.2em] text-[10px] hover:bg-white/5" 
                  onClick={() => setShowEmailInput(true)}
                >
                  Entrar
                </Button>
                <Link to="/onboarding">
                  <Button 
                    className={`${ctaBg} text-white font-black uppercase tracking-[0.2em] text-[10px] h-11 px-8 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95`}
                  >
                    Começar Grátis
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-28 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={`${verticalPath}/${link.href}`}
                  className="text-2xl font-bold hover:text-accent transition-colors"
                  onClick={(e) => handleNavClick(e as any, link.href)}
                >
                  {link.name}
                </Link>
              ))}
              {isSaude && (
                <Link 
                  to="/ranking" 
                  className="text-2xl font-bold text-accent flex items-center justify-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Trophy className="w-6 h-6" />
                  Ranking
                </Link>
              )}
              <Link 
                to="/demo" 
                className="text-2xl font-black text-[#7C3AED] flex items-center justify-center gap-2 uppercase tracking-widest"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Eye className="w-6 h-6" />
                Visualizar Demo
              </Link>
              
              <hr className="border-white/10 my-4" />
              
              {user ? (
                <div className="flex flex-col gap-4">
                  <Link 
                    to="/dashboard" 
                    className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <UserIcon className="w-6 h-6" />
                    )}
                    <span className="text-xl font-bold">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="text-xl h-14" 
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sair
                  </Button>
                </div>
              ) : showEmailInput ? (
                <div className="flex flex-col gap-4 p-6 bg-white/5 rounded-3xl border border-white/10">
                   {emailSent ? (
                     <div className="text-center space-y-4">
                        <Mail className="w-12 h-12 text-accent mx-auto animate-bounce" />
                        <h3 className="text-xl font-bold text-accent uppercase tracking-widest">Link Enviado!</h3>
                        <p className="text-sm text-muted-foreground">Verifique seu email para entrar.</p>
                        <Button variant="ghost" size="sm" onClick={() => setEmailSent(false)}>Tentar outro email</Button>
                     </div>
                   ) : (
                     <form onSubmit={handleEmailLogin} className="space-y-4">
                        <input 
                           type="email" 
                           placeholder="Seu melhor email" 
                           className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-6 focus:border-accent outline-none"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button 
                           disabled={isSending}
                           className="w-full bg-accent text-white h-14 rounded-2xl font-bold text-lg"
                        >
                           {isSending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Enviar Link"}
                        </Button>
                        <Button variant="ghost" className="w-full" onClick={() => setShowEmailInput(false)}>Cancelar</Button>
                     </form>
                   )}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Button 
                    variant="ghost" 
                    className="text-xl h-14" 
                    onClick={() => setShowEmailInput(true)}
                  >
                    Entrar por Email
                  </Button>
                  <Button 
                    className="bg-cta hover:bg-cta/90 text-white text-xl h-14 font-bold rounded-2xl shadow-xl shadow-cta/20"
                    onClick={() => {
                      handleGoogleLogin();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Começar Grátis
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
