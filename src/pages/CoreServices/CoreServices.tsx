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
    title: "Content & Social Media",
    metaDesc: "Content marketing, social media management, and campaigns that bring real customers. Built on results, priced transparently for SA businesses.",
    h1: "Content & Social Media That Brings Real Customers",
    quickAnswer: "We create content and posts that attract your actual customers — not just likes and impressions. We focus on real people in South Africa who need what you offer.",
    iconName: "MessageSquareCode",
    services: [
      {
        id: "DM-SOC-01",
        title: "Social Media Starter",
        desc: "Regular posts and community management on Facebook and Instagram. Designed to grow followers who actually match your customer profile.",
        price: "R1,500/month",
        specs: "8 posts or reels per month, page setup, monitoring, response, and monthly reporting. 3-month minimum."
      },
      {
        id: "DM-SOC-02",
        title: "Social Media Growth",
        price: "R2,800/month",
        desc: "More content across Facebook, Instagram, and TikTok with targeted ads that turn engagement into real leads.",
        specs: "12 posts or reels per month, ad retargeting setup, profile monitoring, audience response, and monthly reports",
        isPopular: true
      },
      {
        id: "DM-CON-01",
        title: "Content That Answers Questions",
        price: "R3,500/month",
        desc: "Blog posts and articles written to answer the exact questions your customers ask — so Google and AI tools like ChatGPT recommend you when people search.",
        specs: "4 in-depth articles per month, keyword research, topic grouping, and on-page SEO setup"
      },
      {
        id: "DM-ADS-01",
        title: "Google & Social Media Ads",
        price: "From R2,500/month",
        desc: "Targeted ads on Google and Meta (Facebook/Instagram) designed to bring in real leads, not just clicks. We focus on clear, trackable results.",
        specs: "Ad account setup, audience targeting, continuous ad testing, and performance reports"
      },
      {
        id: "DM-EML-01",
        title: "Email Marketing",
        price: "R1,950/month",
        desc: "Automated email sequences that turn website visitors into repeat customers. Messages that actually get read and acted on.",
        specs: "Email platform setup, 4 campaigns per month, customer list segmentation, copywriting, and tracking"
      }
    ],
    faqs: [
      {
        q: "Do I need social media and SEO, or just one?",
        a: "They work best together. Social media builds relationships and shows you're active. SEO and well-structured articles help you get found when customers search online. We recommend both, but you can start with whichever is most important for your business."
      },
      {
        q: "Is there a minimum contract period?",
        a: "Digital marketing services have a 3-month minimum. This gives us enough time to see what works, make adjustments, and show you real results."
      }
    ]
  },
  {
    slug: "web-development",
    title: "Websites",
    metaDesc: "Business websites and online stores built fast and mobile-friendly for South African SMEs. Built so Google and AI can find and recommend them.",
    h1: "Your Website Is Your 24/7 Salesperson",
    subheadline: "We build fast, mobile-friendly websites that rank higher on Google and get found by AI tools like ChatGPT and Gemini. Not just pretty designs — websites built to bring you customers.",
    quickAnswer: "A website that loads fast, works on phones, and gets found by Google and ChatGPT. We build websites that actually bring you customers.",
    iconName: "Database",
    services: [
      {
        id: "WEB-BUS-01",
        title: "Business Website",
        price: "R1,850",
        desc: "A fast, mobile-friendly website built for your business. Clear, easy to navigate, and structured so Google and AI tools can understand what you do.",
        specs: "Choose a package below. For complex requirements, contact us directly.",
        packages: [
          {
            name: "1 Page Starter",
            price: "R1,850",
            desc: "A clean, single-page website to establish your online presence. Easy to upgrade as your business grows."
          },
          {
            name: "Business Pack",
            price: "R2,750",
            desc: "Perfect for growing businesses. Includes dedicated service pages, clear contact info, and lead capture forms."
          },
          {
            name: "CMS Business",
            price: "R6,500",
            desc: "A powerful website with a content management system. Update your own pages, manage blog posts, and handle backend tasks yourself."
          }
        ]
      },
      {
        id: "WEB-ECOM-01",
        title: "Online Store",
        price: "Starting from R8,500",
        desc: "A complete online shop that works with South African payment systems. Built so customers can easily browse and buy, and Google can find your products.",
        specs: "Product catalog setup, payment integration (PayFast or Yoco), inventory management, and sales optimization"
      },
      {
        id: "WEB-LAND-01",
        title: "Landing Page",
        price: "Starting from R1,850",
        desc: "A single, high-impact page designed to turn visitors into leads. Fast loading, clear message, focused call-to-action.",
        specs: "Campaign alignment, fast loading, clear structure, and conversion-focused copy"
      },
      {
        id: "WEB-PORT-01",
        title: "Portfolio / Professional Website",
        price: "R3,450 once-off",
        desc: "A professional website for consultants, practitioners, and creative professionals. Clean, visible, and easy for potential clients to contact you.",
        specs: "Media showcase, contact forms, basic SEO setup, and mobile optimization"
      }
    ],
    faqs: [
      {
        q: "Will my website actually be found by Google when it launches?",
        a: "Yes. Every website we build includes proper SEO setup from day one — correct page titles, descriptions, and structured data that Google can read and index."
      },
      {
        q: "Can AI tools like ChatGPT find and recommend my site?",
        a: "AI tools read websites differently than humans. We set up your website's code so that ChatGPT, Gemini, and other AI assistants can understand what you do and recommend you when customers ask."
      }
    ]
  },
  {
    slug: "seo-ai-search",
    title: "SEO & AI Visibility",
    metaDesc: "Technical SEO and Google Business Profile management to get your business found on Google and recommended by AI.",
    h1: "Get Found on Google. Get Recommended by AI.",
    quickAnswer: "SEO helps you rank higher on Google. AI Search Optimization helps you get recommended by ChatGPT and Gemini. We do both — so you get found everywhere your customers are looking.",
    iconName: "BrainCircuit",
    services: [
      {
        id: "SEO-AUD-01",
        title: "SEO & AI Visibility Check",
        price: "R3,950 once-off",
        desc: "A thorough check of why customers can't find your business online. We look at your website, your Google listing, and where you're missing opportunities to show up in search and AI answers.",
        specs: "Complete website check, technical review, live AI search simulation, and a clear action plan"
      },
      {
        id: "SEO-TECH-01",
        title: "Technical SEO Management",
        price: "R2,450/month",
        desc: "Ongoing work to keep your website healthy and findable on Google. We fix issues, improve speed, and keep everything running smoothly.",
        specs: "Regular site monitoring, speed optimization, error fixes, and monthly reports"
      },
      {
        id: "SEO-ENT-01",
        title: "Google Business Profile Management",
        price: "R3,450/month",
        desc: "We make sure your business shows up accurately everywhere online — Google Maps, directories, and review sites — so customers can always find your correct details.",
        specs: "Business listing setup and management, local keyword targeting, review collection, and accuracy monitoring"
      },
      {
        id: "SEO-GEO-01",
        title: "AI Answers Optimization",
        price: "R4,950/month",
        desc: "We write and structure your content so that when someone asks ChatGPT, Gemini, or Perplexity a question about your service, your business is the answer they get.",
        specs: "AI-optimized content creation, structured FAQ pages, monitoring across AI tools, and monthly reporting",
        isPopular: true
      }
    ],
    faqs: [
      {
        q: "What's the difference between SEO and optimizing for AI?",
        a: "SEO helps you appear in Google search results with links. Optimizing for AI helps you get directly recommended by ChatGPT, Gemini, and Perplexity when customers ask questions. We do both."
      },
      {
        q: "How do you measure success with AI visibility?",
        a: "We regularly ask AI tools (like ChatGPT and Gemini) questions about your industry and check whether and how your business comes up. We track how often you're mentioned and recommended."
      }
    ]
  },
  {
    slug: "google-business-profile",
    title: "Google Business Profile",
    metaDesc: "Google Business Profile setup, verification, and management to win local searches and map pack results.",
    h1: "Own Your Local Search Results",
    quickAnswer: "Your Google Business Profile is one of the main places customers check before deciding to visit. We make sure it's complete, accurate, and shows up when local customers search for you.",
    iconName: "ShieldCheck",
    services: [
      {
        id: "GBP-ESSENTIAL",
        title: "Essential Google Business Package",
        price: "R1,180/month",
        desc: "Complete management of your Google Business Profile to ensure you show up in local search and on Google Maps.",
        features: [
          "2 monthly Google post updates",
          "2 keyword-targeted Q&A responses monthly",
          "A clear contact page to convert map views to calls",
          "Consistent business name, address, phone number across all platforms"
        ]
      },
      {
        id: "GBP-GROWTH",
        title: "Growth Google Business Package",
        price: "R2,730/month",
        desc: "For competitive local businesses that need active management and local search optimization.",
        features: [
          "4 monthly Google post updates",
          "4 keyword-rich Q&A responses monthly",
          "Automated review collection system",
          "2 local landing pages for nearby suburbs",
          "Monthly local search performance reporting"
        ],
        isPopular: true
      },
      {
        id: "GBP-PREMIUM",
        title: "Premium Google Business Package",
        price: "R3,950/month",
        desc: "Complete local search domination across multiple areas and suburbs.",
        features: [
          "6 monthly Google post updates",
          "6 highly relevant Q&A responses monthly",
          "Advanced local landing pages for up to 3 service areas",
          "Local map pack monitoring, review tracking, and image updates"
        ]
      }
    ],
    faqs: [
      {
        q: "Why does my Google Business Profile matter for online visibility?",
        a: "When people search for what you do on Google Maps or in local search, your Google Business Profile is often the first thing they see. Google cross-checks this information with your website to decide if you're trustworthy. Inaccurate or inconsistent details cause Google to show your competitors instead."
      },
      {
        q: "How long does verification take?",
        a: "Verification depends on Google's method (video, phone, or postcard). Postcard verification typically takes 1-2 weeks in South Africa."
      }
    ]
  },
  {
    slug: "whatsapp-marketing",
    title: "WhatsApp Marketing",
    metaDesc: "Turn your Facebook, Instagram, and Google ads into direct WhatsApp conversations with automated flow setups.",
    h1: "Turn Clicks Into WhatsApp Conversations",
    quickAnswer: "We turn WhatsApp into an automated sales channel — one that responds instantly, qualifies leads, and keeps your business always on, even when your team isn't.",
    iconName: "Smartphone",
    services: [
      {
        id: "WA-CAMP-01",
        title: "WhatsApp Ad Campaigns",
        price: "From R2,500/month",
        desc: "Setup and management of targeted ad campaigns that send interested customers directly into your WhatsApp for instant conversation.",
        specs: "Campaign setup, target audience matching, ad creative creation, click-to-WhatsApp optimization, and monthly tracking"
      },
      {
        id: "WA-BOT-01",
        title: "WhatsApp Bot Setup",
        price: "R4,950 once-off",
        desc: "Custom automated chat flows built on the official Meta Cloud API. Answers FAQs, qualifies leads, and routes to your team automatically.",
        specs: "API setup, conversation flow design, automated responses, lead routing, and team notifications"
      },
      {
        id: "WA-MGT-01",
        title: "WhatsApp Marketing (Full Package)",
        price: "From R6,500/month",
        desc: "Complete WhatsApp sales system including ads, automation, product catalogs, and tracking — all working together to bring in more sales.",
        specs: "Full ad management, continuous flow optimization, catalog updates, tracking dashboard, and manual handover setup",
        isPopular: true
      }
    ],
    faqs: [
      {
        q: "How is this different from just adding a WhatsApp button to my website?",
        a: "A website button only works if customers already visit your site. Our WhatsApp campaigns actively find your customers on Facebook and Instagram, then send them straight to a WhatsApp conversation with you."
      },
      {
        q: "Will a bot make my business feel impersonal?",
        a: "Not if it's built well. Our bots handle common questions and basic details first, then smoothly pass more complex inquiries to a human. The customer gets fast answers, and you only step in when it matters."
      }
    ]
  },
  {
    slug: "automation-chatbots",
    title: "AI Chatbots & Automation",
    metaDesc: "Deploy AI chatbots and automation that answer questions, qualify leads, and book appointments 24/7 for your business.",
    h1: "24/7 AI Receptionists & Sales Automation",
    quickAnswer: "We deploy AI-powered chatbots and automation that answer customer questions, qualify leads, and book appointments 24/7 — so you never miss an opportunity, even when you're not at your desk.",
    iconName: "Bot",
    services: [
      {
        id: "AUTO-CHAT-01",
        title: "Website Chatbot",
        price: "From R4,950 once-off",
        desc: "An AI chatbot placed on your website, trained on your business information to answer customer questions instantly, 24 hours a day.",
        specs: "Training data setup, custom conversation design, website integration, fallback to human support, and notification setup"
      },
      {
        id: "AUTO-CRM-01",
        title: "CRM & Sales Automation",
        price: "Custom Quote",
        desc: "We connect your lead capture tools directly to your CRM and sales processes, automating follow-ups and appointment booking.",
        specs: "Integration with 3rd-party apps, sales pipeline setup, automated follow-ups, contract/invoice automation, and sync protocols"
      },
      {
        id: "AUTO-VOICE-01",
        title: "AI Voice Agents",
        price: "From R12,000 once-off",
        desc: "AI phone agents that handle incoming calls, answer questions, capture caller details, and schedule appointments automatically.",
        specs: "Voice setup, call flow design, system integrations, calendar sync, and live handoff to human agents"
      }
    ],
    faqs: [
      {
        q: "Will the AI make up facts about my business?",
        a: "No. Our AI agents are locked to pull information only from the materials you provide — your service descriptions, pricing, and FAQs. They cannot answer questions they don't have the right information for."
      },
      {
        q: "Does the automation integrate with my current CRM?",
        a: "Yes. We build connections to HubSpot, Salesforce, Zoho, Monday.com, Slack, Google Workspace, and other common business tools to sync your data automatically."
      }
    ]
  }
];

