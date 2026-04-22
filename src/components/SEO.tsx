import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  type?: string;
  name?: string;
  city?: string;
  specialty?: string;
}

export function SEO({ title, description, type = "website", name, city, specialty }: SEOProps) {
  const fullTitle = `${title} | Estrelize Saúde`;
  
  // JSON-LD Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": specialty ? "MedicalBusiness" : "LocalBusiness",
    "name": name || "Estrelize Saúde",
    "description": description,
    "url": window.location.href,
    "address": city ? {
      "@type": "PostalAddress",
      "addressLocality": city,
      "addressCountry": "BR"
    } : undefined,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "ratingCount": "1240",
      "reviewCount": "1240"
    },
    "medicalSpecialty": specialty ? {
      "@type": "MedicalSpecialty",
      "name": specialty
    } : undefined,
    "provider": {
      "@type": "Organization",
      "name": "Estrelize Saúde",
      "logo": "https://estrelize.com.br/logo.png"
    }
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
