import { Helmet } from 'react-helmet-async';

export const SEO = ({ title, description }: { title: string; description: string }) => (
  <Helmet>
    <title>{title} | Happy Hunter Digital</title>
    <meta name="description" content={description} />
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Happy Hunter Digital",
        "founder": "Thabo Leslie Motsumi",
        "description": "Specialized AIO agency for the South African market.",
        "areaServed": "South Africa"
      })}
    </script>
  </Helmet>
);
