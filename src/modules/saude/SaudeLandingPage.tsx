import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Navbar } from "../../components/landing/Navbar";
import { Hero } from "../../components/landing/Hero";
import { Problem } from "../../components/landing/Problem";
import { Solution } from "../../components/landing/Solution";
import { HowItWorks } from "../../components/landing/HowItWorks";
import { Ranking } from "../../components/landing/Ranking";
import { Benefits } from "../../components/landing/Benefits";
import { ForWhom } from "../../components/landing/ForWhom";
import { Testimonials } from "../../components/landing/Testimonials";
import { Pricing } from "../../components/landing/Pricing";
import { FAQ } from "../../components/landing/FAQ";
import { Footer } from "../../components/landing/Footer";
import { FinalCTA } from "../../components/landing/FinalCTA";
import { createCheckoutSession } from "../../lib/stripe";
import { SEO } from "../../components/SEO";

export function SaudeLanding() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("session_id")) {
      toast.success("Assinatura realizada com sucesso! Bem-vindo ao Estrelize Pro.");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-accent">
      <SEO 
        title="Estrelize Saúde - Gestão de Reputação e Automação para Clínicas" 
        description="Responda avaliações do Google com IA, melhore seu ranking e atraia pacientes. Auditoria de confiança para o setor de saúde." 
      />
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <HowItWorks />
        <Ranking />
        <Benefits />
        <ForWhom />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
