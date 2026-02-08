import { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Zap, ArrowRight } from 'lucide-react';

export default function EventPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('summit_final_v1');
    if (!hasSeen) {
      const timer = setTimeout(() => setIsVisible(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsVisible(false);
    sessionStorage.setItem('summit_final_v1', 'true');
  };

  useEffect(() => {
    const target = new Date("February 28, 2026 09:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff < 0) {
        clearInterval(interval);
      } else {
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

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-slate-950/98 backdrop-blur-md animate-fade-in">
      <div className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto md:overflow-hidden bg-slate-900 border border-slate-800 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row">
        
        {/* CLOSE BUTTON */}
        <button onClick={closePopup} className="absolute top-5 right-5 z-[210] p-2 bg-slate-950/80 rounded-full text-slate-400 hover:text-yellow-500 transition-all border border-white/5">
          <X size={20} />
        </button>

        {/* LEFT: THE PRINCIPAL STRATEGIST */}
        <div className="relative w-full md:w-[42%] h-80 md:h-auto shrink-0 overflow-hidden bg-slate-800 border-b md:border-b-0 md:border-r border-slate-800">
          <img 
            src="https://res.cloudinary.com/dka0498ns/image/upload/v1766069617/Thabo_Leslie_Motsumi._AI_Google_my_Business_profile_optimization_Search_Everywhere_Optimation_SEO_Automation_and_Smart_digital_marketing._vncyse.png"
            alt="Thabo Leslie Motsumi"
            className="w-full h-full object-cover object-[center_15%] md:object-center grayscale brightness-90 hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 md:opacity-40"></div>

          {/* PARTNER SEAL */}
          <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 bg-slate-950/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-2xl">
            <img 
              src="https://res.cloudinary.com/dka0498ns/image/upload/v1765747786/favicon_ofkkb1.png" 
              alt="Integrated Wellth" 
              className="h-7 w-7 object-contain"
            />
            <div className="flex flex-col leading-none">
              <span className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em] mb-1">Invited by</span>
              <span className="text-white font-bold text-[10px] md:text-xs tracking-tight uppercase">Integrated Wellth Summit</span>
            </div>
          </div>
        </div>

        {/* RIGHT: THE INVITATION INTEL */}
        <div className="p-8 md:p-16 lg:p-20 flex flex-col justify-between space-y-10 bg-slate-900/50">
          
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full">
              <Zap size={12} className="text-yellow-500" fill="currentColor" />
              <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">Protocol Directive 2026</span>
            </div>

            <h3 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] text-white">
              SME Clarity & <br />
              <span className="text-yellow-500">Transformation</span>
            </h3>

            <p className="text-slate-400 text-sm md:text-lg leading-relaxed border-l-4 border-yellow-500/20 pl-6 italic">
              Thabo Leslie Motsumi has been officially invited to lead an unsparing session on leveraging <span className="text-yellow-500 font-black not-italic px-1">AI & GMB Optimization</span> for measurable South African growth.
            </p>

            {/* STRATEGIC PILLARS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {[
                "AI-Powered Marketing",
                "Automation Frameworks",
                "Google Business Mastery",
                "Scalable Growth Logic"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                  <span className="text-[10px] md:text-[11px] font-black text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* LOGISTICS & COUNTDOWN */}
          <div className="space-y-10">
            <div className="flex items-center justify-between py-6 border-y border-slate-800/50">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-yellow-500" />
                <span className="text-[11px] font-black uppercase text-white tracking-[0.2em]">28 Feb 2026</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-slate-600" />
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">Waterfall City</span>
              </div>
            </div>

            {/* COUNTDOWN */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Days', val: timeLeft.days },
                { label: 'Hours', val: timeLeft.hours },
                { label: 'Mins', val: timeLeft.mins },
                { label: 'Secs', val: timeLeft.secs }
              ].map((t, idx) => (
                <div key={idx} className="p-4 bg-slate-950 rounded-3xl border border-slate-800 flex flex-col items-center shadow-inner">
                  <span className="text-2xl md:text-3xl font-black text-white leading-none">{t.val.toString().padStart(2, '0')}</span>
                  <span className="text-[7px] uppercase text-slate-600 font-black mt-2 tracking-[0.2em]">{t.label}</span>
                </div>
              ))}
            </div>

            {/* THE CTA */}
            <a 
              href="https://www.quicket.co.za/events/352598-financial-clarity-for-non-financial-business-owners/#/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group w-full bg-yellow-500 text-slate-950 p-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_20px_50px_rgba(250,204,21,0.2)] active:scale-95"
            >
              Reserve Your Spot Today
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
