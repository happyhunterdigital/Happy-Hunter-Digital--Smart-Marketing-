import { Zap, Star, Globe } from 'lucide-react';

export default function ContentRibbon() {
  const content = (
    <div className="flex items-center gap-12 px-6">
      <span className="flex items-center gap-2">
        <Zap size={14} fill="currentColor" /> 
        <span>Digital Entity Audits</span>
      </span>
      <span className="text-slate-800">•</span>
      <span className="flex items-center gap-2">
        <Star size={14} fill="currentColor" /> 
        <span>Local SEO Strategy</span>
      </span>
      <span className="text-slate-800">•</span>
      <span className="flex items-center gap-2">
        <Globe size={14} /> 
        <span>AI Visibility (AEO)</span>
      </span>
      <span className="text-slate-800">•</span>
      <span className="flex items-center gap-2">
        <Zap size={14} fill="currentColor" /> 
        <span>Social Media Positioning</span>
      </span>
      <span className="text-slate-800">•</span>
      
      {/* SUMMIT ANNOUNCEMENT: FLANKED BY LOGOS */}
      <span className="bg-slate-950 text-white px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-4 font-bold shadow-2xl">
        {/* LOGO 1: INTEGRATED WELLTH */}
        <img 
          src="https://res.cloudinary.com/dka0498ns/image/upload/v1765747667/Integrated_Wellth_Solutions_Logo_bodmyc1_iiervl.png" 
          alt="Integrated Wellth Logo" 
          className="h-6 w-auto object-contain brightness-110"
        />

        <span className="uppercase tracking-widest text-[9px] md:text-[10px]">
          Summit 2026: AIpoweredMarketing // Automation // GMB Mastery — 
          <span className="text-red-500 font-black ml-2 underline decoration-red-500/50 underline-offset-2">
            28 February
          </span>
        </span>

        {/* LOGO 2: HAPPY HUNTER */}
        <img 
          src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" 
          alt="Happy Hunter Logo" 
          className="h-6 w-6 rounded-full object-cover border border-yellow-500/50"
        />
      </span>
      <span className="text-slate-800">•</span>
    </div>
  );

  return (
    <div className="bg-yellow-500 py-3 overflow-hidden border-y border-yellow-600/20 relative z-50 shadow-xl">
      <div className="animate-marquee text-slate-950 text-[10px] font-black uppercase tracking-[0.2em] flex items-center">
        {content}
        {content} {/* Seamless loop */}
      </div>
    </div>
  );
}
