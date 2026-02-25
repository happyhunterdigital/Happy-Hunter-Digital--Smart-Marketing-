import React, { useRef } from 'react';
import { 
  Download, MapPin, Calendar, Percent, 
  Mail, Globe, Phone, Facebook, Linkedin, Instagram, Zap
} from 'lucide-react';
import html2canvas from 'html2canvas';

// Tactical Social Icons
const TikTokIcon = () => <svg fill="currentColor" width="16" height="16" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.022 1.61-.013 1.91-.02.08.53.63.91.75 1.17.12.11.71.62.24.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01.92.01.84-.03.75-.03.4-.54.79-1.35.94-1.31.92-3.58.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.1-3.34-3.12-3.59-5.43-.29-2.42.75-4.79 2.59-6.27 1.62-1.33.79-1.84 5.92-1.32v4.03c-1.02-.35-2.23-.14-3.05.55-.9.7-1.15 1.91-.73 2.93.31.83 1.11 1.48 2.01 1.6.86.13 1.8-.12 2.4-.76.54-.53.76-1.28.76-2.02V.02z"/></svg>;
const XIcon = () => <svg fill="currentColor" width="16" height="16" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8l164.9-199.9L26.8 48h145.6l100.5 132.3L389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>;

export const SummitPoster = () => {
  const posterRef = useRef<HTMLDivElement>(null);

  const exportPoster = async () => {
    if (!posterRef.current) return;
    try {
      const canvas = await html2canvas(posterRef.current, { 
        backgroundColor: '#000000', 
        scale: 4, // 4K High Resolution
        useCORS: true 
      });
      const link = document.createElement('a');
      link.download = 'happyhunterdigital_IWS_Summit_2026.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Asset Generation Error', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 flex flex-col items-center justify-center animate-fade-in px-4">
      
      <div className="mb-12 text-center">
        <h1 className="text-gray-600 font-black uppercase tracking-[0.6em] text-[10px] mb-4">Tactical Asset Hub Core</h1>
        <button 
          onClick={exportPoster} 
          className="bg-yellow-500 text-black px-12 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-white transition-all shadow-[0_0_50px_rgba(234,179,8,0.3)]"
        >
          <Download size={20} className="mr-2 inline" /> Export 4K Promo Poster
        </button>
      </div>

      {/* THE POSTER (1080x1350 optimized) */}
      <div 
        ref={posterRef}
        className="w-[540px] h-[675px] bg-[#050505] relative overflow-hidden flex flex-col shadow-2xl"
      >
        
        {/* TOP: THE HERO IMAGE (WORKSPACE) - NO TEXT ON FACE */}
        <div className="h-[35%] relative overflow-hidden">
          <img 
            src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761706/Happy_Hunter_work_space_jovfrh.png" 
            alt="Workspace" 
            className="w-full h-full object-cover grayscale"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
          
          {/* Logo Pushed to Safety Zone */}
          <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
             <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" className="w-8 h-8 rounded-full border border-yellow-500/50" alt="Logo" crossOrigin="anonymous" />
             <span className="font-handwriting text-2xl text-white pt-1">happyhunterdigital</span>
          </div>
        </div>

        {/* MIDDLE: THE CAMPAIGN DATA */}
        <div className="px-10 py-2 relative z-10 flex-grow flex flex-col">
           <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <p className="text-yellow-500 font-black uppercase tracking-[0.4em] text-[8px]">Integrated Wellth Summit // 20 Feb 2026</p>
                <h2 className="text-white font-black uppercase tracking-tighter text-[2.8rem] leading-[0.85]">
                  DIGITAL <br/><span className="text-yellow-500 italic">DOMINANCE</span>
                </h2>
              </div>
              <div className="bg-yellow-500 text-black px-4 py-2 rounded-xl flex flex-col items-center shadow-xl border-2 border-black rotate-2">
                 <span className="text-2xl font-black leading-none">50% OFF</span>
                 <span className="text-[7px] font-black uppercase tracking-widest mt-1">Limited Offer</span>
              </div>
           </div>

           {/* CAPABILITIES GALLERY (THE 4 SCREENSHOTS AS SERVICES) */}
           <div className="mb-6">
              <p className="text-[8px] font-black uppercase text-gray-500 tracking-[0.3em] mb-4 text-left border-b border-white/5 pb-2">Core Service Architecture</p>
              <div className="grid grid-cols-2 gap-4">
                 
                 {/* Division 1: Smart Marketing */}
                 <div className="space-y-3">
                    <div className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                       <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Smart Marketing</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <div className="relative rounded-lg overflow-hidden border border-white/10 h-16">
                          <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1772025720/Screenshot_2026-02-25_140902_engsus.png" className="w-full h-full object-cover" crossOrigin="anonymous" />
                          <div className="absolute inset-0 bg-yellow-500/10"></div>
                       </div>
                       <div className="relative rounded-lg overflow-hidden border border-white/10 h-16">
                          <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1772025720/Screenshot_2026-02-25_140834_muzdbo.png" className="w-full h-full object-cover" crossOrigin="anonymous" />
                          <div className="absolute inset-0 bg-yellow-500/10"></div>
                       </div>
                    </div>
                 </div>

                 {/* Division 2: Digital Infrastructure */}
                 <div className="space-y-3 border-l border-white/5 pl-4">
                    <div className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Digital Assets</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <div className="relative rounded-lg overflow-hidden border border-white/10 h-16">
                          <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1772025720/Screenshot_2026-02-25_140636_wa3a4w.png" className="w-full h-full object-cover" crossOrigin="anonymous" />
                       </div>
                       <div className="relative rounded-lg overflow-hidden border border-white/10 h-16">
                          <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1772025720/Screenshot_2026-02-25_142842_r45gxo.png" className="w-full h-full object-cover" crossOrigin="anonymous" />
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* CONTACT FOOTPRINT */}
           <div className="mt-auto border-t border-white/10 pt-6 pb-6 grid grid-cols-2 items-end">
              <div className="space-y-2">
                 <div className="flex items-center gap-2 text-white text-[9px] font-bold uppercase tracking-widest">
                    <Mail size={12} className="text-yellow-500" /> motsumitl@happyhunterdigital.com
                 </div>
                 <div className="flex items-center gap-2 text-white text-[9px] font-bold uppercase tracking-widest">
                    <Phone size={12} className="text-yellow-500" /> +27 (0) 60 101 6673
                 </div>
                 <div className="flex items-center gap-2 text-white text-[9px] font-bold uppercase tracking-widest">
                    <Globe size={12} className="text-yellow-500" /> happyhunterdigital.com
                 </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                 <div className="flex gap-2">
                    <div className="p-1.5 bg-white/5 rounded border border-white/10 text-gray-500"><Linkedin size={14} /></div>
                    <div className="p-1.5 bg-white/5 rounded border border-white/10 text-gray-500"><XIcon /></div>
                    <div className="p-1.5 bg-white/5 rounded border border-white/10 text-gray-500"><Instagram size={14} /></div>
                    <div className="p-1.5 bg-white/5 rounded border border-white/10 text-gray-500"><TikTokIcon /></div>
                    <div className="p-1.5 bg-white/5 rounded border border-white/10 text-gray-500"><Facebook size={14} /></div>
                 </div>
                 <div className="text-right">
                    <p className="text-yellow-500 font-black text-[9px] uppercase tracking-tighter">Promotion Ends: 07 March 2026</p>
                    <p className="text-gray-600 text-[6px] uppercase font-bold tracking-[0.3em] mt-1">Waterfall City, Johannesburg, ZA</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Tactical Glow Effect */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      </div>
    </div>
  );
};
