import React, { useRef } from 'react';
import { 
  Download, CheckCircle2, MapPin, Calendar, Percent, 
  BrainCircuit, Mail, Search, ShoppingCart, LayoutTemplate, 
  Target, Code, Smartphone, Globe, Phone, Facebook, Linkedin, Instagram 
} from 'lucide-react';
import html2canvas from 'html2canvas';

// Brand Social Icons - Precise SVGs for the high-end look
const TikTokIcon = () => <svg fill="currentColor" width="14" height="14" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.022 1.61-.013 1.91-.02.08.53.63.91.75 1.17.12.11.71.62.24.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01.92.01.84-.03.75-.03.4-.54.79-1.35.94-1.31.92-3.58.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.1-3.34-3.12-3.59-5.43-.29-2.42.75-4.79 2.59-6.27 1.62-1.33.79-1.84 5.92-1.32v4.03c-1.02-.35-2.23-.14-3.05.55-.9.7-1.15 1.91-.73 2.93.31.83 1.11 1.48 2.01 1.6.86.13 1.8-.12 2.4-.76.54-.53.76-1.28.76-2.02V.02z"/></svg>;
const XIcon = () => <svg fill="currentColor" width="14" height="14" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8l164.9-199.9L26.8 48h145.6l100.5 132.3L389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>;

