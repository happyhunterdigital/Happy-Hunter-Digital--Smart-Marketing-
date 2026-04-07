import React from 'react';
import { Star, Database, BrainCircuit, Mail, MessageSquareCode, FileText, Mic, CalendarCheck, Magnet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PricingTier } from './PricingTier';
import { CoreServicesForm } from './CoreServicesForm';

export const SERVICES_DATA = [
  {
    phase: 1, title: "Entity Architecture (Vibe Definition)", iconType: "Database",
    description: "Stop being a 'ghost' to algorithms. We codify your brand into a lightning-fast 'Digital Passport' that AI search tools like ChatGPT explicitly trust.",
    tiers: [
      { subtitle: "Basic", title: "Digital Front Door", priceStart: "R4,500 - R12,500", target: "Startups needing a verified footprint.", description: "A lightning-fast, 1-to-3 page professional site.", features: ["Hand-coded static node", "Sub-200ms TTFB guarantee", "Initial Digital Passport"] },
      { subtitle: "Essential", title: "Smart Business Hub", priceStart: "R14,000 - R19,000", target: "Established SMEs.", description: "A comprehensive site built so AI tools correctly categorize and recommend your specific services.", features: ["5-10 hand-coded pages (SSR)", "LocalBusiness Schema", "Expert copywriting"], isPopular: true },
      { subtitle: "Premium", title: "Premium Blueprint", priceStart: "R25,000 - R55,000+", target: "High-value firms.", description: "The ultimate company website with verified visual assets.", features: ["Deep architectural build", "Extensive JSON-LD mesh", "Professional photography"] }
    ]
  },
  {
    phase: 2, title: "AI-Powered Personalization", iconType: "BrainCircuit",
    description: "Deep data integration for real-time recommendation engines and predictive analytics.",
    tiers: [
      { subtitle: "Basic", title: "Recommendation Engine", priceStart: "R4,500 - R25,000", target: "Standard API integrations.", description: "Real-time product or content suggestions based on browsing history.", features: ["Browsing history tracking", "From R950/mo management"] },
      { subtitle: "Essential", title: "Dynamic Content", priceStart: "R12,000 - R180,000", target: "Mid-market e-commerce.", description: "AI that alters landing pages and CTAs for specific users in real-time.", features: ["Real-time user adaptation", "Agency-led implementation"], isPopular: true },
      { subtitle: "Premium", title: "Predictive Analytics", priceStart: "Up to R20,000/mo", target: "Full-scale AI personalization.", description: "Forecasting customer churn or high-value segments.", features: ["Advanced forecasting models", "High-value segmenting"] }
    ]
  },
  {
    phase: 3, title: "Email Marketing (Vibe Scaling)", iconType: "Mail",
    description: "Generative AI testing and automated lifecycle sequences designed to convert inside the inbox.",
    tiers: [
      { subtitle: "Basic", title: "Specialist Management", priceStart: "R2,500 - R6,000/mo", target: "Lists up to 10,000 contacts.", description: "Freelancer-level email execution and campaign management.", features: ["AI Copy Optimization", "Subject Line Testing"] },
      { subtitle: "Essential", title: "Lifecycle Automation", priceStart: "R9,500 - R15,000/mo", target: "Agency Retainers.", description: "Automated Welcome, Abandoned Cart, and Win-back sequences.", features: ["Full-funnel strategy", "Generative AI refinement"], isPopular: true },
      { subtitle: "Premium", title: "Interactive Design", priceStart: "Custom Quoted", target: "Advanced E-commerce.", description: "Building in-email checkout or live polls.", features: ["Mini-website functionality", "In-email conversions"] }
    ]
  },
  {
    phase: 4, title: "WhatsApp Autonomous Agents", iconType: "MessageSquareCode",
    description: "Never miss another lead. We Vibe-Code your brand's persona into AI assistants that answer questions and book appointments directly in WhatsApp 24/7.",
    tiers: [
      { subtitle: "Basic", title: "WhatsApp API Setup", priceStart: "R5,999 - R45,000", target: "Rule-based bots.", description: "Legal verification and technical integration with CRM/Shopify.", features: ["API Integration", "From R900/mo platform fee"] },
      { subtitle: "Essential", title: "Interactive Chat Flows", priceStart: "R900 - R8,000/mo", target: "Monthly Platform maintenance.", description: "Building interactive forms and native catalogs inside the chat.", features: ["Native catalogs", "Interactive forms"], isPopular: true },
      { subtitle: "Premium", title: "In-Chat Payments", priceStart: "R180k - R400k", target: "AI NLP bots.", description: "Connecting Stripe, PayFast, or Ozow so customers can buy directly in the chat.", features: ["In-chat transactions", "Price Driver: Logic complexity"] }
    ]
  },
  {
    phase: 5, title: "Expert Authority Content", iconType: "FileText",
    description: "We Vibe-Code your content strategy. We write high-quality articles that prove to both humans and AI that you are the absolute expert in your industry.",
    tiers: [
      { subtitle: "Basic", title: "SEO-Optimized Blogs", priceStart: "R3.00 / word", target: "Standard benchmark projects.", description: "1,500+ word blogs with AI research and human editing.", features: ["AI research scaffolding", "Human-led editing"] },
      { subtitle: "Essential", title: "Specialized Writing", priceStart: "R5.00+ / word", target: "Legal, medical, or financial.", description: "Technical content requiring expert authorship.", features: ["Expert authorship", "E-E-A-T compliant"], isPopular: true },
      { subtitle: "Premium", title: "Thought Leadership", priceStart: "R550 - R800+/hr", target: "Brand authority building.", description: "Opinion pieces and whitepapers for brand authority.", features: ["Senior/Expert writers", "High-level strategy"] }
    ]
  },
  {
    phase: 6, title: "24/7 Digital Receptionist", iconType: "Mic",
    description: "Automated receptionists and real-time ticket resolution bots synced across your ecosystem.",
    tiers: [
      { subtitle: "Basic", title: "Web Chat Widgets", priceStart: "R3,500 - R8,000/mo", target: "Customer service bots.", description: "Basic AI support agents for real-time ticket resolution.", features: ["Real-time resolution", "Website integration"] },
      { subtitle: "Essential", title: "AI Voice Agents", priceStart: "R5,000 - R20,000/mo", target: "Automated phone receptionists.", description: "Automated receptionists handling bookings and FAQs over the phone.", features: ["Voice synthesis", "Price Driver: Call Volume"], isPopular: true },
      { subtitle: "Premium", title: "Omnichannel Support", priceStart: "R15k - R50k/mo", target: "Enterprise retainers.", description: "Syncing context across WhatsApp, Web, and Social Media.", features: ["Complex logic updates", "Price Driver: Integration Depth"] }
    ]
  },
  {
    phase: 7, title: "Direct Booking Engines", iconType: "CalendarCheck",
    description: "Bypass high-commission OTAs for hospitality and professional services.",
    tiers: [
      { subtitle: "Basic", title: "Engine Integration", priceStart: "R1,600", target: "Local providers.", description: "Connecting the booking interface to the Property Management System (PMS).", features: ["PMS Integration", "Direct website bookings"] },
      { subtitle: "Essential", title: "Channel Manager", priceStart: "R660 - R1,500+/mo", target: "Monthly Subscription.", description: "Synchronizing availability across Booking.com, Airbnb, and direct sites.", features: ["Cross-platform sync", "Prevents double-booking"], isPopular: true },
      { subtitle: "Premium", title: "Dynamic Pricing", priceStart: "R12,980+", target: "Custom Enterprise Systems.", description: "AI modules that adjust rates based on demand.", features: ["Demand-based pricing", "Specialized directories"] }
    ]
  },
  {
    phase: 8, title: "Smart Customer Tools", iconType: "Magnet",
    description: "Interactive tools that replace static PDF ebooks for exponentially higher conversion rates.",
    tiers: [
      { subtitle: "Basic", title: "Software-only (SaaS)", priceStart: "R350 - R900/mo", target: "Tool access only.", description: "Access to builder tools for calculators and quizzes.", features: ["Self-service generation", "Basic templates"] },
      { subtitle: "Essential", title: "Interactive Tools", priceStart: "R9,950 Setup", target: "Once-off funnel creation.", description: "Tools providing instant, personalized results like loan calculators.", features: ["Personalized AI Reports", "High conversion rates"], isPopular: true },
      { subtitle: "Premium", title: "Custom GPTs", priceStart: "R9,950 - R39,950/mo", target: "Monthly Lead Gen Packages.", description: "Specialized AI assistants offered as a value-add.", features: ["Custom AI Assistants", "Full-house acquisition"] }
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

          {/* VERIFIED TRANSFORMATIONS TRUST SIGNAL */}
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

      <CoreServicesForm />
    </div>
  );
};
