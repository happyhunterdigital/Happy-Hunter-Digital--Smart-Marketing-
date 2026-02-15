import { Zap, Star, Globe } from 'lucide-react';

export default function ContentRibbon() {
  const content = (
    <div className="flex items-center gap-16 px-8 whitespace-nowrap">
      <span className="flex items-center gap-2">
        <Zap size={14} className="text-slate-900" fill="currentColor" /> 
        <span className="text-slate-950 font-bold">Digital Entity Audits</span>
      </span>
      <span className="text-slate-900/20">|</span>
      <span className="flex items-center gap-2">
        <Star size={14} className="text-slate-900" fill="currentColor" /> 
        <span className="text-slate-950 font-bold">Local SEO Strategy</span>
      </span>
      <span className="text-slate-900/20">|</span>
      
      {/* SUMMIT HIGHLIGHT */}
      <span className="bg-slate-950 text-white px-5 py-2 rounded-full border border-white/10 flex items-center gap-4 font-bold shadow-2xl">
        <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765747667/Integrated_Wellth_Solutions_Logo_bodmyc1_iiervl.png" className="h-5 w-auto" alt="IW" />
        <span className="uppercase text-[10px]">Summit 2026: AIpoweredMarketing // Automation // GMB Mastery — <span className="text-red-500 font-black underline underline-offset-4 decoration-red-500/50">28 February</span></span>
        <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" className="h-6 rounded-full border border-yellow-500/50" alt="HH" />
      </span>

      <span className="text-slate-900/20">|</span>
      <span className="flex items-center gap-2">
        <Globe size={14} className="text-slate-900" /> 
        <span className="text-slate-950 font-bold">AI Visibility (AEO)</span>
      </span>
      <span className="text-slate-900/20">|</span>
      <span className="flex items-center gap-2">
        <Zap size={14} className="text-slate-900" fill="currentColor" /> 
        <span className="text-slate-950 font-bold">Social Media Positioning</span>
      </span>
      <span className="text-slate-900/20">|</span>
    </div>
  );

  return (
    <div className="fixed top-0 left-0 w-full h-12 bg-yellow-500 overflow-hidden z-[100] flex items-center border-b border-yellow-600/20 shadow-xl">
      <div className="animate-marquee text-[10px] font-black uppercase tracking-widest flex items-center">
        {content}{content}
      </div>
    </div>
  );
}