const overview = {
  eyebrow: "Our Services",
  intro:
    "Happy Hunter Digital offers six core services for South African SMEs: Content & Social Media, Websites, SEO & AI Visibility, Google Business Profile Management, WhatsApp Marketing, and AI Chatbots & Automation. Every service works toward one goal: making sure Google, AI assistants, and your next customer can find, trust, and choose your business.",
  whyTogether:
    "AI tools like ChatGPT, Gemini, and Google AI Overviews don't just look at your website. They check your Google Business Profile, your online reviews, and your overall consistency. If your business info is wrong or inconsistent anywhere, AI and search may ignore you. We fix everything at once.",
  services: [
    {
      slug: "digital-marketing",
      title: "Content & Social Media",
      summary:
        "We create content and social media posts that attract real customers — not just likes. We focus on real people who need what you offer.",
    },
    {
      slug: "web-development",
      title: "Websites",
      summary:
        "We build fast, mobile-friendly websites that rank on Google and get recommended by ChatGPT and Gemini. Websites that bring you customers, not just visitors.",
    },
    {
      slug: "seo-ai-search",
      title: "SEO & AI Visibility",
      summary:
        "SEO helps you rank on Google. AI visibility helps you get recommended by ChatGPT and Gemini. We do both — so you get found everywhere your customers look.",
    },
    {
      slug: "google-business-profile",
      title: "Google Business Profile",
      summary:
        "Your Google Business Profile is often the first thing customers check. We make sure it's complete, accurate, and shows up when local customers search for you.",
    },
    {
      slug: "whatsapp-marketing",
      title: "WhatsApp Marketing",
      summary:
        "We turn WhatsApp into an automated sales channel that responds instantly and qualifies leads, so you stay on even when your team isn't.",
    },
    {
      slug: "automation-chatbots",
      title: "AI Chatbots & Automation",
      summary:
        "We deploy AI chatbots that answer questions and book appointments 24/7, so you never miss an opportunity — even when you're not at your desk.",
    },
  ],
  closing:
    "The result is a unified online presence where your website, your search visibility, your Google listing, and your customer messages all work together. Instead of being invisible to algorithms, your business becomes the answer your customers get.",
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

const iconMap: Record<string, LucideIcon> = {
  MessageSquareCode,
  Database,
  BrainCircuit,
  ShieldCheck,
  Smartphone,
  Bot,
};

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
             Six Services. One Goal: Get You Found.
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
            SERVICE 0{i+1}
          </span>
                  <span className="hh-mono flex items-center gap-1.5 text-[10px] tracking-widest text-white/30 group-hover:text-[#4DE8C8] transition-colors">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/30 group-hover:bg-[#4DE8C8] transition-colors" />
                    ACTIVE
                  </span>
                </div>
                <h3 className="hh-display font-semibold mb-1.5 text-[15px]">{s.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed mb-3">{s.summary}</p>
                <span className="hh-mono inline-flex items-center gap-1.5 text-[11px] tracking-wide text-yellow-500/90 group-hover:gap-2.5 transition-all">
                  VIEW SERVICE <ArrowRight className="w-3 h-3" />
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
            <span className="hh-mono shrink-0 text-[#4DE8C8] text-sm mt-0.5">GOOD TO KNOW</span>
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
