import { useRef } from 'react';
import { Download, AlertTriangle, ArrowRight, Gift, Zap } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function SummitPoster() {
  const posterRef = useRef<HTMLDivElement>(null);

  const downloadPoster = async () => {
    if (!posterRef.current) return;
    
    // Using a high scale for a crisp 1080x1350 output
    const canvas = await html2canvas(posterRef.current, { 
      width: 1080,
      height: 1350,
      scale: 2, 
      useCORS: true,
      backgroundColor: '#020617' 
    });
    
    const link = document.createElement('a');
    link.download = `HappyHunter-Summit-Final.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center pt-24 pb-20 px-4 font-sans">
      
      {/* 1. INTERFACE CONTROLS */}
      <div className="mb-10 w-full max-w-[500px] flex flex-col gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl">
        <div className="text-center">
           <h2 className="text-white font-black uppercase text-sm tracking-[0.2em]">Social Media Asset Engine</h2>
           <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Format: 1080x1350 (Optimized for IG/FB)</p>
        </div>
        <button 
          onClick={downloadPoster} 
          className="w-full bg-yellow-500 text-slate-950 py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl active:scale-95"
        >
          <Download size={18}/> Download High-Res Poster
        </button>
      </div>

      {/* 2. THE POSTER FRAME (Fixed Social Ratio: 4:5) */}
      <div className="w-full flex justify-center overflow-hidden py-4">
        {/* Responsive Scaling for the browser preview */}
        <div className="scale-[0.32] sm:scale-[0.45] md:scale-[0.75] lg:scale-[0.8] origin-top transition-transform duration-500">
          <div 
            ref={posterRef} 
            className="bg-[#020617] w-[1080px] h-[1350px] border-[20px] border-slate-900 relative overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Background Decor */}
            <div className="absolute top-20 -left-20 opacity-[0.03] select-none pointer-events-none">
              <span className="brand-name text-[30rem] leading-none">HH</span>
            </div>

            {/* TOP LOGO BAR */}
            <div className="p-16 flex justify-between items-center z-20">
              <div className="flex items-center gap-5">
                <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761701/Logo_mock1_jmjuoe.png" className="h-16 w-auto object-contain" alt="logo" />
                <span className="brand-name text-6xl text-white pt-2">happyhunterdigital</span>
              </div>
              <div className="bg-yellow-500 text-slate-950 px-10 py-3 rounded-full font-black text-xl uppercase tracking-widest">
                Secure your Spot
              </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="flex-1 grid grid-cols-12 px-16 gap-10">
              
              {/* LEFT: STRATEGIC INTEL (7/12) */}
              <div className="col-span-7 flex flex-col justify-center space-y-12 z-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-red-500 font-black uppercase text-2xl tracking-[0.3em]">
                    <AlertTriangle size={32} /> The Invisibility Crisis
                  </div>
                  <h1 className="text-9xl font-black uppercase tracking-tighter leading-[0.8] text-white">
                    STOP <br /> BEING <br /> <span className="text-yellow-500 italic">FILTERED.</span>
                  </h1>
                  <p className="text-slate-300 text-4xl font-medium italic border-l-8 border-yellow-500/20 pl-10 leading-relaxed">
                    "Your business exists in reality, but it is a <span className="text-yellow-500 font-black not-italic">GHOST</span> to the AI algorithms. Mend your digital architecture now."
                  </p>
                </div>

                {/* VALUE STACK */}
                <div className="space-y-6 bg-slate-900/60 p-10 rounded-[4rem] border border-white/10 shadow-2xl">
                  <p className="text-xl font-black uppercase text-yellow-500 tracking-[0.4em] mb-4 text-center">Strategic Value Transfer</p>
                  <div className="space-y-5 text-2xl uppercase font-bold text-slate-300">
                    <div className="flex justify-between border-b border-white/5 pb-4"><span>Core Financial & AI Mastery</span> <span>R8,500</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-4"><span>Digital Entity Audit (GMB+)</span> <span>R3,800</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-4"><span>2 Months Free Bookkeeping</span> <span>R4,000</span></div>
                    <div className="pt-6 flex justify-between text-yellow-500 text-6xl font-black italic tracking-tighter">
                      <span>Total Value</span> <span>R16,300</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: THE STRATEGIST (5/12) */}
              <div className="col-span-5 relative h-full">
                {/* SMART CROP: Using object-cover to prevent stretching */}
                <img 
                  src="https://res.cloudinary.com/dka0498ns/image/upload/v1766069617/Thabo_Leslie_Motsumi._AI_Google_my_Business_profile_optimization_Search_Everywhere_Optimation_SEO_Automation_and_Smart_digital_marketing._vncyse.png" 
                  className="h-full w-full object-cover object-center grayscale brightness-90 contrast-125 rounded-[4rem]" 
                  alt="Thabo Leslie Motsumi" 
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#020617] to-[#020617] opacity-30"></div>
                
                {/* THE GIVEAWAY MEDALLION */}
                <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 rotate-12 bg-white text-slate-950 p-12 rounded-[4rem] shadow-2xl border-[12px] border-[#020617] z-30 text-center w-72">
                   <Gift className="mx-auto mb-4 text-yellow-600" size={56} fill="currentColor"/>
                   <p className="text-xl font-black uppercase tracking-widest leading-none mb-2">Lucky Attendees</p>
                   <p className="text-2xl font-bold italic leading-tight">Win Audits & Support Worth R7,800</p>
                </div>
              </div>
            </div>

            {/* FOOTER BAR */}
            <div className="p-16 pt-0">
              <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-12 flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-12">
                  <div className="flex flex-col">
                     <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765747667/Integrated_Wellth_Solutions_Logo_bodmyc1_iiervl.png" className="h-14 object-contain mb-4" alt="IW" />
                     <p className="text-xl font-black text-slate-400 uppercase tracking-widest italic">Munyaka, Waterfall City</p>
                  </div>
                  <div className="h-24 w-px bg-white/10"></div>
                  <div className="space-y-2 text-center">
                     <p className="text-5xl font-black text-red-600 uppercase tracking-tighter leading-none underline decoration-red-600/30 underline-offset-8">28 February</p>
                     <p className="text-xl font-bold text-slate-600 uppercase tracking-widest mt-4">09:00 - 16:30</p>
                  </div>
                </div>
                
                <div className="text-right space-y-6">
                   <div className="bg-yellow-500 text-slate-950 px-12 py-6 rounded-[2.5rem] font-black uppercase text-2xl tracking-widest flex items-center gap-4 shadow-2xl">
                      Register on Quicket <ArrowRight size={32} />
                   </div>
                   <p className="text-sm font-black uppercase tracking-[0.5em] text-slate-700">Managed by happyhunterdigital</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
