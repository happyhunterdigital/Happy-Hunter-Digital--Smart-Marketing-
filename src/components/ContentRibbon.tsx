import { Zap, Star, Globe, AlertCircle } from 'lucide-react';

export default function ContentRibbon() {
  const content = (
    <div className="flex items-center gap-12 px-8 whitespace-nowrap">
      {/* SERVICE NODES */}
      <span className="flex items-center gap-2">
        <Zap size={14} className="text-slate-900" fill="currentColor" /> 
        <span className="text-slate-950 font-bold">Digital Entity Audits</span>
      </span>
      <span className="text-slate-900/20 font-thin">|</span>
      
      <span className="flex items-center gap-2">
        <Star size={14} className="text-slate-900" fill="currentColor" /> 
        <span className="text-slate-950 font-bold">Local SEO Strategy</span>
      </span>
      <span className="text-slate-900/20 font-thin">|</span>
      
      <span className="flex items-center gap-2">
        <Globe size={14} className="text-slate-900" /> 
        <span className="text-slate-950 font-bold">AI Visibility (AEO)</span>
      </span>
      <span className="text-slate-900/20 font-thin">|</span>
      
      <span className="flex items-center gap-2">
        <Zap size={14} className="text-slate-900" fill="currentColor" /> 
        <span className="text-slate-950 font-bold">Social Media Positioning</span>
      </span>
      <span className="text-slate-900/20 font-thin">|</span>
      
      {/* THE SUMMIT HANDSHAKE: FLANKED BY LOGOS */}
      <div className="flex items-center gap-5 bg-slate-950 px-6 py-2 rounded-full border border-white/10 shadow-2xl group">
        {/* LOGO 1: INTEGRATED WELLTH */}
        <img 
          src="https://res.cloudinary.com/dka0498ns/image/upload/v1765747667/Integrated_Wellth_Solutions_Logo_bodmyc1_iiervl.png" 
          className="h-5 w-auto object-contain brightness-110" 
          alt="Integrated Wellth" 
        />
        
        <span className="text-white font-black tracking-tight text-[10px] md:text-[11px]">
          SUMMIT 2026: AIpoweredMarketing // Automation // GMB Mastery — 
          <span className="text-red-500 font-black ml-2 underline underline-offset-4 decoration-red-500/50">
            28 February
          </span>
        </span>

        {/* LOGO 2: HAPPY HUNTER */}
        <img 
          src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" 
          className="h-6 w-6 rounded-full border border-yellow-500/50" 
          alt="Happy Hunter" 
        />
      </div>
      <span className="text-slate-900/20 font-thin">|</span>
    </div>
  );

  return (
    <div className="bg-yellow-500 py-3 overflow-hidden border-y border-yellow-600/20 relative z-50 shadow-lg">
      <div className="animate-marquee text-[10px] font-black uppercase tracking-[0.2em] flex items-center">
        {content}
        {content}
      </div>
    </div>
  );
}
