import { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Clock, Zap, ArrowRight } from 'lucide-react';

export default function EventPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  // 1. SESSION LOGIC: Show popup once per visit after 3 seconds
  useEffect(() => {
    const hasSeen = sessionStorage.getItem('summit_popup_seen');
    if (!hasSeen) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsVisible(false);
    sessionStorage.setItem('summit_popup_seen', 'true');
  };

  // 2. COUNTDOWN LOGIC: Target Feb 28, 2026
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-6 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="relative max-w-5xl w-full bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(250,204,21,0.1)] grid md:grid-cols-2">
        
        {/* CLOSE BUTTON */}
        <button onClick={closePopup} className="absolute top-6 right-6 z-50 p-2 bg-slate-950/50 rounded-full text-slate-400 hover:text-white transition-colors">
          <X size={20} />
        </button>

        {/* LEFT: VISUAL AUTHORITY */}
        <div className="relative h-64 md:h-auto overflow-hidden bg-slate-800">
          <img 
            src="https://res.cloudinary.com/dka0498ns/image/upload/v1766069617/Thabo_Leslie_Motsumi._AI_Google_my_Business_profile_optimization_Search_Everywhere_Optimation_SEO_Automation_and_Smart_digital_marketing._vncyse.png"
            alt="Thabo Leslie Motsumi - Summit Speaker"
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
          <div className="absolute bottom-8 left-8">
            <img 
              src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761701/Logo_mock1_jmjuoe.png" 
              className="h-8 mb-4" 
              alt="logo"
            />
            <h4 className="brand-name text-4xl text-yellow-500">happyhunterdigital</h4>
          </div>
        </div>

        {/* RIGHT: STRATEGIC INTEL */}
        <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full w-fit">
            <Zap size={12} className="text-yellow-500" fill="currentColor" />
            <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest text-center">Summit Exclusive Invitation</span>
          </div>

          <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">
            AI-Powered <br /> <span className="text-yellow-500">Mastery Session</span>
          </h3>

          <div className="space-y-4 text-slate-400 text-sm leading-relaxed italic border-l-2 border-slate-800 pl-6">
            <p>Unpacking campaign orchestration, automation frameworks, and GMB optimization at the IntegratedWellth Summit.</p>
          </div>

          {/* LOGISTICS GRID */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-lg text-yellow-500"><Calendar size={16}/></div>
              <div className="text-[10px] font-bold uppercase tracking-tight text-white">28 February 2026</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-lg text-yellow-500"><MapPin size={16}/></div>
              <div className="text-[10px] font-bold uppercase tracking-tight text-white">Munyaka, Waterfall</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-lg text-yellow-500"><Clock size={16}/></div>
              <div className="text-[10px] font-bold uppercase tracking-tight text-white">09:00 – 16:30</div>
            </div>
          </div>

          {/* THE COUNTDOWN ENGINE */}
          <div className="pt-6">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mb-3">Time Remaining Until Protocol Launch:</p>
            <div className="flex gap-4">
              {[
                { label: 'Days', val: timeLeft.days },
                { label: 'Hours', val: timeLeft.hours },
                { label: 'Mins', val: timeLeft.mins },
                { label: 'Secs', val: timeLeft.secs }
              ].map((t, idx) => (
                <div key={idx} className="flex flex-col items-center min-w-[50px] p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-xl font-black text-white leading-none">{t.val.toString().padStart(2, '0')}</span>
                  <span className="text-[8px] uppercase text-slate-500 font-bold mt-1">{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full bg-yellow-500 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-95 transition-all shadow-2xl shadow-yellow-500/10">
            Reserve Your Spot Today <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
