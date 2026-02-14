import { ArrowRight, ShieldCheck, Zap, Cpu, Globe, Search, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ContentRibbon from '../components/ContentRibbon';

export default function Home() {
  return (
    <div className="pt-24 font-sans text-white">
      <ContentRibbon />

      {/* HERO SECTION */}
      <section className="px-6 py-20 lg:py-32 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 animate-fade-in text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full mx-auto lg:mx-0">
            <Globe size={14} className="text-yellow-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">South African Entity Specialist</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
            Stop Being <br /><span className="text-yellow-500 italic">Invisible</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl italic max-w-md mx-auto lg:mx-0 leading-relaxed font-medium">
            Standard SEO is dead. If you aren't a <span className="text-white font-bold underline decoration-yellow-500/30">Verified Entity</span>, you don't exist.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-6">
            <Link to="/audit" className="bg-yellow-500 text-slate-950 px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-yellow-500/10">
              ASSESS YOUR BUSINESS <Search size={22}/>
            </Link>
          </div>
        </div>
        <div className="relative group animate-fade-in [animation-delay:200ms]">
          <div className="relative rounded-[4rem] overflow-hidden border-2 border-slate-800 shadow-2xl">
            <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1770566290/Thabo_Leslie_Motsumi_is_the_founder_and_key_figure_behind_happyhunterdigital_also_referred_to_as_Happy_Hunter_Smart_Marketing_yvomai.png" className="w-full grayscale brightness-90 hover:grayscale-0 transition-all duration-1000" alt="Thabo" />
            <div className="absolute bottom-0 right-0 max-w-[85%] bg-slate-950/90 backdrop-blur-xl border-t border-l border-yellow-500/30 p-6 rounded-tl-[3rem]">
              <p className="text-[11px] text-slate-300 font-medium italic leading-relaxed">
                <span className="text-white font-black uppercase block mb-2 underline decoration-yellow-500/30">Principal Strategist:</span>
                Thabo Leslie Motsumi is the founder and key figure behind <span className="brand-name text-yellow-500 text-2xl lowercase tracking-tight">happyhunterdigital</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM SECTION */}
      <section className="bg-slate-900/30 border-y border-slate-900 py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">The Great AI <span className="text-slate-800">Filter</span></h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              Google SGE and Gemini are now filtering out businesses that lack <span className="text-yellow-500 font-black">Entity Trust</span>. If your digital footprint is fragmented, AI search engines will protect their users by simply never mentioning your brand.
            </p>
          </div>
          <div className="grid gap-4">
             {[
               { icon: <ShieldCheck className="text-yellow-500" />, title: "The Trust Anchor", desc: "Digital Passport (GMB) Management." },
               { icon: <Cpu className="text-yellow-500" />, title: "The AI Megaphone", desc: "Answer Engine Optimization (AEO)." },
               { icon: <Zap className="text-yellow-500" />, title: "The Revenue Brain", desc: "Agentic Lead Automation." }
             ].map((item, idx) => (
               <div key={idx} className="p-8 border border-slate-800 rounded-[2.5rem] bg-slate-950/50 flex items-center gap-6 hover:border-yellow-500/30 transition-all">
                  <div className="bg-slate-900 p-4 rounded-2xl">{item.icon}</div>
                  <div><h4 className="font-black uppercase text-lg">{item.title}</h4><p className="text-slate-500 text-sm italic font-medium">{item.desc}</p></div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* THE REAL PROOFS (CASE STUDIES) */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">Strategic <span className="text-yellow-500">Wins</span></h3>
          <p className="text-slate-500 italic uppercase text-[10px] font-black tracking-[0.4em]">Real results for South African Entities</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           <Link to="/article/profuse-beauty-success" className="group p-12 border border-slate-900 rounded-[3rem] bg-slate-900/10 hover:bg-slate-900/30 transition-all relative overflow-hidden flex flex-col">
              <TrendingUp className="text-yellow-500 mb-8" size={32} />
              <h4 className="text-3xl font-black uppercase mb-4 text-white group-hover:text-yellow-500 transition-colors tracking-tighter">Profuse Beauty</h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-10 italic font-medium">Local makeup brand transitioned to an AI-validated authority in SA.</p>
              <div className="mt-auto flex items-center gap-2 text-yellow-500 font-black uppercase tracking-widest text-[9px]">
                <CheckCircle2 size={14} /> Result: +310% Inbound Calls
              </div>
           </Link>
           <Link to="/article/integrated-wellth-terminal" className="group p-12 border border-slate-900 rounded-[3rem] bg-slate-900/10 hover:bg-slate-900/30 transition-all relative overflow-hidden flex flex-col">
              <TrendingUp className="text-yellow-500 mb-8" size={32} />
              <h4 className="text-3xl font-black uppercase mb-4 text-white group-hover:text-yellow-500 transition-colors tracking-tighter">IntegratedWellth</h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-10 italic font-medium">Standard consultancy transformed into a high-trust Intelligence Unit.</p>
              <div className="mt-auto flex items-center gap-2 text-yellow-500 font-black uppercase tracking-widest text-[9px]">
                <CheckCircle2 size={14} /> Result: Triage Automation Active
              </div>
           </Link>
           <Link to="/article/khongoloti-academy-growth" className="group p-12 border border-slate-900 rounded-[3rem] bg-slate-900/10 hover:bg-slate-900/30 transition-all relative overflow-hidden flex flex-col">
              <TrendingUp className="text-yellow-500 mb-8" size={32} />
              <h4 className="text-3xl font-black uppercase mb-4 text-white group-hover:text-yellow-500 transition-colors tracking-tighter">Khongoloti Academy</h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-10 italic font-medium">Modernizing SETA-accredited visibility for the 2026 intake cycle.</p>
              <div className="mt-auto flex items-center gap-2 text-yellow-500 font-black uppercase tracking-widest text-[9px]">
                <CheckCircle2 size={14} /> Result: AEO Domination
              </div>
           </Link>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-40 px-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 via-slate-950 to-slate-950 text-center space-y-12">
         <h2 className="text-5xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] text-white">
           Ready to <span className="text-yellow-500 italic">Repair</span> <br /> Your Business?
         </h2>
         <p className="text-slate-500 text-lg md:text-xl italic font-medium max-w-2xl mx-auto leading-relaxed">
           Your business is being filtered out right now. Stop guessing and start winning the smart marketing era.
         </p>
         <div className="flex justify-center">
            <Link to="/audit" className="bg-yellow-500 text-slate-950 px-16 py-6 rounded-2xl font-black text-xl hover:scale-110 transition-all shadow-2xl uppercase tracking-widest">
              Initiate Survival Scan
            </Link>
         </div>
      </section>
    </div>
  );
}
