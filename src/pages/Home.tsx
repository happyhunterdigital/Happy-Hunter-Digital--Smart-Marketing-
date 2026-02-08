import { ArrowRight, ShieldCheck, Zap, Cpu, Globe, Search, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ContentRibbon from '../components/ContentRibbon';

export default function Home() {
  return (
    <div className="pt-24 font-sans text-white">
      
      {/* 1. INBOUND CONTENT RIBBON */}
      <ContentRibbon />

      {/* 2. HERO SECTION: The Strategic Handshake */}
      <section className="px-6 py-20 lg:py-32 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: The Provocation */}
          <div className="space-y-10 text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full mb-4">
              <Globe size={14} className="text-yellow-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">South African Entity Specialist</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase">
              Stop Being <br />
              <span className="text-yellow-500 italic">Invisible</span>
            </h1>
            
            <p className="max-w-xl mx-auto lg:mx-0 text-slate-500 text-lg md:text-xl font-medium leading-relaxed italic">
              Standard SEO is dead. Google is now an <span className="text-white underline decoration-yellow-500/50">Answer Engine</span>. If you aren't a Verified Entity, you don't exist.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6 pt-6">
              <Link to="/audit" className="bg-yellow-500 text-slate-950 px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-[0_0_50px_rgba(250,204,21,0.2)]">
                INITIATE SCAN <Search size={22}/>
              </Link>
              <Link to="/core-services" className="border-2 border-slate-800 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
                THE STRATEGY <ArrowRight size={20}/>
              </Link>
            </div>
          </div>

          {/* Right Column: Founder Authority Image */}
          <div className="relative group animate-fade-in [animation-delay:200ms]">
            {/* The Image Container */}
            <div className="relative rounded-[3rem] overflow-hidden border-2 border-slate-800 shadow-2xl bg-slate-900">
              <img 
                src="https://res.cloudinary.com/dka0498ns/image/upload/v1770566290/Thabo_Leslie_Motsumi_is_the_founder_and_key_figure_behind_happyhunterdigital_also_referred_to_as_Happy_Hunter_Smart_Marketing_yvomai.png" 
                alt="Thabo Leslie Motsumi - Founder of happyhunterdigital" 
                className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              
              {/* THE INTELLIGENT CAPTION: Anchored Bottom-Right */}
              <div className="absolute bottom-0 right-0 max-w-[85%] bg-slate-950/90 backdrop-blur-xl border-t border-l border-yellow-500/30 p-6 rounded-tl-[2rem] shadow-[-20px_-20px_50px_rgba(0,0,0,0.5)]">
                <p className="text-[11px] leading-relaxed text-slate-300 font-medium italic">
                  <span className="text-white font-black uppercase tracking-widest not-italic block mb-2">Principal Strategist:</span>
                  Thabo Leslie Motsumi is the founder and key figure behind <span className="brand-name text-yellow-500 text-xl lowercase tracking-tight">happyhunterdigital</span> (also referred to as Happy Hunter Smart Marketing).
                </p>
              </div>
            </div>

            {/* Decorative Glow Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-500/5 rounded-full blur-3xl" />
          </div>
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
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-slate-950 rounded-3xl border border-slate-900">
                <p className="text-3xl font-black text-yellow-500 mb-1">60%</p>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Zero-Click Searches</p>
              </div>
              <div className="p-6 bg-slate-950 rounded-3xl border border-slate-900">
                <p className="text-3xl font-black text-yellow-500 mb-1">310%</p>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Protocol Lift</p>
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

      {/* 4. PROOF STRIP */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Protocol <span className="text-yellow-500">Proofs</span></h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
           <Link to="/article/profuse-beauty-local-dominance" className="group p-12 border border-slate-900 rounded-[3.5rem] bg-slate-900/10 hover:bg-slate-900/30 transition-all relative overflow-hidden">
              <TrendingUp className="text-yellow-500 mb-8" size={32} />
              <h4 className="text-3xl font-black uppercase mb-4 group-hover:text-yellow-500 transition-colors">Profuse Beauty Clinic</h4>
              <div className="flex items-center gap-2 text-yellow-500 font-black uppercase tracking-widest text-[10px]">
                <CheckCircle2 size={14} /> Result: +310% Inbound Calls
              </div>
           </Link>
           <Link to="/article/construction-sme-trust-architecture" className="group p-12 border border-slate-900 rounded-[3.5rem] bg-slate-900/10 hover:bg-slate-900/30 transition-all relative overflow-hidden">
              <TrendingUp className="text-yellow-500 mb-8" size={32} />
              <h4 className="text-3xl font-black uppercase mb-4 group-hover:text-yellow-500 transition-colors">Construction SME</h4>
              <div className="flex items-center gap-2 text-yellow-500 font-black uppercase tracking-widest text-[10px]">
                <CheckCircle2 size={14} /> Result: R2.5M Contract Secured
              </div>
           </Link>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="py-40 px-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 via-slate-950 to-slate-950">
        <div className="max-w-4xl mx-auto text-center space-y-12">
           <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-tight">
             Ready to <span className="text-yellow-500">Mend</span> <br /> Your Architecture?
           </h2>
           <div className="flex justify-center">
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
