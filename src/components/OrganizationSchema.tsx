import React from 'react';

export const OrganizationSchema = () => (
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "AdvertisingAgency",
      "name": "Happy Hunter Digital",
      "alternateName": "Happy Hunter - Smart Marketing",
      "url": "https://happyhunterdigital.com",
      "logo": "https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "First floor, Unit 35, 29 Rhodes Ave, Florida North",
        "addressLocality": "Roodepoort",
        "addressRegion": "Gauteng",
        "postalCode": "1710",
        "addressCountry": "ZA"
      },
      "founder": { "@type": "Person", "name": "Thabo Leslie Motsumi" },
      "description": "Provider of AI-driven marketing systems, Generative Engine Optimization (GEO), and intelligent WhatsApp automation."
    })}
  </script>
);
