import { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Clock, Zap, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';

export default function EventPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('summit_mobile_v1');
    if (!hasSeen) {
      const timer = setTimeout(() => setIsVisible(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsVisible(false);
    sessionStorage.setItem('summit_mobile_v1', 'true');
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
      {/* MAIN CONTAINER: Responsive width and Max-Height for mobile scrolling */}
      <div className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto md:overflow-hidden bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row">
        
        {/* CLOSE BUTTON (FIXED ON MOBILE) */}
        <button onClick={closePopup} className="absolute top-4 right-4 z-[210] p-2 bg-slate-950/80 rounded-full text-slate-400 hover:text-white transition-colors border border-white/5">
          <X size={18} />
        </button>

        {/* IMAGE SECTION: Top on mobile, Left on desktop */}
        <div className="relative w-full md:w-[40%] h-64 md:h-auto shrink-0 overflow-hidden bg-slate-800 border-b md:border-b-0 md:border-r border-slate-800">
          <img 
            src="https://res.cloudinary.com/dka0498ns/image/upload/v1766069617/Thabo_Leslie_Motsumi._AI_Google_my_Business_profile_optimization_Search_Everywhere_Optimation_SEO_Automation_and_Smart_digital_marketing._vncyse.png"
            alt="Thabo Leslie Motsumi"
            className="w-full h-full object-cover object-[center_15%] md:object-center grayscale brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80 md:opacity-40"></div>

          {/* PARTNER SEAL: Smaller & Smarter for Mobile */}
          <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 bg-slate-950/90 backdrop-blur-md border border-white/10 p-3 md:p-4 rounded-xl flex items-center gap-3">
            <img 
              src="https://res.cloudinary.com/dka0498ns/image/upload/v1765747786/favicon_ofkkb1.png" 
              alt="Integrated Wellth" 
              className="h-6 w-6 object-contain"
            />
            <div className="flex flex-col leading-none">
              <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Invited by</span>
              <span className="text-white font-bold text-[10px] md:text-xs">Integrated Wellth Summit</span>
            </div>
          </div>
        </div>

        {/* CONTENT SECTION: Scrollable if text is long */}
        <div className="p-6 md:p-12 lg:p-16 flex flex-col justify-between space-y-6 md:space-y-8 bg-slate-900/50">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full">
              <Zap size={12} className="text-yellow-500" fill="currentColor" />
              <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">Strategic Masterclass</span>
            </div>

            <h3 className="text-2xl md:text-5xl font-black uppercase tracking-tighter leading-[0.95] text-white">
              SME Clarity & <br />
              <span className="text-yellow-500">Digital Transformation</span>
            </h3>

            <p className="text-slate-400 text-xs md:text-sm leading-relaxed border-l-2 border-slate-800 pl-4 italic">
              Thabo Leslie Motsumi leads an unsparing session on leveraging **AI & GMB Optimization** for measurable SA growth.
            </p>

            {/* VALUE PROPS: 1 column on mobile, 2 on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {[
                "AI-Powered Marketing",
                "Automation Frameworks",
                "Google Business Mastery",
                "Scalable Growth Logic"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-yellow-500 shrink-0" />
                  <span className="text-[9px] md:text-[10px] font-bold text-slate-200 uppercase tracking-wide">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* LOGISTICS & COUNTDOWN */}
          <div className="space-y-6 md:space-y-8">
            <div className="flex flex-row justify-between items-center py-4 border-y border-slate-800/50">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-yellow-500" />
                <span className="text-[10px] font-black uppercase text-white tracking-widest">28 Feb 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-slate-600" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Waterfall City</span>
              </div>
            </div>

            {/* COUNTDOWN: Compact for small screens */}
            <div className="flex gap-2 md:gap-4">
              {[
                { label: 'Days', val: timeLeft.days },
                { label: 'Hrs', val: timeLeft.hours },
                { label: 'Min', val: timeLeft.mins },
                { label: 'Sec', val: timeLeft.secs }
              ].map((t, idx) => (
                <div key={idx} className="flex-1 p-2 md:p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center">
                  <span className="text-lg md:text-2xl font-black text-white">{t.val.toString().padStart(2, '0')}</span>
                  <span className="text-[7px] md:text-[8px] uppercase text-slate-600 font-black mt-1">{t.label}</span>
                </div>
              ))}
            </div>

            {/* THE CTA */}
            <a 
              href="https://www.quicket.co.za/events/352598-financial-clarity-for-non-financial-business-owners/#/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-yellow-500 text-slate-950 p-4 md:p-6 rounded-2xl font-black uppercase tracking-widest text-[11px] md:text-sm flex items-center justify-center gap-3 hover:bg-white transition-all shadow-2xl active:scale-95"
            >
              Reserve Your Spot Today <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
