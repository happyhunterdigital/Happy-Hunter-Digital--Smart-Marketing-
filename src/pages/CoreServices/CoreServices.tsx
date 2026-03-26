import React, { useState } from 'react';
import { ArrowRight, Zap, ShieldCheck, ChevronDown, Star, MessageSquareCode, BrainCircuit, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, functions } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { PricingTier } from './PricingTier';

export const CoreServices: React.FC = () => {
  const [form, setForm] = useState({ name: '', website: '', service: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitServiceRequest = httpsCallable(functions, 'submitServiceRequest');
      await submitServiceRequest({
        name: form.name,
        website: form.website,
        service: form.service,
        email: form.email
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Submission Error:", error);
      await addDoc(collection(db, "leads"), {
        ...form,
        source: "Fallback Client-Side Capture",
        timestamp: serverTimestamp()
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen pb-0 animate-fade-in font-sans selection:bg-yellow-500 selection:text-black">
      {/* HERO */}
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

      {/* PHASE 1: ONCE-OFF ENTITY ARCHITECTURE */}
      <section className="py-24 px-6 relative border-b border-gray-900">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-sm font-black text-yellow-500 uppercase tracking-widest mb-2">Phase 1</h2>
            <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Once-Off Entity Architecture</h3>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">This tier replaces traditional "web design" by providing high-performance, Server-Side Rendered (SSR) infrastructure engineered specifically for Large Language Model (LLM) ingestion.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            <PricingTier 
              phase={1}
              title="The Digital Front Door"
              subtitle="Starter Business Website"
              target="Startups needing a verified, high-speed footprint."
              description="A lightning-fast, 1-to-3 page professional site to get your business online securely."
              priceStart="R4,500"
              priceEnd="R12,500"
              features={["Hand-coded 1–3 page static node", "Sub-200ms TTFB guarantee", "SSL security & standard SEO", "Initial 'Digital Passport' creation in Firestore"]}
              highlightColor="white"
            />
            <PricingTier 
              phase={1}
              title="The Agentic Web Hub"
              subtitle="Professional AI-Ready Website"
              target="Established SMEs requiring dedicated service pages."
              description="A comprehensive site built so Google and AI tools can easily read and recommend your services."
              priceStart="R14,000"
              priceEnd="R19,000"
              features={["5–10 hand-coded pages (SSR)", "'Truth Table' initialized with verified claims", "LocalBusiness & Organization schema markup", "Expert copywriting included"]}
              isPopular={true}
              highlightColor="yellow-500"
            />
            <PricingTier 
              phase={1}
              title="The Premium Blueprint"
              subtitle="Brand Authority Website"
              target="High-value firms (medical, financial, legal)."
              description="The ultimate company website, including professional photography and video to build absolute trust."
              priceStart="R25,000"
              priceEnd="R55,000+"
              features={["Deep architectural build", "Extensive JSON-LD schema mesh", "2 hours of professional photography", "3 hours of film for verified Knowledge Graph visual assets"]}
              highlightColor="white"
            />
          </div>
        </div>
      </section>

      {/* PHASE 4: INTELLIGENT WHATSAPP BOTS */}
      <section className="py-24 px-6 relative border-b border-gray-900 bg-[#020202]">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-sm font-black text-yellow-500 uppercase tracking-widest mb-2">Phase 4</h2>
            <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Intelligent WhatsApp Bots</h3>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Deploy a 24/7 automated workforce. Capture leads, answer FAQs, and route complex queries directly to your CRM.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            <PricingTier 
              phase={4}
              title="Basic FAQ Bot"
              subtitle="Automated Responder"
              target="Simple automated responses and basic customer queries."
              description="Setup & Integration: R3,000 – R12,000 | Conversation Build: R2,000 – R4,000"
              priceStart="R399"
              period="month"
              features={[]}
              highlightColor="white"
              icon={<MessageSquareCode size={32} />}
            />
            <PricingTier 
              phase={4}
              title="Advanced AI Bot"
              subtitle="Tailored NLP Solutions"
              target="Moderate integration with APIs and natural language interactions."
              description="Setup & Integration: R15,000 – R30,000 | Conversation Build: R10,000 – R45,000"
              priceStart="R399"
              period="month"
              features={[]}
              isPopular={true}
              highlightColor="yellow-500"
              icon={<BrainCircuit size={32} />}
            />
            <PricingTier 
              phase={4}
              title="Enterprise Bot"
              subtitle="Deep System Integration"
              target="Complex machine learning, CRM routing, and custom workflows."
              description="Setup & Integration: R40,000+ | Conversation Build: R50,000+"
              priceStart="Custom Quoted"
              features={[]}
              highlightColor="white"
              icon={<Server size={32} />}
            />
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section className="py-24 px-6 bg-black text-white border-t-8 border-yellow-500">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">
              You don't need another "agency."<br/>
              <span className="text-yellow-500">You need an Entity Manager.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              At Happy Hunter Digital, we've perfected the transition from legacy Inbound Marketing to <strong className="text-white">AI-Powered Journey Orchestration</strong>. We don't just get you seen; we get you mathematically verified.
            </p>
          </div>
          <div className="bg-[#111827] border border-gray-800 p-10 rounded-[2.5rem] shadow-2xl text-white relative min-h-[450px] flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-full h-2 bg-yellow-500 rounded-t-[2.5rem]"></div>
            {submitted ? (
              <div className="text-center animate-fade-in">
                <ShieldCheck className="mx-auto text-yellow-500 mb-6" size={72} />
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Request Secured</h3>
                <p className="font-bold text-gray-400 mb-8 text-sm leading-relaxed max-w-sm mx-auto">Your intelligence brief has been dispatched to <strong className="text-white">{form.email}</strong>. The team is reviewing your entity data and will contact you shortly.</p>
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
                      <optgroup label="Phase 1: Architecture">
                        <option value="The Digital Front Door (Starter Site)">The Digital Front Door (Starter Site)</option>
                        <option value="The Agentic Web Hub (AI-Ready)">The Agentic Web Hub (AI-Ready)</option>
                        <option value="The Premium Entity Blueprint">The Premium Entity Blueprint</option>
                      </optgroup>
                      <optgroup label="Phase 4: WhatsApp Bots">
                        <option value="Basic FAQ WhatsApp Bot">Basic FAQ WhatsApp Bot</option>
                        <option value="Advanced AI WhatsApp Bot">Advanced AI WhatsApp Bot</option>
                        <option value="Enterprise WhatsApp Bot">Enterprise WhatsApp Bot</option>
                      </optgroup>
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
