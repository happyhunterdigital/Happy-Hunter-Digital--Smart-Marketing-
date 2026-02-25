import React, { useRef } from 'react';
import { Download, CheckCircle2, MapPin, Calendar, Percent, BrainCircuit, MonitorSmartphone } from 'lucide-react';
import html2canvas from 'html2canvas';

export const SummitPoster = () => {
  const posterRef = useRef<HTMLDivElement>(null);

  const downloadPoster = async () => {
    if (!posterRef.current) return;
    try {
      const canvas = await html2canvas(posterRef.current, { 
        backgroundColor: '#000000', 
        scale: 4, // 4k-Ready Resolution
        useCORS: true 
      });
      const link = document.createElement('a');
      link.download = 'HappyHunter_Powerhouse_Summit_Promo.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to generate poster', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 flex flex-col items-center justify-center animate-fade-in">
      
      <div className="mb-12 text-center px-6">
        <h1 className="text-gray-500 font-black uppercase tracking-[0.5em] text-[10px] mb-4">Tactical Asset Management</h1>
        <button 
          onClick={downloadPoster} 
          className="bg-yellow-500 text-black px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-white hover:scale-105 transition-all flex items-center gap-3 mx-auto shadow-[0_0_30px_rgba(234,179,8,0.3)]"
        >
          <Download size={18}/> Export Ultra-Res Poster
        </button>
      </div>

      {/* THE POWERHOUSE POSTER FRAME (1080x1350) */}
      <div 
        ref={posterRef}
        className="w-full max-w-[540px] aspect-[4/5] bg-black border-[12px] border-[#111] relative overflow-hidden flex flex-col shadow-2xl"
        style={{ width: '540px', height: '675px' }} 
      >
        {/* Cinematic Background Visuas */}
        <div className="absolute inset-0 z-0 h-[48%]">
          <img 
            src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761706/Happy_Hunter_work_space_jovfrh.png" 
            alt="Workspace" 
            className="w-full h-full object-cover opacity-70 grayscale"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col h-full p-10 pt-12">
          
          {/* Top Brand Bar */}
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
              <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" className="w-10 h-10 rounded-full border-2 border-yellow-500/50 shadow-lg" alt="Logo" crossOrigin="anonymous"/>
              <span className="font-handwriting text-[1.8rem] text-white lowercase leading-none">happyhunterdigital</span>
            </div>
            <div className="bg-yellow-500 text-black px-4 py-1.5 rounded-lg font-black text-xs uppercase tracking-tighter shadow-lg">
               50% SUMMIT SPECIAL
            </div>
          </div>

          {/* Headline Section */}
          <div className="mb-10">
             <p className="text-yellow-500 font-black uppercase tracking-[0.4em] text-[9px] mb-2 bg-yellow-500/10 inline-block px-2 py-1 rounded">Integrated Wellth Summit // Feb 2026</p>
             <h2 className="text-white font-black uppercase tracking-tighter text-[3.2rem] leading-[0.85]">
               Digital <br/><span className="text-yellow-500 italic">Dominance</span>
             </h2>
             <div className="w-20 h-1.5 bg-yellow-500 mt-6 rounded-full"></div>
          </div>

          {/* Service Matrix */}
          <div className="grid grid-cols-2 gap-8 mb-auto">
             <div className="space-y-4">
                <div className="flex items-center gap-2 text-yellow-500">
                  <BrainCircuit size={16}/><span className="font-black uppercase text-[10px] tracking-widest">Smart Marketing</span>
                </div>
                <ul className="space-y-2 list-none p-0">
                  <li className="text-gray-300 text-[10px] font-bold uppercase leading-tight">• AI Strategy and Growth</li>
                  <li className="text-gray-300 text-[10px] font-bold uppercase leading-tight">• Lead Gen Automation</li>
                </ul>
             </div>
             <div className="space-y-4 border-l border-gray-800 pl-8">
                <div className="flex items-center gap-2 text-white">
                  <MonitorSmartphone size={16}/><span className="font-black uppercase text-[10px] tracking-widest text-gray-400 font-bold">Infrastructure</span>
                </div>
                <ul className="space-y-2 list-none p-0">
                  <li className="text-gray-300 text-[10px] font-bold uppercase leading-tight">• eCommerce Architecture</li>
                  <li className="text-gray-300 text-[10px] font-bold uppercase leading-tight">• Corporate Authority</li>
                </ul>
             </div>
          </div>

          {/* Footer Intelligence */}
          <div className="mt-10 pt-6 border-t border-gray-900 flex justify-between items-end">
             <div className="space-y-2">
               <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-[9px] tracking-widest leading-none">
                 <Calendar size={12} className="text-yellow-500"/> Saturday 28 Feb
               </div>
               <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-[9px] tracking-widest leading-none">
                 <MapPin size={12} className="text-yellow-500"/> Waterfall City, JHB
               </div>
             </div>
             <div className="text-right">
               <p className="text-white font-black text-lg tracking-tighter leading-none mb-1">HAPPYHUNTERDIGITAL.COM</p>
               <p className="text-yellow-500 text-[7px] font-black uppercase tracking-[0.3em] leading-none">Authorized Agency Partner</p>
             </div>
          </div>

        </div>

        {/* Cinematic glow background element */}
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-yellow-500/5 blur-[100px] rounded-full pointer-events-none"></div>
      </div>
    </div>
  );
};
