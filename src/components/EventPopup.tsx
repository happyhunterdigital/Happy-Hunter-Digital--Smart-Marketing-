import { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Zap, ArrowRight } from 'lucide-react';

export default function EventPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    try {
      const hasSeen = sessionStorage.getItem('summit_final_v1');
      if (!hasSeen) {
        const timer = setTimeout(() => setIsVisible(true), 2500);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // sessionStorage not available
    }
  }, []);

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

  const closePopup = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem('summit_final_v1', 'true');
    } catch (e) {
      console.log('Could not save session');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/98 backdrop-blur-md animate-fade-in">
      <div className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-[2rem] sm:rounded-[3rem] shadow-2xl flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button 
          onClick={closePopup}
          className="absolute top-4 right-4 z-[210] p-2 bg-slate-950/80 rounded-full text-slate-400 hover:text-yellow-500 transition-all border border-white/5"
          aria-label="Close popup"
        >
          <X size={20} />
        </button>

        {/* Left: Image */}
        <div className="relative w-full md:w-[42%] h-64 md:h-auto shrink-0 overflow-hidden bg-slate-800 border-b md:border-b-0 md:border-r border-slate-800">
          <img
            src="https://res.cloudinary.com/dka0498ns/image/upload/v1770566290/Thabo_Leslie_Motsumi_is_the_founder_and_key_figure_behind_happyhunterdigital_also_referred_t_as_Happy_Hunter_Smart_Marketing_yvomai.png"
            alt="Thabo Leslie Motsumi"
            className="w-full h-full object-cover object-[center_15%] md:object-center grayscale brightness-90 hover:grayscale-0 transition-all duration-1000"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 md:opacity-40" />
          
          {/* Partner Seal */}
          <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 bg-slate-950/90 backdrop-blur-xl border border-white/10 p-3 rounded-xl flex items-center gap-3 shadow-xl">
            <img
              src="https://res.cloudinary.com/dka0498ns/image/upload/v1765747786/favicon_ofkkb1.png"
              alt="Integrated Wellth"
              className="h-6 w-6 object-contain"
            />
            <div className="flex flex-col leading-none">
              <span className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em] mb-1">
                Invited by
              </span>
              <span className="text-white font-bold text-[10px] tracking-tight uppercase">
                Integrated Wellth Summit
              </span>
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="p-6 md:p-12 lg:p-16 flex flex-col justify-between space-y-8 bg-slate-900/50">
          <div className="space-y-6">
            div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-full">
              <Zap size={12} className="text-yellow-500" fill="currentColor" />
              <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">
                Protocol Directive 2026
              </span>
            </div>
            
            <h3 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-[0.9] text-white">
              SME Clarity &<br />
              <span className="text-yellow-500">Transformation</span>
            </h3>

            <p className="text-slate-400 text-sm md:text-base leading-relaxed border-l-4 border-yellow-500/20 pl-6 italic">
              Thabo Leslie Motsumi has been officially invited to lead an unsparing session on leveraging{' '}
              <span className="text-yellow-500 font-black not-italic px-1">AI & GMB Optimization</span>{' '}
              for measurable South African business growth.
            </p>

            {/* Strategic Pillars */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              {[
                "AI-Powered Marketing",
                "Automation Frameworks",
                "Google Business Mastery",
                "Scalable Growth Logic"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Logistics & Countdown */}
          <div className="space-y-6">
            <div className="flex items-center justify-between py-4 border-y border-slate-800/50">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-yellow-500" />
                <span className="text-[11px] font-black uppercase text-white tracking-[0.2em]">
                  28 Feb 2026
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-slate-600" />
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">
                  Waterfall City
                </span>
              </div>
            </div>

            {/* Countdown */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {[
                { label: 'Days', val: timeLeft.days },
                { label: 'Hours', val: timeLeft.hours },
                { label: 'Mins', val: timeLeft.mins },
                { label: 'Secs', val: timeLeft.secs }
              ].map((t, idx) => (
                <div key={idx} className="p-3 sm:p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center shadow-inner">
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-none">
                    {t.val.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[7px] uppercase text-slate-600 font-black mt-2 tracking-[0.2em]">
                    {t.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="https://www.quicket.co.za/events/352598-financial-clarity-for-non-financial-business-owners/#/"
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full bg-yellow-500 text-slate-950 p-4 sm:p-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs sm:text-sm flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl active:scale-95"
            >
              Reserve Your Spot Today
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
