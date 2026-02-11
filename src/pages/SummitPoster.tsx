import { useRef } from 'react';
import { ShieldCheck, Zap, MapPin, Calendar, TrendingUp, Download, Gift, AlertTriangle } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function SummitPoster() {
  const posterRef = useRef<HTMLDivElement>(null);

  const downloadPoster = async () => {
    if (!posterRef.current) return;
    const canvas = await html2canvas(posterRef.current, { scale: 3, useCORS: true });
    const link = document.createElement('a');
    link.download = 'HappyHunter-Summit-2026.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 md:p-10 font-sans">
      
      {/* 1. DOWNLOAD TRIGGER */}
      <div className="mb-8 w-full max-w-[850px] flex justify-between items-center px-4">
        <div className="text-left">
           <h2 className="text-white font-black uppercase text-xs tracking-widest">Summit Protocol Asset</h2>
           <p className="text-slate-500 text-[10px] italic">Download this for social media or print.</p>
        </div>
        <button onClick={downloadPoster} className="bg-yellow-500 text-slate-950 px-6 py-3 rounded-xl font-black uppercase text-[10px] flex items-center gap-2 hover:bg-white transition-all shadow-2xl">
          <Download size={16}/> Download High-Res
        </button>
      </div>

      {/* 2. THE POSTER FRAME (1080x1350 Ratio) */}
      <div ref={posterRef} className="bg-slate-950 w-full max-w-[850px] aspect-[3/4] border-[16px] border-slate-900 rounded-[4rem] relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,1)] flex flex-col p-12">
        
        {/* TOP BRANDING */}
        <div className="flex justify-between items-center z-20 mb-12">
          <div className="flex items-center gap-3">
            <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761701/Logo_mock1_jmjuoe.png" className="h-10" alt="logo" />
            <span className="brand-name text-3xl text-white pt-1">happyhunterdigital</span>
          </div>
          <div className="bg-yellow-500 text-slate-950 px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest">Keynote 2026</div>
        </div>

        {/* HERO GRID */}
        <div className="flex-1 grid grid-cols-5 gap-8 relative">
          
          {/* PAIN POINT FOCUS (Left 3/5) */}
          <div className="col-span-3 space-y-8 z-10 flex flex-col justify-center">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-500 font-black uppercase text-[10px] tracking-widest">
                <AlertTriangle size={14} /> The Invisibility Crisis
              </div>
              <h1 className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] text-white">
                STOP <br /> BEING <br /> <span className="text-yellow-500 italic">FILTERED.</span>
              </h1>
              <p className="text-slate-400 text-base font-medium italic border-l-4 border-yellow-500/20 pl-6 leading-relaxed max-w-sm">
                Your business exists in reality, but it’s a **GHOST** to the AI algorithms. Mend your digital architecture before 2026 solidifies.
              </p>
            </div>

            {/* VALUE BREAKDOWN */}
            <div className="space-y-4 bg-slate-900/50 p-6 rounded-3xl border border-white/5 shadow-2xl">
              <p className="text-[10px] font-black uppercase text-yellow-500 tracking-[0.3em]">The Strategic Value Transfer:</p>
              <div className="space-y-2 text-xs uppercase font-bold text-slate-300">
                <div className="flex justify-between"><span>Core Financial & AI Workshop</span> <span>R8,500</span></div>
                <div className="flex justify-between"><span>Digital Entity Audit + GMB Optimization</span> <span>R3,800</span></div>
                <div className="flex justify-between"><span>2 Months Free Bookkeeping</span> <span>R4,000</span></div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-yellow-500 text-lg font-black">
                  <span>Total Value Delivered</span> <span>R16,300</span>
                </div>
              </div>
            </div>
          </div>

          {/* SPEAKER (Right 2/5) */}
          <div className="col-span-2 relative h-full">
            <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1766069617/Thabo_Leslie_Motsumi._AI_Google_my_Business_profile_optimization_Search_Everywhere_Optimation_SEO_Automation_and_Smart_digital_marketing._vncyse.png" className="h-full w-full object-cover grayscale brightness-75 contrast-125" alt="Thabo" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-slate-950 to-slate-950"></div>
            
            {/* THE GIVEAWAY MEDALLION */}
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 rotate-12 bg-white text-slate-950 p-6 rounded-[2.5rem] shadow-2xl border-[6px] border-slate-950 z-30 text-center w-40 animate-pulse">
               <Gift className="mx-auto mb-2 text-yellow-600" size={24} fill="currentColor"/>
               <p className="text-[8px] font-black uppercase tracking-widest leading-none mb-1">Lucky Attendees</p>
               <p className="text-[10px] font-bold italic leading-tight">Win Full Audits & Bookkeeping Support</p>
            </div>
          </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="mt-12 bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
               <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765747667/Integrated_Wellth_Solutions_Logo_bodmyc1_iiervl.png" className="h-6 object-contain mb-2" alt="IW" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Munyaka, Waterfall City</p>
            </div>
            <div className="h-10 w-px bg-white/10"></div>
            <div className="space-y-1">
               <p className="text-xl font-black text-red-600 uppercase tracking-tighter leading-none underline decoration-red-600/30 underline-offset-4">28 February</p>
               <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none">09:00 - 16:30</p>
            </div>
          </div>
          <div className="text-right">
             <p className="text-yellow-500 font-black text-3xl leading-none mb-2">R849.99</p>
             <p className="text-white text-[9px] font-black uppercase tracking-widest opacity-40">quicket.co.za</p>
          </div>
        </div>
      </div>
    </div>
  );
}
