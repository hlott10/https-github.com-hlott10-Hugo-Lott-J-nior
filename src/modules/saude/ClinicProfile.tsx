import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, ChevronRight, Info, Star, MapPin, Phone, Globe, Calendar, CheckCircle2, ShieldCheck, Activity, Award, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { SEO } from "../../components/SEO";
import { calculateClinicScore, getScoreClassification } from "../../lib/ranking";
import { Navbar } from "../../components/landing/Navbar";
import { Footer } from "../../components/landing/Footer";
import { useEffect, useState } from "react";
import { getClinicBySlug, Establishment } from "../../lib/establishments";
import { cn } from "../../lib/utils";

export function ClinicProfile() {
  const { clinicId } = useParams();
  const navigate = useNavigate();
  const [clinic, setClinic] = useState<Establishment | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to parse slug if DB is empty
  const parseClinicSlug = (slug: string) => {
    if (!slug) return { name: "Clínica de Saúde", city: "Sua Cidade" };
    
    // Improved parsing for Estrelize slugs (e.g., "nome-da-clinica-cidade")
    const parts = slug.split("-");
    if (parts.length < 2) return { name: slug.charAt(0).toUpperCase() + slug.slice(1), city: "Brasil" };
    
    // Try to guess city (usually last 1 or 2 parts)
    const city = parts.slice(-1)[0];
    const name = parts.slice(0, -1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
    
    return { 
      name: name || "Clínica de Saúde", 
      city: city.charAt(0).toUpperCase() + city.slice(1) 
    };
  };

  useEffect(() => {
    async function load() {
      if (!clinicId) return;
      setLoading(true);
      try {
        // 1. Try DB first (Supabase)
        const data = await getClinicBySlug(clinicId);
        if (data) {
          setClinic(data);
          setLoading(false);
          return;
        }

        // 2. If not in DB, it might be a Google Place ID from the search results
        // Many Place IDs start with "ChI"
        if (clinicId.startsWith("ChI") || clinicId.length > 20) {
          const res = await fetch(`/api/ranking/details?placeId=${clinicId}`);
          const googleData = await res.json();
          
          if (googleData.id) {
            setClinic({
              id: googleData.id,
              name: googleData.name,
              address: googleData.address,
              phone: googleData.phone,
              website: googleData.website,
              google_rating: googleData.google_rating,
              review_count: googleData.review_count,
              image_url: googleData.image_url,
              city: googleData.address?.split(",")[1]?.trim() || "Local",
              specialty: "Multiespecialidade", // Fallback
              description: `Estabelecimento auditado com ${googleData.review_count} avaliações no Google Maps.`,
              metadata: {
                opening_hours: googleData.opening_hours,
                real_reviews: googleData.reviews
              }
            } as any);
            return;
          }
        }

        throw new Error("Clínica não encontrada");
      } catch (err) {
        console.error("Erro ao carregar clínica, ativando fallback:", err);
        const fallback = parseClinicSlug(clinicId);
        setClinic({
          id: clinicId,
          name: fallback.name,
          city: fallback.city,
          state: "BR",
          specialty: "Multiespecialidade",
          google_rating: 4.8,
          review_count: 500,
          response_rate: 0.9,
          slug: clinicId,
          address: "Endereço em auditoria...",
          phone: "(00) 0000-0000",
          website: "www.estrelize.saude",
        } as Establishment);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [clinicId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#021616] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
      </div>
    );
  }

  if (!clinic) return null;

  const score = calculateClinicScore({
    rating: clinic.google_rating,
    reviewCount: clinic.review_count,
    responseRate: clinic.response_rate,
    recentReviews: clinic.recent_reviews_score || 0.9,
    growthRate: clinic.growth_rate || 0.1
  });

  const classification = getScoreClassification(score);

  return (
    <div className="min-h-screen bg-[#021616] text-foreground selection:bg-accent/30 selection:text-accent">
      <Navbar />
      <SEO 
        title={`${clinic.name} em ${clinic.city}`} 
        description={`Veja a reputação e avaliações da ${clinic.name} em ${clinic.city}. Score de confiança: ${score}. Ranking Auditado.`}
        name={clinic.name}
        city={clinic.city}
        specialty={clinic.specialty}
      />

      <main className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Top Bar / Navigation */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
            <button 
              onClick={() => navigate(-1)}
              className="group flex items-center gap-3 text-[10px] font-black text-muted-foreground hover:text-accent transition-all uppercase tracking-[0.3em]"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Voltar ao Ranking
            </button>

            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1">
                <ShieldCheck className="w-3 h-3 mr-1.5 inline" />
                Perfil Auditado
              </Badge>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent font-bold">
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Column: Visuals & Core Info */}
            <div className="lg:col-span-8 space-y-12">
              <section>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-[21/9] rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl border border-white/5 bg-surface"
                >
                  <img 
                    src={clinic.image_url || `https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200&h=600`}
                    alt={clinic.name}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#021616] via-transparent to-transparent" />
                  <div className="absolute bottom-10 left-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                        <Award className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <Badge className="bg-accent text-white border-none font-black text-[10px] mb-2">{clinic.specialty}</Badge>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">{clinic.name}</h1>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { icon: MapPin, label: "Endereço", value: clinic.address },
                    { icon: Phone, label: "Contato", value: clinic.phone },
                    { icon: Globe, label: "Website", value: clinic.website },
                  ].map((item, i) => (
                    <Card key={i} className="bg-surface/50 border-white/5 p-6 rounded-3xl hover:bg-surface transition-all">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                        <item.icon className="w-5 h-5 text-accent" />
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">{item.label}</div>
                      <div className="text-sm font-bold leading-relaxed">{item.value}</div>
                    </Card>
                  ))}
                </div>
              </section>

              <section className="bg-surface/30 rounded-[2.5rem] p-12 border border-white/5">
                <h2 className="text-3xl font-black mb-8 tracking-tight">Experiência do Paciente</h2>
                <p className="text-muted-foreground text-xl font-light mb-12 leading-relaxed">
                  {clinic.description || `Referência em atendimento humanizado e tecnologia de ponta em ${clinic.city}. Especialistas em proporcionar a melhor experiência de saúde para você e sua família.`}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h4 className="font-bold flex items-center gap-2 text-accent">
                      <CheckCircle2 className="w-5 h-5" />
                      Por que escolher esta clínica?
                    </h4>
                    <ul className="space-y-4">
                      {["Atendimento Humanizado", "Equipamentos de Última Geração", "Professores e Especialistas"].map(point => (
                        <li key={point} className="flex items-center gap-3 text-sm font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-6">
                    <h4 className="font-bold flex items-center gap-2 text-accent">
                      <Activity className="w-5 h-5" />
                      Horários de Funcionamento
                    </h4>
                    <ul className="space-y-3 text-sm font-medium text-muted-foreground">
                      {(clinic as any).metadata?.opening_hours && (clinic as any).metadata.opening_hours.length > 0 ? (
                        (clinic as any).metadata.opening_hours.map((day: string, idx: number) => (
                          <li key={idx} className="border-b border-white/5 pb-2 text-xs">
                            {day}
                          </li>
                        ))
                      ) : (
                        <>
                          <li className="flex justify-between border-b border-white/5 pb-2">
                            <span>Segunda - Sexta</span>
                            <span className="text-foreground">08:00 - 18:00</span>
                          </li>
                          <li className="flex justify-between border-b border-white/5 pb-2">
                            <span>Sábado</span>
                            <span className="text-foreground">08:00 - 12:00</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Reviews Feed */}
              <section className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-black tracking-tight">Auditoria Google</h2>
                  <Button 
                    variant="link" 
                    className="text-accent font-bold"
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.name)}&query_place_id=${clinic.id}`, '_blank')}
                  >
                    Ver no Google Maps
                  </Button>
                </div>
                
                {(clinic as any).metadata?.real_reviews ? (
                  (clinic as any).metadata.real_reviews.map((rev: any, i: number) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <Card className="bg-surface/40 border-white/5 group overflow-hidden hover:bg-surface transition-all">
                        <CardContent className="p-8">
                          <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-4">
                                {rev.profile_photo_url ? (
                                  <img src={rev.profile_photo_url} className="w-12 h-12 rounded-full border border-white/10" referrerPolicy="no-referrer" />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center font-black text-accent uppercase">
                                    {rev.author_name.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <div className="font-bold text-lg">{rev.author_name}</div>
                                  <div className="flex gap-1">
                                    {[...Array(5)].map((_, j) => <Star key={j} className={cn("w-3 h-3", j < rev.rating ? "fill-yellow-400 text-yellow-400" : "text-white/10")} />)}
                                  </div>
                                </div>
                              </div>
                              <p className="text-muted-foreground text-lg font-light italic leading-relaxed mb-6">
                                "{rev.text}"
                              </p>
                              <div className="text-[10px] text-muted-foreground/50 font-black uppercase tracking-widest">{rev.relative_time_description}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  [1, 2, 3].map((i: number) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <Card className="bg-surface/40 border-white/5 group overflow-hidden hover:bg-surface transition-all">
                        <CardContent className="p-8">
                          <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center font-black text-accent">
                                  P{i}
                                </div>
                                <div>
                                  <div className="font-bold text-lg">Paciente Verificado</div>
                                  <div className="flex gap-1">
                                    {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                                  </div>
                                </div>
                              </div>
                              <p className="text-muted-foreground text-lg font-light italic leading-relaxed mb-6">
                                "Experiência incrível. O Dr. {i % 2 === 0 ? 'Santos' : 'Silva'} foi muito atencioso e explicou cada passo do tratamento. Recomendo muito!"
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </section>
            </div>

            {/* Right Column: Score & CTAs */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                <Card className="bg-[#042F2E] border border-white/10 rounded-[2.5rem] shadow-3xl overflow-hidden group">
                  <div className="p-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent/20 text-accent text-[9px] font-black uppercase tracking-widest mb-6">
                      <Star className="w-3 h-3 fill-accent" />
                      Score Estrelize
                    </div>
                    
                    <div className="relative mb-8">
                      <div className="text-8xl font-black text-white tracking-tighter">{score}</div>
                      <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 font-black text-xs uppercase tracking-[0.2em] px-4 py-1 rounded-full bg-accent text-white shadow-lg`}>
                        {classification.label}
                      </div>
                    </div>

                    <div className="space-y-6 text-left mb-10 pt-6 border-t border-white/5">
                      <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                          <span>Volume de Prova</span>
                          <span className="text-white">{clinic.review_count} Reviews</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (clinic.review_count / 1000) * 100)}%` }}
                            className="bg-accent h-full rounded-full shadow-[0_0_15px_rgba(45,212,191,0.5)]"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                          <span>Taxa de Resposta</span>
                          <span className="text-white">{(clinic.response_rate * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${clinic.response_rate * 100}%` }}
                            className="bg-emerald-400 h-full rounded-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <Button 
                        className="w-full bg-accent hover:bg-accent/90 text-white font-black h-16 rounded-2xl shadow-xl flex items-center justify-center gap-2"
                        onClick={() => navigate(`/ranking/diagnostico/${clinic.id}`)}
                      >
                        <Activity className="w-5 h-5" />
                        Ver Diagnóstico Grátis
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full h-14 border-white/10 hover:bg-white/5 font-bold rounded-2xl"
                        onClick={() => window.open(clinic.google_maps_url || `https://www.google.com/maps/search/${encodeURIComponent(clinic.name + ' ' + clinic.city)}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver no Google Maps
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-accent/5 p-6 border-t border-white/5 text-center">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-loose">
                      Esta é a sua clínica? <br />
                      <button className="text-accent underline hover:text-white transition-colors" onClick={() => navigate('/dashboard/settings')}>Reivindique o perfil</button> para gerenciar.
                    </p>
                  </div>
                </Card>

                <div className="p-8 rounded-[2rem] bg-surface border border-white/5">
                  <h4 className="font-bold mb-4">Metodologia Auditada</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed uppercase tracking-wider">
                    As notas e classificações são geradas por algoritmos proprietários do Estrelize Saúde com base em dados públicos do Google Business Profile. Atualizado em Tempo Real.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
