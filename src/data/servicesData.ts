export const SERVICES_DATA = [
  {
    phase: 1, title: "Modern Websites", iconType: "Database",
    description: "Your website is your 24/7 salesperson. We build fast, mobile-friendly websites that Google recommends and AI tools like ChatGPT can understand.",
    tiers: [
      { subtitle: "Essential", title: "Starter Website", priceStart: "R3,950 - R6,500", target: "Startups & Solo-preneurs.", description: "A clean, fast website that gets you found online.", features: ["1-3 Professional Pages", "Fast Loading", "AI Search Discoverable", "WhatsApp Chat Button"] },
      { subtitle: "Growth", title: "The Growth Hub", priceStart: "R12,500 - R18,500", target: "Growing businesses.", description: "Turn your website into an automated sales machine.", features: ["5-10 Pages + Blog", "AI Search Optimization", "Lead Capture Tools", "WhatsApp Follow-ups"], isPopular: true },
      { subtitle: "Premium", title: "Enterprise Engine", priceStart: "R35,000 - R55,000+", target: "Established brands.", description: "Full digital dominance with intelligent automation.", features: ["Unlimited Pages", "Omnichannel AI Sync", "Customer Analytics", "Dedicated Account Manager"] }
    ]
  },
  {
    phase: 2, title: "24/7 Chatbots", iconType: "Mic",
    description: "Never let a customer wait. Our AI chatbots answer questions, qualify leads, and book appointments — 24 hours a day, 7 days a week.",
    tiers: [
      { subtitle: "Starter", title: "Basic Web Chat", priceStart: "R450", period: "Starting From", target: "Small teams.", description: "Instantly route customer questions to the right answers.", features: ["Smart FAQ Handling", "Ticket Routing", "Website Integration"] },
      { subtitle: "Business", title: "Smart Sales Chatbots", priceStart: "R1,800", period: "Starting From", target: "High-traffic sites.", description: "AI that talks to your customers like a real sales rep.", features: ["AI Responses", "Instant Lead Qualification", "Calendar Booking"], isPopular: true },
      { subtitle: "Enterprise", title: "Omnichannel Support", priceStart: "R15,000+", period: "Starting From", target: "Large operations.", description: "AI agents handling your Website, WhatsApp, and Socials.", features: ["Web + WhatsApp + Social", "Phone Receptionist", "Reporting Dashboard"] }
    ]
  },
  {
    phase: 3, title: "WhatsApp Sales", iconType: "MessageSquareCode",
    description: "Turn WhatsApp — the app your customers already use every day — into your most powerful sales channel.",
    tiers: [
      { subtitle: "Essential", title: "Automated Setup", priceStart: "R4,500", period: "Starting From", target: "Local businesses.", description: "Get your business on the official WhatsApp Business API.", features: ["API Integration", "Auto-Replies", "Secure Lead Capture"] },
      { subtitle: "Growth", title: "Interactive Catalogs", priceStart: "R12,500", period: "Starting From", target: "E-commerce & Retail.", description: "Let customers browse and select products directly in WhatsApp.", features: ["WhatsApp Catalogs", "Interactive Forms", "Automated Nurturing"], isPopular: true },
      { subtitle: "Premium", title: "In-Chat Payments", priceStart: "R35,000+", period: "Starting From", target: "High-volume sellers.", description: "Complete sales without customers leaving WhatsApp.", features: ["Payment Integration", "AI Sales Bots", "Easy Checkout"] }
    ]
  },
  {
    phase: 4, title: "Expert Content", iconType: "FileText",
    description: "Content that proves your expertise to both human readers and search engines — answering real customer questions so you rank higher.",
    tiers: [
      { subtitle: "Essential", title: "SEO Blog Articles", priceStart: "From R1.50", period: "Starting From / word", target: "Brands needing visibility.", description: "Well-researched articles that capture search traffic.", features: ["Search Engine Optimization", "Human Editing", "Industry Research"] },
      { subtitle: "Growth", title: "Email Marketing", priceStart: "R4,500", period: "Starting From", target: "Sales teams.", description: "Automated emails that turn leads into paying customers.", features: ["Welcome Emails", "Cart Recovery", "Conversion Copywriting"], isPopular: true },
      { subtitle: "Premium", title: "Whitepapers & Strategy", priceStart: "R12,500+", period: "Starting From", target: "B2B & Enterprise.", description: "Deep-dive content that establishes you as the expert.", features: ["Expert Authorship", "Advanced Strategy", "Lead Magnet Design"] }
    ]
  },
  {
    phase: 5, title: "Booking Systems", iconType: "CalendarCheck",
    description: "Take bookings directly on your website, manage your calendar, and keep 100% of your revenue — no expensive middlemen.",
    tiers: [
      { subtitle: "Essential", title: "Booking Integration", priceStart: "R950", period: "Starting From", target: "Single locations.", description: "Connect your website to your booking system.", features: ["Calendar Sync", "Direct Bookings", "No Commission Fees"] },
      { subtitle: "Growth", title: "Channel Manager", priceStart: "R1,500+", period: "Starting From", target: "Multi-platform hosts.", description: "Keep your availability synced across all platforms.", features: ["Cross-Platform Sync", "No Double-Bookings", "Central Dashboard"], isPopular: true },
      { subtitle: "Premium", title: "Dynamic Pricing AI", priceStart: "R12,980+", period: "Starting From", target: "Large operators.", description: "Automatically adjust rates based on demand to maximize profit.", features: ["Smart Pricing", "Revenue Maximization", "Custom Rules"] }
    ]
  }
];

