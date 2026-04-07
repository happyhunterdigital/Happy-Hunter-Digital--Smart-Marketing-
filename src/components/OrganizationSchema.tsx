import React from 'react';

export const OrganizationSchema = () => (
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ProfessionalService", 
      "name": "Happy Hunter Digital",
      "alternateName": "Happy Hunter - Smart Marketing",
      "url": "https://happyhunterdigital.com",
      "telephone": "+27601016673",
      "logo": "https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Pretoria West, Pretoria",
        "addressRegion": "Gauteng",
        "addressCountry": "ZA"
      },
      "founder": { "@type": "Person", "name": "Thabo Leslie Motsumi" },
      "description": "Digital Marketing Agency specializing in AI search visibility and automated WhatsApp sales funnels."
    })}
  </script>
);
