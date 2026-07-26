import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PageMeta } from '../../components/PageMeta';
import {
  MessageSquareCode,
  Database,
  BrainCircuit,
  ShieldCheck,
  Smartphone,
  Bot,
  ArrowRight,
  Check,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react';

export interface ServicePackage {
  name: string;
  price: string;
  desc: string;
}

export interface SKU {
  id: string;
  title: string;
  desc?: string;
  target?: string;
  specs?: string;
  features?: string[];
  price: string;
  buttonText?: string;
  isPopular?: boolean;
  packages?: ServicePackage[];
}

export interface Category {
  slug: string;
  title: string;
  metaDesc: string;
  h1: string;
  subheadline?: string;
  quickAnswer: string;
  iconName: string;
  services: SKU[];
  faqs: { q: string; a: string }[];
}

export const categories: Category[] = [
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    metaDesc: "Content marketing, social media management, Google Ads, and email marketing for South African SMEs. Built on data, priced transparently.",
    h1: "Digital Marketing That Builds an Audience, Not Just Reach",
    quickAnswer: "We build campaigns structured around what AI answer engines and search algorithms actually reward: consistency, clarity, and verifiable authority, not just ad spend.",
    iconName: "MessageSquareCode",
    services: [
      {
        id: "DM-SOC-01",
        title: "Social Media Starter",
        desc: "Consistent posting and community management across Facebook and Instagram. Built to grow followers who actually match your customer profile.",
        price: "R1,500/month",
        specs: "8 posts or reels per month, page setup, monitoring, response, and monthly reporting with a 3-month setup phase"
      },
      {
        id: "DM-SOC-02",
        title: "Social Media Growth",
        price: "R2,800/month",
        desc: "Expanded content volume across Facebook, Instagram, and TikTok with strategic audience retargeting vectors to actively convert engagement signals into warm pipeline leads.",
        specs: "12 posts or reels per month, full retargeting setup, active profile monitoring, audience response, and comprehensive monthly performance reports",
        isPopular: true
      },
      {
        id: "DM-CON-01",
        title: "Content Marketing",
        price: "R3,500/month",
        desc: "Blog and authority web content written specifically to resolve real customer query pathways. Structured deliberately for high search engine indexing and consistent generative engine citations.",
        specs: "4 deep research articles per month, keyword intent mapping, semantic topic grouping, and on-page technical SEO schema integration"
      },
      {
        id: "DM-ADS-01",
        title: "Paid Search & Social Ads",
        price: "From R2,500/month",
        desc: "Hyper-targeted Google Ads and Meta Ads campaign configuration and execution. Built around clear, trackable metrics and actual cost-per-lead optimization rather than vanity impressions.",
        specs: "Account architecture setup, audience profiling, continuous dynamic asset testing, search intent optimization, and performance transparency reviews"
      },
      {
        id: "DM-EML-01",
        title: "Email Marketing",
        price: "R1,950/month",
        desc: "Automated behavioral sequences and tactical campaign messaging engineered to convert one-time traffic nodes into high-value repeat clients and sustained customer lifecycles.",
        specs: "Marketing automation platform setup, 4 strategic broadcast sends per month, advanced list partitioning, copy generation, and metric tracking"
      }
    ],
    faqs: [
      {
        q: "Do I need social media and SEO, or just one?",
        a: "They work best together. Social channels build active interest and direct brand validation signals across the web, while SEO and structured articles build the indexable, machine-readable authority foundation that search engines and AI engines query."
      },
      {
        q: "Is there a minimum contract period?",
        a: "Digital marketing services carry a standard three-month setup phase to allow sufficient performance signals to compound across target algorithms, ensuring verifiable growth metrics."
      }
    ]
  },
  {
    slug: "web-development",
    title: "Web Development",
    metaDesc: "Business websites, e-commerce stores, and landing pages built on structured, fast, AI and search-crawlable foundations for South African SMEs.",
    h1: "Your Website Isn't Just for Humans Anymore.",
    subheadline: "We build AI-Ready Websites structured for AEO (Answer Engine Optimization) and AI SEO so ChatGPT, Gemini, and Google AI Overviews can find, understand, and recommend your business. Not just rank it.",
    quickAnswer: "Stop being a ghost to the algorithms. Get found by the AI tools your customers already use.",
    iconName: "Database",
    services: [
      {
        id: "WEB-BUS-01",
        title: "Business / Corporate Website",
        price: "R1,850",
        desc: "Fully optimized, fast, and structured business platform featuring clear semantic structures and clean component trees.",
        specs: "Select a package scale below. For complex corporate integrations, get in touch with our engineering team directly.",
        packages: [
          {
            name: "1 Page Starter Pack",
            price: "R1,850",
            desc: "This is a clean, single-page foundational structure designed to establish your digital footprint, which you can easily build onto as your business scale expands."
          },
          {
            name: "Business Pack",
            price: "R2,750",
            desc: "Designed specifically for growing small businesses requiring dedicated service pages, custom trust anchors, and clear lead generation workflows."
          },
          {
            name: "CMS Business Pack",
            price: "R6,500",
            desc: "A powerful platform designed for larger operations requiring dynamic layout controls, unified content hubs, and automated backend inputs."
          }
        ]
      },
      {
        id: "WEB-ECOM-01",
        title: "E-Commerce Website",
        price: "Starting from R8,500",
        desc: "A fully unified online storefront optimized for South African payment gateways, featuring instant indexation architectures and highly responsive product layouts.",
        specs: "Product inventory taxonomy setup, payment portal integration including PayFast or Yoco, real-time inventory hooks, and conversion flow tuning",
        isPopular: true
      },
      {
        id: "WEB-LAND-01",
        title: "Landing Page",
        price: "Starting from R1,850",
        desc: "A high-performance single-page sales machine engineered for high-intent traffic conversions, featuring streamlined script sizing and rapid response times.",
        specs: "Campaign alignment, structural fast-loading configurations, clear semantic focus, and persuasive copy blocks aimed at target actions"
      },
      {
        id: "WEB-PORT-01",
        title: "Portfolio / Personal Website",
        price: "R3,450 once-off",
        desc: "Elegant digital showcase systems tailored for professional practitioners, consultants, and creative directors needing clean visibility across search indexes.",
        specs: "Visual media grids, quick inquiry routing, simple layout design, foundational schema setup, and responsive view verification"
      }
    ],
    faqs: [
      {
        q: "Will my website actually be found by Google when it launches?",
        a: "Yes. Every system we build incorporates exact JSON-LD microdata, proper directory structures, clean routing tables, and optimized loading signals from day one, ensuring immediate and clean platform crawlability."
      },
      {
        q: "Can AI tools like ChatGPT find and recommend my site?",
        a: "AI agents rely on clean, semantic, server-rendered structures to extract database signals. We explicitly configure your metadata, headers, and semantic blocks so LLM scrapers can index and attribute your services."
      }
    ]
  },
  {
    slug: "seo-ai-search",
    title: "SEO & AI Search",
    metaDesc: "Technical SEO, entity authority, and Generative/Answer Engine Optimisation for South African businesses.",
    h1: "Get Ranked on Google. Get Cited by AI.",
    quickAnswer: "Traditional SEO gets you found by Google. AI Search Optimisation gets you recommended by AI. We build for both, structuring content so it answers real customer questions in the exact format AI systems extract from.",
    iconName: "BrainCircuit",
    services: [
      {
        id: "SEO-AUD-01",
        title: "SEO & AI Visibility Audit",
        price: "R3,950 once-off",
        desc: "A comprehensive investigation analyzing index health, platform accessibility, schema structure, and present generative search visibility indices.",
        specs: "Complete data check, semantic audit, structural code diagnostic, live LLM query simulation across models, and a concrete action plan"
      },
      {
        id: "SEO-TECH-01",
        title: "Technical SEO Management",
        price: "R2,450/month",
        desc: "Sustained optimization covering core platform crawlability, search visibility, render path tuning, and clean indexing across major databases.",
        specs: "Continuous crawl tracking, loading speed tuning, code error corrections, site configuration updates, and regular schema maintenance scans"
      },
      {
        id: "SEO-ENT-01",
        title: "Entity Authority Building",
        price: "R3,450/month",
        desc: "We establish your business profile as a verified entity within reference architectures, securing cross-platform validation and data alignment.",
        specs: "Company mapping alignment, local profile corrections, metadata optimization, entity reference builds, and review generation tactics"
      },
      {
        id: "SEO-GEO-01",
        title: "GEO & AI Citation Optimisation",
        price: "R4,950/month",
        desc: "Targeted content structuring and metadata deployments optimized for citation extraction, structured Q&A indexing, and direct machine recommendations.",
        specs: "Retrieval-ready layouts, public schema injections, system catalog profiling, and active tracking across LLM platforms",
        isPopular: true
      }
    ],
    faqs: [
      {
        q: "What is the exact difference between SEO and GEO?",
        a: "SEO is designed to get your link index-ranked on search engine result pages. GEO is designed to get your direct factual data and specific brand name cited as a trustworthy answer inside AI conversational responses."
      },
      {
        q: "How do you measure AI visibility?",
        a: "We systematically query models like ChatGPT, Claude, and Gemini with standard user prompt vectors to monitor citation share, contextual sentiment, and direct recommendation frequency."
      }
    ]
  },
  {
    slug: "google-business-profile",
    title: "GBP Management",
    metaDesc: "Google Business Profile setup, verification, and ongoing management to win local searches and local trust signals.",
    h1: "Own Your 'Near Me' Search Results",
    quickAnswer: "Your Google Business Profile is one of the first places AI systems check to verify a business is real, active, and trustworthy. We keep it accurate, complete, and continuously updated.",
    iconName: "ShieldCheck",
    services: [
      {
        id: "GBP-ESSENTIAL",
        title: "Essential GBP Package",
        price: "R1,180/month",
        desc: "The foundational profile management structure for businesses wanting a clean, verified presence in local search listings and map packs.",
        features: [
          "2 optimized Google Business Profile update posts monthly",
          "2 keyword-targeted Q&A profile updates monthly",
          "A clean, direct inquiry landing page to capture map pack conversions",
          "Consistent verification of physical coordinates, operating hours, and location categories"
        ]
      },
      {
        id: "GBP-GROWTH",
        title: "Growth GBP Package",
        price: "R2,730/month",
        desc: "Designed for competitive local operations requiring active optimization, signal generation, and localized visibility amplification.",
        features: [
          "4 verified Google Business Profile updates monthly",
          "4 keyword-rich Q&A profile entries monthly",
          "Setup of automated review collection pipelines and share links",
          "2 customized local landing pages optimized for targeting adjacent suburbs",
          "Regular analysis of local search behavior and profile performance metrics"
        ],
        isPopular: true
      },
      {
        id: "GBP-PREMIUM",
        title: "Premium GBP Package",
        price: "R3,950/month",
        desc: "The ultimate local validation tier built to dominate search parameters across multiple geographic vectors and surrounding metros.",
        features: [
          "6 high-impact Business Profile update posts monthly",
          "6 highly relevant local Q&A profile updates monthly",
          "Advanced local landing pages targeting up to 3 distinct geographic service zones",
          "Active monitoring of local map pack changes, review sentiment audits, and ongoing image assets"
        ]
      }
    ],
    faqs: [
      {
        q: "Why does my Google Business Profile matter for AI visibility?",
        a: "Search algorithms and AI systems cross-reference location datasets against your domain directory to evaluate legitimacy. Mismatched location details or duplicate listings create conflict signals that cause AI systems to ignore your business."
      },
      {
        q: "How long does verification take?",
        a: "Verification varies depending on the specific method mandated by Google (video, phone, or postcard). Postcard methods generally take between one and two weeks in South Africa."
      }
    ]
  },
  {
    slug: "whatsapp-marketing",
    title: "WhatsApp Marketing",
    metaDesc: "Turn Facebook, Instagram, and Google ads into direct WhatsApp conversations with automated flow setups.",
    h1: "Turn Ad Clicks Into WhatsApp Conversations",
    quickAnswer: "We turn WhatsApp into an automated sales channel: one that responds instantly, qualifies leads, and keeps your business always on, even when your team is not.",
    iconName: "Smartphone",
    services: [
      {
        id: "WA-CAMP-01",
        title: "WhatsApp Ad Campaigns",
        price: "From R2,500/month",
        desc: "End-to-end setup and management of targeted ad structures sending high-intent traffic directly into a customized WhatsApp workspace.",
        specs: "Campaign configuration, profile matching, creation of targeted ad units, click-to-chat optimizations, and monthly metric tracking"
      },
      {
        id: "WA-BOT-01",
        title: "WhatsApp Bot Setup",
        price: "R4,950 once-off",
        desc: "Custom interactive flow bots built using the official Meta Cloud API to automatically welcome, verify, and filter user inquiries in real time.",
        specs: "API setup and registration, logical block configuration, automated answers, lead routing mechanics, and team notifications"
      },
      {
        id: "WA-MGT-01",
        title: "WhatsApp Marketing (Full Package)",
        price: "From R6,500/month",
        desc: "The complete, optimized ecosystem syncing ad investments directly with intelligent automation flows to maximize lead conversions.",
        specs: "Comprehensive ad optimization, continuous flow testing, catalog updates, detailed tracking dash, and manual handover configurations",
        isPopular: true
      }
    ],
    faqs: [
      {
        q: "How is this different from just adding a WhatsApp button to my website?",
        a: "A basic site button relies on traffic already reaching your domain. Our campaigns target active social users on their feeds, driving them directly into an automated chat workspace in one step."
      },
      {
        q: "Will a bot make my business feel impersonal?",
        a: "Not if it is built properly. Our flows quickly handle standard details, check lists, and basic FAQs, then smoothly pass complex or high-intent clients to a human agent when personal interaction is required."
      }
    ]
  },
  {
    slug: "automation-chatbots",
    title: "Automation & Chatbots",
    metaDesc: "Deploy intelligent, 24/7 AI agents and business automations that qualify leads and automate repetitive tasks.",
    h1: "Autonomous Business Systems & AI Chatbots",
    quickAnswer: "We deploy AI-powered digital receptionists that answer questions, qualify leads, and book appointments 24/7 across your website and messaging channels so you never miss an opportunity.",
    iconName: "Bot",
    services: [
      {
        id: "AUTO-CHAT-01",
        title: "Website AI Chatbot",
        price: "From R4,950 once-off",
        desc: "Bespoke semantic chatbot deployed directly on your website, trained on your custom documentation to resolve user questions instantly.",
        specs: "Document intake, custom system instruction config, layout integration, fallback logic parameters, and inquiry routing hooks"
      },
      {
        id: "AUTO-CRM-01",
        title: "CRM & Workflow Automation",
        price: "Custom Quote",
        desc: "We build automated pipelines that link your lead capture channels directly with your active database, CRM, and system triggers.",
        specs: "Multi-app integration, pipeline design, automated alerts, automated contract and invoice creation, and platform sync protocols",
        isPopular: true
      },
      {
        id: "AUTO-VOICE-01",
        title: "AI Voice Agents",
        price: "From R12,000 once-off",
        desc: "Next-generation vocal models customized to handle incoming calls, resolve queries, capture client details, and schedule appointments.",
        specs: "Voice profile configuration, call flow design, system database links, calendar synchronization, and live handoff setups"
      }
    ],
    faqs: [
      {
        q: "Will the AI hallucinate or make up facts about my business?",
        a: "No. Our automated agents use strict RAG parameter controls. They are securely locked to retrieve facts only from the specific reference library, pricing sheets, and system documents you authorize."
      },
      {
        q: "Does the automation integrate with my current CRM?",
        a: "Yes. We build robust API connections to sync data across HubSpot, Salesforce, Zoho, Monday, Slack, Google Workspace, and other typical corporate tools."
      }
    ]
  }
];

