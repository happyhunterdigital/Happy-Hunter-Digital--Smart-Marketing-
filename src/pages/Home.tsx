// src/pages/Home.tsx
import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { ServicesSection } from '../components/ServicesSection';
import { ProcessSection } from '../components/ProcessSection';

const OrganizationSchema = () => (
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Happy Hunter Digital",
      "alternateName": "Happy Hunter - Smart Marketing",
      "url": "https://happyhunterdigital.com",
      "logo": "https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg",
      "telephone": "+27601016673",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "574 Fred Messenger Avenue, Andeon",
        "addressLocality": "Pretoria West, Pretoria",
        "addressRegion": "Gauteng",
        "addressCountry": "ZA"
      },
      "founder": { "@type": "Person", "name": "Thabo Leslie Motsumi" },
      "description": "Digital Entity Architecture Firm specializing in Vibe-Coding, AI search visibility, and autonomous WhatsApp sales systems."
    })}
  </script>
);

export const Home = () => {
  return (
    <div className="min-h-screen bg-deep-950">
      <OrganizationSchema />
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
    </div>
  );
};
