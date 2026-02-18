import { Zap, Star, Globe } from 'lucide-react';

export default function ContentRibbon() {
  const content = (
    <div className="flex items-center gap-8 sm:gap-16 px-8 whitespace-nowrap">
      <span className="flex items-center gap-2">
        <Zap size={14} className="text-slate-900" fill="currentColor" />
        <span className="text-slate-950 font-bold text-xs sm:text-sm">Digital Entity Audits</span>
      </span>
      <span className="text-slate-900/20">|</span>
      <span className="flex items-center gap-2">
        <Star size={14} className="text-slate-900" fill="currentColor" />
        <span className="text-slate-950 font-bold text-xs sm:text-sm">Local SEO Strategy</span>
      </span>
      <span className="text-slate-900/20">|</span>
      {/* Summit Announcement */}
      <div className="flex items-center gap-3 sm:gap-4 bg-slate-950 text-white px-4 sm:px-6 py-1.5 rounded-full border border-white/10 shadow-2xl">
        <img
          src="https://res.cloudinary.com/dka0498ns/image/upload/v1765747667/Integrated_Wellth_Solutions_Logo_bodmyc1_iiervl.png"
          className="h-3 sm:h-4 w-auto"
          alt="IW"
          loading="lazy"
        />
        <span className="uppercase text-[8px] sm:text-[9px] tracking-tight">
          Summit 2026: AI & GMB Mastery — 
          <span className="text-red-500 font-black underline underline-offset-4 decoration-red-500/50">
            28 February
          </span>
        </span>
        <img
          src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg"
          className="h-4 sm:h-5 w-4 sm:w-5 rounded-full border border-yellow-500/50"
          alt="HH"
          loading="lazy"
        />
      </div>
      <span className="text-slate-900/20">|</span>
      <span className="flex items-center gap-2">
        <Globe size={14} className="text-slate-900" />
        <span className="text-slate-950 font-bold text-xs sm:text-sm">AI Visibility (AEO)</span>
      </span>
      <span className="text-slate-900/20">|</span>
      <span className="flex items-center gap-2">
        <Zap size={14} className="text-slate-900" fill="currentColor" />
        <span className="text-slate-950 font-bold text-xs sm:text-sm">Social Media Positioning</span>
      </span>
    </div>
  );

  return (
    <div className="fixed top-0 left-0 w-full h-10 sm:h-12 bg-yellow-500 overflow-hidden z-[110] flex items-center border-b border-yellow-600/20 shadow-xl">
      <div className="animate-marquee text-[10px] font-black uppercase tracking-widest flex items-center">
        {content}
        {content}
      </div>
    </div>
  );
}
