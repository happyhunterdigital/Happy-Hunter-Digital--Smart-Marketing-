import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, CheckCircle2, Volume2, ShieldCheck, ChevronDown } from 'lucide-react';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebaseConfig';

export const MegaphoneLanding: React.FC = () => {
    const [form, setForm] = useState({ name: '', website: '', service: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Call the Cloud Function to send the welcome email
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
            // Fallback: If cloud function fails, at least save the lead locally
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

            {/* 2. LEAD CAPTURE FORM (Restored Position) */}
            <section className="py-24 px-6 bg-black text-white border-b-8 border-yellow-500">
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
                                    Your intelligence brief has been dispatched to <strong className="text-white">{form.email}</strong>. Thabo and the team are reviewing your entity data and will contact you shortly.
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
                                                <option value="Google Search Console Setup">Google Search Console Setup</option>
                                                <option value="GBP Ultimate Setup">GBP Ultimate Setup</option>
                                                <option value="Semantic Intent Mapping">Semantic Intent Mapping</option>
                                                <option value="Custom GA4 Tracking">Custom GA4 Tracking</option>
                                                <option value="Forensic Technical Audit">Forensic Technical Audit</option>
                                                <option value="Neural Link Chatbot">Neural Link Chatbot</option>
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
                                        {loading ? 'Transmitting Request...' : 'Request Service Protocol'} <Zap size={16} />
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 3. PRICING ARCHITECTURE (Reference) */}
            <section className="py-24 px-6 relative bg-[#050505]">
              <div className="container mx-auto max-w-7xl">
                <div className="text-center p-10 border border-gray-800 rounded-3xl bg-[#0a0a0a]">
                    <p className="text-gray-400 mb-6">Review the full architectural pricing breakdown below to confirm your selection.</p>
                    
                    {/* Strategic Consulting Card (Updated Price) */}
                    <div className="p-8 bg-yellow-500/10 border border-yellow-500/30 rounded-3xl flex flex-col max-w-2xl mx-auto text-left mt-8">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                          <div className="flex-1">
                            <h4 className="font-bold text-yellow-500 mb-2">Strategic Consulting</h4>
                            <p className="text-sm text-gray-300 mb-6 flex-grow">Purely strategic, bi-weekly consultation based on real-time algorithmic weather and data tracking.</p>
                          </div>
                          <div className="text-left md:text-right shrink-0">
                            <p className="text-gray-500 line-through text-xs">R1,600</p>
                            <p className="text-yellow-500 font-black text-2xl">R950</p>
                            <p className="text-[10px] font-bold tracking-widest text-yellow-500/70 uppercase mt-1">for the period of 3 months</p>
                          </div>
                        </div>
                    </div>

                    <Link to="/services" className="inline-block mt-8 bg-white text-black px-8 py-3 rounded-xl font-bold uppercase text-xs hover:bg-yellow-500 transition-colors">View Full Pricing Architecture</Link>

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
