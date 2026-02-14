import { Zap, Star, Globe, ShieldAlert } from 'lucide-react';

export default function ContentRibbon() {
  const content = (
    <div className="flex items-center gap-16 px-8">
      <span className="flex items-center gap-3 text-slate-400 group">
        <Zap size={14} className="text-yellow-500 group-hover:animate-pulse" fill="currentColor" /> 
        <span className="hover:text-white transition-colors">Digital Entity Audits</span>
      </span>
      <span className="text-slate-800 opacity-30 font-thin text-2xl">/</span>
      <span className="flex items-center gap-3 text-slate-400 group">
        <Star size={14} className="text-yellow-500" fill="currentColor" /> 
        <span className="hover:text-white transition-colors">Local SEO Strategy</span>
      </span>
      <span className="text-slate-800 opacity-30 font-thin text-2xl">/</span>
      <span className="flex items-center gap-3 text-slate-400 group">
        <Globe size={14} className="text-yellow-500" /> 
        <span className="hover:text-white transition-colors">AI Visibility (AEO)</span>
      </span>
      <span className="text-slate-800 opacity-30 font-thin text-2xl">/</span>
      
      {/* SUMMIT HIGHLIGHT: PROFESSIONAL GLOW */}
      <span className="bg-yellow-500/5 border border-yellow-500/20 px-6 py-2 rounded-full flex items-center gap-6 shadow-[0_0_30px_rgba(250,204,21,0.05)]">
        <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765747667/Integrated_Wellth_Solutions_Logo_bodmyc1_iiervl.png" className="h-6 object-contain" alt="IW" />
        <span className="text-white font-black tracking-tight text-[11px]">
          SUMMIT 2026: AI & GMB MASTERY — <span className="text-red-500 underline underline-offset-4 decoration-red-500/40 font-black italic">28 FEBRUARY</span>
        </span>
        <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" className="h-6 rounded-full border border-yellow-500/30" alt="HH" />
      </span>
      <span className="text-slate-800 opacity-30 font-thin text-2xl">/</span>
    </div>
  );

  return (
    <div className="bg-slate-950/80 backdrop-blur-md py-4 overflow-hidden border-y border-slate-900 relative z-50">
      <div className="animate-marquee text-[10px] font-black uppercase tracking-[0.25em] flex items-center">
        {content}
        {content}
      </div>
    </div>
  );
}
