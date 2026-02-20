import React from 'react';
import { Zap, Globe, Target, ShieldCheck } from 'lucide-react';

export const ContentRibbon = () => {
  const content = (
    <div className="flex items-center gap-10 px-8">
      {/* SERVICE 1 */}
      <div className="flex items-center gap-2">
        <Target size={12} className="text-yellow-500 opacity-60" />
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/70 whitespace-nowrap">Entity Architecture</span>
      </div>

      <span className="text-white/10 font-thin">/</span>

      {/* SERVICE 2 */}
      <div className="flex items-center gap-2">
        <Globe size={12} className="text-yellow-500 opacity-60" />
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/70 whitespace-nowrap">AI Visibility (AEO)</span>
      </div>

      <span className="text-white/10 font-thin">/</span>

      {/* THE HIGHLIGHTED SUMMIT BADGE */}
      <div className="flex items-center gap-3 bg-yellow-500 px-4 py-1 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all hover:scale-105">
        <Zap size={12} className="text-black fill-black" />
        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-black whitespace-nowrap">
          SUMMIT 28TH FEB
        </span>
      </div>

      <span className="text-white/10 font-thin">/</span>

      {/* SERVICE 3 */}
      <div className="flex items-center gap-2">
        <ShieldCheck size={12} className="text-yellow-500 opacity-60" />
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/70 whitespace-nowrap">Trust Synchronization</span>
      </div>

      <span className="text-white/10 font-thin">/</span>

      {/* SERVICE 4 */}
      <div className="flex items-center gap-2">
        <Zap size={12} className="text-yellow-500 opacity-60" />
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/70 whitespace-nowrap">Agentic Revenue</span>
      </div>

      <span className="text-white/10 font-thin">/</span>
    </div>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-[110] bg-black/40 backdrop-blur-xl h-12 flex items-center overflow-hidden border-b border-white/5">
      <div className="flex animate-marquee py-2">
        {content}
        {content}
        {content}
      </div>
      
      {/* Subtle overlay gradients for fade effect on edges */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};
