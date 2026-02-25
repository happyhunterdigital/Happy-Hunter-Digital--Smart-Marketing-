import React, { useRef } from 'react';
import { 
  Download, CheckCircle2, MapPin, Calendar, Percent, 
  BrainCircuit, Mail, Globe, MonitorSmartphone, 
  Linkedin, Facebook, Instagram, Phone, Zap, ShieldCheck
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
        scale: 4, // 4K Resolution
        useCORS: true 
      });
      const link = document.createElement('a');
      link.download = 'happyhunterdigital_IWS_Summit_2026.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Handshake failed during asset export.', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 flex flex-col items-center justify-center animate-fade-in px-4">
      
      <div className="mb-12 text-center">
        <h1 className="text-gray-500 font-black uppercase tracking-[0.6em] text-[10px] mb-4">Tactical Asset Hub</h1>
        <button 
          onClick={exportPoster} 
          className="bg-yellow-500 text-black px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-[0_0_50px_rgba(234,179,8,0.3)]"
        >
          <Download size={20} className="mr-2 inline" /> Export 4K Promo Poster
        </button>
      </div>

      {/* THE POSTER (1080x1350) */}
      <div 
        ref={posterRef}
        className="w-[540px] h-[675px] bg-[#050505] relative overflow-hidden flex flex-col shadow-2xl"
      >
        
        {/* TOP: THE HERO IMAGE (WORKSPACE) - NO TEXT OVERLAY */}
        <div className="h-[38%] relative overflow-hidden">
          <img 
            src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761706/Happy_Hunter_work_space_jovfrh.png" 
            alt="Workspace" 
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
          
          {/* Logo Pushed to Edge */}
          <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
             <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" className="w-6 h-6 rounded-full" alt="Logo" crossOrigin="anonymous" />
             <span className="font-handwriting text-xl text-white pt-1">happyhunterdigital</span>
          </div>
        </div>

        {/* MIDDLE: THE CAMPAIGN HEADLINE */}
        <div className="px-10 pt-4 pb-2 relative z-10">
           <div className="flex justify-between items-end mb-4">
              <div className="space-y-1">
                <p className="text-yellow-500 font-black uppercase tracking-[0.4em] text-[8px]">Integrated Wellth Summit 2026</p>
                <h2 className="text-white font-black uppercase tracking-tighter text-[3.2rem] leading-[0.85]">
                  DIGITAL <br/><span className="text-yellow-500 italic">DOMINANCE</span>
                </h2>
              </div>
              <div className="bg-yellow-500 text-black p-4 rounded-2xl flex flex-col items-center shadow-xl rotate-3 transform border-4 border-black">
                 <span className="text-3xl font-black leading-none">50%</span>
                 <span className="text-[8px] font-black uppercase tracking-widest">Off Protocol</span>
              </div>
           </div>
        </div>

        {/* SERVICE MATRIX (MIRRORING WEBSITE) */}
        <div className="grid grid-cols-2 gap-8 px-10 mb-6">
           <div className="space-y-4">
              <div className="flex items-center gap-2 text-yellow-500 border-b border-yellow-500/20 pb-2">
                <BrainCircuit size={16}/>
                <span className="font-black uppercase text-[10px] tracking-widest">Smart Marketing</span>
              </div>
              <div className="space-y-1.5 text-[9px] font-bold text-gray-300 uppercase leading-tight">
                <p className="flex gap-2"><CheckCircle2 size={10} className="text-yellow-500 shrink-0"/> AI Growth Strategy</p>
                <p className="flex gap-2"><CheckCircle2 size={10} className="text-yellow-500 shrink-0"/> Local Lead Gen</p>
                <p className="flex gap-2"><CheckCircle2 size={10} className="text-yellow-500 shrink-0"/> Conversion Automation</p>
              </div>
           </div>
           <div className="space-y-4 border-l border-white/5 pl-8">
              <div className="flex items-center gap-2 text-white border-b border-white/20 pb-2">
                <MonitorSmartphone size={16}/>
                <span className="font-black uppercase text-[10px] tracking-widest text-gray-500">Infrastructure</span>
              </div>
              <div className="space-y-1.5 text-[9px] font-bold text-gray-300 uppercase leading-tight">
                <p className="flex gap-2"><CheckCircle2 size={10} className="text-gray-500 shrink-0"/> eCommerce Builds</p>
                <p className="flex gap-2"><CheckCircle2 size={10} className="text-gray-500 shrink-0"/> Authority Sites</p>
                <p className="flex gap-2"><CheckCircle2 size={10} className="text-gray-500 shrink-0"/> Custom Web Apps</p>
              </div>
           </div>
        </div>

        {/* PROOF NODES (THE 4 SCREENSHOTS) */}
        <div className="px-10 mb-6">
           <p className="text-[8px] font-black uppercase text-gray-600 tracking-[0.3em] mb-3 text-center">Verified Success Proof</p>
           <div className="grid grid-cols-4 gap-2">
              <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1772025720/Screenshot_2026-02-25_140902_engsus.png" className="rounded-lg border border-white/5 grayscale hover:grayscale-0 transition-all h-10 w-full object-cover" crossOrigin="anonymous"/>
              <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1772025720/Screenshot_2026-02-25_140834_muzdbo.png" className="rounded-lg border border-white/5 grayscale hover:grayscale-0 transition-all h-10 w-full object-cover" crossOrigin="anonymous"/>
              <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1772025720/Screenshot_2026-02-25_140636_wa3a4w.png" className="rounded-lg border border-white/5 grayscale hover:grayscale-0 transition-all h-10 w-full object-cover" crossOrigin="anonymous"/>
              <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1772025720/Screenshot_2026-02-25_142842_r45gxo.png" className="rounded-lg border border-white/5 grayscale hover:grayscale-0 transition-all h-10 w-full object-cover" crossOrigin="anonymous"/>
           </div>
        </div>

        {/* FOOTER: CONTACT & DEADLINE */}
        <div className="mt-auto bg-black p-8 border-t border-white/10 flex justify-between items-center relative">
           <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-white font-black uppercase text-[10px] tracking-tighter">
                <Calendar size={12} className="text-yellow-500"/> Summit: 28 Feb
              </div>
              <div className="flex items-center gap-2 text-white font-black uppercase text-[10px] tracking-tighter">
                <Zap size={12} className="text-yellow-500"/> Promo Ends: 07 March
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-bold uppercase text-[8px] tracking-widest pt-1">
                <MapPin size={10}/> Waterfall City, JHB
              </div>
           </div>

           <div className="flex flex-col items-end gap-3">
              <div className="flex gap-3">
                 <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-500"><Linkedin size={14}/></div>
                 <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-500"><XIcon/></div>
                 <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-500"><TikTokIcon/></div>
                 <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-500"><Facebook size={14}/></div>
              </div>
              <p className="text-white font-black text-xs tracking-widest">WWW.HAPPYHUNTERDIGITAL.COM</p>
           </div>
        </div>

        {/* Tactical Accent Glow */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-500/5 blur-[60px] rounded-full pointer-events-none"></div>
      </div>
    </div>
  );
};