const iconMap: Record<string, LucideIcon> = {
  MessageSquareCode,
  Database,
  BrainCircuit,
  ShieldCheck,
  Smartphone,
  Bot,
};

// Absolute, crawlable URLs — real anchors (not just router state) so search
// engines and AI answer-engine crawlers can see and cite every service page.
const serviceUrls: Record<string, string> = {
  "digital-marketing": "https://www.happyhunterdigital.com/services/digital-marketing",
  "web-development": "https://www.happyhunterdigital.com/services/web-development",
  "seo-ai-search": "https://www.happyhunterdigital.com/services/seo-ai-search",
  "google-business-profile": "https://www.happyhunterdigital.com/services/google-business-profile",
  "whatsapp-marketing": "https://www.happyhunterdigital.com/services/whatsapp-marketing",
  "automation-chatbots": "https://www.happyhunterdigital.com/services/automation-chatbots",
};

const overview = {
  eyebrow: "System Overview",
  intro:
    "Happy Hunter Digital provides five core services for South African SMEs: Digital Marketing, Web Development, SEO & AI Search Optimisation, Google Business Profile Management, and WhatsApp Automation. Every service works toward one goal: making sure algorithms, search engines, and AI assistants can find, verify, and recommend your business.",
  whyTogether:
    "AI systems like ChatGPT, Gemini, and Google AI Overviews don't just crawl your website. They cross reference your business across your site, your Google Business Profile, and your customer communication channels. A gap in any one of these creates inconsistency, and inconsistency is what makes AI systems distrust or ignore a business. Our six services close every gap at once.",
  services: [
    {
      slug: "digital-marketing",
      title: "Digital Marketing",
      summary:
        "We build campaigns structured around what AI answer engines and search algorithms actually reward: consistency, clarity, and verifiable authority, not just ad spend.",
    },
    {
      slug: "web-development",
      title: "Web Development",
      summary:
        "We build AI ready websites, structured for AEO and AI SEO so AI assistants can read, understand, and cite your business, not just rank it in search results.",
    },
    {
      slug: "seo-ai-search",
      title: "SEO & AI Search Optimisation",
      summary:
        "Traditional SEO gets you found by Google. AI Search Optimisation gets you recommended by AI. We build for both, structuring content so it answers real customer questions in the exact format AI systems extract from.",
    },
    {
      slug: "google-business-profile",
      title: "GBP Management",
      summary:
        "Your Google Business Profile is one of the first places AI systems check to verify a business is real, active, and trustworthy. We keep it accurate, complete, and continuously updated.",
    },
    {
      slug: "whatsapp-marketing",
      title: "WhatsApp Automation",
      summary:
        "We turn WhatsApp into an automated sales channel that responds instantly, qualifies leads, and keeps your business always on, even when your team isn't.",
    },
    {
      slug: "automation-chatbots",
      title: "Automation & Chatbots",
      summary:
        "We deploy AI receptionists and workflow automations that qualify leads and answer questions 24/7, so no opportunity goes cold waiting for a reply.",
    },
  ],
  closing:
    "The result is a unified digital presence where your website, your search visibility, your Google listing, and your customer messaging all say the same thing. Instead of being a ghost to the algorithms, your business becomes the answer they give.",
};

