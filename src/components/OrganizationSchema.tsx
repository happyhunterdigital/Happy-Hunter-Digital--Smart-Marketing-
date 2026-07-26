import React from 'react';

export const OrganizationSchema = () => (
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Happy Hunter Digital",
      "alternateName": "Happy Hunter - Smart Marketing",
      "url": "https://www.happyhunterdigital.com",
      "logo": "https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg",
      "image": "https://res.cloudinary.com/dka0498ns/image/upload/v1772005724/The_Architecture_of_Digital_Authority_Integrating_Trust_Anchors_AI-Powered_Answer_Engines_and_Agentic_Revenue_Ecosystems_in_2026_i4tgjt.png",
      "telephone": "+27601016673",
      "email": "motsumitl@happyhunterdigital.com",
      "priceRange": "R",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "574 Fred Messenger Avenue, Andeon",
        "addressLocality": "Pretoria West, Pretoria",
        "addressRegion": "Gauteng",
        "postalCode": "0183",
        "addressCountry": "ZA"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -25.7255,
        "longitude": 28.0688
      },
      "areaServed": [
        { "@type": "City", "name": "Pretoria" },
        { "@type": "City", "name": "Johannesburg" },
        { "@type": "Country", "name": "South Africa" }
      ],
      "founder": { "@type": "Person", "name": "Thabo Leslie Motsumi" },
      "description": "Digital marketing agency in Pretoria and Johannesburg building websites, smart chat assistants, and WhatsApp sales tools for South African small businesses.",
      "sameAs": [
        "https://za.linkedin.com/in/thabomotsumi",
        "https://x.com/HappyHunter35",
        "https://www.instagram.com/happyhunterdigital/",
        "https://www.tiktok.com/@happyhunterdigital",
        "https://www.facebook.com/Happyhunterdigital/"
      ]
    })}
  </script>
);
