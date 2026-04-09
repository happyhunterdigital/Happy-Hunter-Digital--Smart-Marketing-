import React from 'react';
import { Star, Database, BrainCircuit, Mail, MessageSquareCode, FileText, Mic, CalendarCheck, Magnet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PricingTier } from './PricingTier';
import { CoreServicesForm } from './CoreServicesForm';

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
      { subtitle: "Starter", title: "Basic Web Chat", priceStart: "R450 - R950", period: "Monthly", target: "Small teams.", description: "Instantly route customer questions to the right answers.", features: ["Smart FAQ Handling", "Ticket Routing", "Easy Website Integration"] },
      { subtitle: "Business", title: "Smart Sales Chatbots", priceStart: "R1,800 - R4,500", period: "Monthly", target: "High-traffic sites.", description: "AI that talks to your customers like a real sales rep.", features: ["AI-Powered Responses", "Instant Lead Qualification", "Automated Calendar Booking"], isPopular: true },
      { subtitle: "Enterprise", title: "Omnichannel Support", priceStart: "R15,000+", period: "Monthly", target: "Large operations.", description: "A unified AI team handling your Website, WhatsApp, and Socials.", features: ["Web + WhatsApp + Social", "Phone Receptionist Included", "Advanced Reporting Dashboard"] }
    ]
  },
  {
    phase: 3, title: "Automated WhatsApp Sales", iconType: "MessageSquareCode",
    description: "Turn the app your customers already use every day into your most powerful and frictionless sales channel.",
    tiers: [
      { subtitle: "Essential", title: "Automated Setup", priceStart: "R4,500 - R6,500", target: "Local businesses.", description: "Get your business officially verified on the WhatsApp API.", features: ["Official API Integration", "Basic Auto-Replies", "Secure Lead Capture"] },
      { subtitle: "Comprehensive", title: "Interactive Catalogs", priceStart: "R12,500 - R18,500", target: "E-commerce & Retail.", description: "Let customers browse and select products directly in chat.", features: ["Native WhatsApp Catalogs", "Interactive Menu Forms", "Automated Nurturing Flows"], isPopular: true },
      { subtitle: "Premium", title: "In-Chat Payments", priceStart: "R35,000+", target: "High-volume sellers.", description: "Complete the entire transaction without leaving WhatsApp.", features: ["Direct Payment Gateways", "Advanced AI Sales Bots", "Frictionless Checkout Experience"] }
    ]
  },
  {
    phase: 4, title: "Expert Authority Content", iconType: "FileText",
    description: "High-quality, expertly crafted content that proves your absolute industry authority to both human readers and AI algorithms.",
    tiers: [
      { subtitle: "Essential", title: "High-Ranking Articles", priceStart: "From R1.50/word", target: "Brands needing visibility.", description: "Well-researched blog posts designed to capture search traffic.", features: ["Search Engine Optimization", "Human-Led Editing", "Deep Industry Research"] },
      { subtitle: "Comprehensive", title: "Automated Email Marketing", priceStart: "R4,500 - R7,500", period: "Monthly", target: "Sales teams.", description: "Smart email sequences that nurture leads into paying customers.", features: ["Welcome Sequences", "Abandoned Cart Recovery", "Conversion Copywriting"], isPopular: true },
      { subtitle: "Premium", title: "Strategic Whitepapers", priceStart: "R12,500+", target: "B2B & Enterprise.", description: "Deep-dive technical content that establishes ultimate authority.", features: ["Expert Authorship", "High-Level Strategy", "Custom Lead Magnet Design"] }
    ]
  },
  {
    phase: 5, title: "Direct Booking Engines", iconType: "CalendarCheck",
    description: "Bypass expensive third-party platforms. Take direct bookings, manage your calendar, and keep 100% of your revenue.",
    tiers: [
      { subtitle: "Essential", title: "Booking Integration", priceStart: "R950 - R1,500", period: "Monthly", target: "Single locations.", description: "Seamlessly connect your website to your booking management system.", features: ["Property System Sync", "Direct Website Bookings", "Zero Commission Fees"] },
      { subtitle: "Comprehensive", title: "Channel Manager", priceStart: "R1,500+", period: "Monthly Subscription", target: "Multi-platform hosts.", description: "Sync your availability perfectly across Airbnb, Booking.com, and your site.", features: ["Cross-Platform Sync", "Double-Booking Prevention", "Centralized Dashboard"], isPopular: true },
      { subtitle: "Premium", title: "Dynamic Pricing AI", priceStart: "R12,980+", target: "Large operators.", description: "Automatically adjust your rates based on market demand to maximize profit.", features: ["Demand-Based Rates", "Revenue Maximization", "Custom Pricing Rules"] }
    ]
  }
];

