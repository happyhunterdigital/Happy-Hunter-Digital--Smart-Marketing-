import { ArrowRight, ShieldCheck, Zap, Cpu, Globe, Search, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ContentRibbon from '../components/ContentRibbon';

export default function Home() {
  return (
    <div className="pt-24 font-sans text-white">
      
      {/* 1. INBOUND CONTENT RIBBON */}
      <ContentRibbon />

      {/* 2. HERO: The Provocation */}
      <section className="px-6 py-24 md:py-40 max-w-7xl mx-auto text-center space-y-10">
        <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full mb-4">
          <Globe size={14} className="text-yellow-500" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">South African Entity Specialist</span>
        </div>
        
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
          Stop Being <br />
          <span className="text-yellow-500 italic">Invisible</span>
        </h1>
        
        <p className="max-w-3xl mx-auto text-slate-500 text-lg md:text-2xl font-medium leading-relaxed italic">
          Standard SEO is dead. Google is no longer a search engine; it is an <span className="text-white underline decoration-yellow-500/50">Answer Engine</span>. If you aren't a Verified Entity, you don't exist.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-6 pt-10">
          <Link to="/audit" className="bg-yellow-500 text-slate-950 px-12 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-[0_0_50px_rgba(250,204,21,0.2)]">
            INITIATE ENTITY SCAN <Search size={24}/>
          </Link>
          <Link to="/core-services" className="border-2 border-slate-800 px-12 py-6 rounded-2xl font-bold text-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
            THE 2026 STRATEGY <ArrowRight size={22}/>
          </Link>
        </div>
      </section>

      {/* 3. THE PROBLEM: The Great AI Filter */}
      <section className="bg-slate-900/30 border-y border-slate-900 py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <span className="text-yellow-500 font-black uppercase tracking-widest text-xs">The Failure Point</span>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">The Great AI <span className="text-slate-700">Filter</span></h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Google SGE and Gemini are now filtering out businesses that lack **Entity Trust**. 
              If your digital footprint is fragmented, AI search engines will protect their users by simply never mentioning your brand. 
              We solve the **Invisibility Crisis**.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-slate-950 rounded-3xl border border-slate-900">
                <p className="text-3xl font-black text-yellow-500 mb-1">60%</p>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Of searches are now "Zero-Click"</p>
              </div>
              <div className="p-6 bg-slate-950 rounded-3xl border border-slate-900">
                <p className="text-3xl font-black text-yellow-500 mb-1">310%</p>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Average inquiry increase with the Protocol</p>
              </div>
            </div>
          </div>
          
          <div className="grid gap-4">
             {[
               { icon: <ShieldCheck className="text-yellow-500" />, title: "The Trust Anchor", desc: "Digital Passport (GMB) Management." },
               { icon: <Cpu className="text-yellow-500" />, title: "The AI Megaphone", desc: "Answer Engine Optimization (AEO)." },
               { icon: <Zap className="text-yellow-500" />, title: "The Revenue Brain", desc: "Agentic Lead Automation." }
             ].map((item, idx) => (
               <div key={idx} className="p-8 border border-slate-800 rounded-[2.5rem] bg-slate-950/50 flex items-center gap-6 hover:border-yellow-500/30 transition-all">
                  <div className="bg-slate-900 p-4 rounded-2xl">{item.icon}</div>
                  <div>
                    <h4 className="font-black uppercase text-lg">{item.title}</h4>
                    <p className="text-slate-500 text-sm italic">{item.desc}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. PROOF STRIP: Regional Authority */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Protocol <span className="text-yellow-500">Proofs</span></h3>
          <p className="text-slate-500 italic uppercase text-[10px] font-black tracking-widest">Verifiable outcomes in the South African market</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
           <Link to="/article/profuse-beauty-local-dominance" className="group p-12 border border-slate-900 rounded-[3.5rem] bg-slate-900/10 hover:bg-slate-900/30 transition-all relative overflow-hidden">
              <TrendingUp className="text-yellow-500 mb-8" size={32} />
              <h4 className="text-3xl font-black uppercase mb-4 group-hover:text-yellow-500 transition-colors">Profuse Beauty Clinic</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">From 'Hidden Gem' to fully booked 3 weeks in advance via Local Pack Domination.</p>
              <div className="flex items-center gap-2 text-yellow-500 font-black uppercase tracking-widest text-[10px]">
                <CheckCircle2 size={14} /> Result: +310% Inbound Calls
              </div>
           </Link>
           <Link to="/article/construction-sme-trust-architecture" className="group p-12 border border-slate-900 rounded-[3.5rem] bg-slate-900/10 hover:bg-slate-900/30 transition-all relative overflow-hidden">
              <TrendingUp className="text-yellow-500 mb-8" size={32} />
              <h4 className="text-3xl font-black uppercase mb-4 group-hover:text-yellow-500 transition-colors">Construction SME</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">Secured a R2.5 Million residential contract using Strategic Trust Architecture.</p>
              <div className="flex items-center gap-2 text-yellow-500 font-black uppercase tracking-widest text-[10px]">
                <CheckCircle2 size={14} /> Result: R2.5M Contract Secured
              </div>
           </Link>
        </div>
      </section>

      {/* 5. THE FINAL CTA */}
      <section className="py-40 px-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 via-slate-950 to-slate-950">
        <div className="max-w-4xl mx-auto text-center space-y-12">
           <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-tight">
             Ready to <span className="text-yellow-500">Mend</span> <br /> Your Architecture?
           </h2>
           <p className="text-slate-500 text-lg md:text-xl italic font-medium">
             Your business is being filtered out right now. Stop guessing and start winning the smart marketing era.
           </p>
           <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link to="/audit" className="bg-yellow-500 text-slate-950 px-16 py-6 rounded-2xl font-black text-xl hover:scale-110 transition-all shadow-2xl">
                START YOUR SURVIVAL SCAN
              </Link>
           </div>
           <p className="text-slate-700 text-[10px] font-black uppercase tracking-[0.5em]">
             Handshake Protocol v2.0 // Managed by Thabo Leslie Motsumi
           </p>
        </div>
      </section>
    </div>
  );
}