/** Four-corner targeting brackets — the page's signature motif.
 *  A "Hunter" locks onto a target; every clickable panel gets locked
 *  into view the same way, brackets tightening in on hover/focus. */
function Reticle({ tone = "signal" }: { tone?: "signal" | "verify" }) {
  const color = tone === "signal" ? "#F5C518" : "#4DE8C8";
  const base =
    "pointer-events-none absolute h-4 w-4 border-white/15 transition-all duration-300 ease-out group-hover:h-5 group-hover:w-5";
  return (
    <>
      <span
        className={`${base} left-0 top-0 border-l-2 border-t-2 group-hover:border-[var(--tone)]`}
        style={{ ["--tone" as string]: color }}
      />
      <span
        className={`${base} right-0 top-0 border-r-2 border-t-2 group-hover:border-[var(--tone)]`}
        style={{ ["--tone" as string]: color }}
      />
      <span
        className={`${base} left-0 bottom-0 border-l-2 border-b-2 group-hover:border-[var(--tone)]`}
        style={{ ["--tone" as string]: color }}
      />
      <span
        className={`${base} right-0 bottom-0 border-r-2 border-b-2 group-hover:border-[var(--tone)]`}
        style={{ ["--tone" as string]: color }}
      />
    </>
  );
}

function channelCode(index: number) {
  return `CH-0${index + 1}`;
}

