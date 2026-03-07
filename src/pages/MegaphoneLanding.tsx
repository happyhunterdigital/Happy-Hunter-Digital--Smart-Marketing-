import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, CheckCircle2, Volume2, ShieldCheck, ChevronDown, Database, Target, Mail, MapPin, Search, BarChart, Code, ShoppingCart, LayoutTemplate, Server } from 'lucide-react';
import { db, functions } from '../firebaseConfig';
import { httpsCallable } from 'firebase/functions';

// This is the SAME Onboarding Form component, now self-contained in this file.
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
                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 mt-2">Deploy System Architecture</h3>
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
                                        <optgroup label="Phase 4: Standalone Services">
                                            <option value="Strategic Consulting">Strategic Consulting</option>
                                        </optgroup>
                                    </select>
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-yellow-500"><ChevronDown size={20} /></div>
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
                                    {loading ? 'Transmitting Request...' : 'Request Service Protocol'} <Zap size={16} />
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
    // Cycling Hero Text Logic
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
                        Stop Ranking.<br />
                        <span className="text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">Start Being<br />Recommended.</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-black font-bold max-w-3xl mx-auto mb-12 leading-relaxed">
                        Traditional SEO is a ghost town. In 2026, the most valuable customers don&apos;t search—they ask. We ensure ChatGPT, Gemini, and Perplexity cite your business as the definitive answer.
                    </p>
                    
                    <Link to="/audit" className="inline-flex items-center justify-center gap-3 bg-black text-yellow-500 px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-lg hover:bg-white hover:text-black transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-105">
                        Get Your AI Authority Audit <ArrowRight size={24} />
                    </Link>
                </div>
            </section>
            
            {/* ONBOARDING FORM */}
            <OnboardingForm />

            {/* FULL PRICING ARCHITECTURE */}
            <section className="py-24 px-6 relative bg-[#050505] border-t border-black">
              <div className="container mx-auto max-w-7xl">
                <div className="mb-16 text-center">
                  <h2 className="text-sm font-black text-yellow-500 uppercase tracking-widest mb-2">Phase 1</h2>
                  <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Once-Off Entity Architecture</h3>
                  <p className="text-gray-400 mt-4 max-w-2xl mx-auto">This tier replaces traditional &quot;web design&quot; by providing high-performance, Server-Side Rendered (SSR) infrastructure engineered specifically for Large Language Model (LLM) ingestion and speed.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-stretch">
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
            
            {/* SHARED FOOTER IMAGE BANNER */}
            <section className="relative h-[60vh] min-h-[500px] border-t border-black overflow-hidden bg-[#050505] flex items-center justify-center text-center">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://res.cloudinary.com/dka0498ns/image/upload/v1772910872/happyhunterdigital_mock_logo_rybzv3.png" 
                  alt="Digital Dominance Footer" 
                  className="w-full h-full object-cover object-bottom opacity-50 mix-blend-screen transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-[#050505]/30"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-transparent h-32"></div>
              </div>
              <div className="relative z-10 container mx-auto px-6 max-w-3xl">
                <ShieldCheck className="mx-auto text-yellow-500 mb-6" size={56} />
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6 leading-none drop-shadow-2xl">Initialize <br/><span className="text-yellow-500">The Protocol</span></h2>
                <p className="text-gray-300 text-xl md:text-2xl font-medium mb-10 drop-shadow-lg">Stop losing revenue to invisible algorithms. Secure your digital passport today.</p>
                <Link to="/audit" className="inline-flex items-center justify-center gap-3 bg-yellow-500 text-black px-12 py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_40px_rgba(234,179,8,0.4)] hover:scale-105">
                  Commence Onboarding <ArrowRight size={20} />
                </Link>
              </div>
            </section>
        </div>
    );
};
