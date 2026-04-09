export const SERVICES_DATA = [
  {
    phase: 1, title: "Essential (The Trust Anchor)", iconType: "ShieldCheck",
    description: "For micro-businesses and local service providers needing foundational AI visibility and a verified digital footprint.",
    tiers: [
      { 
        subtitle: "Target: <R5M Revenue", title: "The Foundation", priceStart: "R9,950 / month", 
        target: "Micro-businesses & Solopreneurs", 
        description: "Your baseline algorithmic trust and verified digital passport.",
        features: ["3-5 page SSR website", "LocalBusiness Schema & JSON-LD", "Google Business Profile Optimisation", "Q&A Seeding (10/mo)", "2x SEO Blog Articles", "Basic WhatsApp API Setup", "Email Marketing (Up to 5k)"],
        isPopular: false
      }
    ]
  },
  {
    phase: 2, title: "Comprehensive (The AI Megaphone)", iconType: "Database",
    description: "For growing SMEs and professional services requiring a full AI marketing engine to dominate generative search.",
    tiers: [
      { 
        subtitle: "Target: R5M-R50M Revenue", title: "The Growth Hub", priceStart: "R19,950 / month", 
        target: "Growing SMEs & Hospitality", 
        description: "Advanced Answer Engine Optimization (AEO) and workflow automation.",
        features: ["5-10 page SSR website", "Full JSON-LD mesh", "Advanced AEO/GEO Content", "4x SEO/AEO Articles + 1x Thought Leadership", "3 Automated WhatsApp Flows", "Live AI Chat Widget", "Lifecycle Email Automation"],
        isPopular: true
      }
    ]
  },
  {
    phase: 3, title: "Premium (The Revenue Brain)", iconType: "BrainCircuit",
    description: "Tailored for established brands and enterprise clients seeking an autonomous AI revenue system.",
    tiers: [
      { 
        subtitle: "Target: R50M+ Revenue", title: "The Enterprise Engine", priceStart: "R39,950 / month", 
        target: "Enterprise & Franchises", 
        description: "Total digital dominance through intelligent automation.",
        features: ["Deep build (10-20 pages)", "Cross-platform AI citation dominance", "Predictive Analytics & Churn Forecasting", "8x Articles + 2x Whitepapers", "AI NLP WhatsApp Bot", "AI Voice Agents"],
        isPopular: false
      }
    ]
  }
];

export const STANDALONE_SERVICES = [
  { title: "AI Visibility Audit", price: "R3,950", desc: "Full digital entity scan, AI citation analysis, and schema gap identification." },
  { title: "GBP Setup & Verification", price: "R2,950", desc: "Google Business Profile creation, verification, optimization, and initial Q&A seeding." },
  { title: "Entity Architecture Starter", price: "R9,950", desc: "High-performance 1-3 page SSR site with injected LocalBusiness Schema." },
  { title: "WhatsApp API Setup", price: "R7,950", desc: "Official Meta API integration, verification, and 1 basic automated flow." },
  { title: "Direct Booking Engine", price: "R4,950", desc: "PMS integration and direct booking interface to bypass OTA commissions." },
  { title: "Interactive Lead Magnet", price: "R9,950", desc: "Custom calculator, quiz, or diagnostic assessment tool." },
  { title: "Custom GPT Setup", price: "R14,950", desc: "Branded AI assistant trained on your proprietary data for lead acquisition." }
];

export const GROWTH_SERVICES = [
  { title: "GBP Optimization Starter", price: "R1,950 / mo", desc: "Weekly GBP posts, review management, Q&A seeding (5/mo), and photo updates." },
  { title: "GBP Optimization Pro", price: "R3,950 / mo", desc: "Daily GBP posts, review management, Q&A seeding (15/mo), and competitor tracking." },
  { title: "AEO/GEO Starter", price: "R5,950 / mo", desc: "5 AEO articles, GBP Q&A seeding, and monthly citation reports." },
  { title: "WhatsApp Commerce Pro", price: "R5,950 / mo", desc: "3 advanced flows, catalog management, and AI intent routing." },
  { title: "AI Voice Agent", price: "R9,950 / mo", desc: "Automated phone receptionist with booking and calendar integration." },
  { title: "Content Pro Pack", price: "R9,950 / mo", desc: "4 SEO articles, 1 technical piece, and 1 thought leadership piece per month." },
  { title: "Dynamic Pricing AI", price: "R14,950 / mo", desc: "AI-driven rate management and demand forecasting." }
];
