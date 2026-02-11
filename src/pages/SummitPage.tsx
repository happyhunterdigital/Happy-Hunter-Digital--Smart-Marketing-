import { useEffect, useState } from 'react';
import { ShieldCheck, Zap, ArrowRight, CheckCircle2, AlertTriangle, TrendingDown, HelpCircle, Calendar, MapPin, Gift, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      
      {/* 1. HERO: THE INVISIBILITY CRISIS */}
      <section className="max-w-7xl mx-auto py-20 lg:py-32 grid lg:grid-cols-2 gap-16 items-center border-b border-slate-900">
        <div className="space-y-10 animate-fade-in">
          <div className="flex items-center gap-4">
             <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765747667/Integrated_Wellth_Solutions_Logo_bodmyc1_iiervl.png" className="h-8" alt="IW" />
             <span className="text-yellow-500 font-black uppercase text-[10px] tracking-[0.4em]">Official 2026 Summit Invitation</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-500 font-black uppercase text-xs tracking-widest">
              <AlertTriangle size={18} /> The Invisibility Crisis
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
              Stop Being <br /> <span className="text-yellow-500 italic">Filtered.</span>
            </h1>
          </div>
          
          <p className="text-xl text-slate-400 italic font-medium leading-relaxed max-w-xl border-l-4 border-yellow-500/20 pl-8">
            Your business is excellent, but it's a <span className="text-white underline decoration-yellow-500/30">Ghost</span> to the AI algorithms. Align your financial reality with your digital future.
          </p>

          {/* THE VALUE STACK BADGE */}
          <div className="p-10 border-2 border-yellow-500 bg-yellow-500/5 rounded-[3rem] space-y-6 shadow-2xl relative overflow-hidden group">
             <div className="relative z-10">
                <p className="text-yellow-500 font-black uppercase text-xs tracking-[0.3em] mb-4">Strategic Value Transfer</p>
                <div className="flex items-baseline gap-4">
                   <span className="text-5xl md:text-7xl font-black">R16,300</span>
                   <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">In Professional Assets</span>
                </div>
                <p className="text-slate-400 text-sm mt-4 italic font-medium">Mending your entity architecture with a massive R15,450.01 arbitrage.</p>
             </div>
             <Zap className="absolute -bottom-10 -right-10 text-yellow-500 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity" size={200} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a href="https://www.quicket.co.za/events/352598-financial-clarity-for-non-financial-business-owners/#/" target="_blank" className="bg-yellow-500 text-slate-950 px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3 uppercase">
              Secure Your Seat <ArrowRight size={20} />
            </a>
            <Link to="/poster" className="border-2 border-slate-800 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-900 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
              View Poster <Download size={20}/>
            </Link>
          </div>
        </div>

        {/* SPEAKER CARD */}
        <div className="relative">
           <div className="relative rounded-[4rem] overflow-hidden border-2 border-slate-800 shadow-2xl bg-slate-900">
              <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1766069617/Thabo_Leslie_Motsumi._AI_Google_my_Business_profile_optimization_Search_Everywhere_Optimation_SEO_Automation_and_Smart_digital_marketing._vncyse.png" className="w-full grayscale brightness-75 hover:brightness-100 transition-all duration-1000" alt="Thabo" />
              
              {/* GIVEAWAY OVERLAY */}
              <div className="absolute top-10 left-10 rotate-[-12deg] bg-white text-slate-950 p-6 rounded-3xl shadow-2xl border-4 border-slate-950 z-20 text-center max-w-[180px] animate-pulse">
                 <Gift className="mx-auto mb-2 text-yellow-600" size={24} fill="currentColor"/>
                 <p className="text-[10px] font-black uppercase leading-tight">Lucky Attendees Win</p>
                 <p className="text-xs font-bold italic">Entity Audits & Support Worth R7,800</p>
              </div>

              <div className="absolute bottom-0 right-0 p-8 bg-slate-950/90 backdrop-blur-xl border-t border-l border-yellow-500/30 rounded-tl-[3rem] text-right">
                 <p className="text-xs font-black uppercase text-white mb-1">Saturday, 28 Feb 2026</p>
                 <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest leading-none">Munyaka Waterfall City</p>
              </div>
           </div>
        </div>
      </section>

      {/* 2. THE VALUE RECEIPT (The Math) */}
      <section className="py-32 max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
           <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">The Math <span className="text-yellow-500">Makes Sense</span></h3>
           <p className="text-slate-500 font-medium">We aren't selling a ticket; we are transferring professional assets.</p>
        </div>

        <div className="p-12 border border-slate-800 rounded-[4rem] bg-slate-900/20 shadow-2xl relative overflow-hidden">
           <div className="space-y-6 relative z-10">
              {[
                { item: "Strategic Financial & AI Mastery Session", val: "R 8,500.00" },
                { item: "Lucky Draw: Digital Business Audit (GMB+)", val: "R 3,800.00" },
                { item: "Lucky Draw: 2 Months Business Bookkeeping", val: "R 4,000.00" },
                { item: "Munyaka Premium Hospitality", val: "R 550.00" }
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-slate-800 font-medium group">
                   <span className="text-slate-400 text-sm uppercase group-hover:text-yellow-500 transition-colors">{row.item}</span>
                   <span className="text-white font-black text-sm">{row.val}</span>
                </div>
              ))}
              <div className="flex justify-between items-center py-10">
                 <div className="flex flex-col">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Total Strategic Value</span>
                    <span className="text-4xl md:text-6xl font-black text-white">R 16,300</span>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-yellow-500 text-[10px] font-black uppercase tracking-widest">Your Price Today</span>
                    <span className="text-4xl md:text-6xl font-black text-yellow-500">R 849.99</span>
                 </div>
              </div>
           </div>
           <Zap className="absolute -bottom-20 -left-20 text-yellow-500 opacity-[0.02]" size={400} />
        </div>
      </section>

      {/* 3. CURRICULUM BENTO GRID */}
      <section className="py-32 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
           <div className="p-12 border border-slate-800 rounded-[4rem] bg-slate-900/10 space-y-8">
              <span className="bg-yellow-500 text-slate-950 px-4 py-1 rounded-full font-black uppercase text-[9px] tracking-widest w-fit">Part 1: The Foundation</span>
              <h4 className="text-4xl font-black uppercase leading-tight">Financial <br /> Sovereignty</h4>
              <p className="text-slate-400 text-sm leading-relaxed italic">Lead: Marcia Kgaphola (IntegratedWellth)</p>
              <ul className="space-y-4 text-slate-300 font-medium">
                 <li className="flex items-center gap-3"><CheckCircle2 className="text-yellow-500" size={18}/> Live Chart of Accounts Build</li>
                 <li className="flex items-center gap-3"><CheckCircle2 className="text-yellow-500" size={18}/> Automated Ledger Configuration</li>
                 <li className="flex items-center gap-3"><CheckCircle2 className="text-yellow-500" size={18}/> Compliance & Funding Readiness</li>
              </ul>
           </div>

           <div className="p-12 border border-slate-800 rounded-[4rem] bg-slate-900/10 space-y-8">
              <span className="bg-yellow-500 text-slate-950 px-4 py-1 rounded-full font-black uppercase text-[9px] tracking-widest w-fit">Part 2: The Engine</span>
              <h4 className="text-4xl font-black uppercase leading-tight">Digital <br /> Authority</h4>
              <p className="text-slate-400 text-sm leading-relaxed italic">Guest: Thabo Leslie Motsumi (happyhunterdigital)</p>
              <ul className="space-y-4 text-slate-300 font-medium">
                 <li className="flex items-center gap-3"><CheckCircle2 className="text-yellow-500" size={18}/> Local SEO & GMB Domination</li>
                 <li className="flex items-center gap-3"><CheckCircle2 className="text-yellow-500" size={18}/> Marketing Automation Frameworks</li>
                 <li className="flex items-center gap-3"><CheckCircle2 className="text-yellow-500" size={18}/> Answer Engine Optimization (AEO)</li>
              </ul>
           </div>
        </div>
      </section>

      {/* 4. FINAL CTA */}
      <div className="py-40 text-center space-y-16">
          <div className="space-y-4">
             <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none">Join the <span className="text-yellow-500 italic">Summit.</span></h2>
             <p className="text-slate-500 text-xl italic font-medium">Only 50 entrepreneurs will secure this R16,300 value stack.</p>
          </div>
          <div className="flex justify-center">
             <a 
                href="https://www.quicket.co.za/events/352598-financial-clarity-for-non-financial-business-owners/#/" 
                target="_blank" 
                className="bg-yellow-500 text-slate-950 px-16 py-7 rounded-3xl font-black text-2xl hover:scale-110 transition-all shadow-[0_0_50px_rgba(250,204,21,0.3)] uppercase tracking-widest"
              >
                Book on Quicket Now
              </a>
          </div>
          <p className="brand-name text-slate-800 text-4xl pt-20">happyhunterdigital</p>
      </div>
    </div>
  );
}
