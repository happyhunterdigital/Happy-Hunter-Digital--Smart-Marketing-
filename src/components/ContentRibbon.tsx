import React from 'react';
import { Zap, Star, Globe } from 'lucide-react';

export const ContentRibbon = () => {
  const content = (
    <div className="flex items-center gap-12 px-6">
      <span className="flex items-center gap-2 text-black font-black uppercase text-[10px] tracking-widest whitespace-nowrap">
        <Zap size={14} fill="currentColor"/> Digital Entity Audits
      </span>
      <span className="text-black/20">|</span>
      <span className="flex items-center gap-2 text-black font-black uppercase text-[10px] tracking-widest whitespace-nowrap">
        <Star size={14} fill="currentColor"/> Local SEO Strategy
      </span>
      <span className="text-black/20">|</span>
      
      {/* SUMMIT HIGHLIGHT */}
      <div className="flex items-center gap-3 bg-black text-white px-4 py-1 rounded-full border border-white/10 shadow-xl">
        <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765747667/Integrated_Wellth_Solutions_Logo_bodmyc1_iiervl.png" className="h-4 w-auto brightness-0 invert" alt="IW"/>
        <span className="text-[10px] font-black uppercase tracking-tighter">Summit 2026: AI & GMB Mastery — 28 February</span>
        <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" className="h-4 w-4 rounded-full" alt="HH"/>
      </div>

      <span className="text-black/20">|</span>
      <span className="flex items-center gap-2 text-black font-black uppercase text-[10px] tracking-widest whitespace-nowrap">
        <Globe size={14}/> AI Visibility (AEO)
      </span>
      <span className="text-black/20">|</span>
      <span className="flex items-center gap-2 text-black font-black uppercase text-[10px] tracking-widest whitespace-nowrap">
        <Zap size={14} fill="currentColor"/> Social Media Positioning
      </span>
      <span className="text-black/20">|</span>
    </div>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-[110] bg-yellow-500 h-10 flex items-center overflow-hidden border-b border-yellow-600 shadow-xl">
      <div className="flex animate-marquee">
        {content}
        {content}
      </div>
    </div>
  );
};
