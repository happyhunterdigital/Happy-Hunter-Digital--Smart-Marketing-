// src/pages/CoreServices/CoreServices.tsx
import React, { useState } from 'react';
import { Star, Database, BrainCircuit, Mail, MessageSquareCode, FileText, Mic, CalendarCheck, Magnet, Zap, ShieldCheck, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PricingTier } from './PricingTier';
import { db, functions } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { Telemetry } from '../../posthog';

export const SERVICES_DATA = [
  { ph: "1", title: "Entity Architecture", icon: <Database size={32}/>, desc: "High-performance Server-Side Rendered (SSR) infrastructure engineered specifically for LLM ingestion.", tiers: [
    { sub: "Basic", title: "Digital Front Door", price: "R4,500 - R12,500", desc: "A lightning-fast, 1-to-3 page professional site to get your business online securely.", target: "Startups needing a verified, high-speed footprint.", feats: ["Hand-coded static node", "Sub-200ms TTFB guarantee", "Initial Digital Passport"] },
    { sub: "Essential", title: "Agentic Web Hub", price: "R14,000 - R19,000", desc: "A comprehensive site built so Google and AI tools can easily read and recommend your services.", target: "Established SMEs requiring dedicated service pages.", feats: ["5-10 hand-coded pages (SSR)", "LocalBusiness Schema", "Expert copywriting"], pop: true },
    { sub: "Premium", title: "Premium Blueprint", price: "R25,000 - R55,000+", desc: "The ultimate company website, including professional photography and video to build absolute trust.", target: "High-value firms (medical, financial, legal).", feats: ["Deep architectural build", "Extensive JSON-LD mesh", "Verified visual assets"] }
  ]},
  { ph: "2", title: "AI-Powered Personalization", icon: <BrainCircuit size={32}/>, desc: "Deep data integration for real-time recommendation engines and predictive analytics.", tiers: [
    { sub: "Basic", title: "Recommendation Engines", price: "R4,500 - R25,000", desc: "Real-time product or content suggestions based on browsing history.", target: "Standard API integrations.", feats: ["Browsing history tracking", "From R950/mo management"] },
    { sub: "Essential", title: "Dynamic Website Content", price: "R12,000 - R180,000", desc: "AI that alters landing pages and CTAs for specific users in real-time.", target: "Mid-market e-commerce businesses.", feats: ["Real-time user adaptation", "Agency-led implementation"], pop: true },
    { sub: "Premium", title: "Predictive Analytics", price: "Up to R20,000/mo", desc: "Forecasting customer churn or high-value segments.", target: "Full-scale AI personalization projects.", feats: ["Advanced forecasting models", "High-value segmenting"] }
  ]},
  { ph: "3", title: "Email Marketing", icon: <Mail size={32}/>, desc: "Generative AI testing and automated lifecycle sequences designed to convert inside the inbox.", tiers: [
    { sub: "Basic", title: "Specialist Management", price: "R2,500 - R6,000/mo", desc: "Freelancer-level email execution and campaign management.", target: "Lists up to 10,000 contacts.", feats: ["AI Copy Optimization", "Subject Line Testing"] },
    { sub: "Essential", title: "Lifecycle Automation", price: "R950 - R15,000+/mo", desc: "Automated Welcome, Abandoned Cart, and Win-back sequences.", target: "Agency Retainers (Full-funnel).", feats: ["Automated sequences", "Generative AI refinement"], pop: true },
    { sub: "Premium", title: "Interactive Design", price: "Custom Quoted", desc: "Building in-email checkout or live polls (mini-website functionality).", target: "Advanced E-commerce.", feats: ["In-email conversions", "Live polls & checkouts"] }
  ]},
  { ph: "4", title: "WhatsApp Conversational Commerce", icon: <MessageSquareCode size={32}/>, desc: "Deploy a 24/7 automated workforce. Capture leads, answer FAQs, and process payments inside the chat.", tiers: [
    { sub: "Basic", title: "WhatsApp API Setup", price: "R5,999 - R45,000", desc: "Legal verification and technical integration with CRM/Shopify.", target: "Rule-based bots.", feats: ["API Integration", "From R900/mo platform fee"] },
    { sub: "Essential", title: "WhatsApp Flows", price: "R900 - R8,000/mo", desc: "Building interactive forms and native catalogs inside the chat.", target: "Monthly Platform maintenance.", feats: ["Native catalogs", "Interactive forms"], pop: true },
    { sub: "Premium", title: "Payment Integration", price: "R180k - R400k", desc: "Connecting Stripe, PayFast, or Ozow for in-chat transactions.", target: "AI NLP bots.", feats: ["In-chat transactions", "Meta costs ~R0.72/msg"] }
  ]},
  { ph: "5", title: "Professional Content (E-E-A-T)", icon: <FileText size={32}/>, desc: "Professional human-led content commands a Human Premium to combat AI slop and establish authority.", tiers: [
    { sub: "Basic", title: "SEO-Optimized Content", price: "R3.00 / word", desc: "Long-form blogs (1,500+ words) with AI research and human editing.", target: "Standard benchmark projects.", feats: ["AI research scaffolding", "Human-led editing"] },
    { sub: "Essential", title: "Technical/Specialized Writing", price: "R5.00+ / word", desc: "Legal, medical, or financial content requiring expert authorship.", target: "Per Project: R2,000 - R3,500.", feats: ["Expert authorship", "E-E-A-T compliant"], pop: true },
    { sub: "Premium", title: "Thought Leadership", price: "R550 - R800+/hr", desc: "Opinion pieces and whitepapers for brand authority.", target: "Senior/Expert writers.", feats: ["Brand authority", "Opinion pieces"] }
  ]},
  { ph: "6", title: "Live Chat & Conversational Agents", icon: <Mic size={32}/>, desc: "Automated receptionists and real-time ticket resolution bots synced across your ecosystem.", tiers: [
    { sub: "Basic", title: "Web Chat Widgets", price: "R3,500 - R8,000/mo", desc: "Customer service bots for real-time ticket resolution.", target: "Chatbot Retainer.", feats: ["Real-time resolution", "Website integration"] },
    { sub: "Essential", title: "AI Voice Agents", price: "R5,000 - R20,000/mo", desc: "Automated receptionists handling bookings and FAQs over the phone.", target: "Includes setup and maintenance.", feats: ["Voice synthesis", "Booking handling"], pop: true },
    { sub: "Premium", title: "Omnichannel Support", price: "R15k - R50k/mo", desc: "Syncing context across WhatsApp, Web, and Social Media.", target: "Enterprise Retainers.", feats: ["Complex logic updates", "Ongoing training"] }
  ]},
  { ph: "7", title: "Direct Booking Engines", icon: <CalendarCheck size={32}/>, desc: "Bypass high-commission OTAs for hospitality and professional services.", tiers: [
    { sub: "Basic", title: "Engine Integration", price: "R0 Setup", desc: "Connecting the booking interface to the Property Management System (PMS).", target: "Local providers (like NightsBridge).", feats: ["PMS Integration", "Direct website bookings"] },
    { sub: "Essential", title: "Channel Manager", price: "R660 - R1,500+/mo", desc: "Synchronizing availability across Booking.com, Airbnb, and direct sites.", target: "Monthly Subscription.", feats: ["Cross-platform sync", "Prevents double-booking"], pop: true },
    { sub: "Premium", title: "Dynamic Pricing Modules", price: "R12,980+", desc: "AI that adjusts rates based on demand.", target: "Custom Enterprise Systems.", feats: ["Demand-based pricing", "Specialized directories"] }
  ]},
  { ph: "8", title: "AI-Powered Lead Magnets", icon: <Magnet size={32}/>, desc: "Interactive tools that replace static PDF ebooks for higher conversion rates.", tiers: [
    { sub: "Basic", title: "Software-only (SaaS)", price: "R350 - R900/mo", desc: "Access to builder tools for calculators and quizzes.", target: "Tool access only.", feats: ["Self-service generation", "Basic templates"] },
    { sub: "Essential", title: "Interactive Calculators", price: "R9,950 Setup", desc: "Tools providing instant, personalized results (e.g., loan or cost calculators).", target: "Once-off funnel creation.", feats: ["Personalized AI Reports", "Instant results"], pop: true },
    { sub: "Premium", title: "Custom GPTs & Full House", price: "R9,950 - R39,950/mo", desc: "Specialized AI assistants offered as a value-add and comprehensive lead gen.", target: "Monthly Lead Gen Packages.", feats: ["Custom AI Assistants", "Full-house acquisition"] }
  ]}
];

