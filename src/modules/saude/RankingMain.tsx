import { motion } from "motion/react";
import { Search, MapPin, Star, MessageSquare, TrendingUp, ArrowRight, Trophy, Users, BarChart3, Globe, Activity, Stethoscope, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SPECIALTIES, CITIES } from "../../constants/seo";
import { Navbar } from "../../components/landing/Navbar";
import { Footer } from "../../components/landing/Footer";
import { getClinics, Establishment } from "../../lib/establishments";

// Fallback clinics if DB is empty
const DEFAULT_CLINICS = [
  { name: "Sorriso Ideal", city: "Salvador", google_rating: 4.9, review_count: 850, specialty: "Odontologia", slug: "sorriso-ideal-salvador" },
  { name: "Clínica São Lucas", city: "Belo Horizonte", google_rating: 4.8, review_count: 1200, specialty: "Cardiologia", slug: "clinica-sao-lucas-bh" },
];

export function RankingMain() {
  const [search, setSearch] = useState("");
  const [localCities, setLocalCities] = useState<string[]>(CITIES);
  const [featuredClinics, setFeaturedClinics] = useState<Establishment[]>([]);
  const [loadingClinics, setLoadingClinics] = useState(true);
  const navigate = useNavigate();

  // Load featured clinics from Supabase
  useEffect(() => {
    async function loadFeatured() {
      try {
        const clinics = await getClinics();
        if (clinics && clinics.length > 0) {
          setFeaturedClinics(clinics.slice(0, 4));
        }
      } catch (err) {
        console.error("Erro ao carregar clínicas:", err);
      } finally {
        setLoadingClinics(false);
      }
    }
    loadFeatured();
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCities = localStorage.getItem("estrelize_saude_custom_cities");
    if (savedCities) {
      try {
        const parsed = JSON.parse(savedCities);
        setLocalCities(prev => {
          const combined = [...new Set([...prev, ...parsed])];
          return combined;
        });
      } catch (e) {
        console.error("Error parsing saved cities", e);
      }
    }
  }, []);

  const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");

  const filteredCities = localCities.filter(city => 
    city.toLowerCase().includes(search.toLowerCase())
  );

  const handleVerRanking = () => {
    if (!search.trim()) return;

    const normalizedNewCity = normalize(search.trim());
    const existingCity = localCities.find(c => normalize(c) === normalizedNewCity);

    if (!existingCity) {
      // Add new city to local list and persist
      const newCityName = search.trim();
      const updatedCities = [newCityName, ...localCities];
      setLocalCities(updatedCities);
      
      const customOnes = updatedCities.filter(c => !CITIES.includes(c));
      localStorage.setItem("estrelize_saude_custom_cities", JSON.stringify(customOnes));
      
      navigate(`/ranking/${normalizedNewCity}`);
    } else {
      navigate(`/ranking/${normalize(existingCity)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#021616] text-foreground selection:bg-accent/30 selection:text-accent">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-48 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-accent)_0%,_transparent_70%)] opacity-20 -z-10" />
        
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black mb-8 uppercase tracking-widest">
              🏆 Ranking Auditado de Clínicas 2026
            </div>
            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
              As Melhores Clínicas <br />
              <span className="text-accent">da sua Cidade</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-16 font-light leading-relaxed">
              Auditoria em tempo real de **avalições do Google**. Saiba quem realmente entrega o melhor atendimento e resolva suas dúvidas com as clínicas mais bem avaliadas.
            </p>

            <div className="max-w-3xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent/50 to-emerald-500/50 blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <div className="relative flex flex-col md:flex-row gap-2 p-3 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-3xl">
                <div className="flex-1 flex items-center px-6 gap-4">
                  <MapPin className="w-6 h-6 text-accent" />
                  <input 
                    type="text" 
                    placeholder="Busque sua cidade (Ex: Salvador, BA)"
                    className="bg-transparent border-none outline-none w-full text-xl font-medium placeholder:text-muted-foreground/30 h-14"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleVerRanking()}
                  />
                </div>
                <Button 
                  onClick={handleVerRanking}
                  className="bg-accent hover:bg-accent/90 text-white px-10 h-16 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-2xl"
                >
                  Ver Ranking Agora
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-50">
                Mais de 10.000 cidades auditadas automaticamente
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEQUENCE 1: CIDADES JÁ CADASTRADAS */}
      <section id="cidades" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-accent font-black mb-4 uppercase tracking-[0.3em] text-[10px]">01 // Cidades Populares</h2>
              <h3 className="text-4xl md:text-6xl font-bold tracking-tighter">Cidades com Rankings Ativos</h3>
            </div>
            <div className="text-right">
              <span className="text-5xl font-black text-white/5 tabular-nums">#01</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredCities.map((city, index) => (
              <motion.div
                key={city}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
              >
                <Link 
                  to={`/ranking/${normalize(city)}`}
                  className="group block p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-accent/10 hover:border-accent/30 transition-all duration-500"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg group-hover:text-accent transition-colors">{city}</span>
                    <ArrowRight className="w-5 h-5 text-white/10 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SEQUENCE 2: CLÍNICAS COM DETALHES */}
      <section id="clinicas" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-accent font-black mb-4 uppercase tracking-[0.3em] text-[10px]">02 // Destaques</h2>
              <h3 className="text-4xl md:text-6xl font-bold tracking-tighter">Clínicas em Alta</h3>
            </div>
            <div className="text-right">
              <span className="text-5xl font-black text-white/5 tabular-nums">#02</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loadingClinics ? (
              <div className="col-span-full py-12 flex justify-center">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
              </div>
            ) : (featuredClinics.length > 0 ? featuredClinics : DEFAULT_CLINICS as any[]).map((clinic, index) => (
              <motion.div
                key={clinic.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="bg-surface border-white/5 overflow-hidden group hover:border-accent/30 transition-all duration-500">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="w-24 bg-accent/5 flex items-center justify-center border-r border-white/5">
                        <span className="text-3xl font-black text-accent/20 group-hover:text-accent transition-colors">0{index + 1}</span>
                      </div>
                      <div className="flex-1 p-8">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h4 className="text-2xl font-bold mb-1 group-hover:text-accent transition-colors">{clinic.name}</h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <MapPin className="w-3 h-3" />
                              {clinic.city} • {clinic.specialty}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-black text-yellow-400">{clinic.google_rating || clinic.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            {clinic.review_count || clinic.reviews} Avaliações Auditadas
                          </span>
                          <Button 
                            variant="ghost" 
                            className="text-accent font-bold hover:bg-accent/10 flex items-center gap-2"
                            onClick={() => navigate(`/clinica/${clinic.slug}`)}
                          >
                            Ver Detalhes
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Button 
              size="lg"
              className="bg-white text-black hover:bg-white/90 font-black px-12 h-16 rounded-2xl text-xl"
              onClick={() => navigate('/onboarding')}
            >
              Quero Minha Clínica Aqui
            </Button>
          </div>
        </div>
      </section>

      {/* Stats/SEO Section */}
      <section className="py-32 px-6 bg-accent border-y border-white/10 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div className="space-y-4">
              <div className="text-6xl font-black tracking-tighter tabular-nums">+50k</div>
              <div className="text-white/60 font-bold uppercase tracking-widest text-xs">Clínicas Auditadas</div>
            </div>
            <div className="space-y-4">
              <div className="text-6xl font-black tracking-tighter tabular-nums">98%</div>
              <div className="text-white/60 font-bold uppercase tracking-widest text-xs">Precisão em IA</div>
            </div>
            <div className="space-y-4">
              <div className="text-6xl font-black tracking-tighter tabular-nums">24h</div>
              <div className="text-white/60 font-bold uppercase tracking-widest text-xs">Redução tempo resposta</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