export const SummitPoster = () => {
  const posterRef = useRef<HTMLDivElement>(null);

  const downloadPoster = async () => {
    if (!posterRef.current) return;
    try {
      const canvas = await html2canvas(posterRef.current, { 
        backgroundColor: '#000000', 
        scale: 4, 
        useCORS: true 
      });
      const link = document.createElement('a');
      link.download = 'happyhunterdigital_Summit_Powerhouse.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Handshake failed during asset export.', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 flex flex-col items-center justify-center animate-fade-in px-4">
      
      <div className="mb-12 text-center">
        <h1 className="text-gray-600 font-black uppercase tracking-[0.6em] text-[9px] mb-4 text-center w-full">Tactical Asset Management Core</h1>
        <button 
          onClick={downloadPoster} 
          className="bg-yellow-500 text-black px-12 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-white transition-all shadow-[0_0_50px_rgba(234,179,8,0.3)]"
        >
          <Download size={20} className="mr-2 inline" /> Export Full-Scale Poster
        </button>
      </div>

      {/* THE POSTER FRAME (1080x1350) */}
      <div 
        ref={posterRef}
        className="w-full max-w-[540px] bg-[#050505] border-[1px] border-white/5 relative overflow-hidden flex flex-col shadow-2xl"
        style={{ width: '540px', height: '675px' }} 
      >
        
        {/* HERO IMAGE SECTION */}
        <div className="absolute inset-0 z-0 h-[45%]">
          <img 
            src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761706/Happy_Hunter_work_space_jovfrh.png" 
            alt="Workspace" 
            className="w-full h-full object-cover grayscale opacity-60"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>
        </div>

        {/* LOGO (Corner Placed) */}
        <div className="absolute top-8 left-8 z-20 flex items-center gap-3">
          <img 
            src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" 
            className="w-12 h-12 rounded-full border-2 border-yellow-500 shadow-xl" 
            alt="Logo" 
            crossOrigin="anonymous"
          />
          <span className="font-handwriting text-[2.2rem] text-white lowercase leading-none pt-1">
            happyhunterdigital
          </span>
        </div>

        {/* SUMMIT SPECIAL BADGE */}
        <div className="absolute top-10 right-8 z-20 bg-yellow-500 text-black px-4 py-2 rounded-xl font-black text-xs uppercase tracking-tighter shadow-lg">
           <Percent size={14} className="inline mr-1 mb-0.5" /> 50% Off Protocol
        </div>

        {/* MAIN CONTENT LAYER */}
        <div className="relative z-10 flex flex-col h-full p-10 mt-[25%]">
          
          <div className="mb-8">
             <p className="text-yellow-500 font-black uppercase tracking-[0.4em] text-[9px] mb-2 border-l-2 border-yellow-500 pl-3">Integrated Wellth Summit // Feb 2026</p>
             <h2 className="text-white font-black uppercase tracking-tighter text-[3.5rem] leading-[0.85]">
               Digital <br/><span className="text-yellow-500 italic">Dominance</span>
             </h2>
          </div>

          {/* SERVICE MATRIX (MIRRORING CORESERVICES PAGE) */}
          <div className="grid grid-cols-2 gap-8 mb-auto">
             
             {/* Division 1: Smart Marketing */}
             <div className="space-y-4">
                <div className="flex items-center gap-2 text-yellow-500 border-b border-yellow-500/20 pb-2">
                  <BrainCircuit size={16}/>
                  <span className="font-black uppercase text-[10px] tracking-widest">Smart Marketing</span>
                </div>
                <div className="space-y-2">
                  <p className="text-white text-[10px] font-bold leading-tight flex gap-2">
                    <CheckCircle2 size={10} className="text-yellow-500 shrink-0"/> AI Growth Strategy
                  </p>
                  <p className="text-white text-[10px] font-bold leading-tight flex gap-2">
                    <CheckCircle2 size={10} className="text-yellow-500 shrink-0"/> Local Lead Generation
                  </p>
                  <p className="text-white text-[10px] font-bold leading-tight flex gap-2">
                    <CheckCircle2 size={10} className="text-yellow-500 shrink-0"/> Marketing Automation
                  </p>
                  <p className="text-white text-[10px] font-bold leading-tight flex gap-2">
                    <CheckCircle2 size={10} className="text-yellow-500 shrink-0"/> Strategic Audits
                  </p>
                </div>
             </div>

             {/* Division 2: Digital Infrastructure */}
             <div className="space-y-4 border-l border-white/5 pl-8">
                <div className="flex items-center gap-2 text-white border-b border-white/20 pb-2">
                  <Smartphone size={16}/>
                  <span className="font-black uppercase text-[10px] tracking-widest text-gray-400">Infrastructure</span>
                </div>
                <div className="space-y-2">
                  <p className="text-white text-[10px] font-bold leading-tight flex gap-2">
                    <CheckCircle2 size={10} className="text-gray-500 shrink-0"/> eCommerce Architecture
                  </p>
                  <p className="text-white text-[10px] font-bold leading-tight flex gap-2">
                    <CheckCircle2 size={10} className="text-gray-500 shrink-0"/> Corporate Authority
                  </p>
                  <p className="text-white text-[10px] font-bold leading-tight flex gap-2">
                    <CheckCircle2 size={10} className="text-gray-500 shrink-0"/> Performance Marketing
                  </p>
                  <p className="text-white text-[10px] font-bold leading-tight flex gap-2">
                    <CheckCircle2 size={10} className="text-gray-500 shrink-0"/> Custom Web Apps
                  </p>
                </div>
             </div>
          </div>

          {/* FOOTER CONTACT DETAILS */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 items-end">
             <div className="space-y-2 text-gray-400 font-bold uppercase text-[8px] tracking-widest">
               <div className="flex items-center gap-2">
                 <Mail size={12} className="text-yellow-500"/> motsumitl@happyhunterdigital.com
               </div>
               <div className="flex items-center gap-2">
                 <Phone size={12} className="text-yellow-500"/> +27 (0) 60 101 6673
               </div>
               <div className="flex items-center gap-2">
                 <Globe size={12} className="text-yellow-500"/> www.happyhunterdigital.com
               </div>
             </div>

             <div className="flex flex-col items-end gap-3">
               <div className="flex gap-3">
                 <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-400"><Linkedin size={14}/></div>
                 <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-400"><XIcon/></div>
                 <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-400"><Instagram size={14}/></div>
                 <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-400"><TikTokIcon/></div>
                 <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-400"><Facebook size={14}/></div>
               </div>
               <div className="text-right">
                 <p className="text-[7px] text-gray-600 uppercase font-black tracking-[0.4em]">Munyaka, Waterfall City, JHB</p>
               </div>
             </div>
          </div>
        </div>

        {/* Tactical Glow */}
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-yellow-500/5 blur-[100px] rounded-full pointer-events-none"></div>
      </div>
    </div>
  );
};
