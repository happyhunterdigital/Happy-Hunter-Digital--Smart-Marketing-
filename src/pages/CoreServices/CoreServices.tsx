// src/pages/CoreServices/CoreServices.tsx
import React from 'react';
import { Star, Database, BrainCircuit, Mail, MessageSquareCode, FileText, Mic, CalendarCheck, Magnet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PricingTier } from './PricingTier';
import { CoreServicesForm } from './CoreServicesForm';

export const SERVICES_DATA = [
  {
    phase: 1, title: "Once-Off Entity Architecture", iconType: "Database",
    desc: "High-performance, Server-Side Rendered (SSR) infrastructure engineered specifically for Large Language Model (LLM) ingestion.",
    tiers: [
      { subtitle: "Basic", title: "Digital Front Door", priceStart: "R4,500", priceEnd: "R12,500", target: "Startups needing a verified footprint.", description: "A lightning-fast, 1-to-3 page professional site.", features: ["Hand-coded static node", "Sub-200ms TTFB guarantee", "Initial Digital Passport"] },
      { subtitle: "Essential", title: "Agentic Web Hub", priceStart: "R14,000", priceEnd: "R19,000", target: "Established SMEs.", description: "Built so AI tools can easily read your services.", features: ["5-10 pages (SSR)", "LocalBusiness Schema", "Expert copywriting"], isPopular: true },
      { subtitle: "Premium", title: "Premium Blueprint", priceStart: "R25,000", priceEnd: "R55,000+", target: "High-value firms.", description: "The ultimate company website with verified visual assets.", features: ["Deep architectural build", "Extensive JSON-LD mesh", "Professional photography"] }
    ]
  },
  {
    phase: 2, title: "AI-Powered Personalization", iconType: "BrainCircuit",
    desc: "Deep data integration for real-time recommendation engines and predictive analytics.",
    tiers: [
      { subtitle: "Basic", title: "Recommendation Engine", priceStart: "R4,500", period: "setup", target: "Standard API integrations.", description: "Real-time product or content suggestions based on browsing history.", features: ["Browsing history tracking", "From R950/mo management"] },
      { subtitle: "Essential", title: "Dynamic Content", priceStart: "R12,000", priceEnd: "R180,000", period: "project", target: "Mid-market e-commerce.", description: "AI that alters landing pages and CTAs for specific users in real-time.", features: ["Real-time user adaptation", "Agency-led implementation"], isPopular: true },
      { subtitle: "Premium", title: "Predictive Analytics", priceStart: "R25,000", period: "setup", target: "Full-scale AI personalization.", description: "Forecasting customer churn or high-value segments.", features: ["Advanced forecasting models", "Up to R20,000/mo management"] }
    ]
  },
  {
    phase: 3, title: "Email Marketing", iconType: "Mail",
    desc: "Generative AI testing and automated lifecycle sequences designed to convert inside the inbox.",
    tiers: [
      { subtitle: "Basic", title: "Specialist Management", priceStart: "R2,500", priceEnd: "R6,000", period: "month", target: "Lists up to 10,000 contacts.", description: "Freelancer-level email execution and campaign management.", features: ["AI Copy Optimization", "Subject Line Testing"] },
      { subtitle: "Essential", title: "Lifecycle Automation", priceStart: "R4,500", priceEnd: "R15,000+", period: "month", target: "Agency Retainers.", description: "Automated Welcome, Abandoned Cart, and Win-back sequences.", features: ["Full-funnel strategy", "Generative AI refinement"], isPopular: true },
      { subtitle: "Premium", title: "Interactive Design", priceStart: "R9,500", period: "month", target: "Advanced E-commerce.", description: "Building in-email checkout or live polls.", features: ["Mini-website functionality", "In-email conversions"] }
    ]
  },
  {
    phase: 4, title: "WhatsApp Conversational Commerce", iconType: "MessageSquareCode",
    desc: "Deploy a 24/7 automated workforce. Capture leads, answer FAQs, and process payments inside the chat.",
    tiers: [
      { subtitle: "Basic", title: "Rule-Based Bot", priceStart: "R5,999", priceEnd: "R45,000", period: "setup", target: "Legal verification & CRM setup.", description: "Connecting your business to the WhatsApp API.", features: ["From R900/mo platform fee", "Basic FAQ routing"] },
      { subtitle: "Essential", title: "WhatsApp Flows", priceStart: "R45,000", period: "setup", target: "Interactive forms & catalogs.", description: "Native catalogs and interactive forms inside chat.", features: ["Stripe/PayFast Integration", "From R8,000/mo platform fee"], isPopular: true },
      { subtitle: "Premium", title: "AI NLP Bot", priceStart: "R180,000", priceEnd: "R400,000", period: "setup", target: "Enterprise NLP.", description: "Complex conversational AI with deep system integrations.", features: ["Custom workflows", "Meta message costs apply"] }
    ]
  },
  {
    phase: 5, title: "Professional Content (E-E-A-T)", iconType: "FileText",
    desc: "Professional human-led content commands a Human Premium to combat AI slop and establish authority.",
    tiers: [
      { subtitle: "Basic", title: "SEO-Optimized Blogs", priceStart: "R2,000", priceEnd: "R3,500", period: "project", target: "Standard benchmark (R3.00/word).", description: "1,500+ word blogs with AI research and human editing.", features: ["AI research scaffolding", "Human-led editing"] },
      { subtitle: "Essential", title: "Specialized Writing", priceStart: "R3,500", period: "project", target: "Legal, medical, or financial.", description: "Technical content requiring expert authorship.", features: ["R5.00+ per word", "E-E-A-T compliant"], isPopular: true },
      { subtitle: "Premium", title: "Thought Leadership", priceStart: "R550", priceEnd: "R800+", period: "hour", target: "Brand authority building.", description: "Opinion pieces and whitepapers by senior experts.", features: ["Senior/Expert writers", "High-level strategy"] }
    ]
  },
  {
    phase: 6, title: "Live Chat & Conversational Agents", iconType: "Mic",
    desc: "Automated receptionists and real-time ticket resolution bots synced across your ecosystem.",
    tiers: [
      { subtitle: "Basic", title: "Web Chat Widgets", priceStart: "R3,500", priceEnd: "R8,000", period: "month", target: "Customer service bots.", description: "Basic AI support agents for real-time ticket resolution.", features: ["Website integration", "FAQ handling"] },
      { subtitle: "Essential", title: "AI Voice Agents", priceStart: "R5,000", priceEnd: "R20,000", period: "month", target: "Automated phone receptionists.", description: "Handling bookings and voice queries over the phone.", features: ["Setup and maintenance", "Real-time voice synthesis"], isPopular: true },
      { subtitle: "Premium", title: "Omnichannel Support", priceStart: "R15,000", priceEnd: "R50,000", period: "month", target: "Enterprise retainers.", description: "Syncing context across WhatsApp, Web, and Social Media.", features: ["Complex logic updates", "Ongoing AI training"] }
    ]
  },
  {
    phase: 7, title: "Direct Booking Engines", iconType: "CalendarCheck",
    desc: "Bypass high-commission OTAs for hospitality and professional services using dynamic architecture.",
    tiers: [
      { subtitle: "Basic", title: "Engine Integration", priceStart: "R660", period: "month", target: "Property Management Systems.", description: "Connecting the booking interface to your PMS.", features: ["R0 Setup fees", "Direct website bookings"] },
      { subtitle: "Essential", title: "Channel Manager", priceStart: "R1,500+", period: "month", target: "Syncing availability.", description: "Synchronizing across Booking.com, Airbnb, and direct sites.", features: ["Cross-platform sync", "Prevents double-booking"], isPopular: true },
      { subtitle: "Premium", title: "Dynamic Pricing", priceStart: "R12,980+", period: "setup", target: "Custom Enterprise Systems.", description: "AI modules that dynamically adjust rates based on demand.", features: ["Specialized directories", "Complex portals"] }
    ]
  },
  {
    phase: 8, title: "AI-Powered Lead Magnets", iconType: "Magnet",
    desc: "Interactive tools that replace static PDF ebooks for exponentially higher conversion rates.",
    tiers: [
      { subtitle: "Basic", title: "Software-only (SaaS)", priceStart: "R350", priceEnd: "R900", period: "month", target: "Tool access only.", description: "Access to builder tools for calculators and quizzes.", features: ["Self-service generation", "Basic templates"] },
      { subtitle: "Essential", title: "Interactive Tools", priceStart: "R9,950", period: "setup", target: "Once-off funnel creation.", description: "Tools providing instant, personalized results like loan calculators.", features: ["Personalized AI Reports", "High conversion rates"], isPopular: true },
      { subtitle: "Premium", title: "Custom GPTs", priceStart: "R9,950", priceEnd: "R39,950", period: "month", target: "Comprehensive full-house.", description: "Specialized AI assistants offered as a value-add.", features: ["Monthly Lead Gen Packages", "Fully managed acquisition"] }
    ]
  }
];

