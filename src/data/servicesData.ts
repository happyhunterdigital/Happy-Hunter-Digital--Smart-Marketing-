export const SERVICES_DATA = [
  {
    phase: 1, title: "AI-Ready Websites", iconType: "Database",
    description: "Stop losing customers to outdated websites. We build lightning-fast, modern platforms that Google and AI assistants love to recommend.",
    tiers: [
      { subtitle: "Essential", title: "The Market Entry", priceStart: "R3,950 - R6,500", target: "Startups & Solo-preneurs.", description: "The last basic website you will ever need to buy.", features: ["1-3 Professional Pages", "Ultra-Fast Loading Speeds", "AI Search Discoverable", "WhatsApp Chat Button"] },
      { subtitle: "Comprehensive", title: "The Growth Hub", priceStart: "R12,500 - R18,500", target: "Growing businesses.", description: "Turn your website into an autonomous revenue employee.", features: ["5-10 Pages + Blog", "Full AI Search Optimization", "Smart Lead Capture Tools", "Automated WhatsApp Follow-ups"], isPopular: true },
      { subtitle: "Premium", title: "The Enterprise Engine", priceStart: "R35,000 - R55,000+", target: "Established brands.", description: "Total digital dominance through intelligent automation.", features: ["Unlimited Custom Pages", "Omnichannel AI Sync", "Predictive Customer Analytics", "Dedicated Account Manager"] }
    ]
  },
  {
    phase: 2, title: "24/7 Digital Receptionists", iconType: "Mic",
    description: "Never let a customer wait. Our AI agents answer questions, qualify leads, and book appointments around the clock.",
    tiers: [
      { subtitle: "Starter", title: "Basic Web Chat", priceStart: "R450", period: "Starting From", target: "Small teams.", description: "Instantly route customer questions to the right answers.", features: ["Smart FAQ Handling", "Ticket Routing", "Easy Website Integration"] },
      { subtitle: "Business", title: "Smart Sales Chatbots", priceStart: "R1,800", period: "Starting From", target: "High-traffic sites.", description: "AI that talks to your customers like a real sales rep.", features: ["AI-Powered Responses", "Instant Lead Qualification", "Automated Calendar Booking"], isPopular: true },
      { subtitle: "Enterprise", title: "Omnichannel Support", priceStart: "R15,000+", period: "Starting From", target: "Large operations.", description: "A unified AI team handling your Website, WhatsApp, and Socials.", features: ["Web + WhatsApp + Social", "Phone Receptionist Included", "Advanced Reporting Dashboard"] }
    ]
  },
  {
    phase: 3, title: "Automated WhatsApp Sales", iconType: "MessageSquareCode",
    description: "Turn the app your customers already use every day into your most powerful and frictionless sales channel.",
    tiers: [
      { subtitle: "Essential", title: "Automated Setup", priceStart: "R4,500", period: "Starting From", target: "Local businesses.", description: "Get your business officially verified on the WhatsApp API.", features: ["Official API Integration", "Basic Auto-Replies", "Secure Lead Capture"] },
      { subtitle: "Comprehensive", title: "Interactive Catalogs", priceStart: "R12,500", period: "Starting From", target: "E-commerce & Retail.", description: "Let customers browse and select products directly in chat.", features: ["Native WhatsApp Catalogs", "Interactive Menu Forms", "Automated Nurturing Flows"], isPopular: true },
      { subtitle: "Premium", title: "In-Chat Payments", priceStart: "R35,000+", period: "Starting From", target: "High-volume sellers.", description: "Complete the entire transaction without leaving WhatsApp.", features: ["Direct Payment Gateways", "Advanced AI Sales Bots", "Frictionless Checkout Experience"] }
    ]
  },
  {
    phase: 4, title: "Expert Authority Content", iconType: "FileText",
    description: "High-quality, expertly crafted content that proves your absolute industry authority to both human readers and AI algorithms.",
    tiers: [
      { subtitle: "Essential", title: "High-Ranking Articles", priceStart: "From R1.50", period: "Starting From / word", target: "Brands needing visibility.", description: "Well-researched blog posts designed to capture search traffic.", features: ["Search Engine Optimization", "Human-Led Editing", "Deep Industry Research"] },
      { subtitle: "Comprehensive", title: "Automated Email Marketing", priceStart: "R4,500", period: "Starting From", target: "Sales teams.", description: "Smart email sequences that nurture leads into paying customers.", features: ["Welcome Sequences", "Abandoned Cart Recovery", "Conversion Copywriting"], isPopular: true },
      { subtitle: "Premium", title: "Strategic Whitepapers", priceStart: "R12,500+", period: "Starting From", target: "B2B & Enterprise.", description: "Deep-dive technical content that establishes ultimate authority.", features: ["Expert Authorship", "High-Level Strategy", "Custom Lead Magnet Design"] }
    ]
  },
  {
    phase: 5, title: "Direct Booking Engines", iconType: "CalendarCheck",
    description: "Bypass expensive third-party platforms. Take direct bookings, manage your calendar, and keep 100% of your revenue.",
    tiers: [
      { subtitle: "Essential", title: "Booking Integration", priceStart: "R950", period: "Starting From", target: "Single locations.", description: "Seamlessly connect your website to your booking management system.", features: ["Property System Sync", "Direct Website Bookings", "Zero Commission Fees"] },
      { subtitle: "Comprehensive", title: "Channel Manager", priceStart: "R1,500+", period: "Starting From", target: "Multi-platform hosts.", description: "Sync your availability perfectly across Airbnb, Booking.com, and your site.", features: ["Cross-Platform Sync", "Double-Booking Prevention", "Centralized Dashboard"], isPopular: true },
      { subtitle: "Premium", title: "Dynamic Pricing AI", priceStart: "R12,980+", period: "Starting From", target: "Large operators.", description: "Automatically adjust your rates based on market demand to maximize profit.", features: ["Demand-Based Rates", "Revenue Maximization", "Custom Pricing Rules"] }
    ]
  }
];

