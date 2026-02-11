import { ShieldCheck, Zap, MapPin, Calendar, Clock, TrendingUp, ArrowRight } from 'lucide-react';

export default function SummitPoster() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 md:p-10 font-sans">
      {/* THE POSTER FRAME (Instagram Portrait / A4 Ratio) */}
      <div id="event-poster" className="bg-slate-950 w-full max-w-[850px] aspect-[3/4] border-[16px] border-slate-900 rounded-[5rem] relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,1)] flex flex-col">
        
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]"></div>

        {/* 1. HEADER BRANDING */}
        <div className="p-12 pb-0 flex justify-between items-center z-20">
          <div className="flex items-center gap-4">
            <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761701/Logo_mock1_jmjuoe.png" className="h-12" alt="HH" />
            <span className="brand-name text-4xl text-white">happyhunterdigital</span>
          </div>
          <div className="bg-yellow-500 text-slate-950 px-5 py-1.5 rounded-full font-black text-xs uppercase tracking-widest">
            Principal Keynote
          </div>
        </div>

        {/* 2. THE HERO GRID */}
        <div className="flex-1 grid grid-cols-5 relative">
          {/* Text Content (Left 3/5) */}
          <div className="col-span-3 p-12 flex flex-col justify-center space-y-10 z-10">
            <div className="space-y-2">
              <span className="text-yellow-500 font-black uppercase tracking-[0.5em] text-[11px]">IntegratedWellth Summit 2026</span>
              <h1 className="text-7xl font-black uppercase tracking-tighter leading-[0.85] text-white">
                STOP <br /> GUESSING. <br /> <span className="text-yellow-500">START <br /> GROWING.</span>
              </h1>
            </div>
            
            <p className="text-slate-400 text-lg font-medium italic border-l-4 border-yellow-500/20 pl-8 leading-relaxed max-w-sm">
              "The only workshop that aligns your Financial Reality with your Digital Future."
            </p>

            <div className="flex gap-10">
               <div className="space-y-1">
                  <p className="text-slate-600 font-black uppercase text-[10px] tracking-widest">Date</p>
                  <p className="text-red-600 font-black text-xl uppercase tracking-tighter underline underline-offset-4 decoration-red-600/30">28 February</p>
               </div>
               <div className="space-y-1">
                  <p className="text-slate-600 font-black uppercase text-[10px] tracking-widest">Location</p>
                  <p className="text-white font-black text-xl uppercase tracking-tighter">Munyaka, Midrand</p>
               </div>
            </div>
          </div>

          {/* Speaker Image (Right 2/5) */}
          <div className="col-span-2 relative h-full">
            <img 
              src="https://res.cloudinary.com/dka0498ns/image/upload/v1766069617/Thabo_Leslie_Motsumi._AI_Google_my_Business_profile_optimization_Search_Everywhere_Optimation_SEO_Automation_and_Smart_digital_marketing._vncyse.png" 
              className="h-full w-full object-cover grayscale brightness-90 contrast-110"
              alt="Thabo Leslie Motsumi"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-slate-950 to-slate-950"></div>
            
            {/* VALUE ARBITRAGE MEDALLION */}
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] bg-yellow-500 text-slate-950 p-8 rounded-[3rem] shadow-2xl border-[6px] border-slate-950 z-30 text-center scale-110">
               <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Total Value</p>
               <p className="text-2xl font-black uppercase leading-none mb-3">R8,500</p>
               <div className="h-0.5 bg-slate-950/20 w-12 mx-auto mb-3"></div>
               <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Your Price</p>
               <p className="text-5xl font-black tracking-tighter leading-none">R1,200</p>
            </div>
          </div>
        </div>

        {/* 3. THE INFRASTRUCTURE BAR (Glassmorphism) */}
        <div className="p-12 pt-0 z-20">
          <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 shadow-2xl flex items-center justify-between gap-12">
            <div className="space-y-4">
               <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765747667/Integrated_Wellth_Solutions_Logo_bodmyc1_iiervl.png" className="h-8" alt="IW" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Official Guest Speaker: <span className="text-white">Thabo Leslie Motsumi</span></p>
            </div>

            <div className="h-16 w-px bg-white/10"></div>

            <div className="space-y-2 max-w-xs">
               <p className="text-[10px] font-black uppercase text-yellow-500 tracking-widest flex items-center gap-2">
                  <TrendingUp size={14}/> Core Session Outcome
               </p>
               <p className="text-[12px] text-slate-300 font-medium leading-relaxed italic">
                  Build your Ledger Architecture & AI Authority signal in one day. 
               </p>
            </div>

            <div className="text-right space-y-4">
               <div className="bg-white text-slate-950 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-xl">
                  Quicket.co.za <ArrowRight size={14} />
               </div>
               <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600">Protocol Launch 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
