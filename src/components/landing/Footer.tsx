import { Stethoscope, Utensils, Instagram, Linkedin, Twitter, Globe, MapPin, Share2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Footer() {
  const location = useLocation();
  const isRestaurante = location.pathname.startsWith("/restaurantes");
  const isSaude = location.pathname.startsWith("/saude") || location.pathname.startsWith("/ranking") || !isRestaurante;

  const verticalName = isRestaurante ? "Restaurantes" : "Saúde";
  const accentColor = isRestaurante ? "text-orange-500" : "text-accent";
  const primaryBg = isRestaurante ? "bg-orange-500" : "bg-primary";
  const BrandIcon = isRestaurante ? Utensils : Stethoscope;
  const description = isRestaurante 
    ? "A solução completa para gestão de reputação gastronômica. Transforme avaliações em clientes fiéis."
    : "A plataforma líder em automação de avaliações para o setor de saúde. Ajudando clínicas a crescerem com inteligência.";

  return (
    <footer className="py-20 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className={`${primaryBg} p-2 rounded-lg transition-colors`}>
                <BrandIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold font-heading tracking-tighter">
                Estrelize <span className={accentColor}>{verticalName}</span>
              </span>
            </div>
            <p className="text-muted-foreground max-w-sm mb-8">
              {description}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6">Plataforma</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link to="/sobre" className={`hover:${accentColor} transition-colors`}>Sobre Nós</Link></li>
              <li><Link to="/seguranca" className={`hover:${accentColor} transition-colors`}>Segurança</Link></li>
              <li><Link to="/contato" className={`hover:${accentColor} transition-colors`}>Contato</Link></li>
              {isSaude && <li><Link to="/ranking" className="hover:text-accent transition-colors">Ranking</Link></li>}
              <li>
                <Link to="/" className="flex items-center gap-2 text-white font-medium hover:opacity-80 transition-opacity">
                  <Globe className="w-4 h-4" />
                  Portal Estrelize
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-white/50">JURÍDICO</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/termos" className={`hover:${accentColor} transition-colors`}>Termos de Uso</Link></li>
              <li><Link to="/privacidade" className={`hover:${accentColor} transition-colors`}>Política de Privacidade</Link></li>
              <li><Link to="/cookies" className={`hover:${accentColor} transition-colors`}>Política de Cookies</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Localização</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className={`w-4 h-4 mt-0.5 ${accentColor}`} />
                <span>
                  Operação Estrelize<br />
                  Brasil
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 italic">
            DADOS DE AVALIAÇÕES FORNECIDOS POR GOOGLE MAPS © 2026
          </div>
          <div className="flex items-center gap-6 text-muted-foreground/40">
            <Share2 className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
            <MapPin className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
}
