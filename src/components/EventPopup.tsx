import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EventPopup = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show popup after 2 seconds if not seen in this session
    const hasSeen = sessionStorage.getItem('summit_popup_seen');
    if (!hasSeen) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => {
    setShow(false);
    sessionStorage.setItem('summit_popup_seen', 'true');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-yellow-500/30 rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.2)] overflow-hidden">
        
        {/* Background Graphic */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://res.cloudinary.com/dka0498ns/image/upload/v1762926940/Gemini_Generated_Image_wayxwqwayxwqwayx_mt1bop.png')] bg-cover bg-center"></div>
        
        {/* Close Button */}
        <button onClick={close} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-20">
          <X size={24} />
        </button>

        <div className="relative z-10 p-8 text-center">
          <span className="inline-block px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[9px] font-black uppercase tracking-[0.2em] rounded-full mb-6">
            Official Invitation
          </span>

          <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-2">
            Integrated Wellth <br/><span className="text-yellow-500">Summit 2026</span>
          </h2>
          
          <p className="text-gray-400 text-sm font-medium mb-8">
            Join Thabo Leslie Motsumi as he unveils the "Revenue Brain" architecture live on stage.
          </p>

          <div className="flex justify-center gap-6 text-xs font-bold text-gray-300 uppercase tracking-widest mb-8">
            <span className="flex items-center gap-2"><Calendar size={14} className="text-yellow-500"/> Feb 28</span>
            <span className="flex items-center gap-2"><MapPin size={14} className="text-yellow-500"/> Waterfall City</span>
          </div>

          <Link 
            to="/summit-2026" 
            onClick={close}
            className="w-full block bg-yellow-500 text-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl"
          >
            View Event Protocol
          </Link>
        </div>
      </div>
    </div>
  );
};
