import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Database, ArrowRight, Zap, CheckCircle2, Activity, Volume2, ShieldCheck, ChevronDown } from 'lucide-react';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const MegaphoneLanding: React.FC = () => {
    const [form, setForm] = useState({ name: '', website: '', service: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addDoc(collection(db, "leads"), {
                ...form,
                source: "AI Megaphone Landing Page - Service Request",
                timestamp: serverTimestamp()
            });

            let dynamicProblem = "";
            if (form.service.includes("RAG-Ready")) {
                dynamicProblem = "Your brand is present online, but AI models like Gemini and ChatGPT aren't citing you as the expert source yet.";
            } else if (form.service.includes("Digital Passport")) {
                dynamicProblem = "Your digital footprint is fragmented, making it hard for both Google and potential customers to verify that you're the safest choice.";
            } else if (form.service.includes("Agentic Revenue")) {
                dynamicProblem = "You have traffic, but your team is losing leads because you don't have a 24/7 intelligent system to capture and qualify them instantly.";
            } else {
                dynamicProblem = "You have digital assets, but they aren't working together as a cohesive ecosystem to attract, convert, and retain high-value clients.";
            }

            const firstName = form.name.split(' ')[0] || 'there';
            
            const emailHtml = `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; line-height: 1.6; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
                <p style="font-size: 16px;">Hi ${firstName},</p>
                <p style="font-size: 16px;">Welcome to the hunt for smarter growth.</p>
                <p style="font-size: 16px;">I noticed you were looking into <strong>${form.service}</strong>. Most businesses come to us because they realize that simply "ranking" on page one isn't enough anymore. In 2026, if you aren't being synthesized into the answers provided by AI assistants, you're effectively invisible.</p>
                
                <h3 style="color: #000; margin-top: 30px;">The Problem We Identified:</h3>
                <p style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #eab308; margin-bottom: 20px; font-size: 16px; border-radius: 0 8px 8px 0;">
                    Based on your interest, it sounds like you're facing a common challenge: <br/><br/><strong>${dynamicProblem}</strong>
                </p>

                <h3 style="color: #000; margin-top: 30px;">How Happy Hunter Solves This:</h3>
                <p style="font-size: 16px;">We don't just "do marketing." We build a Smart Authority Ecosystem for you. By applying our Digital Entity Management & Optimization (DEMO) framework, we ensure that:</p>
                <ul style="font-size: 16px; margin-bottom: 30px;">
                    <li style="margin-bottom: 10px;"><strong>You are Verified:</strong> Your digital passport is flawless.</li>
                    <li style="margin-bottom: 10px;"><strong>You are Recommended:</strong> AI engines cite you as the authority.</li>
                    <li><strong>You are Automated:</strong> Leads are converted while you sleep.</li>
                </ul>

                <div style="background-color: #050505; color: #fff; padding: 30px; text-align: center; border-radius: 12px; margin-top: 40px;">
                    <h3 style="color: #eab308; margin-top: 0;">What's Next?</h3>
                    <p style="color: #d1d5db; margin-bottom: 25px;">Our system has already started a preliminary scan of your digital entity. I'd love to walk you through the results.</p>
                    <a href="https://calendly.com/motsumitl/30min" style="background-color: #eab308; color: #000; padding: 16px 32px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">Book Entity Strategy Session</a>
                </div>

                <p style="margin-top: 40px; font-size: 16px;">Stay Smart,<br/><br/><strong>Thabo Leslie Motsumi</strong><br/><span style="color: #666; font-size: 14px;">Happy Hunter -Smart Marketing-</span></p>
            </div>
            `;

            await addDoc(collection(db, "mail"), {
                to: [form.email],
                message: {
                    subject: `Regarding your interest in ${form.service} – Let's solve the "Invisibility" problem.`,
                    html: emailHtml
                }
            });

        } catch (error) {
            console.error("Lead/Email capture warning:", error);
        } finally {
            setLoading(false);
            setSubmitted(true);
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
                        <Volume2 size={14} className="animate-pulse" /> Generative Engine Optimization
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

            {/* 2. THE NEW PRICING ARCHITECTURE INTEGRATION */}
            <section className="bg-[#050505] text-white py-24 px-6 relative border-t-8 border-black">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 text-white">
                            The 2026 <span className="text-yellow-500">Service Protocol</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
                            We don&apos;t build standard websites. We architect high-performance, AI-ingestible Digital Entities that algorithmically dominate local search and large language models.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {/* Package 1 */}
                        <div className="p-8 border border-gray-800 rounded-3xl bg-[#0a0a0a] hover:border-yellow-500/30 transition-all flex flex-col">
                            <div className="mb-4 pb-4 border-b border-gray-800">
                                <h3 className="text-xl font-black uppercase text-white mb-1">Starter Business Node</h3>
                                <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest">Digital Front Door</p>
                            </div>
                            <p className="text-gray-400 text-sm mb-6 leading-relaxed">A lightning-fast, 1-to-3 page professional site to get your business online securely.</p>
                            <ul className="space-y-3 text-sm text-gray-300 mb-8 flex-grow">
                                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-green-500 shrink-0 mt-1"/> Hand-coded static node</li>
                                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-green-500 shrink-0 mt-1"/> Sub-200ms TTFB guarantee</li>
                                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-green-500 shrink-0 mt-1"/> Initial &quot;Digital Passport&quot; creation</li>
                            </ul>
                            <div>
                                <p className="text-gray-500 line-through text-xs">R7,500 – R12,500</p>
                                <p className="text-2xl font-black text-white">R4,500+</p>
                            </div>
                        </div>

                        {/* Package 2 */}
                        <div className="p-8 border-2 border-yellow-500/50 rounded-3xl bg-gradient-to-b from-[#111827] to-[#0a0a0a] hover:border-yellow-500 transition-all shadow-[0_0_30px_rgba(234,179,8,0.1)] flex flex-col relative transform md:-translate-y-4">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Most Popular</div>
                            <div className="mb-4 pb-4 border-b border-gray-800">
                                <h3 className="text-xl font-black uppercase text-white mb-1">Professional AI-Ready</h3>
                                <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest">The Agentic Web Hub</p>
                            </div>
                            <p className="text-gray-300 text-sm mb-6 leading-relaxed">A comprehensive 5-10 page site built so Google and AI tools can easily read and recommend your services.</p>
                            <ul className="space-y-3 text-sm text-gray-200 mb-8 flex-grow">
                                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-yellow-500 shrink-0 mt-1"/> &quot;Truth Table&quot; initialized</li>
                                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-yellow-500 shrink-0 mt-1"/> LocalBusiness Schema markup</li>
                                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-yellow-500 shrink-0 mt-1"/> Server-Side Rendered (SSR)</li>
                                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-yellow-500 shrink-0 mt-1"/> Expert copywriting</li>
                            </ul>
                            <div>
                                <p className="text-gray-500 line-through text-xs">R18,000 – R28,000</p>
                                <p className="text-3xl font-black text-yellow-500">R14,000+</p>
                            </div>
                        </div>

                        {/* Package 3 */}
                        <div className="p-8 border border-gray-800 rounded-3xl bg-[#0a0a0a] hover:border-yellow-500/30 transition-all flex flex-col">
                            <div className="mb-4 pb-4 border-b border-gray-800">
                                <h3 className="text-xl font-black uppercase text-white mb-1">Premium Brand Authority</h3>
                                <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest">The Entity Blueprint</p>
                            </div>
                            <p className="text-gray-400 text-sm mb-6 leading-relaxed">The ultimate company architecture. Deep architectural build with professional photography and video.</p>
                            <ul className="space-y-3 text-sm text-gray-300 mb-8 flex-grow">
                                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-green-500 shrink-0 mt-1"/> Extensive JSON-LD schema mesh</li>
                                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-green-500 shrink-0 mt-1"/> 2 hours of professional photography</li>
                                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-green-500 shrink-0 mt-1"/> 3 hours of film for visual assets</li>
                            </ul>
                            <div>
                                <p className="text-gray-500 line-through text-xs">R38,000 – R55,000+</p>
                                <p className="text-2xl font-black text-white">R25,000+</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. LEAD CAPTURE (SERVICE REQUEST) */}
            <section className="py-24 px-6 bg-black text-white">
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
                            <li className="flex items-center gap-3 text-lg font-bold"><CheckCircle2 className="text-yellow-500" /> Dominate ChatGPT & Gemini</li>
                            <li className="flex items-center gap-3 text-lg font-bold"><CheckCircle2 className="text-yellow-500" /> Secure &quot;Share of Model&quot;</li>
                            <li className="flex items-center gap-3 text-lg font-bold"><CheckCircle2 className="text-yellow-500" /> Eradicate the Ghost Effect</li>
                        </ul>
                    </div>

                    <div className="bg-yellow-500 p-10 rounded-[2.5rem] shadow-2xl text-black relative min-h-[450px] flex flex-col justify-center">
                        <div className="absolute top-0 left-0 w-full h-2 bg-white rounded-t-[2.5rem]"></div>
                        
                        {submitted ? (
                            <div className="text-center animate-fade-in">
                                <ShieldCheck className="mx-auto text-black mb-6" size={72} />
                                <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">Request Secured</h3>
                                <p className="font-bold text-black/80 mb-8 text-sm leading-relaxed max-w-sm mx-auto">
                                    Your intelligence brief has been dispatched to <strong>{form.email}</strong>. Thabo and the team are reviewing your entity data and will contact you shortly.
                                </p>
                                <Link to="/" className="inline-block w-full bg-black text-yellow-500 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-gray-900 transition-colors shadow-xl">
                                    Return to Command Center
                                </Link>
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 mt-2">Deploy System Architecture</h3>
                                <p className="font-bold text-black/70 mb-8 text-sm">Select your required protocol below. We will capture your request and immediately initialize your AI Entity Scanner.</p>
                                
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <input 
                                        type="text" placeholder="Full Name" required
                                        className="w-full bg-white p-4 rounded-xl border-2 border-black/10 outline-none focus:border-black font-bold placeholder:font-normal transition-all"
                                        onChange={e => setForm({...form, name: e.target.value})}
                                    />
                                    
                                    <div className="relative">
                                        <select 
                                            required
                                            defaultValue=""
                                            className="w-full bg-white p-4 rounded-xl border-2 border-black/10 outline-none focus:border-black font-bold text-gray-900 transition-all appearance-none cursor-pointer"
                                            onChange={e => setForm({...form, service: e.target.value})}
                                        >
                                            <option value="" disabled className="font-normal text-gray-500">Select Requested Architecture...</option>
                                            <option value="RAG-Ready Authority Site (AI-Optimized Website)">RAG-Ready Authority Site (AI-Optimized Website)</option>
                                            <option value="Entity-Based Digital Passport (Google & Maps Verification)">Entity-Based Digital Passport (Google & Maps Verification)</option>
                                            <option value="Agentic Revenue Engine (24/7 AI Lead Automation)">Agentic Revenue Engine (24/7 AI Lead Automation)</option>
                                            <option value="Smart Inbound Hub (Personalized Marketing Funnel)">Smart Inbound Hub (Personalized Marketing Funnel)</option>
                                            <option value="Forensic Technical Audit (R7,000+)">Forensic Technical Audit (R7,000+)</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                                            <ChevronDown size={20} />
                                        </div>
                                    </div>

                                    <input 
                                        type="text" placeholder="Website URL (e.g. www.yourbrand.com)" required
                                        className="w-full bg-white p-4 rounded-xl border-2 border-black/10 outline-none focus:border-black font-bold placeholder:font-normal transition-all"
                                        onChange={e => setForm({...form, website: e.target.value})}
                                    />
                                    
                                    <input 
                                        type="email" placeholder="Secure Email Address" required
                                        className="w-full bg-white p-4 rounded-xl border-2 border-black/10 outline-none focus:border-black font-bold placeholder:font-normal transition-all"
                                        onChange={e => setForm({...form, email: e.target.value})}
                                    />
                                    
                                    <button 
                                        type="submit" disabled={loading}
                                        className="w-full bg-black text-yellow-500 py-5 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-gray-900 transition-colors mt-4 shadow-xl disabled:opacity-70 flex justify-center items-center gap-2"
                                    >
                                        {loading ? 'Transmitting Request...' : 'Request Service Protocol'} <Zap size={16} />
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* SHARED FOOTER IMAGE BANNER */}
            <section className="relative py-32 border-t border-gray-800 overflow-hidden bg-[#050505] flex items-center justify-center text-center">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761706/Happy_Hunter_work_space_jovfrh.png" 
                        alt="Digital Dominance" 
                        className="w-full h-full object-cover object-center opacity-30 grayscale mix-blend-overlay transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>
                </div>
                <div className="relative z-10 container mx-auto px-6 max-w-3xl">
                    <ShieldCheck className="mx-auto text-yellow-500 mb-6" size={48} />
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-none">Initialize <br/><span className="text-yellow-500">The Protocol</span></h2>
                    <p className="text-gray-400 text-lg mb-10">Stop losing revenue to invisible algorithms. Secure your digital passport today.</p>
                    <Link to="/the-ai-megaphone" className="inline-flex items-center justify-center gap-3 bg-yellow-500 text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                        Commence Onboarding <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

        </div>
    );
};
