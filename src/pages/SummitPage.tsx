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
      <section className="max-w-7xl mx-auto py-20 lg:py-32 border-b border-slate-900">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-8">
             <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765747667/Integrated_Wellth_Solutions_Logo_bodmyc1_iiervl.png" className="h-12" alt="Integrated Wellth" />
             <span className="text-yellow-500 font-black uppercase text-[10px] tracking-[0.4em]">Official 2026 Summit</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
            Stop Guessing. <br /> <span className="text-yellow-500">Start Growing.</span>
          </h1>
          
          <p className="text-xl text-slate-400 italic font-medium leading-relaxed max-w-2xl mx-auto">
            The only workshop in South Africa that aligns your <span className="text-white underline decoration-yellow-500/30">Financial Reality</span> with your <span className="text-white underline decoration-yellow-500/30">Digital Future</span>.
          </p>
        </div>

        {/* HERO IMAGES GRID */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
           <div className="relative rounded-[3rem] overflow-hidden border-2 border-slate-800 shadow-2xl group">
              <img 
                src="https://res.cloudinary.com/dka0498ns/image/upload/v1765644818/Accountability_Partnership._SMMEs_review_session._egzihs.jpg" 
                className="w-full h-[400px] object-cover grayscale brightness-75 group-hover:brightness-100 transition-all duration-1000" 
                alt="SMMEs Review Session" 
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-950 to-transparent">
                 <p className="text-xs font-black uppercase text-yellow-500 tracking-widest">Accountability Partnership</p>
                 <p className="text-white font-bold text-sm">SMMEs Review Session</p>
              </div>
           </div>
           <div className="relative rounded-[3rem] overflow-hidden border-2 border-slate-800 shadow-2xl group">
              <img 
                src="https://res.cloudinary.com/dka0498ns/image/upload/v1765321878/Integrated_Wellth_Financial_Literacy._nscht7.jpg" 
                className="w-full h-[400px] object-cover grayscale brightness-75 group-hover:brightness-100 transition-all duration-1000" 
                alt="Financial Literacy" 
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-950 to-transparent">
                 <p className="text-xs font-black uppercase text-yellow-500 tracking-widest">Integrated Wellth</p>
                 <p className="text-white font-bold text-sm">Financial Literacy</p>
              </div>
           </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          <div className="p-8 border-2 border-yellow-500/20 bg-yellow-500/5 rounded-3xl space-y-4 shadow-2xl">
             <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-yellow-500/50">
                <span>Market Value: R8,500.00</span>
                <span className="text-white bg-red-600 px-2 py-0.5 rounded">Only 50 Seats Available</span>
             </div>
             <div className="text-4xl font-black text-center">YOURS FOR R849.99</div>
             <p className="text-slate-500 text-xs italic text-center">A Strategic Value Transfer of R7,650.01 to your SME.</p>
          </div>

          <div className="flex justify-center">
            <a 
              href="https://www.quicket.co.za/events/352598-financial-clarity-for-non-financial-business-owners/#/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-fit bg-yellow-500 text-slate-950 px-12 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3 uppercase tracking-tighter"
            >
              Secure Your Seat on Quicket <ArrowRight size={24} />
            </a>
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

      {/* 3. THE SPEAKERS */}
      <section className="py-32 max-w-6xl mx-auto border-b border-slate-900">
        <div className="text-center mb-20">
           <h3 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6 text-white">The <span className="text-yellow-500">Speakers</span></h3>
           <p className="text-slate-600 font-black uppercase tracking-widest text-[10px]">Two Experts. One Day. Total Clarity.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
           {/* MARCIA */}
           <div className="p-12 border border-slate-800 rounded-[4rem] bg-slate-900/20 space-y-8 hover:border-yellow-500/20 transition-all">
              <div className="relative rounded-[3rem] overflow-hidden border-2 border-slate-800 mb-6">
                 <img 
                   src="https://res.cloudinary.com/dka0498ns/image/upload/v1766077285/Chartered_Business_Accountant_in_Practice_CIBA_Hons_Psychological_Counselling_Risk_and_Project_Management_ubcpy9.jpg" 
                   className="w-full h-[300px] object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                   alt="Marcia - Chartered Business Accountant" 
                 />
              </div>
              <span className="text-yellow-500 font-black uppercase text-[10px] tracking-widest">Part 1: The Foundation</span>
              <h4 className="text-3xl font-black uppercase leading-none">Financial <br /> Sovereignty</h4>
              <div className="space-y-4 text-sm text-slate-400">
                 <p className="flex items-center gap-3"><CheckCircle2 size={16} className="text-yellow-500"/> Automated Bookkeeping (Zoho/Wave)</p>
                 <p className="flex items-center gap-3"><CheckCircle2 size={16} className="text-yellow-500"/> Live Chart of Accounts Build</p>
                 <p className="flex items-center gap-3"><CheckCircle2 size={16} className="text-yellow-500"/> Funding & Compliance Readiness</p>
              </div>
              <div className="pt-6 border-t border-slate-800">
                 <p className="text-white font-black text-sm">Marcia</p>
                 <p className="text-[10px] font-bold text-slate-500 uppercase">Chartered Business Accountant (CIBA) • IntegratedWellth</p>
              </div>
           </div>

           {/* THABO */}
           <div className="p-12 border border-slate-800 rounded-[4rem] bg-slate-900/20 space-y-8 hover:border-yellow-500/20 transition-all">
              <div className="relative rounded-[3rem] overflow-hidden border-2 border-slate-800 mb-6">
                 <img 
                   src="https://res.cloudinary.com/dka0498ns/image/upload/v1766069617/Thabo_Leslie_Motsumi._AI_Google_my_Business_profile_optimization_Search_Everywhere_Optimation_SEO_Automation_and_Smart_digital_marketing._vncyse.png" 
                   className="w-full h-[300px] object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                   alt="Thabo Leslie Motsumi - Digital Strategist" 
                 />
              </div>
              <span className="text-yellow-500 font-black uppercase text-[10px] tracking-widest">Part 2: The Engine</span>
              <h4 className="text-3xl font-black uppercase leading-none">Digital <br /> Authority</h4>
              <div className="space-y-4 text-sm text-slate-400">
                 <p className="flex items-center gap-3"><CheckCircle2 size={16} className="text-yellow-500"/> Local SEO & GMB Domination</p>
                 <p className="flex items-center gap-3"><CheckCircle2 size={16} className="text-yellow-500"/> Marketing Automation Frameworks</p>
                 <p className="flex items-center gap-3"><CheckCircle2 size={16} className="text-yellow-500"/> The Invisible Entity Audit</p>
              </div>
              <div className="pt-6 border-t border-slate-800">
                 <p className="text-white font-black text-sm">Thabo Leslie Motsumi</p>
                 <p className="text-[10px] font-bold text-slate-500 uppercase">Founder • Smart Marketing / Happy Hunter Digital</p>
              </div>
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
                 <span className="text-slate-950 font-black text-3xl">R 849.99</span>
              </div>
           </div>
           <Zap className="absolute -bottom-10 -right-10 text-yellow-500 opacity-[0.03]" size={300} />
        </div>
      </section>

      {/* 5. EVENT DETAILS */}
      <section className="py-32 max-w-4xl mx-auto border-t border-slate-900">
         <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8 border border-slate-800 rounded-[2.5rem] bg-slate-900/20">
               <Calendar className="mx-auto mb-4 text-yellow-500" size={32} />
               <p className="text-xs font-black uppercase text-slate-500 tracking-widest mb-2">Date</p>
               <p className="