const ICONS: Record<string, React.ReactNode> = {
  Database: <Database size={32} />, BrainCircuit: <BrainCircuit size={32} />, Mail: <Mail size={32} />,
  MessageSquareCode: <MessageSquareCode size={32} />, FileText: <FileText size={32} />, Mic: <Mic size={32} />,
  CalendarCheck: <CalendarCheck size={32} />, Magnet: <Magnet size={32} />
};

export const CoreServices: React.FC = () => {
  return (
    <div className="bg-[#050505] min-h-screen pb-0 animate-fade-in font-sans selection:bg-yellow-500 selection:text-black">
      <header className="relative pt-40 pb-24 border-b border-gray-800 overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 z-0">
          <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1772893108/Untitled_design_4_jghatq.png" alt="Strategic Services" className="w-full h-full object-cover object-center opacity-50 mix-blend-overlay transition-all duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 to-transparent"></div>
        </div>
        <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">The 2026 Protocol</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none text-white">
            We build smart WhatsApp bots and <br className="hidden md:block" />
            <span className="text-yellow-500 italic text-white underline decoration-yellow-500/30 underline-offset-[12px]">AI-ready websites</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">For South African business owners, brokers, and founders who are tired of losing high-value clients to competitors after hours. We ensure your business never misses a lead.</p>
          <div className="flex justify-center gap-4 mb-8">
            <Link to="/audit" className="inline-block bg-yellow-500 text-black px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-colors">Initialize Smart Business Scan</Link>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex gap-1 text-yellow-500">
              {[1, 2, 3, 4, 5].map((star) => (<Star key={star} className="fill-yellow-500 text-yellow-500" size={16} />))}
            </div>
            <p className="text-sm text-gray-400 font-medium">Trusted by <strong className="text-white">Profuse Beauty Cosmetics</strong>, <strong className="text-white">Gamazine Factory Online</strong>, and 50+ local brands.</p>
          </div>
        </div>
      </header>

      {SERVICES_DATA.map((phase, idx) => (
        <section key={phase.phase} className={`py-24 px-6 relative border-b border-gray-900 ${idx % 2 !== 0 ? 'bg-[#020202]' : ''}`}>
          <div className="container mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="text-sm font-black text-yellow-500 uppercase tracking-widest mb-2">Phase {phase.phase}</h2>
              <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">{phase.title}</h3>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">{phase.desc}</p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8 items-stretch">
              {phase.tiers.map(tier => (
                <PricingTier
                  key={tier.title}
                  phase={phase.phase}
                  title={tier.title}
                  subtitle={tier.subtitle}
                  target={tier.target}
                  description={tier.description}
                  priceStart={tier.priceStart}
                  priceEnd={tier.priceEnd}
                  period={tier.period}
                  features={tier.features}
                  isPopular={tier.isPopular}
                  highlightColor={tier.isPopular ? "yellow-500" : "white"}
                  icon={ICONS[phase.iconType]}
                />
              ))}
            </div>
          </div>
        </section>
      ))}

      <CoreServicesForm />
    </div>
  );
};