export const MASTER_TIERS = [
  {
    phase: "0", title: "2026 Master Retainers", iconType: "ShieldCheck",
    description: "The complete, holistic Answer Engine Optimization (AEO) and Entity Architecture ecosystems.",
    tiers: [
      { subtitle: "The Trust Anchor", title: "Tier 1: Essential", priceStart: "R9,950", period: "Starting From", target: "Businesses <R5M Revenue", description: "Foundational AI visibility and a verified digital footprint.", features: ["3-5 page SSR website", "Google Business Profile Optimization", "2x SEO Blog Articles/mo", "Basic WhatsApp API Setup", "Basic Email Sequence (5k contacts)"] },
      { subtitle: "The AI Megaphone", title: "Tier 2: Comprehensive", priceStart: "R19,950", period: "Starting From", target: "Businesses R5M-R50M Revenue", description: "A full AI marketing engine to dominate generative search.", features: ["5-10 page SSR website + JSON-LD", "AEO/GEO Advanced Citation", "4x SEO Articles + 1x Whitepaper/mo", "3 WhatsApp Automated Flows", "AI Live Chat Widget"], isPopular: true },
      { subtitle: "The Revenue Brain", title: "Tier 3: Premium", priceStart: "R39,950", period: "Starting From", target: "Businesses R50M+ Revenue", description: "An autonomous AI revenue system for established brands.", features: ["10-20 page Deep Build", "Cross-platform AI Citation Dominance", "8x Articles + 2x Whitepapers/mo", "AI NLP WhatsApp Bot", "AI Voice Agents"] }
    ]
  }
];

export const STANDALONE_SERVICES = [
  { title: "Additional Pages", price: "Starting From R750 / page", desc: "Expand your AI-Ready digital footprint." },
  { title: "E-commerce Add-on", price: "Starting From R4,500", desc: "Full online store integration and product cataloging." },
  { title: "Booking System", price: "Starting From R2,500", desc: "Native calendar and scheduling integration." },
  { title: "SEO Blogs", price: "Starting From R1.50 / word", desc: "High-ranking, AI-optimized authority content." },
  { title: "Technical Writing", price: "Starting From R3.00 / word", desc: "Expert-level industry documentation." },
  { title: "Whitepapers & Strategy", price: "Starting From R5,500", desc: "Deep-dive lead magnets and strategic blueprints." },
  { title: "Custom GPT / AI Agent", price: "Starting From R9,950", desc: "Bespoke AI assistants trained on your proprietary data." },
  { title: "AI Visibility Audit", price: "Starting From R3,950", desc: "Full digital entity scan, AI citation analysis, schema gaps." },
  { title: "GBP Setup & Verification", price: "Starting From R2,950", desc: "Profile creation, verification, optimization, initial Q&A seeding." },
  { title: "Entity Architecture Starter", price: "Starting From R9,950", desc: "1-3 page SSR site, LocalBusiness Schema." },
  { title: "WhatsApp API Setup", price: "Starting From R7,950", desc: "API integration, verification, 1 basic flow." },
  { title: "Interactive Lead Magnet", price: "Starting From R9,950", desc: "Custom calculator, quiz, or assessment tool." },
  { title: "GBP Optimization Starter", price: "Starting From R1,950 / mo", desc: "Weekly posts, review management, Q&A seeding (5/mo)." },
  { title: "GBP Optimization Pro", price: "Starting From R3,950 / mo", desc: "Daily posts, review management, Q&A seeding (15/mo), competitor tracking." },
  { title: "AEO/GEO Starter", price: "Starting From R5,950 / mo", desc: "5 AEO articles, GBP Q&A seeding, citation report." },
  { title: "WhatsApp Commerce Pro", price: "Starting From R5,950 / mo", desc: "3 flows, catalog management, AI routing." },
  { title: "AI Voice Agent", price: "Starting From R9,950 / mo", desc: "Automated phone receptionist, booking integration." },
  { title: "Dynamic Pricing AI", price: "Starting From R14,950 / mo", desc: "AI-driven rate management, demand forecasting." }
];
