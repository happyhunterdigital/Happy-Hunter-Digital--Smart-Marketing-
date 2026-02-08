import { AlertCircle, Zap, Star, Globe } from 'lucide-react';

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
      
      {/* SUMMIT ANNOUNCEMENT WITH RED BOLD DATE */}
      <span className="bg-slate-950 text-white px-5 py-1.5 rounded-full border border-white/10 flex items-center gap-3 font-bold">
        <AlertCircle size={14} className="text-yellow-500" />
        <span className="uppercase tracking-wider">
          happyhunterdigital @ IntegratedWellth Summit: AIpoweredMarketing // Automation // GMB Optimization — 
          <span className="text-red-500 font-black ml-2 text-xs decoration-red-500/50 underline underline-offset-2">
            28 February
          </span>
        </span>
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
