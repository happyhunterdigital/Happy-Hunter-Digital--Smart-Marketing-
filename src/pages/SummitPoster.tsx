import React, { useRef } from 'react';
import { Download, CheckCircle2, MapPin, Calendar, Percent, BrainCircuit, MonitorSmartphone } from 'lucide-react';
import html2canvas from 'html2canvas';

export const SummitPoster = () => {
  const posterRef = useRef<HTMLDivElement>(null);

  const downloadPoster = async () => {
    if (!posterRef.current) return;
    try {
      const canvas = await html2canvas(posterRef.current, { 
        backgroundColor: '#050505', 
        scale: 3, 
        useCORS: true 
      });
      const link = document.createElement('a');
      link.download = 'HappyHunter_Summit_DualThreat_Promo.png';
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

      {/* THE POSTER FRAME (1080x1350 ratio) */}
      <div 
        ref={posterRef}
        className="w-full max-w-[540px] aspect-[4/5] bg-black border border-gray-800 relative overflow-hidden shadow-2xl flex flex-col"
        style={{ width: '540px', height: '675px' }} 
      >
        {/* Background Image: Happy Hunter Workspace */}
        <div className="absolute inset-0 z-0 h-[60%]">
          <img 
            src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761706/Happy_Hunter_work_space_jovfrh.png" 
            alt="Workspace" 
            className="w-full h-full object-cover opacity-60 grayscale"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent"></div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col h-full p-8 pt-10">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" className="w-8 h-8 rounded-full" alt="Logo" crossOrigin="anonymous"/>
              <span className="font-handwriting text-2xl text-white lowercase tracking-wide">
                happy<span className="text-yellow-500">hunter</span>digital
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="mb-8">
             <p className="text-yellow-500 font-black uppercase tracking-[0.2em] text-[8px] mb-2 bg-yellow-500/10 inline-block px-2 py-1 rounded">Integrated Wellth Summit</p>
             <h2 className="text-white font-black uppercase tracking-tighter text-[2.5rem] leading-[0.9]">
               The Dual-Threat <br/><span className="text-yellow-500">Agency</span>
             </h2>
             <p className="text-gray-400 text-xs mt-3 max-w-xs font-medium italic">We build the infrastructure, and we deploy the intelligence.</p>
          </div>

          {/* The Offer & Services */}
          <div className="bg-[#0a0a0a]/90 border border-gray-800 backdrop-blur-md rounded-2xl p-5 mb-auto shadow-2xl">
             <div className="flex items-center gap-4 mb-4 border-b border-gray-800 pb-4">
                <div className="bg-yellow-500 text-black px-3 py-1.5 rounded-lg flex items-center gap-1 font-black text-sm uppercase">
                   <Percent size={14}/> 50% Off
                </div>
                <span className="text-white font-bold uppercase tracking-widest text-[9px] leading-tight">All System Integrations<br/>Booked at Summit</span>
             </div>
             
             {/* Service Division 1 */}
             <div className="mb-4">
               <h3 className="text-yellow-500 font-black uppercase text-[9px] tracking-[0.2em] mb-2 flex items-center gap-1"><BrainCircuit size={12}/> Smart Marketing</h3>
               <ul className="space-y-2">
                 <li className="flex items-start gap-2 text-gray-300 text-[11px] font-medium">
                   <CheckCircle2 size={12} className="text-yellow-500 shrink-0 mt-0.5"/> <span>Local Lead Gen & AI Strategy</span>
                 </li>
                 <li className="flex items-start gap-2 text-gray-300 text-[11px] font-medium">
                   <CheckCircle2 size={12} className="text-yellow-500 shrink-0 mt-0.5"/> <span>Marketing Automation Funnels</span>
                 </li>
               </ul>
             </div>

             {/* Service Division 2 */}
             <div>
               <h3 className="text-white font-black uppercase text-[9px] tracking-[0.2em] mb-2 flex items-center gap-1"><MonitorSmartphone size={12}/> Digital Infrastructure</h3>
               <ul className="space-y-2">
                 <li className="flex items-start gap-2 text-gray-300 text-[11px] font-medium">
                   <CheckCircle2 size={12} className="text-yellow-500 shrink-0 mt-0.5"/> <span>eCommerce Architecture</span>
                 </li>
                 <li className="flex items-start gap-2 text-gray-300 text-[11px] font-medium">
                   <CheckCircle2 size={12} className="text-yellow-500 shrink-0 mt-0.5"/> <span>Corporate Authority Sites</span>
                 </li>
               </ul>
             </div>
          </div>

          {/* Footer Logistics */}
          <div className="border-t border-gray-800 pt-4 mt-6 flex justify-between items-end">
             <div className="space-y-1.5">
               <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5"><Calendar size={12} className="text-yellow-500"/> 28 Feb 2026</p>
               <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5"><MapPin size={12} className="text-yellow-500"/> Waterfall City</p>
             </div>
             <div className="text-right">
               <p className="text-white font-black text-sm tracking-wide">happyhunterdigital.com</p>
               <p className="text-yellow-500 text-[8px] font-bold uppercase tracking-widest">Identify Untapped Opportunities</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
