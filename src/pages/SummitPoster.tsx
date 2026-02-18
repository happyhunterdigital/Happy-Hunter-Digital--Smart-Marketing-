import { useRef } from 'react';
import { Download, AlertTriangle, ArrowRight, Gift, Zap } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function SummitPoster() {
  const posterRef = useRef<HTMLDivElement>(null);

  const downloadPoster = async () => {
    if (!posterRef.current) return;

    try {
      const canvas = await html2canvas(posterRef.current, {
        width: 1080,
        height: 1350,
        scale: 2,
        useCORS: true,
        backgroundColor: '#020617',
        logging: false,
      });

      const link = document.createElement('a');
      link.download = 'happyhunter_summit_2026_poster.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      
    } catch (err) {
      console.error('Poster generation failed:', err);
      alert('Could not generate poster. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center pt-24 pb-20 px-4 font-sans">
      {/* Controls */}
      <div className="mb-8 lg:mb-10 w-full max-w-[500px] flex flex-col gap-4 bg-slate-900/80 p-4 lg:p-6 rounded-2xl lg:rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-white font-black uppercase text-sm tracking-[0.2em]">
            Social Media Asset Engine
          </h2>
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">
            Format: 1080x1350 (Optimized for IG/FB)
          </p>
        </div>
        <button
          onClick={downloadPoster}
          className="w-full bg-yellow-500 text-slate-950 py-3 lg:py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl active:scale-95"
        >
          <Download size={18} /> Download High-Res Poster
        </button>
      </div>

      {/* Poster Frame */}
      <div className="w-full flex justify-center overflow-hidden py-4">
        <div className="scale-[0.25] sm:scale-[0.35] md:scale-[0.5] lg:scale-[0.65] xl:scale-[0.75] origin-top transition-transform duration-500">
          <div
            ref={posterRef}
            className="bg-[#020617] w-[1080px] h-[1350px] border-[20px] border-slate-900 relative overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Background Decor */}
            <div className="absolute top-20 -left-20 opacity-[0.03] select-none pointer-events-none">
              <span className="brand-name text-[30rem] leading-none">HH</span>
            </div>

            {/* Top Logo Bar */}
            <div className="p-10 lg:p-16 flex justify-between items-center z-20">
              <div className="flex items-center gap-4 lg:gap-5">
                <img
                  src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761701/Logo_mock1_jmjuoe.png"
                  className="h-12 lg:h-16 w-auto object-contain"
                  alt="logo"
                />
                <span className="brand-name text-4xl lg:text-6xl text-white pt-2">
                  happyhunterdigital
                </span>
              </div>
              <div className="bg-yellow-500 text-slate-950 px-6 lg:px-10 py-2 lg:py-3 rounded-full font-black text-lg lg:text-xl uppercase tracking-widest">
                Secure your Spot
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex-1 grid grid-cols-12 px-8 lg:px-16 gap-6 lg:gap-10">
              {/* Left: Strategic Intel */}
              <div className="col-span-7 flex flex-col justify-center space-y-8 lg:space-y-12 z-10">
                <div className="space-y-4 lg:space-y-6">
                  <div className="flex items-center gap-3 lg:gap-4 text-red-500 font-black uppercase text-lg lg:text-2xl tracking-[0.3em]">
                    <AlertTriangle size={28} lg:size={32} /> The Invisibility Crisis
                  </div>
                  <h1 className="text-6xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.8] text-white">
                    STOP <br />BEING <br />
                    <span className="text-yellow-500 italic">FILTERED.</span>
                  </h1>
                  <p className="text-slate-300 text-xl lg:text-4xl font-medium italic border-l-8 border-yellow-500/20 pl-6 lg:pl-10 leading-relaxed">
                    "Your business exists in reality, but it is a{' '}
                    <span className="text-yellow-500 font-black not-italic">GHOST</span> to the AI algorithms. 
                    Mend your digital architecture now."
                  </p>
                </div>

                {/* Value Stack */}
                <div className="space-y-4 lg:space-y-6 bg-slate-900/60 p-6 lg:p-10 rounded-[2rem] lg:rounded-[4rem] border border-white/10 shadow-2xl">
                  <p className="text-base lg:text-xl font-black uppercase text-yellow-500 mb-2 lg:mb-4 text-center">
                    Strategic Value Transfer
                  </p>
                  <div className="space-y-3 lg:space-y-5 text-lg lg:text-2xl uppercase font-bold text-slate-300">
                    <div className="flex justify-between border-b border-white/5 pb-2 lg:pb-4">
                      <span>Core Financial & AI Mastery</span>
                      <span>R8,500</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2 lg:pb-4">
                      <span>Digital Entity Audit (GMB+)</span>
                      <span>R3,800</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2 lg:pb-4">
                      <span>2 Months Free Bookkeeping</span>
                      <span>R4,000</span>
                    </div>
                    <div className="pt-4 lg:pt-6 flex justify-between text-yellow-500 text-4xl lg:text-6xl font-black italic tracking-tighter">
                      <span>Total Value</span>
                      <span>R16,300</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Strategist Image */}
              <div className="col-span-5 relative h-full">
                <img
                  src="https://res.cloudinary.com/dka0498ns/image/upload/v1766069617/Thabo_Leslie_Motsumi._AI_Google_my_Business_profile_optimization_Search_Everywhere_Optimation_SEO_Automation_and_Smart_digital_marketing._vncyse.png"
                  className="h-full w-full object-cover object-center grayscale brightness-90 contrast-125 rounded-[2rem] lg:rounded-[4rem]"
                  alt="Thabo Leslie Motsumi"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#020617] to-[#020617] opacity-30" />
                
                {/* Giveaway Medallion */}
                <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 rotate-12 bg-white text-slate-950 p-6 lg:p-12 rounded-[2rem] lg:rounded-[4rem] shadow-2xl border-[8px] lg:border-[12px] border-[#020617] z-30 text-center w-48 lg:w-72">
                  <Gift className="mx-auto mb-2 lg:mb-4 text-yellow-600" size={36} lg:size={56} fill="currentColor" />
                  <p className="text-sm lg:text-xl font-black uppercase tracking-widest leading-none mb-1 lg:mb-2">
                    Lucky Attendees
                  </p>
                  <p className="text-base lg:text-2xl font-bold italic leading-tight">
                    Win Audits & Support Worth R7,800
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Bar */}
            <div className="p-8 lg:p-16 pt-0">
              <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] lg:rounded-[4rem] p-6 lg:p-12 flex flex-col lg:flex-row items-center justify-between shadow-2xl gap-6">
                <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
                  <div className="flex flex-col items-center lg:items-start">
                    <img
                      src="https://res.cloudinary.com/dka0498ns/image/upload/v1765747667/Integrated_Wellth_Solutions_Logo_bodmyc1_iiervl.png"
                      className="h-10 lg:h-14 object-contain mb-2 lg:mb-4"
                      alt="IW"
                    />
                    <p className="text-sm lg:text-xl font-black text-slate-400 uppercase tracking-widest italic text-center lg:text-left">
                      Munyaka, Waterfall City
                    </p>
                  </div>
                  <div className="hidden lg:block h-24 w-px bg-white/10" />
                  <div className="space-y-1 lg:space-y-2 text-center">
                    <p className="text-3xl lg:text-5xl font-black text-red-600 uppercase tracking-tighter leading-none underline decoration-red-600/30 underline-offset-8">
                      28 February
                    </p>
                    <p className="text-base lg:text-xl font-bold text-slate-600 uppercase tracking-widest mt-2 lg:mt-4">
                      09:00 - 16:30
                    </p>
                  </div>
                </div>
                
                <div className="text-center lg:text-right space-y-4">
                  <div className="bg-yellow-500 text-slate-950 px-6 lg:px-12 py-3 lg:py-6 rounded-[1.5rem] lg:rounded-[2.5rem] font-black uppercase text-lg lg:text-2xl tracking-widest flex items-center justify-center gap-3 shadow-2xl">
                    Register on Quicket <ArrowRight size={24} lg:size={32} />
                  </div>
                  <p className="text-xs lg:text-sm font-black uppercase tracking-[0.5em] text-slate-700">
                    Managed by happyhunterdigital
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
