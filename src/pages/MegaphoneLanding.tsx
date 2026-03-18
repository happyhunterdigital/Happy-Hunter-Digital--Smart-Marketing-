import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, CheckCircle2, Volume2, ShieldCheck, ChevronDown, Star, MessageSquareCode, BrainCircuit, Server } from 'lucide-react';
import { db, functions } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

const OnboardingForm = () => {
  const [form, setForm] = useState({ name: '', website: '', service: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitServiceRequest = httpsCallable(functions, 'submitServiceRequest');
      await submitServiceRequest({ ...form });
      setSubmitted(true);
    } catch (error) {
      console.error("Submission Error:", error);
      alert("There was an error submitting your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-6 bg-black text-white border-t-8 border-yellow-500">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">
            You don&apos;t need another &quot;agency.&quot;<br/>
            <span className="text-yellow-500">You need an Entity Manager.</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            At Happy Hunter Digital, we&apos;ve perfected the transition from legacy Inbound Marketing to <strong className="text-white">AI-Powered Journey Orchestration</strong>. We don&apos;t just get you seen; we get you mathematically verified.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-lg font-bold"><CheckCircle2 className="text-yellow-500" /> Dominate ChatGPT &amp; Gemini</li>
            <li className="flex items-center gap-3 text-lg font-bold"><CheckCircle2 className="text-yellow-500" /> Secure &quot;Share of Model&quot;</li>
            <li className="flex items-center gap-3 text-lg font-bold"><CheckCircle2 className="text-yellow-500" /> Eradicate the Ghost Effect</li>
          </ul>
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
              <button onClick={() => setSubmitted(false)} className="inline-block w-full bg-yellow-500 text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white transition-colors shadow-xl">
                Submit Another Request
              </button>
            </div>
          ) : (
            <div className="animate-fade-in">
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 mt-2">Initialize Your Audit</h3>
              <p className="font-bold text-gray-400 mb-8 text-sm">Select your required protocol below. We will capture your request and immediately initialize your AI Entity Scanner.</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text" placeholder="Full Name" required
                  className="w-full bg-[#0a0a0a] text-white p-4 rounded-xl border border-gray-800 outline-none focus:border-yellow-500 font-bold placeholder:font-normal transition-all"
                  onChange={e => setForm({...form, name: e.target.value})}
                />
                <div className="relative">
                  <select
                    required
                    defaultValue=""
                    className="w-full bg-[#0a0a0a] text-white p-4 rounded-xl border border-gray-800 outline-none focus:border-yellow-500 font-bold transition-all appearance-none cursor-pointer"
                    onChange={e => setForm({...form, service: e.target.value})}
                  >
                    <option value="" disabled className="font-normal text-gray-500">Select Requested Architecture...</option>
                    
                    <optgroup label="Phase 1: Architecture">
                      <option value="The Digital Front Door (Starter Site)">The Digital Front Door (Starter Site)</option>
                      <option value="The Agentic Web Hub (AI-Ready)">The Agentic Web Hub (AI-Ready)</option>
                      <option value="The Premium Entity Blueprint">The Premium Entity Blueprint</option>
                    </optgroup>
                    
                    <optgroup label="Phase 2: Governance">
                      <option value="Local Authority & Verification (Tier 1)">Local Authority & Verification (Tier 1)</option>
                      <option value="National AI Growth & Triage (Tier 2)">National AI Growth & Triage (Tier 2)</option>
                      <option value="Enterprise Entity Governance (Tier 3)">Enterprise Entity Governance (Tier 3)</option>
                    </optgroup>
                    
                    <optgroup label="Phase 3: Agentic Social Media">
                      <option value="The Awareness Mesh (Ads)">The Awareness Mesh (Ads)</option>
                      <option value="The Acquisition Engine (Ads)">The Acquisition Engine (Ads)</option>
                      <option value="The Omnichannel Dominance (Ads)">The Omnichannel Dominance (Ads)</option>
                    </optgroup>
                    
                    <optgroup label="Phase 4: WhatsApp Bots">
                      <option value="Basic FAQ WhatsApp Bot">Basic FAQ WhatsApp Bot</option>
                      <option value="Advanced AI WhatsApp Bot">Advanced AI WhatsApp Bot</option>
                      <option value="Enterprise WhatsApp Bot">Enterprise WhatsApp Bot</option>
                    </optgroup>
                    
                    <optgroup label="Phase 5: Standalone Services">
                      <option value="Google Search Console Setup">Google Search Console Setup</option>
                      <option value="GBP Ultimate Setup">GBP Ultimate Setup</option>
                      <option value="Semantic Intent Mapping">Semantic Intent Mapping</option>
                      <option value="Custom GA4 Tracking">Custom GA4 Tracking</option>
                      <option value="Forensic Technical Audit">Forensic Technical Audit</option>
                      <option value="UX Behavioral Analysis">UX Behavioral Analysis</option>
                      <option value="Targeted AEO Content">Targeted AEO Content</option>
                      <option value="AEO Answer Blocks">AEO Answer Blocks</option>
                      <option value="Verified Visuals (Photo/Film)">Verified Visuals (Photo/Film)</option>
                      <option value="Strategic Consulting">Strategic Consulting</option>
                    </optgroup>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-yellow-500">
                    <ChevronDown size={20} />
                  </div>
                </div>
                <input
                  type="text" placeholder="Website URL (e.g. www.yourbrand.com)" required
                  className="w-full bg-[#0a0a0a] text-white p-4 rounded-xl border border-gray-800 outline-none focus:border-yellow-500 font-bold placeholder:font-normal transition-all"
                  onChange={e => setForm({...form, website: e.target.value})}
                />
                <input
                  type="email" placeholder="Secure Email Address" required
                  className="w-full bg-[#0a0a0a] text-white p-4 rounded-xl border border-gray-800 outline-none focus:border-yellow-500 font-bold placeholder:font-normal transition-all"
                  onChange={e => setForm({...form, email: e.target.value})}
                />
                <button
                  type="submit" disabled={loading}
                  className="w-full bg-yellow-500 text-black py-5 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-white transition-colors mt-4 shadow-xl disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {loading ? 'Transmitting Request...' : 'Request Service Protocol'}
                  <Zap size={16} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export const MegaphoneLanding: React.FC = () => {
  const heroServices = [
    "Generative Engine Optimization",
    "Google Business Profile",
    "Agentic Revenue Systems",
    "Entity Architecture",
    "Truth Table Verification"
  ];
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServiceIndex((prev) => (prev + 1) % heroServices.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-yellow-500 font-sans animate-fade-in selection:bg-black selection:text-yellow-500">
      
      {/* 1. THE HERO SECTION */}
      <section className="relative pt-24 pb-24 md:pt-32 md:pb-32 px-6 overflow-hidden border-b-[16px] border-black">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <path d="M 0 500 Q 250 300 500 500 T 1000 500" fill="none" stroke="#000" strokeWidth="4" />
            <path d="M 0 600 Q 250 400 500 600 T 1000 600" fill="none" stroke="#000" strokeWidth="2" className="animate-pulse" />
            <path d="M 0 400 Q 250 200 500 400 T 1000 400" fill="none" stroke="#000" strokeWidth="1" />
          </svg>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-xl">
            <Volume2 size={14} className="animate-pulse" />
            <span key={currentServiceIndex} className="animate-fade-in">{heroServices[currentServiceIndex]}</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black text-black uppercase tracking-tighter leading-[0.85] mb-8">
            We build smart WhatsApp bots and <br />
            <span className="text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">AI-Ready Websites</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-black font-bold max-w-3xl mx-auto mb-12 leading-relaxed">
            For South African business owners, brokers, and founders who are tired of losing high-value clients to competitors after hours. We ensure your business never misses a lead.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/audit" className="inline-flex items-center justify-center gap-3 bg-black text-yellow-500 px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-lg hover:bg-white hover:text-black transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-105">
              Initialize Smart Business Scan <ArrowRight size={24} />
            </Link>
          </div>

          {/* IMMEDIATE TRUST SIGNALS */}
          <div className="mt-8 flex flex-col items-center justify-center gap-2">
            <div className="flex gap-1 text-black">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="fill-black text-black" size={16} />
              ))}
            </div>
            <p className="text-sm text-black font-bold drop-shadow-md">
              Trusted by <strong>Profuse Beauty Cosmetics</strong>, <strong>Gamazine Factory Online</strong>, and 50+ local brands.
            </p>
          </div>
        </div>
      </section>

      {/* 2. COMPREHENSIVE PRICING ARCHITECTURE */}
      <section className="py-24 px-6 relative border-t-8 border-black border-b border-gray-900 bg-[#050505]">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-sm font-black text-yellow-500 uppercase tracking-widest mb-2">Phase 1</h2>
            <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Once-Off Entity Architecture</h3>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">This tier replaces traditional &quot;web design&quot; by providing high-performance, Server-Side Rendered (SSR) infrastructure engineered specifically for Large Language Model (LLM) ingestion and speed.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {/* Tier 1 */}
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 hover:border-yellow-500/30 transition-all flex flex-col relative">
              <div className="mb-8">
                <h4 className="text-2xl font-black text-white mb-1">The &quot;Digital Front Door&quot;</h4>
                <p className="text-yellow-500 text-xs font-bold uppercase tracking-widest">Starter Business Website</p>
              </div>
              <p className="text-sm text-gray-400 mb-8 pb-8 border-b border-gray-800">Best for: Startups needing a verified, high-speed footprint.</p>
              <div className="flex-grow space-y-4 mb-10">
                <p className="text-white text-sm font-medium">A lightning-fast, 1-to-3 page professional site to get your business online securely.</p>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5"/> Hand-coded 1–3 page static node</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5"/> Sub-200ms TTFB guarantee</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5"/> SSL security &amp; standard SEO</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5"/> Initial &quot;Digital Passport&quot; creation in Firestore</li>
                </ul>
              </div>
              <div className="mt-auto pt-6 border-t border-gray-800/50">
                <p className="text-gray-500 line-through text-sm">R7,500 – R12,500</p>
                <p className="text-3xl font-black text-white">R4,500 <span className="text-lg text-gray-500 font-medium">to</span> R12,500</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 mb-6">Once-Off Investment</p>
              </div>
            </div>

            {/* Tier 2 (Highlighted) */}
            <div className="bg-gradient-to-b from-[#111827] to-[#0a0a0a] border-2 border-yellow-500/50 rounded-3xl p-8 hover:border-yellow-500 transition-all flex flex-col relative shadow-[0_0_40px_rgba(234,179,8,0.1)] transform lg:-translate-y-4 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Most Popular</div>
              <div className="mb-8">
                <h4 className="text-2xl font-black text-white mb-1">The Agentic Web Hub</h4>
                <p className="text-yellow-500 text-xs font-bold uppercase tracking-widest">Professional AI-Ready Website</p>
              </div>
              <p className="text-sm text-gray-400 mb-8 pb-8 border-b border-gray-800">Best for: Established SMEs requiring dedicated service pages.</p>
              <div className="flex-grow space-y-4 mb-10">
                <p className="text-white text-sm font-medium">A comprehensive site built so Google and AI tools can easily read and recommend your services.</p>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5"/> 5–10 hand-coded pages (SSR)</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5"/> &quot;Truth Table&quot; initialized with verified claims</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5"/> LocalBusiness &amp; Organization schema markup</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5"/> Expert copywriting included</li>
                </ul>
              </div>
              <div className="mt-auto pt-6 border-t border-gray-800/50">
                <p className="text-gray-500 line-through text-sm">R18,000 – R28,000</p>
                <p className="text-3xl font-black text-yellow-500">R14,000 <span className="text-lg text-gray-500 font-medium">to</span> R19,000</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 mb-6">Once-Off Investment</p>
              </div>
            </div>

            {/* Tier 3 */}
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 hover:border-yellow-500/30 transition-all flex flex-col relative">
              <div className="mb-8">
                <h4 className="text-2xl font-black text-white mb-1">The Premium Blueprint</h4>
                <p className="text-yellow-500 text-xs font-bold uppercase tracking-widest">Brand Authority Website</p>
              </div>
              <p className="text-sm text-gray-400 mb-8 pb-8 border-b border-gray-800">Best for: High-value firms (medical, financial, legal).</p>
              <div className="flex-grow space-y-4 mb-10">
                <p className="text-white text-sm font-medium">The ultimate company website, including professional photography and video to build absolute trust.</p>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5"/> Deep architectural build</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5"/> Extensive JSON-LD schema mesh</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5"/> 2 hours of professional photography</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-yellow-500 shrink-0 mt-0.5"/> 3 hours of film for verified Knowledge Graph visual assets</li>
                </ul>
              </div>
              <div className="mt-auto pt-6 border-t border-gray-800/50">
                <p className="text-gray-500 line-through text-sm">R38,000 – R55,000+</p>
                <p className="text-3xl font-black text-white">R25,000 <span className="text-lg text-gray-500 font-medium">to</span> R55,000+</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 mb-6">Once-Off Investment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHASE 2: GOVERNANCE & AEO RETAINERS */}
      <section className="py-24 px-6 relative border-b border-gray-900 bg-[#020202]">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-sm font-black text-yellow-500 uppercase tracking-widest mb-2">Phase 2</h2>
            <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Entity Governance &amp; AEO Retainers</h3>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">This tier replaces standard SEO. These packages are recurring governance retainers focused on maintaining a 100% perfect Rich Results score, driving AI visibility, and triaging leads.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Monthly Tier 1 */}
            <div className="bg-black border border-gray-800 p-8 rounded-3xl hover:border-white/20 transition-all flex flex-col">
              <div className="mb-6">
                <h4 className="text-xl font-black text-white mb-1">Local Authority &amp; Verification</h4>
                <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest">Local Search Dominance</p>
              </div>
              <p className="text-gray-500 text-xs mb-6 font-medium pb-6 border-b border-gray-800">Target Scope: Single-city or suburban practices.</p>
              <div className="flex-grow mb-8">
                <p className="text-sm text-gray-300 mb-6">We manage your Google Maps and website so you show up first when people in your city search for your services.</p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex gap-2"><CheckCircle2 size={14} className="text-gray-500 shrink-0 mt-0.5"/> Active Google Business Profile (GBP) management</li>
                  <li className="flex gap-2"><CheckCircle2 size={14} className="text-gray-500 shrink-0 mt-0.5"/> Tracking up to 10 core keywords</li>
                  <li className="flex gap-2"><CheckCircle2 size={14} className="text-gray-500 shrink-0 mt-0.5"/> 1 RAG-optimized monthly blog post</li>
                  <li className="flex gap-2"><CheckCircle2 size={14} className="text-gray-500 shrink-0 mt-0.5"/> Ongoing technical maintenance</li>
                </ul>
              </div>
              <div className="mt-auto pt-6 border-t border-gray-800/50">
                <p className="text-gray-500 line-through text-xs">R8,500 – R12,500</p>
                <p className="text-2xl font-black text-white">R5,500 – R9,500 <span className="text-xs text-yellow-500 font-bold uppercase tracking-widest block mt-2">for the period of 3 months</span></p>
              </div>
            </div>

            {/* Monthly Tier 2 */}
            <div className="bg-black border border-yellow-500/30 p-8 rounded-3xl hover:border-yellow-500 transition-all flex flex-col shadow-xl relative">
              <div className="mb-6">
                <h4 className="text-xl font-black text-white mb-1">National AI Growth &amp; Lead Triage</h4>
                <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest">National Growth &amp; Lead Generation</p>
              </div>
              <p className="text-gray-500 text-xs mb-6 font-medium pb-6 border-b border-gray-800">Target Scope: SMEs targeting multiple cities or a province.</p>
              <div className="flex-grow mb-8">
                <p className="text-sm text-gray-300 mb-6">We optimize your site for nationwide searches and use AI to capture and filter your incoming leads.</p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex gap-2"><CheckCircle2 size={14} className="text-yellow-500 shrink-0 mt-0.5"/> Optimization for 20–50 core keywords</li>
                  <li className="flex gap-2"><CheckCircle2 size={14} className="text-yellow-500 shrink-0 mt-0.5"/> Continuous updates to Firestore &quot;Truth Table&quot;</li>
                  <li className="flex gap-2"><CheckCircle2 size={14} className="text-yellow-500 shrink-0 mt-0.5"/> Advanced schema (FAQ/HowTo)</li>
                  <li className="flex gap-2"><CheckCircle2 size={14} className="text-yellow-500 shrink-0 mt-0.5"/> Maintenance of the &quot;Neural Link&quot; Chatbot</li>
                </ul>
              </div>
              <div className="mt-auto pt-6 border-t border-gray-800/50">
                <p className="text-gray-500 line-through text-xs">R30,000 – R45,000</p>
                <p className="text-2xl font-black text-yellow-500">R21,000 – R34,000 <span className="text-xs text-yellow-500 font-bold uppercase tracking-widest block mt-2">for the period of 3 months</span></p>
              </div>
            </div>

            {/* Monthly Tier 3 */}
            <div className="bg-black border border-gray-800 p-8 rounded-3xl hover:border-white/20 transition-all flex flex-col">
              <div className="mb-6">
                <h4 className="text-xl font-black text-white mb-1">Enterprise Entity Governance</h4>
                <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest">Ultimate Brand Protection &amp; Visibility</p>
              </div>
              <p className="text-gray-500 text-xs mb-6 font-medium pb-6 border-b border-gray-800">Target Scope: National brands, high-risk brokers, e-commerce.</p>
              <div className="flex-grow mb-8">
                <p className="text-sm text-gray-300 mb-6">24/7 technical monitoring, legal data compliance, and aggressive strategy to make your massive brand the top answer everywhere.</p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex gap-2"><CheckCircle2 size={14} className="text-gray-500 shrink-0 mt-0.5"/> 24/7 Agentic Technical SEO monitoring</li>
                  <li className="flex gap-2"><CheckCircle2 size={14} className="text-gray-500 shrink-0 mt-0.5"/> POPIA/FAIS digital asset compliance auditing</li>
                  <li className="flex gap-2"><CheckCircle2 size={14} className="text-gray-500 shrink-0 mt-0.5"/> AI Share of Voice tracking</li>
                  <li className="flex gap-2"><CheckCircle2 size={14} className="text-gray-500 shrink-0 mt-0.5"/> Monthly live broadcast facilitation (OBS/Mux)</li>
                </ul>
              </div>
              <div className="mt-auto pt-6 border-t border-gray-800/50">
                <p className="text-gray-500 line-through text-xs">R75,000 – R120,000+</p>
                <p className="text-2xl font-black text-white">R55,000 – R109,000+ <span className="text-xs text-yellow-500 font-bold uppercase tracking-widest block mt-2">for the period of 3 months</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHASE 3: AGENTIC SOCIAL MEDIA */}
      <section className="py-24 px-6 relative border-b border-gray-900 bg-[#050505]">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-sm font-black text-yellow-500 uppercase tracking-widest mb-2">Phase 3</h2>
            <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">Agentic Social Media Packages</h3>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">These packages feed vital social signals and traffic back to the client&apos;s Digital Passport, utilizing active media spend to guarantee reach.</p>
          </div>
          <div className="overflow-x-auto bg-[#0a0a0a] rounded-3xl border border-gray-800 shadow-2xl">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-900 border-b border-gray-800 text-yellow-500">
                  <th className="p-6 font-bold uppercase tracking-widest text-xs w-1/4">Package Name</th>
                  <th className="p-6 font-bold uppercase tracking-widest text-xs w-1/4">Content &amp; Output</th>
                  <th className="p-6 font-bold uppercase tracking-widest text-xs w-1/3">Professional Services</th>
                  <th className="p-6 font-bold uppercase tracking-widest text-xs text-right w-auto">Investment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr className="hover:bg-gray-900/30 transition-colors">
                  <td className="p-6 align-top border-r border-gray-800/50">
                    <p className="font-bold text-white text-lg">The &quot;Awareness&quot; Mesh</p>
                    <p className="text-[10px] text-yellow-500 uppercase tracking-widest mt-1">Brand Awareness Ads</p>
                  </td>
                  <td className="p-6 text-gray-300 align-top text-sm">2 Promoted Adverts<br/>across 2 channels.</td>
                  <td className="p-6 text-gray-400 text-sm align-top leading-relaxed">
                    Entry-level social media ads designed to get people in your area to recognize your business name.<br/><br/>
                    <span className="text-white font-medium">Copywriting, design, plus <strong>R1,000</strong> allocated media spend.</span>
                  </td>
                  <td className="p-6 align-top text-right">
                    <p className="text-gray-500 line-through text-xs">R4,900</p>
                    <p className="font-black text-white text-xl">R3,500</p>
                    <p className="text-[10px] text-yellow-500 uppercase tracking-widest mt-1">for the period of 3 months</p>
                  </td>
                </tr>
                <tr className="hover:bg-gray-900/30 transition-colors">
                  <td className="p-6 align-top border-r border-gray-800/50">
                    <p className="font-bold text-white text-lg">The &quot;Acquisition&quot; Engine</p>
                    <p className="text-[10px] text-yellow-500 uppercase tracking-widest mt-1">Lead Generation Ads</p>
                  </td>
                  <td className="p-6 text-gray-300 align-top text-sm">4 Promoted Posts<br/>across 2 channels.</td>
                  <td className="p-6 text-gray-400 text-sm align-top leading-relaxed">
                    Aggressive, targeted social media campaigns designed to make people click, call, and buy.<br/><br/>
                    <span className="text-white font-medium">Elevated copywriting, advanced design, plus <strong>R2,000</strong> allocated media spend.</span>
                  </td>
                  <td className="p-6 align-top text-right">
                    <p className="text-gray-500 line-through text-xs">R8,500</p>
                    <p className="font-black text-yellow-500 text-xl">R6,500</p>
                    <p className="text-[10px] text-yellow-500 uppercase tracking-widest mt-1">for the period of 3 months</p>
                  </td>
                </tr>
                <tr className="hover:bg-gray-900/30 transition-colors">
                  <td className="p-6 align-top border-r border-gray-800/50">
                    <p className="font-bold text-white text-lg">The &quot;Omnichannel&quot; Dominance</p>
                    <p className="text-[10px] text-yellow-500 uppercase tracking-widest mt-1">Total Market Takeover</p>
                  </td>
                  <td className="p-6 text-gray-300 align-top text-sm">6 Promoted Posts<br/>across 3 channels.</td>
                  <td className="p-6 text-gray-400 text-sm align-top leading-relaxed">
                    High-budget advertising across multiple platforms (Facebook, LinkedIn, X) so your brand is everywhere your customers look.<br/><br/>
                    <span className="text-white font-medium">Priority copywriting, premium design execution, plus <strong>R4,000</strong> allocated media spend.</span>
                  </td>
                  <td className="p-6 align-top text-right">
                    <p className="text-gray-500 line-through text-xs">R14,500</p>
                    <p className="font-black text-white text-xl">R10,500</p>
                    <p className="text-[10px] text-yellow-500 uppercase tracking-widest mt-1">for the period of 3 months</p>
                  </td>
                </tr>
              </tbody>
            </table>
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
            {/* Basic Bot */}
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 hover:border-yellow-500/30 transition-all flex flex-col relative">
              <div className="mb-8">
                <MessageSquareCode className="text-yellow-500 mb-4" size={32} />
                <h4 className="text-2xl font-black text-white mb-1">Basic FAQ Bot</h4>
                <p className="text-yellow-500 text-xs font-bold uppercase tracking-widest">Automated Responder</p>
              </div>
              <p className="text-sm text-gray-400 mb-8 pb-8 border-b border-gray-800">Best for: Simple automated responses and basic customer queries.</p>
              <div className="flex-grow space-y-6 mb-10">
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Setup & Integration</p>
                  <p className="text-xl font-bold text-white">R3,000 – R12,000</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Conversation Build</p>
                  <p className="text-xl font-bold text-white">R2,000 – R4,000</p>
                </div>
              </div>
              <div className="mt-auto pt-6 border-t border-gray-800/50">
                <p className="text-yellow-500 font-bold text-lg">from R399 <span className="text-xs text-gray-500 font-medium uppercase tracking-widest">/ month</span></p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Maintenance & Server Costs</p>
              </div>
            </div>

            {/* Standard Bot */}
            <div className="bg-gradient-to-b from-[#111827] to-[#0a0a0a] border-2 border-yellow-500/50 rounded-3xl p-8 hover:border-yellow-500 transition-all flex flex-col relative shadow-[0_0_40px_rgba(234,179,8,0.1)] transform lg:-translate-y-4 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">High Intent</div>
              <div className="mb-8">
                <BrainCircuit className="text-yellow-500 mb-4" size={32} />
                <h4 className="text-2xl font-black text-white mb-1">Advanced AI Bot</h4>
                <p className="text-yellow-500 text-xs font-bold uppercase tracking-widest">Tailored NLP Solutions</p>
              </div>
              <p className="text-sm text-gray-400 mb-8 pb-8 border-b border-gray-800">Best for: Moderate integration with APIs and natural language interactions.</p>
              <div className="flex-grow space-y-6 mb-10">
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Setup & Integration</p>
                  <p className="text-xl font-bold text-yellow-500">R15,000 – R30,000</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Conversation Build</p>
                  <p className="text-xl font-bold text-white">R10,000 – R45,000</p>
                </div>
              </div>
              <div className="mt-auto pt-6 border-t border-gray-800/50">
                <p className="text-yellow-500 font-bold text-lg">from R399 <span className="text-xs text-gray-500 font-medium uppercase tracking-widest">/ month</span></p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Maintenance & Server Costs</p>
              </div>
            </div>

            {/* Enterprise Bot */}
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 hover:border-white/20 transition-all flex flex-col relative">
              <div className="mb-8">
                <Server className="text-yellow-500 mb-4" size={32} />
                <h4 className="text-2xl font-black text-white mb-1">Enterprise Bot</h4>
                <p className="text-yellow-500 text-xs font-bold uppercase tracking-widest">Deep System Integration</p>
              </div>
              <p className="text-sm text-gray-400 mb-8 pb-8 border-b border-gray-800">Best for: Complex machine learning, CRM routing, and custom workflows.</p>
              <div className="flex-grow space-y-6 mb-10">
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Setup & Integration</p>
                  <p className="text-xl font-bold text-white">R40,000+</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Conversation Build</p>
                  <p className="text-xl font-bold text-white">R50,000+</p>
                </div>
              </div>
              <div className="mt-auto pt-6 border-t border-gray-800/50">
                <p className="text-yellow-500 font-bold text-lg">Custom Quoted</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Maintenance & Server Costs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHASE 5: A LA CARTE SERVICES */}
      <section className="py-24 px-6 relative bg-[#050505]">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-sm font-black text-yellow-500 uppercase tracking-widest mb-2">Phase 5</h2>
            <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">Standalone &quot;Smart&quot; Services</h3>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">These are highly technical foot-in-the-door diagnostics and specialized one-off integrations.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl flex flex-col hover:border-white/20 transition-all">
              <h4 className="font-bold text-white text-lg mb-2">Google Search Console Setup</h4>
              <p className="text-sm text-gray-400 mb-6 flex-grow">Verification and direct crawler communication setup to uncover &quot;orphan pages&quot; and indexing errors.</p>
              <div className="pt-4 border-t border-gray-800/50">
                <p className="text-yellow-500 font-black text-xl">R990 <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-2">(Once-off)</span></p>
              </div>
            </div>
            <div className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl flex flex-col hover:border-white/20 transition-all">
              <h4 className="font-bold text-white text-lg mb-2">GBP Ultimate Setup</h4>
              <p className="text-sm text-gray-400 mb-6 flex-grow">Complete optimization of Google Business Profile categories, attributes, and local trust signals.</p>
              <div className="pt-4 border-t border-gray-800/50">
                <p className="text-yellow-500 font-black text-xl">R1,500 – R2,500 <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-2">(Once-off)</span></p>
              </div>
            </div>
            <div className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl flex flex-col hover:border-white/20 transition-all">
              <h4 className="font-bold text-white text-lg mb-2">Semantic Intent Mapping</h4>
              <p className="text-sm text-gray-400 mb-6 flex-grow">Mapping semantic clusters and user intents to define topical authority, bypassing standard keyword lists.</p>
              <div className="pt-4 border-t border-gray-800/50">
                <p className="text-yellow-500 font-black text-xl">R1,760 – R15,000 <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-2">(Once-off)</span></p>
              </div>
            </div>
            <div className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl flex flex-col hover:border-white/20 transition-all">
              <h4 className="font-bold text-white text-lg mb-2">Custom GA4 Tracking</h4>
              <p className="text-sm text-gray-400 mb-6 flex-grow">Configuration of GA4 to isolate and track AI/LLM referral traffic and document friction points.</p>
              <div className="pt-4 border-t border-gray-800/50">
                <p className="text-yellow-500 font-black text-xl">R5,500 – R11,000 <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-2">(Once-off)</span></p>
              </div>
            </div>
            <div className="p-8 bg-gradient-to-br from-[#111827] to-[#0a0a0a] border border-yellow-500/30 rounded-3xl flex flex-col hover:border-yellow-500 transition-all shadow-lg">
              <h4 className="font-bold text-white text-lg mb-2">Forensic Technical Audit</h4>
              <p className="text-sm text-gray-300 mb-6 flex-grow">Deep-dive architectural blueprint mapping crawl budgets, canonical tags, and server latency.</p>
              <div className="pt-4 border-t border-gray-800/50">
                <p className="text-yellow-500 font-black text-xl">R7,000 – R50,000+ <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-2">(Once-off)</span></p>
              </div>
            </div>
            <div className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl flex flex-col hover:border-white/20 transition-all">
              <h4 className="font-bold text-white text-lg mb-2">UX Behavioral Analysis</h4>
              <p className="text-sm text-gray-400 mb-6 flex-grow">Exhaustive, human-led qualitative research utilizing dynamic heatmaps and session recordings.</p>
              <div className="pt-4 border-t border-gray-800/50">
                <p className="text-yellow-500 font-black text-xl">R75,000 – R175,000 <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-2">(Once-off)</span></p>
              </div>
            </div>
            <div className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl flex flex-col hover:border-white/20 transition-all">
              <h4 className="font-bold text-white text-lg mb-2">Targeted AEO Content</h4>
              <p className="text-sm text-gray-400 mb-6 flex-grow">Creation of highly expert, human-generated articles engineered as magnets for organic LLM citations.</p>
              <div className="pt-4 border-t border-gray-800/50">
                <p className="text-yellow-500 font-black text-xl">R1,000 – R1,500 <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-2">(Per article)</span></p>
              </div>
            </div>
            <div className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl flex flex-col hover:border-white/20 transition-all">
              <h4 className="font-bold text-white text-lg mb-2">AEO &quot;Answer Blocks&quot;</h4>
              <p className="text-sm text-gray-400 mb-6 flex-grow">Restructuring existing pages into concise, schema-rich snippets designed for &quot;position zero&quot; extraction.</p>
              <div className="pt-4 border-t border-gray-800/50">
                <p className="text-yellow-500 font-black text-xl">R1,440</p>
              </div>
            </div>
            <div className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl flex flex-col hover:border-white/20 transition-all">
              <h4 className="font-bold text-white text-lg mb-2">Verified Visuals</h4>
              <p className="text-sm text-gray-400 mb-6 flex-grow">Dedicated capture sessions to establish authoritative visual assets for the client&apos;s Knowledge Graph.</p>
              <div className="pt-4 border-t border-gray-800/50">
                <p className="text-yellow-500 font-black text-xl">R4,500 <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mx-1">(Photo)</span> / R8,500 <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-1">(Film)</span></p>
              </div>
            </div>
            {/* STRATEGIC CONSULTING (UPDATED PRICE) */}
            <div className="p-8 bg-yellow-500/10 border border-yellow-500/30 rounded-3xl flex flex-col lg:col-span-3">
              <div className="flex flex-col md:flex-row justify-between gap-6 items-center">
                <div className="flex-1">
                  <h4 className="font-bold text-yellow-500 mb-2">Strategic Consulting</h4>
                  <p className="text-sm text-gray-300 flex-grow">Purely strategic, bi-weekly consultation based on real-time algorithmic weather and data tracking.</p>
                </div>
                <div className="text-left md:text-right shrink-0">
                  <p className="text-gray-500 line-through text-xs">R1,600</p>
                  <p className="text-yellow-500 font-black text-2xl">R950</p>
                  <p className="text-[10px] font-bold tracking-widest text-yellow-500/70 uppercase mt-1">for the period of 3 months</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <OnboardingForm />

    </div>
  );
};
