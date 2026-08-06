import React from 'react';

export const OrganizationSchema = () => (
  <>
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": "https://www.happyhunterdigital.com/#organization",
        "name": "Happy Hunter Digital",
        "alternateName": ["Happy Hunter - Smart Marketing", "HHD"],
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
          { "@type": "City", "name": "Pretoria", "@id": "https://www.wikidata.org/wiki/Q38446" },
          { "@type": "City", "name": "Johannesburg", "@id": "https://www.wikidata.org/wiki/Q34647" },
          { "@type": "Country", "name": "South Africa" }
        ],
        "founder": {
          "@type": "Person",
          "name": "Thabo Leslie Motsumi",
          "url": "https://www.happyhunterdigital.com/founders",
          "jobTitle": "Principal Strategist & Entity Architect",
          "sameAs": [
            "https://www.linkedin.com/in/thabomotsumi",
            "https://x.com/HappyHunter35"
          ]
        },
        "description": "Digital marketing agency in Pretoria and Johannesburg building AI-ready websites, smart chat assistants, and WhatsApp sales tools for South African small businesses.",
        "foundingDate": "2024",
        "servesCuisine": null,
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Digital Marketing Services",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "AI-Ready Websites" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "24/7 Digital Receptionists" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Automated WhatsApp Sales" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Expert Authority Content" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Direct Booking Engines" } }
          ]
        },
        "sameAs": [
          "https://za.linkedin.com/in/thabomotsumi",
          "https://x.com/HappyHunter35",
          "https://www.instagram.com/happyhunterdigital/",
          "https://www.tiktok.com/@happyhunterdigital",
          "https://www.facebook.com/Happyhunterdigital/"
        ]
      })}
    </script>
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Happy Hunter Digital",
        "url": "https://www.happyhunterdigital.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://www.happyhunterdigital.com/smart-news?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      })}
    </script>
  </>
);
