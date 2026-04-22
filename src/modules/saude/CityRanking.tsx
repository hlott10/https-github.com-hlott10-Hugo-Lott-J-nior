import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ArrowLeft, Share2, ChevronRight, Info, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useState, useEffect } from "react";
import { SEO } from "../../components/SEO";
import { calculateClinicScore } from "../../lib/ranking";

// Mock data for clinics with ranking factors
const mockClinics = [
  {
    id: "1",
    name: "Clínica Saúde & Vida",
    rating: 4.9,
    reviews: 1240,
    responseRate: 0.98,
    lastReviewDays: 2,
    specialty: "CLÍNICAS MÉDICAS",
    address: "Av. Beira Mar, 1234 - Jardins, Aracaju - SE, 49025-040",
    slug: "clinica-saude-vida"
  },
  {
    id: "2",
    name: "Odonto Premium",
    rating: 4.8,
    reviews: 850,
    responseRate: 0.95,
    lastReviewDays: 5,
    specialty: "ODONTOLOGIA",
    address: "R. Dr. Leonardo Leite, 456 - Treze de Julho, Aracaju - SE, 49020-320",
    slug: "odonto-premium"
  },
  {
    id: "3",
    name: "Estética Avançada",
    rating: 4.7,
    reviews: 2100,
    responseRate: 0.92,
    lastReviewDays: 10,
    specialty: "ESTÉTICA",
    address: "Av. Min. Geraldo Barreto Sobral, 789 - Jardins, Aracaju - SE, 49026-010",
    slug: "estetica-avancada"
  },
  {
    id: "4",
    name: "Laboratório BioCheck",
    rating: 4.6,
    reviews: 3200,
    responseRate: 0.89,
    lastReviewDays: 15,
    specialty: "LABORATÓRIO",
    address: "R. Itabaiana, 101 - Centro, Aracaju - SE, 49010-170",
    slug: "laboratorio-biocheck"
  },
  {
    id: "5",
    name: "Dermatologia Avançada",
    rating: 4.9,
    reviews: 450,
    responseRate: 0.87,
    lastReviewDays: 20,
    specialty: "DERMATOLOGIA",
    address: "Av. Jorge Amado, 202 - Garcia, Aracaju - SE, 49025-330",
    slug: "dermatologia-avancada"
  },
  {
    id: "6",
    name: "Psico Centro",
    rating: 4.8,
    reviews: 300,
    responseRate: 0.99,
    lastReviewDays: 1,
    specialty: "PSICOLOGIA",
    address: "R. Vila Cristina, 500 - São José, Aracaju - SE, 49015-000",
    slug: "psico-centro"
  }
];

const categories = [
  "TODOS",
  "CLÍNICAS MÉDICAS",
  "ODONTOLOGIA",
  "ESTÉTICA",
  "PSICOLOGIA",
  "DERMATOLOGIA",
  "PEDIATRIA",
  "CARDIOLOGIA",
  "FISIOTERAPIA",
  "LABORATÓRIO",
  "GINECOLOGIA"
];

