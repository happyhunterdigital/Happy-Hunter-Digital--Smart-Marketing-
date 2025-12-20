import React, { useState, useEffect } from 'react';
import { Users, ArrowRight } from 'lucide-react';

const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show the bubble only after scrolling down 300px (so it doesn't clutter the Hero section)
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToAccountability = () => {
    const section = document.getElementById('accountability');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: If they are on a different page, go to home#accountability
      window.location.href = '/#accountability';
    }
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToAccountability}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-brand-gold text-white pl-4 pr-6 py-3 rounded-full shadow-2xl hover:bg-brand-900 hover:scale-105 transition-all duration-300 group animate-in slide-in-from-bottom-10 fade-in border-2 border-white/20"
    >
      {/* Icon Bubble */}
      <div className="bg-white/20 p-2 rounded-full">
        <Users size={20} className="text-white" />
      </div>

      {/* Text Content */}
      <div className="text-left">
        <p className="text-[10px] text-brand-100 uppercase tracking-widest font-bold">Founders</p>
        <p className="font-bold font-sora text-sm md:text-base leading-none">The "Lonely Journey" Ends Here</p>
      </div>
      
      {/* Arrow Animation */}
      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform ml-1" />
    </button>
  );
};

export default FloatingCTA;
