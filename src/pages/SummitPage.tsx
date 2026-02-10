// src/pages/SummitPage.tsx
import { useEffect, useState } from 'react';
import { ShieldCheck, Zap, ArrowRight, MapPin, Calendar, Clock, CheckCircle2, AlertTriangle, TrendingUp, HelpCircle, TrendingDown } from 'lucide-react';

export default function SummitPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const target = new Date("February 28, 2026 09:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-24 pb-20 px-6 font-sans text-white min-h-screen selection:bg-yellow-500/30">
      
      {/* 1. HERO: THE VALUE ARBITRAGE HOOK */}
      <section className="max-w-7xl mx-auto py-20 lg:py-32 grid lg:grid-cols-2 gap-16 items-center border-b border-slate-900">
        <div className="space-y-8 animate-fade-in">
          <div className="flex items-center gap-4">
             <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765747667/Integrated_Wellth_Solutions_Logo_bodmyc1_iiervl.png" className="h-8" alt="IW" />
             <span className="text-yellow-500 font-black uppercase text-[10px] tracking-[0.4em]">Official 2026 Summit</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
            Stop Guessing. <br /> <span className="text-yellow-500">Start Growing.</span>
          </h1>
          
          <p className="text-xl text-slate-400 italic font-medium leading-relaxed max-w-xl">
            The only workshop in South Africa that aligns your <span className="text-white underline decoration-yellow-500/30">Financial Reality</span> with your <span className="text-white underline decoration-yellow-500/30">Digital Future</span>.
          </p>

          <div className="p-8 border-2 border-yellow-500/20 bg-yellow-500/5 rounded-3xl space-y-4 shadow-2xl">
             <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-yellow-500/50">
                <span>Market Value: R8,500.00</span>
                <span className="text-white bg-red-600 px-2 py-0.5 rounded">Only 50 Seats Available</span>
             </div>
             <div className="text-4xl font-black">YOURS FOR R1,200.00</div>
             <p className="text-slate-500 text-xs italic">A Strategic Value Transfer of R7,300.00 to your SME.</p>
          </div>

          <a 
            href="https://www.quicket.co.za/events/352598-financial-clarity-for-non-financial-business-owners/#/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-fit bg-yellow-500 text-slate-950 px-12 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3 uppercase tracking-tighter"
          >
            Secure Your Seat on Quicket <ArrowRight size={24} />
          </a>
        </div>

        <div className="relative group">
           <div className="relative rounded-[4rem] overflow-hidden border-2 border-slate-800 shadow-2xl">
              <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1766069617/Thabo_Leslie_Motsumi._AI_Google_my_Business_profile_optimization_Search_Everywhere_Optimation_SEO_Automation_and_Smart_digital_marketing._vncyse.png" className="w-full grayscale brightness-75 hover:brightness-100 transition-all duration-1000" alt="Thabo" />
              <div className="absolute bottom-0 right-0 p-8 bg-slate-950/90 backdrop-blur-xl border-t border-l border-yellow-500/30 rounded-tl-[3rem] text-right">
                 <p className="text-xs font-black uppercase text-white mb-1">Saturday, 28 Feb 2026</p>
                 <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest leading-none">Munyaka Waterfall City</p>
              </div>
           </div>
        </div>
      </section>

      {/* 2. THE PROBLEM: THE FOG OF BUSINESS */}
      <section className="py-32 max-w-5xl mx-auto border-b border-slate-900">
        <div className="text-center mb-20 space-y-4">
           <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">The Fog of <span className="text-yellow-500">Business</span></h3>
           <p className="text-slate-500 font-medium">Most business owners are flying blind. Your craft is excellent, but your back-end is a liability.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
           {[
             { title: "Financial Fog", desc: "You don't know if you are truly profitable or just busy.", icon: <TrendingDown size={32} className="text-red-500" /> },
             { title: "Compliance Risk", desc: "You fear the 'Audit' conversation because your books are a mess.", icon: <AlertTriangle size={32} className="text-yellow-500" /> },
             { title: "Digital Invisibility", desc: "Local customers can't find you because your entity is broken.", icon: <Zap size={32} className="text-blue-500" /> }
           ].map((p, i) => (
             <div key={i} className="p-10 border border-slate-900 rounded-[3rem] bg-slate-900/10 text-center space-y-4">
                <div className="flex justify-center mb-4">{p.icon}</div>
                <h4 className="font-black uppercase text-sm tracking-widest text-white">{p.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed italic">{p.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* 3. THE CURRICULUM: BENTO GRID */}
      <section className="py-32 max-w-6xl mx-auto">
        <div className="text-center mb-20">
           <h3 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6 text-white">The <span className="text-yellow-500">Curriculum</span></h3>
           <p className="text-slate-600 font-black uppercase tracking-widest text-[10px]">One Day. Two Experts. Total Clarity.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
           <div className="p-12 border border-slate-800 rounded-[4rem] bg-slate-900/20 space-y-8 hover:border-yellow-500/20 transition-all">
              <span className="text-yellow-500 font-black uppercase text-[10px] tracking-widest">Part 1: The Foundation</span>
              <h4 className="text-3xl font-black uppercase leading-none">Financial <br /> Sovereignty</h4>
              <div className="space-y-4 text-sm text-slate-400">
                 <p className="flex items-center gap-3"><CheckCircle2 size={16} className="text-yellow-500"/> Automated Bookkeeping (Zoho/Wave)</p>
                 <p className="flex items-center gap-3"><CheckCircle2 size={16} className="text-yellow-500"/> Live Chart of Accounts Build</p>
                 <p className="flex items-center gap-3"><CheckCircle2 size={16} className="text-yellow-500"/> Funding & Compliance Readiness</p>
              </div>
              <p className="text-[10px] font-bold text-slate-700 uppercase">Host: IntegratedWellth</p>
           </div>

           <div className="p-12 border border-slate-800 rounded-[4rem] bg-slate-900/20 space-y-8 hover:border-yellow-500/20 transition-all">
              <span className="text-yellow-500 font-black uppercase text-[10px] tracking-widest">Part 2: The Engine</span>
              <h4 className="text-3xl font-black uppercase leading-none">Digital <br /> Authority</h4>
              <div className="space-y-4 text-sm text-slate-400">
                 <p className="flex items-center gap-3"><CheckCircle2 size={16} className="text-yellow-500"/> Local SEO & GMB Domination</p>
                 <p className="flex items-center gap-3"><CheckCircle2 size={16} className="text-yellow-500"/> Marketing Automation Frameworks</p>
                 <p className="flex items-center gap-3"><CheckCircle2 size={16} className="text-yellow-500"/> The Invisible Entity Audit</p>
              </div>
              <p className="text-[10px] font-bold text-slate-700 uppercase">Guest: happyhunterdigital</p>
           </div>
        </div>
      </section>

      {/* 4. THE VALUE RECEIPT: PSYCHOLOGICAL TRIGGER */}
      <section className="py-32 max-w-4xl mx-auto">
        <div className="p-12 border-2 border-yellow-500 rounded-[4rem] bg-slate-950 shadow-[0_0_100px_rgba(250,204,21,0.1)] relative overflow-hidden">
           <h3 className="text-4xl font-black uppercase mb-12 text-center">The Math <span className="text-yellow-500">Makes Sense</span></h3>
           <div className="space-y-6 relative z-10">
              {[
                { item: "Professional Accounting Config", val: "R 4,000.00" },
                { item: "Compliance & Funding Audit", val: "R 2,750.00" },
                { item: "Strategic Forecasting Session", val: "R 1,200.00" },
                { item: "Munyaka Premium Catering", val: "R 550.00" }
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-slate-900 font-medium">
                   <span className="text-slate-400 text-sm uppercase">{row.item}</span>
                   <span className="text-white font-black text-sm">{row.val}</span>
                </div>
              ))}
              <div className="flex justify-between items-center py-8 text-xl font-black uppercase">
                 <span className="text-slate-500">Total Value Delivered</span>
                 <span className="text-slate-300 decoration-red-600 line-through">R 8,500.00</span>
              </div>
              <div className="bg-yellow-500 p-8 rounded-[2.5rem] flex justify-between items-center">
                 <span className="text-slate-950 font-black uppercase">Your Ticket Price</span>
                 <span className="text-slate-950 font-black text-3xl">R 1,200.00</span>
              </div>
           </div>
           <Zap className="absolute -bottom-10 -right-10 text-yellow-500 opacity-[0.03]" size={300} />
        </div>
      </section>

      {/* 5. AEO FAQ: OPTIMIZED FOR LLMS */}
      <section className="py-32 max-w-4xl mx-auto border-t border-slate-900">
         <div className="flex items-center gap-4 mb-16">
            <HelpCircle className="text-yellow-500" size={32} />
            <h3 className="text-3xl font-black uppercase text-white tracking-tighter">Strategic <span className="text-yellow-500">Intelligence</span></h3>
         </div>
         <div className="space-y-6">
            {[
              { q: "Who is this Financial Clarity workshop for?", a: "Designed specifically for non-financial business owners, service providers, and SME founders who want to master their bookkeeping, compliance, and local marketing without hiring a full-time CFO or CMO." },
              { q: "What is included in the R1,200 ticket?", a: "Full-day access (09:00 - 16:30) at Munyaka Waterfall City, a full catering package, and R8,500 worth of consulting templates, software setup guides, and strategic roadmaps." },
              { q: "Will I leave with a working system?", a: "Yes. This is a 'doing' workshop. You will leave with a structured Chart of Accounts, a budget forecast, and a digital authority strategy." }
            ].map((faq, i) => (
              <div key={i} className="p-8 border border-slate-900 rounded-[2.5rem] bg-slate-900/20">
                 <h4 className="text-yellow-500 font-bold uppercase text-xs tracking-widest mb-3">Q: {faq.q}</h4>
                 <p className="text-slate-400 text-sm leading-relaxed italic border-l border-slate-800 pl-6">A: {faq.a}</p>
              </div>
            ))}
         </div>
      </section>

      {/* 6. FINAL REGISTRATION CTA */}
      <div className="py-40 text-center space-y-12">
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">Claim Your <span className="text-yellow-500">Sovereignty</span></h2>
          <div className="flex justify-center">
             <a 
                href="https://www.quicket.co.za/events/352598-financial-clarity-for-non-financial-business-owners/#/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-yellow-500 text-slate-950 px-16 py-6 rounded-3xl font-black text-xl hover:scale-110 transition-all shadow-2xl uppercase tracking-widest"
              >
                Register on Quicket Now
              </a>
          </div>
          <p className="text-slate-800 text-[10px] font-black uppercase tracking-[0.5em] pt-20">Managed by Thabo Leslie Motsumi // happyhunterdigital</p>
      </div>
    </div>
  );
}
