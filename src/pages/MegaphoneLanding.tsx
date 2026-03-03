import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Network, Database, BrainCircuit, ArrowRight, Zap, CheckCircle2, Activity, Volume2 } from 'lucide-react';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const MegaphoneLanding: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', website: '', niche: '', email: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Capture lead into Firestore
      await addDoc(collection(db, "leads"), {
        ...form,
        source: "AI Megaphone Landing Page",
        timestamp: serverTimestamp()
      });
      // Route them directly into the Audit Engine to prove the point
      navigate('/audit');
    } catch (error) {
      console.error("Lead capture failed", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-500 font-sans animate-fade-in selection:bg-black selection:text-yellow-500">
      
      {/* 1. THE HERO SECTION (70% Yellow Domination) */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 px-6 overflow-hidden border-b-[16px] border-black">
        {/* Abstract Tech Pulse Background */}
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
            Traditional SEO is a ghost town. In 2026, the most valuable customers don't search—they ask. We ensure ChatGPT, Gemini, and Perplexity cite your business as the definitive answer.
          </p>
          
          <Link to="/audit" className="inline-flex items-center justify-center gap-3 bg-black text-yellow-500 px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-lg hover:bg-white hover:text-black transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-105">
            Get Your AI Authority Audit <ArrowRight size={24} />
          </Link>
        </div>
      </section>

      {/* 2. THE REALITY CHECK (25% Black Contrast Block) */}
      <section className="bg-black text-white py-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 text-yellow-500">
              "If an AI assistant summarizes your industry and doesn't mention your name, you don't exist in the modern buyer's journey."
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-10 border border-gray-800 rounded-3xl bg-[#0a0a0a] opacity-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-xl">Obsolete</div>
              <h3 className="text-2xl font-black mb-4 text-gray-400 uppercase">The Old Way (SEO)</h3>
              <p className="text-gray-500 leading-relaxed">Fighting for a blue link on page one, hoping for a click, and getting buried by ads and automated overviews.</p>
            </div>
            
            <div className="p-10 border-2 border-yellow-500 rounded-3xl bg-gradient-to-br from-gray-900 to-black relative shadow-[0_0_40px_rgba(234,179,8,0.15)]">
              <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-xl">2026 Protocol</div>
              <h3 className="text-2xl font-black mb-4 text-white uppercase flex items-center gap-3">
                <BrainCircuit className="text-yellow-500" /> The Smart Way (GEO)
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">Becoming a <strong className="text-yellow-500">"Citable Entity"</strong> so your brand is synthesized directly into the AI’s response as the trusted, verified recommendation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INSIDE THE AI MEGAPHONE (Back to Yellow) */}
      <section className="py-24 px-6 border-b-8 border-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-black uppercase tracking-tighter mb-4">Inside the AI Megaphone</h2>
            <p className="text-black font-bold text-xl">We don't just "optimize" your site; we engineer your Digital Entity.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-black text-white p-8 rounded-3xl shadow-2xl relative">
              <Network size={40} className="text-yellow-500 mb-6" />
              <h3 className="text-xl font-black uppercase mb-2">Entity Building</h3>
              <p className="text-gray-400 text-sm mb-6">Maps your brand to industry-specific keywords across high-authority nodes.</p>
              <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl mt-auto">
                <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500 block mb-1">The Result</span>
                <span className="font-bold text-sm">AI natively identifies you as a verified Subject Matter Expert.</span>
              </div>
            </div>

            <div className="bg-black text-white p-8 rounded-3xl shadow-2xl relative lg:-translate-y-4">
              <Database size={40} className="text-yellow-500 mb-6" />
              <h3 className="text-xl font-black uppercase mb-2">Citable Content</h3>
              <p className="text-gray-400 text-sm mb-6">Creates data-heavy, structured content explicitly designed for AI extraction.</p>
              <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl mt-auto">
                <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500 block mb-1">The Result</span>
                <span className="font-bold text-sm">Your data is actively pulled into LLM responses and cited as fact.</span>
              </div>
            </div>

            <div className="bg-black text-white p-8 rounded-3xl shadow-2xl relative">
              <Activity size={40} className="text-yellow-500 mb-6" />
              <h3 className="text-xl font-black uppercase mb-2">Generative Engine Optimization</h3>
              <p className="text-gray-400 text-sm mb-6">Optimizes your entire digital footprint for the unique algorithms of AI models.</p>
              <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl mt-auto">
                <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500 block mb-1">The Result</span>
                <span className="font-bold text-sm">You become the unassailable "Top Recommendation" in AI search.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 & 5. WHY US & LEAD CAPTURE (The Final Push) */}
      <section className="py-24 px-6 bg-black text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">
              You don't need another "agency."<br/>
              <span className="text-yellow-500">You need an Entity Manager.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              At Happy Hunter Digital, we’ve perfected the transition from legacy Inbound Marketing to <strong className="text-white">AI-Powered Journey Orchestration</strong>. We don't just get you seen; we get you mathematically verified.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-lg font-bold"><CheckCircle2 className="text-yellow-500" /> Dominate ChatGPT & Gemini</li>
              <li className="flex items-center gap-3 text-lg font-bold"><CheckCircle2 className="text-yellow-500" /> Secure "Share of Model"</li>
              <li className="flex items-center gap-3 text-lg font-bold"><CheckCircle2 className="text-yellow-500" /> Eradicate the Ghost Effect</li>
            </ul>
          </div>

          <div className="bg-yellow-500 p-10 rounded-[2.5rem] shadow-2xl text-black relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-white rounded-t-[2.5rem]"></div>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 mt-2">Ready to turn up the volume?</h3>
            <p className="font-bold text-black/70 mb-8 text-sm">Enter your coordinates below. We will immediately route you to our AI Entity Scanner.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" placeholder="Full Name" required
                className="w-full bg-white p-4 rounded-xl border-2 border-black/10 outline-none focus:border-black font-bold placeholder:font-normal transition-all"
                onChange={e => setForm({...form, name: e.target.value})}
              />
              <input 
                type="url" placeholder="Website URL (For Entity Scan)" required
                className="w-full bg-white p-4 rounded-xl border-2 border-black/10 outline-none focus:border-black font-bold placeholder:font-normal transition-all"
                onChange={e => setForm({...form, website: e.target.value})}
              />
              <input 
                type="text" placeholder="Primary Industry Niche" required
                className="w-full bg-white p-4 rounded-xl border-2 border-black/10 outline-none focus:border-black font-bold placeholder:font-normal transition-all"
                onChange={e => setForm({...form, niche: e.target.value})}
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
                {loading ? 'Initializing Protocol...' : 'Make Me The Recommended Choice'} <Zap size={16} />
              </button>
            </form>
          </div>

        </div>
      </section>
      
    </div>
  );
};
