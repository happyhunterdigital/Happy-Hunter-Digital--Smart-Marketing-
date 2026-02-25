import React, { useRef } from 'react';
import { 
  Download, CheckCircle2, MapPin, Calendar, Percent, 
  BrainCircuit, Mail, Globe, MonitorSmartphone, 
  Linkedin, Facebook, Instagram, Phone, Zap, ShieldCheck, Search, LayoutTemplate
} from 'lucide-react';
import html2canvas from 'html2canvas';

// Social Signal Icons
const TikTokIcon = () => <svg fill="currentColor" width="16" height="16" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.022 1.61-.013 1.91-.02.08.53.63.91.75 1.17.12.11.71.62.24.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01.92.01.84-.03.75-.03.4-.54.79-1.35.94-1.31.92-3.58.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.1-3.34-3.12-3.59-5.43-.29-2.42.75-4.79 2.59-6.27 1.62-1.33.79-1.84 5.92-1.32v4.03c-1.02-.35-2.23-.14-3.05.55-.9.7-1.15 1.91-.73 2.93.31.83 1.11 1.48 2.01 1.6.86.13 1.8-.12 2.4-.76.54-.53.76-1.28.76-2.02V.02z"/></svg>;
const XIcon = () => <svg fill="currentColor" width="16" height="16" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8l164.9-199.9L26.8 48h145.6l100.5 132.3L389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>;

export const SummitPoster = () => {
  const posterRef = useRef<HTMLDivElement>(null);

  const exportPoster = async () => {
    if (!posterRef.current) return;
    try {
      const canvas = await html2canvas(posterRef.current, { 
        backgroundColor: '#000000', 
        scale: 4, 
        useCORS: true 
      });
      const link = document.createElement('a');
      link.download = 'happyhunterdigital_IWS_Summit_Official.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Handshake error during asset generation.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 flex flex-col items-center justify-center animate-fade-in px-4">
      
      <div className="mb-12 text-center">
        <h1 className="text-gray-600 font-black uppercase tracking-[0.6em] text-[10px] mb-4">Tactical Asset Core</h1>
        <button 
          onClick={exportPoster} 
          className="bg-yellow-500 text-black px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-[0_0_50px_rgba(234,179,8,0.3)]"
        >
          <Download size={18} className="inline mr-2 mb-0.5" /> Export Powerhouse Poster
        </button>
      </div>

      {/* THE POSTER FRAME (1080x1350) */}
      <div 
        ref={posterRef}
        className="w-[540px] h-[675px] bg-[#050505] relative overflow-hidden flex flex-col shadow-2xl border border-white/5"
      >
        
        {/* TOP: THE HERO IMAGE - COMPLETELY CLEAR OF TEXT */}
        <div className="h-[40%] relative overflow-hidden">
          <img 
            src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761706/Happy_Hunter_work_space_jovfrh.png" 
            alt="Workspace" 
            className="w-full h-full object-cover grayscale opacity-80"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
          
          {/* Logo Pushed to Margin */}
          <div className="absolute top-8 left-8 flex items-center gap-3">
             <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" className="w-10 h-10 rounded-full border-2 border-yellow-500" alt="Logo" crossOrigin="anonymous" />
             <span className="font-handwriting text-2xl text-white pt-1">happyhunterdigital</span>
          </div>
        </div>

        {/* MIDDLE: HEADLINE & OFFER */}
        <div className="px-10 py-4 relative z-10">
           <div className="flex justify-between items-end mb-8">
              <div className="space-y-1">
                <p className="text-yellow-500 font-black uppercase tracking-[0.4em] text-[9px] mb-2 border-l-2 border-yellow-500 pl-3 leading-none">IWS Summit // 20 February 2026</p>
                <h2 className="text-white font-black uppercase tracking-tighter text-[3.2rem] leading-[0.85]">
                  DIGITAL <br/><span className="text-yellow-500 italic">DOMINANCE</span>
                </h2>
              </div>
              <div className="bg-yellow-500 text-black px-4 py-2 rounded-2xl flex flex-col items-center shadow-xl border-4 border-black rotate-2">
                 <span className="text-3xl font-black leading-none">50%</span>
                 <span className="text-[8px] font-black uppercase tracking-widest mt-1">Off System</span>
              </div>
           </div>

           {/* SERVICES GRID (2X2) */}
           <div className="grid grid-cols-2 gap-x-10 gap-y-6 mb-10">
              
              <div className="space-y-2">
                <h3 className="text-white font-black uppercase text-[11px] tracking-widest border-b border-yellow-500/20 pb-1 flex items-center gap-2">
                  <BrainCircuit size={14} className="text-yellow-500" /> AI Strategy
                </h3>
                <p className="text-gray-400 text-[10px] leading-relaxed font-medium">We integrate elite AI tools for content creation, customer service, and predictive data analysis to help startups scale efficiently. Work smarter, not harder.</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-white font-black uppercase text-[11px] tracking-widest border-b border-yellow-500/20 pb-1 flex items-center gap-2">
                  <MapPin size={14} className="text-yellow-500" /> Local Lead Gen
                </h3>
                <p className="text-gray-400 text-[10px] leading-relaxed font-medium">We execute hyper-localized SEO protocols to capture the South African Near Me economy via ZA Long-Tail optimization.</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-white font-black uppercase text-[11px] tracking-widest border-b border-yellow-500/20 pb-1 flex items-center gap-2">
                  <Zap size={14} className="text-yellow-500" /> Automation
                </h3>
                <p className="text-gray-400 text-[10px] leading-relaxed font-medium">We deploy automated email drip campaigns and real-time customer personalization to remove manual operational tasks from your sales funnel.</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-white font-black uppercase text-[11px] tracking-widest border-b border-yellow-500/20 pb-1 flex items-center gap-2">
                  <Search size={14} className="text-yellow-500" /> Gap Analysis
                </h3>
                <p className="text-gray-400 text-[10px] leading-relaxed font-medium">We perform intense marketing gap analyses to identify exactly where competitors are winning and where you are losing revenue.</p>
              </div>

           </div>
        </div>

        {/* FOOTER: CONTACTS & DEADLINE */}
        <div className="mt-auto bg-black p-8 border-t border-white/10 flex justify-between items-center relative">
           <div className="space-y-2">
              <div className="flex items-center gap-3 text-white text-[9px] font-bold uppercase tracking-widest">
                <Mail size={12} className="text-yellow-500" /> motsumitl@happyhunterdigital.com
              </div>
              <div className="flex items-center gap-3 text-white text-[9px] font-bold uppercase tracking-widest">
                <Phone size={12} className="text-yellow-500" /> +27 (0) 60 101 6673
              </div>
              <div className="flex items-center gap-3 text-white text-[9px] font-bold uppercase tracking-widest">
                <Globe size={12} className="text-yellow-500" /> happyhunterdigital.com
              </div>
           </div>

           <div className="flex flex-col items-end gap-3">
              <div className="flex gap-2">
                 <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-gray-400"><Linkedin size={14}/></div>
                 <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-gray-400"><XIcon/></div>
                 <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-gray-400"><TikTokIcon/></div>
                 <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-gray-400"><Facebook size={14}/></div>
              </div>
              <p className="text-yellow-500 font-black text-[10px] uppercase tracking-tighter">Offer Ends 07 March 2026</p>
           </div>
        </div>

        {/* Cinematic glow background element */}
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-yellow-500/5 blur-[100px] rounded-full pointer-events-none"></div>
      </div>
    </div>
  );
};
