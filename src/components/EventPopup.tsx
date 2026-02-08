import { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Clock, Zap, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';

export default function EventPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  // 1. SESSION LOGIC: Show popup after 3 seconds
  useEffect(() => {
    const hasSeen = sessionStorage.getItem('summit_v2_seen');
    if (!hasSeen) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsVisible(false);
    sessionStorage.setItem('summit_v2_seen', 'true');
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 sm:px-6 bg-slate-950/95 backdrop-blur-md animate-fade-in">
      <div className="relative max-w-6xl w-full bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] grid md:grid-cols-2 lg:grid-cols-5">
        
        {/* CLOSE BUTTON */}
        <button onClick={closePopup} className="absolute top-6 right-6 z-50 p-2 bg-slate-950/50 rounded-full text-slate-400 hover:text-white transition-colors">
          <X size={20} />
        </button>

        {/* LEFT COLUMN: THE SPEAKER BADGE (2/5) */}
        <div className="relative lg:col-span-2 h-72 md:h-auto overflow-hidden bg-slate-800 border-r border-slate-800">
          <img 
            src="https://res.cloudinary.com/dka0498ns/image/upload/v1766069617/Thabo_Leslie_Motsumi._AI_Google_my_Business_profile_optimization_Search_Everywhere_Optimation_SEO_Automation_and_Smart_digital_marketing._vncyse.png"
            alt="Thabo Leslie Motsumi"
            className="w-full h-full object-cover grayscale brightness-75 transition-all duration-1000 hover:grayscale-0 hover:scale-105"
          />
          
          {/* LOGO OVERLAY */}
          <div className="absolute top-8 left-8 flex flex-col gap-4">
            <img 
              src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761701/Logo_mock1_jmjuoe.png" 
              alt="Happy Hunter Logo" 
              className="h-10 w-auto"
            />
            <h4 className="brand-name text-4xl text-yellow-500 leading-none">happyhunterdigital</h4>
          </div>

          {/* PARTNER SEAL: Integrated Wellth */}
          <a 
            href="https://integratedwellth.co.za" 
            target="_blank" 
            rel="noopener noreferrer"
            className="absolute bottom-8 left-8 right-8 bg-slate-950/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4 group hover:border-yellow-500/50 transition-all"
          >
            <img 
              src="https://res.cloudinary.com/dka0498ns/image/upload/v1765747786/favicon_ofkkb1.png" 
              alt="Integrated Wellth" 
              className="h-8 w-8 object-contain"
            />
            <div className="flex flex-col leading-none">
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Official Guest of</span>
              <span className="text-white font-bold text-xs group-hover:text-yellow-500 transition-colors">Integrated Wellth Summit</span>
            </div>
            <ExternalLink size={12} className="ml-auto text-slate-700 group-hover:text-yellow-500" />
          </a>
        </div>

        {/* RIGHT COLUMN: THE INTEL (3/5) */}
        <div className="lg:col-span-3 p-8 md:p-14 flex flex-col justify-between space-y-8 bg-slate-900/50">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full">
              <Zap size={14} className="text-yellow-500" fill="currentColor" />
              <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">High-Impact SME Session</span>
            </div>

            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.95] text-white">
              Empowering SMEs with <br />
              <span className="text-yellow-500">Clarity & Transformation</span>
            </h3>

            <div className="space-y-4 text-slate-400 text-sm leading-relaxed border-l-2 border-slate-800 pl-6 italic">
              <p>Thabo Leslie Motsumi has been officially invited by **Integrated Wellth** to lead a session on navigating the digital era without complexity.</p>
            </div>

            {/* VALUE PROPS GRID */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "AI-Powered Marketing",
                "Automation Frameworks",
                "Google Business Mastery",
                "Scalable Growth Logic"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <ShieldCheck size={16} className="text-yellow-500" />
                  <span className="text-[10px] font-bold text-slate-200 uppercase tracking-wide">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* LOGISTICS & COUNTDOWN */}
          <div className="space-y-8">
            <div className="flex flex-wrap gap-8 py-6 border-y border-slate-800/50">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-yellow-500" />
                <div className="text-[11px] font-black uppercase text-white tracking-widest leading-none">
                  28 Feb 2026
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <MapPin size={20} className="text-slate-600" />
                <div className="text-[11px] font-bold uppercase tracking-widest leading-none">
                  Waterfall City
                </div>
              </div>
            </div>

            {/* COUNTDOWN CLOCK */}
            <div className="flex gap-4">
              {[
                { label: 'Days', val: timeLeft.days },
                { label: 'Hours', val: timeLeft.hours },
                { label: 'Mins', val: timeLeft.mins },
                { label: 'Secs', val: timeLeft.secs }
              ].map((t, idx) => (
                <div key={idx} className="flex-1 p-3 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center">
                  <span className="text-2xl font-black text-white">{t.val.toString().padStart(2, '0')}</span>
                  <span className="text-[8px] uppercase text-slate-600 font-black mt-1 tracking-widest">{t.label}</span>
                </div>
              ))}
            </div>

            {/* THE CTA */}
            <a 
              href="https://www.quicket.co.za/events/352598-financial-clarity-for-non-financial-business-owners/#/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group w-full bg-yellow-500 text-slate-950 p-6 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_20px_50px_rgba(250,204,21,0.2)]"
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