const STANDALONE_SERVICES = [
  { title: "Additional Pages", price: "From R750 / page", desc: "Expand your AI-Ready digital footprint." },
  { title: "E-commerce Add-on", price: "From R4,500", desc: "Full online store integration and product cataloging." },
  { title: "Booking System", price: "From R2,500", desc: "Native calendar and scheduling integration." },
  { title: "SEO Blogs", price: "From R1.50 / word", desc: "High-ranking, AI-optimized authority content." },
  { title: "Technical Writing", price: "From R3.00 / word", desc: "Expert-level industry documentation." },
  { title: "Whitepapers & Strategy", price: "From R5,500", desc: "Deep-dive lead magnets and strategic blueprints." },
  { title: "Custom GPT / AI Agent", price: "From R9,950", desc: "Bespoke AI assistants trained on your proprietary data." }
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
          <img 
            src="https://res.cloudinary.com/dka0498ns/image/upload/v1772893108/Untitled_design_4_jghatq.png" alt="Strategic Services" className="w-full h-full object-cover object-center opacity-50 mix-blend-overlay transition-all duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 to-transparent"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">The 2026 Protocol</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none text-white">
            We build smart WhatsApp bots and <br className="hidden md:block" />
            <span className="text-yellow-500 italic text-white underline decoration-yellow-500/30 underline-offset-[12px]">AI-ready websites</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">For ambitious South African business owners, brokers, and founders who are tired of losing high-value clients to competitors after hours. We ensure your business never misses a lead.</p>
          
          <div className="flex justify-center gap-4 mb-12">
            <Link to="/audit" className="inline-block bg-yellow-500 text-black px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-colors">Initialize Smart Business Scan</Link>
          </div>

          <div className="p-6 bg-black/60 backdrop-blur-md border border-gray-800 rounded-2xl max-w-3xl mx-auto text-left shadow-2xl">
            <h4 className="text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-4">Verified Transformations</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-2 border-yellow-500/50 pl-4">
                <strong className="text-white text-sm block mb-1">Profuse Beauty</strong>
                <p className="text-gray-400 text-xs leading-relaxed">Engineered a direct-to-consumer Meta Ads and automated email infrastructure, elevating the brand to a highly targeted luxury cosmetic entity.</p>
              </div>
              <div className="border-l-2 border-yellow-500/50 pl-4">
                <strong className="text-white text-sm block mb-1">Skubalisto Heritage</strong>
                <p className="text-gray-400 text-xs leading-relaxed">Resolved "Digital Atrophy" by codifying the brand narrative, recovering reputation to a 5.0-star rating, and deploying Answer Engine Optimization (AEO).</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {SERVICES_DATA.map((phase, idx) => (
        <section key={phase.phase} className={`py-24 px-6 relative border-b border-gray-900 ${idx % 2 !== 0 ? 'bg-[#020202]' : ''}`}>
          <div className="container mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="text-sm font-black text-yellow-500 uppercase tracking-widest mb-2">Phase {phase.phase}</h2>
              <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">{phase.title}</h3>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">{phase.description}</p>
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
                  period={tier.period}
                  features={tier.features}
                  isPopular={tier.isPopular}
                  highlightColor={tier.isPopular ? "yellow-500" : "white"}
                  icon={ICONS[phase.iconType as keyof typeof ICONS] || ICONS.Database}
                />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* STANDALONE SERVICES SECTION */}
      <section className="py-24 px-6 relative border-b border-gray-900 bg-[#050505]">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">Standalone Services</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Targeted upgrades to scale your digital entity infrastructure.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {STANDALONE_SERVICES.map((item, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-2xl hover:border-yellow-500/50 transition-colors flex flex-col">
                <h4 className="text-lg font-black text-white mb-2">{item.title}</h4>
                <p className="text-sm text-gray-400 mb-6 flex-grow">{item.desc}</p>
                <p className="text-xl font-black text-yellow-500 mb-6">{item.price}</p>
                <Link to="/audit" className="w-full block text-center py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all bg-gray-800 text-white hover:bg-yellow-500 hover:text-black mt-auto">
                  Invest Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CoreServicesForm />
    </div>
  );
};
