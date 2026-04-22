import React from "react";
import { Navbar } from "./landing/Navbar";
import { Footer } from "./landing/Footer";

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  lastUpdated: string;
}

export function LegalLayout({ children, title, lastUpdated }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-accent">
      <Navbar />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 tracking-tight">{title}</h1>
            <p className="text-muted-foreground">Última atualização: {lastUpdated}</p>
          </div>
          <div className="prose prose-invert prose-primary max-w-none">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
