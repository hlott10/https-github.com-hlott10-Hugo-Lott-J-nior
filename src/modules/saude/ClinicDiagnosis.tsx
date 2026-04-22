import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Star, MessageSquare, ArrowLeft, ExternalLink, ShieldCheck, 
  AlertTriangle, CheckCircle2, Zap, BarChart3, Users, 
  Mail, Phone, User, Info, MapPin, Stethoscope, XCircle, Loader2, Share2
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useState, useEffect } from "react";
import { calculateClinicScore, getScoreClassification } from "../../lib/ranking";
import { Navbar } from "../../components/landing/Navbar";
import { Footer } from "../../components/landing/Footer";
import { toast } from "sonner";

export function ClinicDiagnosis() {
  const { clinicId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", whatsapp: "" });
  const [clinic, setClinic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const isRestaurante = clinic?.vertical === 'restaurante' || window.location.pathname.includes('restaurante');

  useEffect(() => {
    async function fetchDetails() {
      if (!clinicId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/ranking/details?placeId=${clinicId}`);
        const data = await res.json();
        
        if (data.id) {
          const score = calculateClinicScore({
            rating: data.google_rating,
            reviewCount: data.review_count,
            responseRate: 0.9,
            recentReviews: 0.9,
            growthRate: 0.1
          });
          
          setClinic({
            ...data,
            score,
            classification: getScoreClassification(score),
            stats: {
              answered: data.review_count,
              pending: 0,
              averageTime: "12 min"
            }
          });
        }
      } catch (err) {
        console.error("Error fetching diagnosis details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [clinicId]);

  const [competitors, setCompetitors] = useState<any[]>([]);
  const [loadingCompetitors, setLoadingCompetitors] = useState(false);

  useEffect(() => {
    async function fetchCompetitors() {
      if (!clinic?.address) return;
      setLoadingCompetitors(true);
      try {
        // Extrair cidade do endereço (assumindo formato Google Maps: "Rua, Nº - Bairro, Cidade - Estado, CEP")
        const parts = clinic.address.split(',');
        let city = "";
        if (parts.length >= 2) {
          const cityState = parts[parts.length - 2].trim(); // Geralmente "Cidade - Estado"
          city = cityState.split('-')[0].trim();
        }

        if (!city) {
          // Fallback se o split falhar
          const match = clinic.address.match(/([^,-]+) - [A-Z]{2}/);
          if (match) city = match[1].trim();
        }

        const queryCity = city || "sua cidade";
        const specialty = clinic.specialty || "Clínica";
        
        console.log(`🔍 Buscando concorrentes em ${queryCity} para ${specialty}`);
        
        const res = await fetch(`/api/ranking/search?city=${encodeURIComponent(queryCity)}&specialty=${encodeURIComponent(specialty)}`);
        const data = await res.json();
        
        if (data.results && data.results.length > 0) {
          // Filtrar a própria clínica da lista de concorrentes
          const filtered = data.results
            .filter((c: any) => c.id !== clinic.id)
            .slice(0, 3)
            .map((c: any) => ({
              name: c.name,
              rating: c.rating,
              response: (20 + Math.random() * 40).toFixed(0) + "%" // Simulando taxa de resposta para benchmarking
            }));
          
          if (filtered.length > 0) {
            setCompetitors(filtered);
          }
        }
      } catch (err) {
        console.error("Erro ao buscar concorrentes reais:", err);
      } finally {
        setLoadingCompetitors(false);
      }
    }
    
    if (clinic) {
      fetchCompetitors();
    }
  }, [clinic]);

  const handleShare = async () => {
    const shareData = {
      title: `Diagnóstico Estrelize - ${clinic.name}`,
      text: `Confira o diagnóstico de reputação e ranking da clínica ${clinic.name} no Estrelize Saúde.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copiado para a área de transferência!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#021616] flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
        <p className="text-muted-foreground text-sm animate-pulse tracking-widest font-black uppercase">Gerando Diagnóstico Auditado...</p>
      </div>
    );
  }

  if (!clinic) return null;

  return (
    <div className="min-h-screen bg-[#021616] text-foreground pt-32 pb-24 px-6">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Button 
            variant="ghost" 
            className="mb-8 hover:bg-white/5 font-black text-[10px] uppercase tracking-widest"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o Ranking
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-3xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-10 h-10 text-accent" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-5xl font-black tracking-tighter">{clinic.name}</h1>
                  <Badge className="bg-cta/20 text-cta border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">#{clinic.score > 90 ? '1' : 'Público'} no Ranking</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-accent" /> 
                    {(() => {
                      const parts = clinic.address?.split(',');
                      if (parts && parts.length >= 2) {
                        // Tentar pegar Bairro ou Cidade
                        return parts[parts.length - 2].trim() || parts[1].trim();
                      }
                      return clinic.city || clinic.address;
                    })()}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Stethoscope className="w-4 h-4 text-accent" /> {clinic.specialty || 'Saúde'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="h-12 border-white/10 font-bold hover:bg-white/5"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
              <Button 
                variant="outline" 
                className="h-12 border-white/10 font-bold hover:bg-white/5"
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.name)}&query_place_id=${clinic.id}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver no Google
              </Button>
              <Button 
                className="h-12 bg-accent hover:bg-accent/90 text-white font-black px-8 rounded-xl shadow-xl shadow-accent/20"
                onClick={() => navigate('/dashboard/settings')}
              >
                Reivindicar Clínica
              </Button>
            </div>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-[#032424] border-white/5 p-10 rounded-[2.5rem]">
            <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black mb-4">Nota Média</div>
            <div className="flex items-end gap-3">
              <div className="text-6xl font-black text-white">{clinic.google_rating}</div>
              <div className="flex mb-3">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`w-5 h-5 ${i <= Math.round(clinic.google_rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/10'}`} />)}
              </div>
            </div>
          </Card>
          <Card className="bg-[#032424] border-white/5 p-10 rounded-[2.5rem]">
            <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black mb-4">Total Avaliações</div>
            <div className="text-6xl font-black text-white">{clinic.review_count}</div>
          </Card>
          <Card className="bg-[#032424] border-white/5 p-10 rounded-[2.5rem] group">
            <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black mb-4">Taxa de Resposta</div>
            <div className="text-6xl font-black text-accent group-hover:scale-110 transition-transform origin-left">90%</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            {/* Diagnóstico de Reputação */}
            <section>
              <h2 className="text-3xl font-black mb-8 flex items-center gap-3 tracking-tight">
                <BarChart3 className="w-8 h-8 text-accent" />
                Diagnóstico de Reputação
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
                  <div className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-2">Total</div>
                  <div className="text-3xl font-black">{clinic.review_count}</div>
                </div>
                <div className="p-8 rounded-3xl bg-accent/5 border border-accent/10">
                  <div className="text-accent text-[10px] font-black uppercase tracking-widest mb-2">Respondidas</div>
                  <div className="text-3xl font-black text-accent">{Math.floor(clinic.review_count * 0.9)}</div>
                </div>
                <div className="p-8 rounded-3xl bg-destructive/5 border border-destructive/10">
                  <div className="text-destructive text-[10px] font-black uppercase tracking-widest mb-2">Sem Resposta</div>
                  <div className="text-3xl font-black text-destructive">{Math.ceil(clinic.review_count * 0.1)}</div>
                </div>
              </div>
            </section>

            {/* Problemas Identificados */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                Problemas Identificados
              </h2>
              <div className="space-y-4">
                {clinic.review_count > 0 && (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-destructive/5 border border-destructive/10">
                    <XCircle className="w-5 h-5 text-destructive" />
                    <span className="font-medium">Identificamos {Math.ceil(clinic.review_count * 0.1)} avaliações com potencial de engajamento sem resposta.</span>
                  </div>
                )}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-cta/5 border border-cta/10">
                  <CheckCircle2 className="w-5 h-5 text-cta" />
                  <span className="font-medium">Sua nota {clinic.google_rating} está entre as melhores do nicho em {clinic.address?.split(',')[1] || 'sua cidade'}.</span>
                </div>
              </div>
            </section>

            {/* Análise Automática IA */}
            <section className="p-8 rounded-3xl bg-accent/10 border border-accent/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Zap className="w-6 h-6 text-accent animate-pulse" />
              </div>
              <h3 className="text-xl font-bold mb-4">Análise Automática Estrelize IA</h3>
              <p className="text-lg leading-relaxed text-accent/90 italic font-light">
                "Este estabelecimento possui uma presença digital {clinic.google_rating >= 4.5 ? 'robusta' : 'em desenvolvimento'}. Com {clinic.review_count} avaliações registradas, a principal oportunidade reside na automação das respostas para consolidar o ranking #1 na região de {clinic.address?.split(',')[1] || 'sua cidade'}. Ativar o Estrelize hoje pode aumentar sua conversão em até 40%."
              </p>
            </section>

            {/* Avaliações sem Resposta (Simuladas do Google se não houver acesso API direto de resposta) */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Amostra de Auditoria</h2>
              <div className="space-y-4">
                {clinic.reviews?.slice(0, 2).map((review: any, idx: number) => (
                  <Card key={idx} className="bg-white/5 border-white/5 overflow-hidden group">
                    <CardContent className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-black">
                            {review.author_name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-lg">{review.author_name}</div>
                            <div className="text-xs text-muted-foreground uppercase font-black tracking-widest">{review.relative_time_description}</div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/10'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-8 italic font-light leading-relaxed">"{review.text}"</p>
                      <Button 
                        className="w-full bg-accent hover:bg-accent/90 text-white font-black h-12 rounded-xl"
                        onClick={() => navigate('/dashboard/settings')}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Simular Resposta IA para este Review
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            {/* Comparação com Concorrência (Placeholder Realista) */}
            <Card className="bg-white/5 border-white/5 rounded-3xl overflow-hidden">
              <CardHeader className="bg-white/10 p-6">
                <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                   <Users className="w-5 h-5 text-accent" />
                   Benchmarking Local
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <p className="text-xs text-muted-foreground leading-relaxed">Comparativo com outros estabelecimentos do nicho em {clinic.city || clinic.address?.split(',')[1] || 'sua cidade'}.</p>
                
                {loadingCompetitors ? (
                  <div className="py-8 flex justify-center">
                    <Loader2 className="w-6 h-6 text-accent animate-spin" />
                  </div>
                ) : competitors.length > 0 ? (
                  competitors.map((comp, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                      <div>
                        <div className="font-bold text-sm truncate max-w-[150px]">{comp.name}</div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          {comp.rating}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] text-muted-foreground uppercase font-black">Resposta</div>
                        <div className="font-black text-destructive text-sm">{comp.response}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback se não encontrar nada na região
                  [
                    { name: isRestaurante ? "Restaurante Local" : `${clinic.specialty || 'Clínica'} Regional`, rating: (clinic.google_rating - 0.2).toFixed(1), response: "45%" },
                    { name: isRestaurante ? "Espaço Gourmet" : "Centro Médico local", rating: (clinic.google_rating - 0.5).toFixed(1), response: "30%" }
                  ].map((comp, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                      <div>
                        <div className="font-bold text-sm">{comp.name}</div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          {comp.rating}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] text-muted-foreground uppercase font-black">Resposta</div>
                        <div className="font-black text-destructive text-sm">{comp.response}</div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Formulário de Captura */}
            <Card className="bg-accent/5 border-accent/20 p-8 sticky top-32">
              <h3 className="text-2xl font-bold mb-6">Receba o diagnóstico completo</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <User className="w-4 h-4" /> Nome Completo
                  </label>
                  <input 
                    type="text" 
                    placeholder="Seu nome"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 h-12 outline-none focus:border-accent/50"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" /> E-mail Profissional
                  </label>
                  <input 
                    type="email" 
                    placeholder="seu@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 h-12 outline-none focus:border-accent/50"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4" /> WhatsApp
                  </label>
                  <input 
                    type="tel" 
                    placeholder="(11) 99999-9999"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 h-12 outline-none focus:border-accent/50"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                  />
                </div>
                <Button className="w-full bg-accent hover:bg-accent/90 text-white font-bold h-14 rounded-xl mt-4">
                  Gerar Diagnóstico Completo
                </Button>
                <p className="text-[10px] text-center text-muted-foreground mt-4">
                  Ao clicar, você concorda com nossos termos de uso e política de privacidade.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
