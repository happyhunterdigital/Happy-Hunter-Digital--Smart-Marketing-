import React from 'react';
import { Zap, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContentRibbon = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-yellow-500 text-black h-8 flex items-center overflow-hidden border-b border-yellow-600">
      <div className="animate-marquee whitespace-nowrap flex items-center gap-12 font-black text-[10px] uppercase tracking-widest">
        {[1, 2, 3, 4].map((i) => (
          <React.Fragment key={i}>
            <span className="flex items-center gap-2">
              <Zap size={12} fill="currentColor"/> 
              Official Summit Invitation
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={12} /> 
              28 February 2026
            </span>
            <Link to="/summit-2026" className="underline hover:text-white transition-colors">
              Read The Protocol
            </Link>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
