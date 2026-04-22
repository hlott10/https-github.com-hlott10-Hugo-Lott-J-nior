/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useState, useEffect } from "react";
import { ScrollToTop } from "./components/ScrollToTop";
import { Navbar } from "./components/landing/Navbar";
import { Footer } from "./components/landing/Footer";
import { Portal } from "./modules/portal/PortalPage";
import { SaudeLanding } from "./modules/saude/SaudeLandingPage";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { UsageProvider } from "./lib/UsageContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { Loader2 } from "lucide-react";
import { RankingMain } from "./modules/saude/RankingMain";
import { CityRanking } from "./modules/saude/CityRanking";
import { ClinicDiagnosis } from "./modules/saude/ClinicDiagnosis";
import { ClinicProfile } from "./modules/saude/ClinicProfile";
import { AuditoriaPortal } from "./modules/saude/AuditoriaPortal";
import { MarketingEticoPortal } from "./modules/saude/MarketingEticoPortal";
import { TermsOfUse } from "./pages/TermsOfUse";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { CookiePolicy } from "./pages/CookiePolicy";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Security } from "./pages/Security";
import { SEORankingPage } from "./modules/saude/SEORankingPage";
import { Onboarding } from "./modules/saude/Onboarding";
import { Demo } from "./pages/Demo";

function RankingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-accent">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [vertical, setVertical] = useState<'portal' | 'saude'>('portal');

  useEffect(() => {
    console.log("%c🌟 ESTRELIZE ATIVO [v1.1.0 - Multi-App Mode] ❤️", "color: #14b8a6; font-size: 20px; font-weight: bold; background: white; padding: 10px; border-radius: 10px;");
    
    // Priority: URL Param -> Environment Variable -> Hostname
    const searchParams = new URLSearchParams(window.location.search);
    const forceV = searchParams.get('v');
    const envVertical = import.meta.env.VITE_VERTICAL;
    const hostname = window.location.hostname;

    if (forceV === 'saude' || envVertical === 'saude' || hostname.includes('saude.')) {
      setVertical('saude');
    } else {
      setVertical('portal');
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
      </div>
    );
  }

  const renderHome = () => {
    if (user) return <Navigate to="/dashboard" />;
    
    switch (vertical) {
      case 'saude': return <SaudeLanding />;
      default: return <Portal />;
    }
  };

  return (
    <Routes>
      {/* Dynamic Root Based on Subdomain */}
      <Route path="/" element={renderHome()} />
      
      {/* Explicit Vertical Landings (Fallback/Path-based) */}
      <Route path="/saude" element={user ? <Navigate to="/dashboard" /> : <SaudeLanding />} />
      <Route path="/saude/clinicas" element={<AuditoriaPortal />} />
      <Route path="/saude/medicos" element={<MarketingEticoPortal />} />
      
      {/* Ranking System */}
      <Route path="/ranking" element={<RankingLayout><RankingMain /></RankingLayout>} />
      
      {/* New SEO Ranking Routes */}
      <Route path="/ranking/:cityId" element={<SEORankingPage />} />
      <Route path="/ranking/:cityId/:specialtyId" element={<SEORankingPage />} />
      
      {/* Fallback for specialty only ranking */}
      <Route path="/ranking/setores/:specialtyId" element={<SEORankingPage />} />

      <Route path="/ranking/diagnostico/:clinicId" element={<RankingLayout><ClinicDiagnosis /></RankingLayout>} />
      
      {/* New Clinic Profile Route */}
      <Route path="/clinica/:clinicId" element={<ClinicProfile />} />

      {/* Legal Pages */}
      <Route path="/termos" element={<TermsOfUse />} />
      <Route path="/privacidade" element={<PrivacyPolicy />} />
      <Route path="/cookies" element={<CookiePolicy />} />
      <Route path="/sobre" element={<About />} />
      <Route path="/contato" element={<Contact />} />
      <Route path="/seguranca" element={<Security />} />

      {/* Dashboard */}
      <Route path="/demo" element={<Demo />} />
      <Route 
        path="/dashboard/*" 
        element={<DashboardLayout />} 
      />

      {/* Dynamic SEO Pages */}
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/:seoSlug" element={<SEORankingPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Router>
          <ScrollToTop />
          <AuthProvider>
            <UsageProvider>
              <AppContent />
            </UsageProvider>
          </AuthProvider>
        </Router>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
