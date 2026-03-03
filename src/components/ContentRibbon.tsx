import React from 'react';
import { Zap, ShieldCheck, Database, Globe } from 'lucide-react';

export const ContentRibbon: React.FC = () => {
  // We pair the technical architecture with the layman's result, and removed the Summit.
  const items = [
    { text: "Entity Architecture (AI-Optimized Websites)", icon: <Database size={14} /> },
    { text: "AI Visibility (Recommended by ChatGPT & Gemini)", icon: <Globe size={14} /> },
    { text: "Trust Synchronization (Google Maps Verification)", icon: <ShieldCheck size={14} /> },
    { text: "Agentic Revenue (24/7 AI Lead Automation)", icon: <Zap size={14} /> },
  ];

  // Repeat items to create a seamless infinite scroll effect
  const scrollingItems = [...items, ...items, ...items, ...items];

  return (
    <div className="fixed top-0 left-0 right-0 z-[110] bg-yellow-500 text-black border-b border-yellow-600 overflow-hidden h-8 flex items-center shadow-md">
      <div className="flex animate-marquee whitespace-nowrap items-center">
        {scrollingItems.map((item, index) => (
          <div key={index} className="flex items-center mx-4 text-[10px] font-black uppercase tracking-[0.2em]">
            <span className="mr-2 text-black/70">{item.icon}</span>
            {item.text}
            <span className="mx-8 text-black/30">/</span>
          </div>
        ))}
      </div>
    </div>
  );
};
