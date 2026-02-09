import { useEffect, useState } from 'react';
import { ShieldCheck, Zap, ArrowRight, MapPin, Calendar, Clock, ExternalLink, Globe } from 'lucide-react';

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
    <div className="pt-40 pb-20 px-6 font-sans text-white min-h-screen overflow-x-hidden">
      
      {/* 1. SUMMIT IDENTITY */}
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center mb-32 animate-fade-in">
        <div className="space-y-10">
          <div className="flex items-center gap-4">
             <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765747667/Integrated_Wellth_Solutions_Logo_bodmyc1_iiervl.png" className="h-10" alt="IW" />
             <span className="text-yellow-500 font-black uppercase text-[10px] tracking-[0.4em]">Invited Keynote Speaker</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85]">
            SME <br /> <span className="text-yellow-500">Clarity</span>
          </h1>
          
          <p className="text-xl text-slate-500 italic font-medium leading-relaxed border-l-4 border-yellow-500/20 pl-8">
            "Empowering South African Business Owners with the Clarity, Tools, and AI Transformation required for 2026."
          </p>

          <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
             <span className="flex items-center gap-2"><Calendar size={14} className="text-yellow-500" /> 28 February 2026</span>
             <span className="flex items-center gap-2"><MapPin size={14} className="text-yellow-500" /> Munyaka Waterfall City</span>
             <span className="flex items-center gap-2"><Clock size={14} className="text-yellow-500" /> 09:00 – 16:30</span>
          </div>
        </div>

        {/* 2. THE SPEAKER CARD */}
        <div className="relative group">
           <div className="relative rounded-[4rem] overflow-hidden border-2 border-slate-800 shadow-2xl">
              <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1766069617/Thabo_Leslie_Motsumi._AI_Google_my_Business_profile_optimization_Search_Everywhere_Optimation_SEO_Automation_and_Smart_digital_marketing._vncyse.png" className="w-full grayscale brightness-75" alt="Thabo" />
              <div className="absolute bottom-0 right-0 p-8 bg-slate-950/90 backdrop-blur-xl border-t border-l border-yellow-500/30 rounded-tl-[3rem] text-right">
                 <p className="text-xs font-black uppercase text-white mb-2">Thabo Leslie Motsumi</p>
                 <p className="text-[10px] font-bold text-yellow-500 italic uppercase">Principal Strategist</p>
              </div>
           </div>
        </div>
      </div>

      {/* 3. SESSION BREAKDOWN */}
      <section className="bg-slate-900/30 border-y border-slate-800 py-32 px-6">
        <div className="max-w-4xl mx-auto space-y-20">
          <div className="text-center space-y-4">
             <h3 className="text-4xl font-black uppercase tracking-tight">The Mastery <span className="text-yellow-500">Session</span></h3>
             <p className="text-slate-500 font-medium italic">A technical but accessible blueprint for the non-technical founder.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
             {[
               { title: "AI-Powered Marketing", desc: "Harness AI ecosystems to streamline campaigns and personalize customer engagement." },
               { title: "Automation Frameworks", desc: "Building reliable workflows that ensure operational consistency while you sleep." },
               { title: "GMB Optimization", desc: "Turn your Google Profile into a conversion engine with citable data nodes." },
               { title: "Measurable Growth", desc: "Using predictive analytics to scale your South African footprint." }
             ].map((box, i) => (
               <div key={i} className="p-10 border border-slate-800 rounded-[3rem] bg-slate-950/50 hover:border-yellow-500/20 transition-all">
                  <ShieldCheck className="text-yellow-500 mb-6" size={24} />
                  <h4 className="text-lg font-black uppercase mb-3">{box.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{box.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. THE FOMO CLOCK & RESERVATION */}
      <div className="py-40 max-w-4xl mx-auto text-center space-y-16">
         <div className="space-y-4">
            <h3 className="text-3xl font-black uppercase tracking-widest text-slate-500">Time Until Protocol Launch</h3>
            <div className="flex justify-center gap-6">
               {[
                 { l: 'Days', v: timeLeft.days },
                 { l: 'Hours', v: timeLeft.hours },
                 { l: 'Mins', v: timeLeft.mins },
                 { l: 'Secs', v: timeLeft.secs }
               ].map((t, idx) => (
                 <div key={idx} className="flex flex-col items-center">
                    <span className="text-5xl md:text-7xl font-black text-white">{t.v.toString().padStart(2, '0')}</span>
                    <span className="text-[10px] uppercase font-black text-yellow-500 mt-2">{t.l}</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="space-y-8">
            <a 
              href="https://www.quicket.co.za/events/352598-financial-clarity-for-non-financial-business-owners/#/" 
              target="_blank" 
              className="bg-yellow-500 text-slate-950 px-16 py-6 rounded-2xl font-black text-xl hover:scale-110 transition-all shadow-[0_0_50px_rgba(250,204,21,0.2)] inline-flex items-center gap-3"
            >
              RESERVE YOUR SUMMIT SPOT <ArrowRight size={24} />
            </a>
            <p className="text-slate-700 text-[10px] font-black uppercase tracking-[0.4em]">Official guest of integrated wellth // 2026 summit protocol</p>
         </div>
      </div>
    </div>
  );
}
