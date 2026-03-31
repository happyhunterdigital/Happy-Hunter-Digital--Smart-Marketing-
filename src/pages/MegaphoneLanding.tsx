// src/pages/MegaphoneLanding.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, CheckCircle2, Volume2, ShieldCheck, ChevronDown, Database, BrainCircuit, Mail, MessageSquareCode, FileText, Mic, CalendarCheck, Magnet } from 'lucide-react';
import { db, functions } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { SERVICES_DATA } from './CoreServices/CoreServices';

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
            You do not need another agency.<br/>
            <span className="text-yellow-500">You need an Entity Manager.</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            At Happy Hunter Digital, we have perfected the transition from legacy Inbound Marketing to <strong className="text-white">AI-Powered Journey Orchestration</strong>. We do not just get you seen. We get you mathematically verified.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-lg font-bold"><CheckCircle2 className="text-yellow-500" /> Dominate ChatGPT & Gemini</li>
            <li className="flex items-center gap-3 text-lg font-bold"><CheckCircle2 className="text-yellow-500" /> Secure Share of Model</li>
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
                <input type="text" placeholder="Full Name" required className="w-full bg-[#0a0a0a] text-white p-4 rounded-xl border border-gray-800 outline-none focus:border-yellow-500 font-bold placeholder:font-normal transition-all" onChange={e => setForm({...form, name: e.target.value})} />
                <div className="relative">
                  <select required defaultValue="" className="w-full bg-[#0a0a0a] text-white p-4 rounded-xl border border-gray-800 outline-none focus:border-yellow-500 font-bold transition-all appearance-none cursor-pointer" onChange={e => setForm({...form, service: e.target.value})}>
                    <option value="" disabled className="font-normal text-gray-500">Select Requested Architecture...</option>
                    {SERVICES_DATA.map(phase => (
                      <optgroup key={phase.phase} label={`Phase ${phase.phase}: ${phase.title}`}>
                        {phase.tiers.map(tier => (
                          <option key={tier.title} value={tier.title}>{tier.title}</option>
                        ))}
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
  );
};

export const MegaphoneLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-yellow-500 font-sans animate-fade-in selection:bg-black selection:text-yellow-500">
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
            <span className="animate-fade-in">Comprehensive 2026 Capabilities</span>
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
        </div>
      </section>

      <section className="py-24 px-6 bg-[#050505] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Our 8-Phase Architectural Protocol</h2>
             <p className="text-gray-400 max-w-2xl mx-auto text-lg">We deploy highly specialized, modular services tailored for the South African market to guarantee AI discovery and agentic conversion.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-3xl hover:border-yellow-500 transition-colors group">
               <Database className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
               <h3 className="font-bold text-lg mb-2">Entity Architecture</h3>
               <p className="text-sm text-gray-400">High-performance SSR structures for LLM ingestion.</p>
             </div>
             <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-3xl hover:border-yellow-500 transition-colors group">
               <BrainCircuit className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
               <h3 className="font-bold text-lg mb-2">AI Personalization</h3>
               <p className="text-sm text-gray-400">Real-time recommendation engines and dynamic content.</p>
             </div>
             <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-3xl hover:border-yellow-500 transition-colors group">
               <Mail className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
               <h3 className="font-bold text-lg mb-2">Email Marketing</h3>
               <p className="text-sm text-gray-400">Generative AI testing and lifecycle automation.</p>
             </div>
             <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-3xl hover:border-yellow-500 transition-colors group">
               <MessageSquareCode className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
               <h3 className="font-bold text-lg mb-2">WhatsApp Commerce</h3>
               <p className="text-sm text-gray-400">Native catalogs, NLP bots, and in-chat payments.</p>
             </div>
             <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-3xl hover:border-yellow-500 transition-colors group">
               <FileText className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
               <h3 className="font-bold text-lg mb-2">E-E-A-T Content</h3>
               <p className="text-sm text-gray-400">Human-led thought leadership and expert writing.</p>
             </div>
             <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-3xl hover:border-yellow-500 transition-colors group">
               <Mic className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
               <h3 className="font-bold text-lg mb-2">Voice & Chat Agents</h3>
               <p className="text-sm text-gray-400">Automated receptionists handling queries 24/7.</p>
             </div>
             <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-3xl hover:border-yellow-500 transition-colors group">
               <CalendarCheck className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
               <h3 className="font-bold text-lg mb-2">Direct Bookings</h3>
               <p className="text-sm text-gray-400">Bypass high-commission OTAs with smart PMS sync.</p>
             </div>
             <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-3xl hover:border-yellow-500 transition-colors group">
               <Magnet className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
               <h3 className="font-bold text-lg mb-2">AI Lead Magnets</h3>
               <p className="text-sm text-gray-400">Interactive calculators replacing static PDF ebooks.</p>
             </div>
          </div>
        </div>
      </section>

      <OnboardingForm />
    </div>
  );
};