export function CoreServices() {
  const { category: activeSlug } = useParams<{ category?: string }>();
  const activeCategory = categories.find((c) => c.slug === activeSlug) ?? categories[0];
  const activeIndex = categories.findIndex((c) => c.slug === activeCategory.slug);

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  useEffect(() => {
    setOpenFaq(0);
  }, [activeCategory.slug]);

  // Built from the same data rendered on the page, so pricing/answers shown to
  // AI crawlers and search engines always match what a visitor actually sees.
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": activeCategory.title,
    "description": activeCategory.metaDesc,
    "provider": { "@type": "ProfessionalService", "name": "Happy Hunter Digital" },
    "areaServed": [
      { "@type": "City", "name": "Pretoria" },
      { "@type": "City", "name": "Johannesburg" },
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": activeCategory.title,
      "itemListElement": activeCategory.services.map((s) => ({
        "@type": "Offer",
        "itemOffered": { "@type": "Service", "name": s.title, "description": s.desc || activeCategory.metaDesc },
        "price": s.price,
        "priceCurrency": "ZAR",
      })),
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": activeCategory.faqs.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 md:px-8 pb-24">
      <PageMeta
        title={`${activeCategory.title} | Happy Hunter Digital`}
        description={activeCategory.metaDesc}
        path={activeSlug ? `/services/${activeSlug}` : '/services'}
        jsonLd={[serviceSchema, faqSchema]}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');
        .hh-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .hh-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        @keyframes hh-scan {
          0% { transform: translateY(-100%); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .hh-scanline { animation: hh-scan 2.4s ease-in-out infinite; }
        .hh-grid-bg {
          background-image:
            linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 34px 34px;
        }
      `}</style>

      {/* ============ OVERVIEW / SYSTEM MAP ============ */}
      <section className="mb-20 pt-4">
        <div className="max-w-3xl">
          <div className="hh-mono flex items-center gap-2 text-[11px] tracking-[0.25em] text-[#4DE8C8] mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4DE8C8] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4DE8C8]" />
            </span>
            {overview.eyebrow.toUpperCase()}
          </div>
          <h2 className="hh-display text-3xl md:text-4xl font-bold mb-5 leading-tight">
            Six Channels. One Verified Signal.
          </h2>
          <p className="text-white/70 mb-4 leading-relaxed">{overview.intro}</p>
          <p className="text-white/55 mb-10 leading-relaxed">{overview.whyTogether}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {overview.services.map((s, i) => {
            const isActive = s.slug === activeCategory.slug;
            return (
              <a
                key={s.slug}
                href={serviceUrls[s.slug]}
                className={`group relative block rounded-lg border p-5 transition-colors duration-300 overflow-hidden ${
                  isActive
                    ? "border-yellow-500/60 bg-yellow-500/[0.06]"
                    : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
              >
                <Reticle tone="signal" />
                <div className="flex items-start justify-between mb-3">
                  <span className="hh-mono text-[10px] tracking-widest text-white/35">
                    {channelCode(i)}
                  </span>
                  <span className="hh-mono flex items-center gap-1.5 text-[10px] tracking-widest text-white/30 group-hover:text-[#4DE8C8] transition-colors">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/30 group-hover:bg-[#4DE8C8] transition-colors" />
                    ACTIVE
                  </span>
                </div>
                <h3 className="hh-display font-semibold mb-1.5 text-[15px]">{s.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed mb-3">{s.summary}</p>
                <span className="hh-mono inline-flex items-center gap-1.5 text-[11px] tracking-wide text-yellow-500/90 group-hover:gap-2.5 transition-all">
                  VIEW CHANNEL <ArrowRight className="w-3 h-3" />
                </span>
              </a>
            );
          })}
        </div>

        <div className="max-w-3xl border-l-2 border-yellow-500/60 pl-5">
          <p className="text-white/85 font-medium leading-relaxed">{overview.closing}</p>
        </div>
      </section>

      {/* ============ CATEGORY NAV ============ */}
      <nav className="mb-14 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto">
        <div className="flex gap-2 w-max md:w-auto md:flex-wrap">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.iconName] ?? Database;
            const isActive = cat.slug === activeCategory.slug;
            return (
              <Link
                key={cat.slug}
                to={`/services/${cat.slug}`}
                className={`group relative flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-md border text-sm transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? "bg-yellow-500 text-black border-yellow-500 font-medium"
                    : "border-white/12 text-white/65 hover:border-white/30 hover:text-white"
                }`}
              >
                <span className={`hh-mono text-[10px] tracking-wider ${isActive ? "text-black/50" : "text-white/30"}`}>
                  {channelCode(i)}
                </span>
                <Icon className="w-4 h-4" />
                {cat.title}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <header className="relative mb-14 max-w-3xl">
        <div className="hh-mono flex items-center gap-2 text-[11px] tracking-[0.25em] text-yellow-500/80 mb-4">
          {channelCode(activeIndex)} // {activeCategory.title.toUpperCase()}
        </div>
        <h1 className="hh-display text-3xl md:text-5xl font-bold mb-5 leading-[1.08]">
          {activeCategory.h1}
        </h1>
        {activeCategory.subheadline && (
          <p className="text-lg text-white/70 mb-5 leading-relaxed">{activeCategory.subheadline}</p>
        )}
        <div className="relative flex gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <span className="hh-mono shrink-0 text-[#4DE8C8] text-sm mt-0.5">&gt;</span>
          <p className="text-white/70 text-sm leading-relaxed">{activeCategory.quickAnswer}</p>
        </div>
      </header>

      {/* ============ SERVICES GRID ============ */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {activeCategory.services.map((service) => (
          <div
            key={service.id}
            className={`group relative rounded-xl border p-6 flex flex-col overflow-hidden ${
              service.isPopular
                ? "border-yellow-500/70 bg-yellow-500/[0.05]"
                : "border-white/10 bg-white/[0.02] hover:border-white/20"
            } transition-colors duration-300`}
          >
            <Reticle tone={service.isPopular ? "signal" : "verify"} />

            {service.isPopular && (
              <span className="hh-mono absolute -top-px -right-px rounded-bl-lg rounded-tr-xl bg-yellow-500 text-black text-[10px] font-semibold tracking-wider px-3 py-1.5">
                MOST POPULAR
              </span>
            )}

            <span className="hh-mono text-[10px] tracking-widest text-white/30 mb-3">
              {service.id}
            </span>

            <h3 className="hh-display text-lg font-semibold mb-2 leading-snug">{service.title}</h3>
            <p className="hh-mono text-yellow-500 font-semibold mb-3 text-[15px]">{service.price}</p>

            {service.desc && (
              <p className="text-white/60 text-sm leading-relaxed mb-4">{service.desc}</p>
            )}
            {service.specs && (
              <p className="hh-mono text-white/35 text-[11px] leading-relaxed mb-4 border-t border-white/10 pt-3">
                {service.specs}
              </p>
            )}

            {service.features && (
              <ul className="space-y-2.5 mb-4">
                {service.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                    <Check className="w-4 h-4 text-[#4DE8C8] mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            )}

            {service.packages && (
              <div className="space-y-3 mb-4">
                {service.packages.map((pkg, i) => (
                  <div key={i} className="rounded-lg border border-white/10 p-3 hover:border-white/20 transition-colors">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-medium text-sm">{pkg.name}</span>
                      <span className="hh-mono text-yellow-500 text-sm font-semibold">
                        {pkg.price}
                      </span>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">{pkg.desc}</p>
                  </div>
                ))}
              </div>
            )}

            <Link
              to="/audit"
              className="mt-auto inline-flex items-center justify-center gap-2 bg-yellow-500 text-black font-semibold rounded-md px-5 py-2.5 hover:bg-yellow-400 transition-colors"
            >
              {service.buttonText ?? "Get Started"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>

      {/* ============ FAQ ============ */}
      <section className="max-w-3xl">
        <div className="hh-mono flex items-center gap-2 text-[11px] tracking-[0.25em] text-white/35 mb-4">
          FAQ // {channelCode(activeIndex)}
        </div>
        <h2 className="hh-display text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {activeCategory.faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className={`rounded-lg border transition-colors duration-300 ${
                  isOpen ? "border-yellow-500/40 bg-yellow-500/[0.03]" : "border-white/10"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/60 rounded-lg"
                >
                  <span className="font-semibold text-[15px]">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-white/50 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-white/60 text-sm leading-relaxed px-5 pb-4">{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
