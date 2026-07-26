// src/components/PageMeta.tsx
// Sets per-route title, description, canonical URL, Open Graph/Twitter tags,
// and optional JSON-LD structured data. Rendered client-side via react-helmet-async,
// then captured into static HTML per-route by scripts/prerender.mjs at build time —
// this is what makes each route (not just "/") show real, distinct content to
// search engines and AI crawlers that don't execute JavaScript.
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://www.happyhunterdigital.com';
const DEFAULT_IMAGE =
  'https://res.cloudinary.com/dka0498ns/image/upload/v1772005724/The_Architecture_of_Digital_Authority_Integrating_Trust_Anchors_AI-Powered_Answer_Engines_and_Agentic_Revenue_Ecosystems_in_2026_i4tgjt.png';

interface PageMetaProps {
  title: string;
  description: string;
  path: string; // e.g. "/services" — no trailing slash except for "/"
  image?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function PageMeta({ title, description, path, image = DEFAULT_IMAGE, jsonLd }: PageMetaProps) {
  const url = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  const jsonLdItems = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_ZA" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@HappyHunter35" />
      <meta name="twitter:creator" content="@HappyHunter35" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLdItems.map((item, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
}
