import { motion } from "motion/react";
import { Stethoscope, ArrowRight, Star, TrendingUp, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "../../components/SEO";
import { useState } from "react";

export function Portal() {
  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(null);

  const isDev = window.location.hostname.includes('run.app');
  const restauranteUrl = isDev ? "/?v=restaurantes" : "https://restaurantes.estrelize.com.br";
  const saudeUrl = isDev ? "/?v=saude" : "https://saude.estrelize.com.br";

  return (
    <div className="min-h-screen bg-[#020202] flex flex-col md:flex-row overflow-hidden relative">
      <SEO 
        title="Estrelize - Gestão de Reputação Inteligente" 
        description="Escolha a solução Estrelize ideal para o seu negócio: Restaurantes ou Saúde." 
      />

      {/* Restaurantes Side (Left) */}
      <a 
        href={restauranteUrl}
        onMouseEnter={() => setHoveredSide("left")}
        onMouseLeave={() => setHoveredSide(null)}
        className={`relative flex-1 group overflow-hidden flex flex-col items-center justify-center p-12 text-center transition-all duration-700 
          ${hoveredSide === "left" ? "md:flex-[1.15]" : "md:flex-1"}
          ${hoveredSide === "right" ? "opacity-80" : "opacity-100"}
        `}
      >
        {/* Glow Layer */}
        <div className={`absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent transition-opacity duration-1000 ${hoveredSide === "left" ? "opacity-100" : "opacity-0"}`} />
        <div className="absolute inset-0 bg-[#050505] -z-10" />
        
        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 space-y-10"
        >
          {/* Restaurants Logo */}
          <div className="relative w-28 h-28 mx-auto transition-transform duration-700 group-hover:scale-110">
            <div className="absolute inset-0 rounded-[1.8rem] bg-orange-500 flex items-center justify-center shadow-[0_15px_50px_rgba(255,69,0,0.3)]">
              <Star className="w-14 h-14 text-white fill-white" />
              <div className="absolute bottom-4 right-4 bg-orange-500 rounded-sm p-0.5">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
              Estrelize <br />
              <span className="text-orange-500">Restaurantes</span>
            </h2>
            <p className="text-gray-400 max-w-sm mx-auto text-base md:text-xl font-medium leading-relaxed min-h-[5rem] px-4">
              Transforme avaliações de clientes em reservas reais. Automação e resposta com IA.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 text-orange-500 font-black uppercase tracking-[0.2em] text-[10px] group-hover:text-orange-400 transition-colors">
            <span>Acessar Plataforma</span>
            <motion.div
              animate={hoveredSide === "left" ? { x: 8 } : { x: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </div>
        </motion.div>

        {/* Decorative Stars */}
        <div className="absolute bottom-16 flex gap-2 opacity-10 group-hover:opacity-100 transition-all duration-1000">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
          ))}
        </div>
      </a>

      {/* Central Divider Circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
        <motion.div 
          animate={{ 
            rotate: hoveredSide === "left" ? -5 : hoveredSide === "right" ? 5 : 0,
            scale: hoveredSide ? 1.05 : 1
          }}
          className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center rounded-full bg-[#0a0a0a] shadow-[0_0_60px_rgba(0,0,0,0.9)]"
        >
          {/* Gradient Border Circle */}
          <div className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-r from-[#FF4500] via-[#7c7c7c] to-[#00FA9A]">
            <div className="w-full h-full rounded-full bg-[#0a0a0a]" />
          </div>
          
          {/* Logo Star Icon */}
          <div className="relative z-10">
            <Star className="w-12 h-12 text-white fill-white animate-pulse" />
          </div>
        </motion.div>
      </div>

      {/* Saúde Side (Right) */}
      <a 
        href={saudeUrl}
        onMouseEnter={() => setHoveredSide("right")}
        onMouseLeave={() => setHoveredSide(null)}
        className={`relative flex-1 group overflow-hidden flex flex-col items-center justify-center p-12 text-center transition-all duration-700 
          ${hoveredSide === "right" ? "md:flex-[1.15]" : "md:flex-1"}
          ${hoveredSide === "left" ? "opacity-80" : "opacity-100"}
        `}
      >
        {/* Glow Layer */}
        <div className={`absolute inset-0 bg-gradient-to-bl from-emerald-500/10 via-transparent to-transparent transition-opacity duration-1000 ${hoveredSide === "right" ? "opacity-100" : "opacity-0"}`} />
        <div className="absolute inset-0 bg-[#081212] -z-10" />
        
        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 space-y-10"
        >
          {/* Saude Logo */}
          <div className="relative w-28 h-28 mx-auto transition-transform duration-700 group-hover:scale-110">
            <div className="absolute inset-0 rounded-[1.8rem] bg-emerald-500 flex items-center justify-center shadow-[0_15px_50px_rgba(16,185,129,0.3)]">
              <Stethoscope className="w-14 h-14 text-white" />
              <div className="absolute bottom-4 right-4 bg-emerald-500 rounded-sm p-0.5">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
              Estrelize <br />
              <span className="text-emerald-400">Saúde</span>
            </h2>
            <p className="text-gray-400 max-w-sm mx-auto text-base md:text-xl font-medium leading-relaxed min-h-[5rem] px-4">
              Reputação auditada que gera confiança. Especializado para clínicas e médicos.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px] group-hover:text-emerald-300 transition-colors">
            <span>Acessar Plataforma</span>
            <motion.div
              animate={hoveredSide === "right" ? { x: 8 } : { x: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </div>
        </motion.div>

        {/* Decorative Badge */}
        <div className="absolute bottom-16 px-8 py-3 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-500/80 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 group-hover:opacity-100 transition-all duration-1000">
          Trust & Compliance Edition
        </div>
      </a>

      {/* Mobile Branding */}
      <div className="md:hidden absolute top-10 left-1/2 -translate-x-1/2 z-40">
        <h1 className="text-xs font-black text-white tracking-[1em] uppercase opacity-50">Estrelize</h1>
      </div>

      {/* Footer Attribution */}
      <div className="absolute bottom-6 left-0 right-0 z-40 text-center px-6">
        <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 italic">
          DADOS DE AVALIAÇÕES FORNECIDOS POR GOOGLE MAPS © 2026
        </p>
      </div>
    </div>
  );
}
