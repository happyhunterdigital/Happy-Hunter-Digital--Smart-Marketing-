import React, { useRef } from 'react';
import { Download, CheckCircle2, MapPin, Calendar, Percent } from 'lucide-react';
import html2canvas from 'html2canvas';

export const SummitPoster = () => {
  const posterRef = useRef<HTMLDivElement>(null);

  // Allows you to download the poster as a high-res image
  const downloadPoster = async () => {
    if (!posterRef.current) return;
    try {
      const canvas = await html2canvas(posterRef.current, { 
        backgroundColor: '#050505', 
        scale: 3, // High resolution for social media
        useCORS: true // Allows the external Cloudinary image to render in the canvas
      });
      const link = document.createElement('a');
      link.download = 'HappyHunter_Summit_Promo.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to generate poster', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 flex flex-col items-center justify-center animate-fade-in">
      
      <div className="mb-8 text-center">
        <h1 className="text-white font-black uppercase tracking-widest text-sm mb-4">Marketing Asset Generator</h1>
        <button 
          onClick={downloadPoster} 
          className="bg-yellow-500 text-black px-6 py-3 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all flex items-center gap-2 mx-auto"
        >
          <Download size={14}/> Download Poster for Socials
        </button>
      </div>

      {/* THE POSTER FRAME (1080x1350 - Optimized for Instagram/LinkedIn) */}
      <div 
        ref={posterRef}
        className="w-full max-w-[540px] aspect-[4/5] bg-black border border-gray-800 relative overflow-hidden shadow-2xl flex flex-col"
        style={{ width: '540px', height: '675px' }} // Fixed dimensions for consistent rendering
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0 h-[50%]">
          <img 
            src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761706/Happy_Hunter_work_space_jovfrh.png" 
            alt="Workspace" 
            className="w-full h-full object-cover opacity-50 grayscale"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col h-full p-8 pt-10">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" className="w-8 h-8 rounded-full" alt="Logo" crossOrigin="anonymous"/>
              <span className="font-handwriting text-xl text-white">happyhunterdigital</span>
            </div>
            <div className="bg-yellow-500 text-black px-3 py-1 rounded-md flex items-center gap-1 font-black text-[10px] uppercase">
               <Percent size={12}/> Summit Special
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
             <p className="text-yellow-500 font-black uppercase tracking-[0.2em] text-[8px] mb-1">Integrated Wellth Summit</p>
             <h2 className="text-white font-black uppercase tracking-tighter text-4xl leading-[0.9]">
               Deploy The <br/><span className="text-yellow-500">Architecture</span>
             </h2>
          </div>

          {/* The Offer */}
          <div className="bg-gray-900/80 border border-gray-700 backdrop-blur-md rounded-2xl p-5 mb-auto">
             <div className="flex items-center gap-4 mb-4 border-b border-gray-700 pb-4">
                <span className="text-4xl font-black text-white">50%</span>
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] leading-tight">Discount on all<br/>system integrations</span>
             </div>
             <ul className="space-y-3">
               <li className="flex items-start gap-2 text-white text-xs font-medium">
                 <CheckCircle2 size={14} className="text-yellow-500 shrink-0 mt-0.5"/> 
                 <span><strong>Trust Anchor:</strong> Google Maps & Entity Sync</span>
               </li>
               <li className="flex items-start gap-2 text-white text-xs font-medium">
                 <CheckCircle2 size={14} className="text-yellow-500 shrink-0 mt-0.5"/> 
                 <span><strong>AI Megaphone:</strong> Generative Engine Optimization</span>
               </li>
               <li className="flex items-start gap-2 text-white text-xs font-medium">
                 <CheckCircle2 size={14} className="text-yellow-500 shrink-0 mt-0.5"/> 
                 <span><strong>Revenue Brain:</strong> Automated Lead Chatbots</span>
               </li>
               <li className="flex items-start gap-2 text-white text-xs font-medium">
                 <CheckCircle2 size={14} className="text-yellow-500 shrink-0 mt-0.5"/> 
                 <span><strong>Infrastructure:</strong> eCommerce & Corporate Dev</span>
               </li>
             </ul>
          </div>

          {/* Footer Logistics */}
          <div className="border-t border-gray-800 pt-4 mt-6 flex justify-between items-end">
             <div className="space-y-1">
               <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1"><Calendar size={10} className="text-yellow-500"/> 28 Feb 2026</p>
               <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1"><MapPin size={10} className="text-yellow-500"/> Waterfall City</p>
             </div>
             <div className="text-right">
               <p className="text-white font-black text-sm">happyhunterdigital.com</p>
               <p className="text-yellow-500 text-[8px] font-bold uppercase tracking-widest">Claim offer at our booth</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
