import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EventPopup = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show popup after 2.5 seconds if not seen in this session
    const hasSeen = sessionStorage.getItem('summit_popup_seen_v2');
    if (!hasSeen) {
      const timer = setTimeout(() => setShow(true), 2500);
      return () => clearTimeout(timer);
    }
    return () => {};
  }, []);

  const close = () => {
    setShow(false);
    sessionStorage.setItem('summit_popup_seen_v2', 'true');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-yellow-500/40 rounded-3xl shadow-[0_0_60px_rgba(234,179,8,0.2)] overflow-hidden">
        
        {/* Cinematic Background */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://res.cloudinary.com/dka0498ns/image/upload/v1762926940/Gemini_Generated_Image_wayxwqwayxwqwayx_mt1bop.png')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent"></div>
        
        {/* Close Button */}
        <button onClick={close} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20 bg-black/50 p-2 rounded-full">
          <X size={20} />
        </button>

        <div className="relative z-10 p-8 pt-12 text-center">
          <div className="flex justify-center mb-4">
            <ShieldCheck className="text-yellow-500" size={40} />
          </div>

          <span className="inline-block px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[9px] font-black uppercase tracking-[0.2em] rounded-full mb-4">
            Strategic Declassification
          </span>

          <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-3">
            The Digital <span className="text-yellow-500">Bridge</span>
          </h2>
          
          <p className="text-gray-300 text-sm font-medium mb-6 leading-relaxed px-4">
            Join Thabo Leslie Motsumi at the IntegratedWellth Summit. Learn how to align your financial clarity with AI-driven digital visibility.
          </p>

          <div className="bg-black/50 border border-gray-800 rounded-xl p-4 mb-8">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Value Transfer</p>
            <p className="text-yellow-500 text-sm font-medium">Attendees receive a Live Forensic Scan & a chance to win a R3,800 Strategic Audit.</p>
          </div>

          <div className="flex justify-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">
            <span className="flex items-center gap-2"><Calendar size={14} className="text-yellow-500"/> Feb 28</span>
            <span className="flex items-center gap-2"><MapPin size={14} className="text-yellow-500"/> Waterfall City</span>
          </div>

          <Link 
            to="/summit-2026" 
            onClick={close}
            className="w-full block bg-yellow-500 text-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl"
          >
            Access Event Details
          </Link>
        </div>
      </div>
    </div>
  );
};
