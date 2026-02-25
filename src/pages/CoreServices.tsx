import React, { useRef } from 'react';
import { Download, CheckCircle2, MapPin, Calendar, Percent, BrainCircuit, MonitorSmartphone, ShieldCheck, Zap } from 'lucide-react';
import html2canvas from 'html2canvas';

export const SummitPoster = () => {
  const posterRef = useRef<HTMLDivElement>(null);

  const downloadPoster = async () => {
    if (!posterRef.current) return;
    try {
      const canvas = await html2canvas(posterRef.current, { 
        backgroundColor: '#000000', 
        scale: 4, // 4K Resolution
        useCORS: true,
        logging: false
      });
      const link = document.createElement('a');
      link.download = 'HappyHunter_Powerhouse_Summit_2026.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Asset Generation Failed', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 flex flex-col items-center justify-center animate-fade-in px-4">
      
      {/* CONTROL PANEL */}
      <div className="mb-12 text-center">
        <p className="text-yellow-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Tactical Asset Hub</p>
        <button 
          onClick={downloadPoster} 
          className="bg-yellow-500 text-black px-12 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-white hover:scale-105 transition-all flex items-center gap-3 mx-auto shadow-[0_0_40px_rgba(234,179,8,0.4)]"
        >
          <Download size={20}/> Export 4K Powerhouse Poster
        </button>
      </div>

      {/* THE POSTER (1080x1350 optimized) */}
      <div 
        ref={posterRef}
        className="w-full max-w-[540px] bg-black border-[1px] border-white/10 relative overflow-hidden flex flex-col shadow-2xl"
        style={{ width: '540px', height: '675px' }} 
      >
        
        {/* CINEMATIC HERO LAYER */}
        <div className="absolute inset-0 z-0 h-[55%]">
          <img 
            src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761706/Happy_Hunter_work_space_jovfrh.png" 
            alt="Workspace" 
            className="w-full h-full object-cover opacity-80 grayscale"
            crossOrigin="anonymous"
          />
          {/* Multi-stage gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
        </div>

        {/* CONTENT OVERLAY */}
        <div className="relative z-10 flex flex-col h-full p-10">
          
          {/* BRAND HEADER */}
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-3">
              <img 
                src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" 
                className="w-12 h-12 rounded-full border-2 border-yellow-500 shadow-lg" 
                alt="Logo" 
                crossOrigin="anonymous"
              />
              <span className="font-handwriting text-[2.2rem] text-white lowercase leading-none pt-1">
                happyhunterdigital
              </span>
            </div>
            <div className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-tighter shadow-[0_0_20px_rgba(234,179,8,0.5)]">
               50% Summit Special
            </div>
          </div>

          {/* MAIN TITLES */}
          <div className="mb-10">
             <div className="flex items-center gap-2 mb-3">
               <div className="w-8 h-[2px] bg-yellow-500"></div>
               <p className="text-yellow-500 font-black uppercase tracking-[0.4em] text-[10px]">Waterfall City // Feb 2026</p>
             </div>
             <h2 className="text-white font-black uppercase tracking-tighter text-[3.8rem] leading-[0.8] mb-4">
               DIGITAL <br/><span className="text-yellow-500 italic">DOMINANCE</span>
             </h2>
             <p className="text-gray-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
               <ShieldCheck size={16} className="text-yellow-500"/> The Dual-Threat Protocol
             </p>
          </div>

          {/* SERVICE MATRIX (Designed like the page icons) */}
          <div className="grid grid-cols-2 gap-8 mb-auto">
             
             {/* Column 1: Intelligence */}
             <div className="space-y-4">
                <div className="flex items-center gap-2 text-yellow-500 border-b border-yellow-500/20 pb-2">
                  <BrainCircuit size={18}/><span className="font-black uppercase text-[11px] tracking-widest">Smart Marketing</span>
                </div>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2 text-gray-300 text-[10px] font-bold uppercase leading-tight">
                    <Zap size={10} className="text-yellow-500 mt-0.5 shrink-0"/> AI Strategy and Growth
                  </li>
                  <li className="flex items-start gap-2 text-gray-300 text-[10px] font-bold uppercase leading-tight">
                    <Zap size={10} className="text-yellow-500 mt-0.5 shrink-0"/> Lead Gen Automation
                  </li>
                </ul>
             </div>

             {/* Column 2: Infrastructure */}
             <div className="space-y-4">
                <div className="flex items-center gap-2 text-white border-b border-white/20 pb-2">
                  <MonitorSmartphone size={18}/><span className="font-black uppercase text-[11px] tracking-widest text-gray-300">Infrastructure</span>
                </div>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2 text-gray-300 text-[10px] font-bold uppercase leading-tight">
                    <Zap size={10} className="text-gray-500 mt-0.5 shrink-0"/> eCommerce Architecture
                  </li>
                  <li className="flex items-start gap-2 text-gray-300 text-[10px] font-bold uppercase leading-tight">
                    <Zap size={10} className="text-gray-500 mt-0.5 shrink-0"/> Corporate Lead Gen
                  </li>
                </ul>
             </div>

          </div>

          {/* LOGISTICS & AUTHENTICITY */}
          <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-end">
             <div className="space-y-3">
               <div className="flex items-center gap-3 text-white font-black uppercase text-[11px] tracking-tighter">
                 <Calendar size={14} className="text-yellow-500"/> Saturday 28 February
               </div>
               <div className="flex items-center gap-3 text-white font-black uppercase text-[11px] tracking-tighter">
                 <MapPin size={14} className="text-yellow-500"/> Waterfall City, JHB
               </div>
             </div>
             <div className="text-right">
               <p className="text-white font-black text-xl tracking-tighter leading-none mb-1">HAPPYHUNTERDIGITAL.COM</p>
               <p className="text-yellow-500 text-[8px] font-black uppercase tracking-[0.4em]">Official Agency Partner</p>
             </div>
          </div>

        </div>

        {/* Tactical Corner Accent */}
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-500/5 blur-[80px] rounded-full pointer-events-none"></div>
      </div>
    </div>
  );
};
