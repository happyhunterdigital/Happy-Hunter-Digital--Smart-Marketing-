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
      
      {/* SUMMIT ANNOUNCEMENT HIGHLIGHT */}
      <span className="bg-slate-950 text-yellow-500 px-4 py-1 rounded-full border border-yellow-500/30 flex items-center gap-3 font-black italic">
        <AlertCircle size={14} />
        <span>happyhunterdigital @ IntegratedWellth Summit: AIpoweredMarketing // Automation // GMB Optimization</span>
      </span>
      <span className="text-slate-800">•</span>
    </div>
  );

  return (
    <div className="bg-yellow-500 py-3 overflow-hidden border-y border-yellow-600/20 relative z-50">
      <div className="animate-marquee text-slate-950 text-[10px] font-black uppercase tracking-[0.2em] flex items-center">
        {content}
        {content} {/* Doubled for seamless loop */}
      </div>
    </div>
  );
}
