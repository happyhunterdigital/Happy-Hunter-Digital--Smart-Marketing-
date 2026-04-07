import React from 'react';

export const OrganizationSchema = () => (
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Happy Hunter Digital",
      "url": "https://happyhunterdigital.com",
      "logo": "https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg",
      "address": { "@type": "PostalAddress", "addressLocality": "Pretoria", "addressCountry": "ZA" },
      "founder": { "@type": "Person", "name": "Thabo Leslie Motsumi" }
    })}
  </script>
);