export const CoreServices: React.FC = () => {
  const [form, setForm] = useState({ name: '', website: '', service: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    Telemetry.serviceRequested(form.service, form.website);
    try {
      const submitServiceRequest = httpsCallable(functions, 'submitServiceRequest');
      await submitServiceRequest({ ...form });
      setSubmitted(true);
    } catch (error) {
      console.error("Submission Error:", error);
      await addDoc(collection(db, "leads"), { ...form, source: "Fallback Client-Side Capture", timestamp: serverTimestamp() });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

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
        <section key={phase.ph} className={`py-24 px-6 relative border-b border-gray-900 ${idx % 2 !== 0 ? 'bg-[#020202]' : ''}`}>
          <div className="container mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="text-sm font-black text-yellow-500 uppercase tracking-widest mb-2">Phase {phase.ph}</h2>
              <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">{phase.title}</h3>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">{phase.desc}</p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8 items-stretch">
              {phase.tiers.map(tier => (
                <PricingTier key={tier.title} phase={parseInt(phase.ph)} title={tier.title} subtitle={tier.sub} target={tier.target} description={tier.desc} priceStart={tier.price} features={tier.feats} isPopular={tier.pop} highlightColor={tier.pop ? "yellow-500" : "white"} icon={phase.icon} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="py-24 px-6 bg-black text-white border-t-8 border-yellow-500">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">
              You do not need another agency.<br/><span className="text-yellow-500">You need an Entity Manager.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              We have perfected the transition from legacy Inbound Marketing to <strong className="text-white">AI-Powered Journey Orchestration</strong>. We do not just get you seen. We get you mathematically verified.
            </p>
          </div>
          
          <div className="bg-[#111827] border border-gray-800 p-10 rounded-[2.5rem] shadow-2xl text-white relative min-h-[450px] flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-full h-2 bg-yellow-500 rounded-t-[2.5rem]"></div>
            {submitted ? (
              <div className="text-center animate-fade-in">
                <ShieldCheck className="mx-auto text-yellow-500 mb-6" size={72} />
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Request Secured</h3>
                <p className="font-bold text-gray-400 mb-8 text-sm leading-relaxed max-w-sm mx-auto">
                  Your intelligence brief has been dispatched to <strong className="text-white">{form.email}</strong>. The team is reviewing your entity data and will contact you shortly.
                </p>
                <button onClick={() => setSubmitted(false)} className="inline-block w-full bg-yellow-500 text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white transition-colors shadow-xl">Submit Another Request</button>
              </div>
            ) : (
              <div className="animate-fade-in">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 mt-2">Initialize Your Audit</h3>
                <p className="font-bold text-gray-400 mb-8 text-sm">Select your required protocol below. We will capture your request and immediately initialize your AI Entity Scanner.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" placeholder="Full Name" required className="w-full bg-[#0a0a0a] text-white p-4 rounded-xl border border-gray-800 outline-none focus:border-yellow-500 font-bold placeholder:font-normal transition-all" onChange={e => setForm({...form, name: e.target.value})} />
                  <div className="relative">
                    <select required defaultValue="" className="w-full bg-[#0a0a0a] text-white p-4 rounded-xl border border-gray-800 outline-none focus:border-yellow-500 font-bold transition-all appearance-none cursor-pointer" onChange={e => setForm({...form, service: e.target.value})}>
                      <option value="" disabled className="font-normal text-gray-500">Select Requested Architecture...</option>
                      {SERVICES_DATA.map(phase => (
                        <optgroup key={phase.ph} label={`Phase ${phase.ph}: ${phase.title}`}>
                          {phase.tiers.map(tier => (<option key={tier.title} value={tier.title}>{tier.title}</option>))}
                        </optgroup>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-yellow-500"><ChevronDown size={20} /></div>
                  </div>
                  <input type="text" placeholder="Website URL (e.g. www.yourbrand.com)" required className="w-full bg-[#0a0a0a] text-white p-4 rounded-xl border border-gray-800 outline-none focus:border-yellow-500 font-bold placeholder:font-normal transition-all" onChange={e => setForm({...form, website: e.target.value})} />
                  <input type="email" placeholder="Secure Email Address" required className="w-full bg-[#0a0a0a] text-white p-4 rounded-xl border border-gray-800 outline-none focus:border-yellow-500 font-bold placeholder:font-normal transition-all" onChange={e => setForm({...form, email: e.target.value})} />
                  <button type="submit" disabled={loading} className="w-full bg-yellow-500 text-black py-5 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-white transition-colors mt-4 shadow-xl disabled:opacity-70 flex justify-center items-center gap-2">
                    {loading ? 'Transmitting Request...' : 'Request Service Protocol'} <Zap size={16} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