export const MASTER_TIERS = [
  {
    phase: "0", title: "2026 Marketing Retainers", iconType: "ShieldCheck",
    description: "Complete online visibility and automated sales — all in one monthly package. Shows up on Google, AI tools, and WhatsApp.",
    tiers: [
      { subtitle: "Essential", title: "Visibility Starter", priceStart: "R9,950", period: "Starting From", target: "Businesses <R5M Revenue", description: "Get found online and verify your Google listing.", features: ["3-5 page website", "Google Business Profile Setup", "2 blog articles per month", "Basic WhatsApp Setup", "Basic email sequence"] },
      { subtitle: "Growth", title: "AI Visibility Pro", priceStart: "R19,950", period: "Starting From", target: "Businesses R5M-R50M Revenue", description: "Full online presence that Google and AI both recommend.", features: ["5-10 page website", "AI content optimization", "4 blog articles + 1 guide per month", "3 WhatsApp automation flows", "AI live chat"], isPopular: true },
      { subtitle: "Premium", title: "Full Automation", priceStart: "R39,950", period: "Starting From", target: "Businesses R50M+ Revenue", description: "An end-to-end system: website, content, and sales automation running on autopilot.", features: ["10-20 page website", "Cross-platform visibility", "8 articles + 2 guides per month", "WhatsApp bot with AI", "AI voice agent"] }
    ]
  }
];

export const STANDALONE_SERVICES = [
  { title: "Additional Pages", price: "Starting From R750 / page", desc: "Add more pages to your website." },
  { title: "E-commerce Store", price: "Starting From R4,500", desc: "Full online store setup with payment integration." },
  { title: "Booking System", price: "Starting From R2,500", desc: "Calendar and scheduling integration." },
  { title: "SEO Blog Articles", price: "Starting From R1.50 / word", desc: "Search-optimized content that ranks." },
  { title: "Technical Writing", price: "Starting From R3.00 / word", desc: "Professional industry documentation." },
  { title: "Whitepapers & Guides", price: "Starting From R5,500", desc: "In-depth lead generation content." },
  { title: "Custom AI Assistant", price: "Starting From R9,950", desc: "Your own ChatGPT-style assistant trained on your business info." },
  { title: "AI Visibility Audit", price: "Starting From R3,950", desc: "Full check of where your business shows up online." },
  { title: "Google Business Profile Setup", price: "Starting From R2,950", desc: "Profile creation and optimization." },
  { title: "Website Builder Package", price: "Starting From R9,950", desc: "1-3 page website with Google setup." },
  { title: "WhatsApp API Setup", price: "Starting From R7,950", desc: "WhatsApp Business API integration." },
  { title: "Custom Calculator/Quiz", price: "Starting From R9,950", desc: "Interactive tools to capture leads." },
  { title: "Google Business Management", price: "Starting From R1,950 / mo", desc: "Monthly management of your Google listing." },
  { title: "Google Business Growth Plan", price: "Starting From R3,950 / mo", desc: "Daily management with competitor tracking." },
  { title: "AI Answers Optimization", price: "Starting From R5,950 / mo", desc: "Monthly content that gets cited by AI." },
  { title: "WhatsApp Marketing Pro", price: "Starting From R5,950 / mo", desc: "Advanced WhatsApp sales automation." },
  { title: "AI Phone Agent", price: "Starting From R9,950 / mo", desc: "Automated phone receptionist with booking." },
  { title: "Dynamic Pricing AI", price: "Starting From R14,950 / mo", desc: "AI-powered pricing that adjusts to demand." }
];