export function CityRanking() {
  const { cityId, specialtyId } = useParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("TODOS");
  const [realClinics, setRealClinics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cityName = cityId?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  useEffect(() => {
    if (specialtyId) {
      setActiveCategory(specialtyId.toUpperCase());
    }
  }, [specialtyId]);

  useEffect(() => {
    async function fetchRankings() {
      if (!cityName) return;
      setLoading(true);
      try {
        const specialty = activeCategory === "TODOS" ? "clínica" : activeCategory.toLowerCase();
        const res = await fetch(`/api/ranking/search?city=${encodeURIComponent(cityName)}&specialty=${encodeURIComponent(specialty)}`);
        const data = await res.json();
        
        if (data.results) {
          const scored = data.results.map((c: any) => ({
            ...c,
            score: calculateClinicScore({
              rating: c.rating,
              reviewCount: c.reviews,
              growthRate: 0.85,
              responseRate: 0.9,
              recentReviews: 0.9
            })
          })).sort((a: any, b: any) => b.score - a.score);
          setRealClinics(scored);
        }
      } catch (err) {
        console.error("Error fetching real rankings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRankings();
  }, [cityName, activeCategory]);

  const displayClinics = realClinics;

  return (
    <div className="min-h-screen bg-[#021616] text-foreground pt-32 pb-24 px-6">
      <SEO 
        title={`Ranking de Clínicas em ${cityName}`} 
        description={`Veja as clínicas mais bem avaliadas em ${cityName}. Ranking baseado em avaliações do Google Maps e engajamento.`}
        city={cityName}
      />
      <div className="max-w-6xl mx-auto">
        {/* Back Link */}
        <button 
          onClick={() => navigate('/ranking')}
          className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors mb-12 uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Rankings
        </button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold mb-4 uppercase tracking-wider">
              🏆 Ranking Oficial 2024
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight">
              Melhores Clínicas em <span className="text-white">{cityName}</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
              Veja o ranking atualizado das melhores clínicas de {cityName} baseado em avaliações do Google Maps.
            </p>
          </div>
          
          <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 h-12 px-6 rounded-xl gap-2 font-bold">
            <Share2 className="w-4 h-4" />
            Compartilhar Ranking
          </Button>
        </div>

        {/* Info Card */}
        <Card className="bg-white/5 border-white/5 mb-12 overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-accent/20 rounded-lg shrink-0">
                <Info className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">A Importância da Gestão de Avaliações para Clínicas em {cityName}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  No cenário competitivo da saúde em {cityName}, a velocidade e a qualidade das respostas no Google Maps são fatores decisivos para o ranking orgânico. 
                  Este ranking analisa as clínicas que utilizam o feedback dos pacientes como ferramenta de SEO local, aumentando sua visibilidade e taxa de conversão.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-bold transition-all border ${
                activeCategory === cat 
                  ? "bg-accent text-white border-accent shadow-lg shadow-accent/20" 
                  : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/20 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Ranking List */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
              <Loader2 className="w-10 h-10 text-accent animate-spin" />
              <p className="text-muted-foreground text-sm animate-pulse tracking-widest font-black uppercase">Auditoria em tempo real via Google Maps...</p>
            </div>
          ) : displayClinics.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
               <p className="text-muted-foreground uppercase tracking-widest font-black text-xs">Nenhum resultado real encontrado para {cityName}.</p>
            </div>
          ) : displayClinics.map((clinic, index) => (
            <motion.div
              key={clinic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="bg-[#042F2E] border-white/5 hover:bg-[#064e4c] transition-all group overflow-hidden cursor-pointer"
                onClick={() => navigate(`/ranking/diagnostico/${clinic.id}`)}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row items-stretch">
                    {/* Rank Number */}
                    <div className="w-full md:w-24 bg-orange-500 flex items-center justify-center py-6 md:py-0">
                      <span className="text-4xl font-black text-white">{index + 1}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-8 flex flex-col md:flex-row justify-between items-center gap-8">
                      <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-3 mb-3">
                          <h3 className="text-2xl font-bold text-white">
                            {clinic.name}
                          </h3>
                          <Badge variant="secondary" className="bg-white/10 text-white border-none text-[10px] font-bold px-3 py-1">
                            {clinic.specialty}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {clinic.address}
                        </p>
                      </div>

                      <div className="flex flex-col items-center md:items-end gap-4 shrink-0">
                        <div className="bg-[#021616] px-6 py-3 rounded-xl border border-white/5">
                          <div className="text-accent font-bold text-xl">
                            Score: {clinic.score}
                          </div>
                        </div>
                        <Button 
                          className="bg-accent hover:bg-accent/90 text-white font-bold px-8 h-12 rounded-xl group/btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/ranking/diagnostico/${clinic.id}`);
                          }}
                        >
                          Ver Diagnóstico
                          <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-24 text-center">
          <h2 className="text-2xl font-bold mb-4">Sua clínica não está no ranking?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Reivindique sua clínica e comece a automatizar suas respostas para subir no ranking e atrair mais pacientes.
          </p>
          <Button 
            onClick={() => navigate('/onboarding')}
            className="bg-cta hover:bg-cta/90 text-white px-12 h-14 text-lg font-bold rounded-xl shadow-xl shadow-cta/20"
          >
            Reivindicar Minha Clínica
          </Button>
        </div>
      </div>
    </div>
  );
}
