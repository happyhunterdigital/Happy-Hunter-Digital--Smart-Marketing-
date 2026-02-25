import React from 'react';
import { Target, Zap, ShieldCheck, Search, ArrowRight, BarChart3, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="animate-fade-in">
      
      {/* 
        HERO SECTION
        Using the "Happy Hunter Workspace" image.
      */}
      <section className="relative container-fluid px-6 text-center py-32 md:py-48 overflow-hidden min-h-[90vh] flex flex-col justify-center">
        
        {/* NEW WORKSPACE BACKGROUND IMAGE */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 grayscale"
          style={{ backgroundImage: "url('https://res.cloudinary.com/dka0498ns/image/upload/v1762761706/Happy_Hunter_work_space_jovfrh.png')" }}
        ></div>

        {/* Deepened the gradient slightly for better contrast against the new image */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#020617]/90 via-[#020617]/90 to-[#050505]"></div>

        <div className="absolute inset-0 z-10 opacity-30 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
             <path d="M 100 200 L 300 500 L 600 300 L 800 700 L 950 400" fill="none" stroke="#eab308" strokeWidth="1" strokeDasharray="4,4" className="animate-pulse" />
             <path d="M 200 800 L 400 600 L 700 800 L 850 500" fill="none" stroke="#eab308" strokeWidth="0.5" />
             <circle cx="100" cy="200" r="4" fill="#eab308" />
             <circle cx="300" cy="500" r="6" fill="#eab308" />
             <circle cx="600" cy="300" r="4" fill="#eab308" />
             <circle cx="800" cy="700" r="8" fill="#eab308" className="animate-pulse" />
             <circle cx="950" cy="400" r="3" fill="#eab308" />
          </svg>
        </div>

        <div className="relative z-20 container mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-widest mb-8 backdrop-blur-md">
            <TrendingDown size={14} className="animate-pulse" />
            Alert: 87% of SMEs are invisible to AI Search
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-black uppercase tracking-tighter leading-[0.9] mb-8 text-white drop-shadow-2xl">
            Your Business is a <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-yellow-600 italic text-white underline decoration-red-600 underline-offset-[15px]">Ghost to AI</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-300 text-lg md:text-xl font-medium mb-12 leading-relaxed drop-shadow-md">
            If you aren't a <strong className="text-white">Verified Entity</strong>, you don't exist. Our forensic engine exposes the digital gaps that are costing you monthly revenue.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/audit" className="bg-yellow-500 text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(234,179,8,0.3)]">
              <Search size={20} /> Initialize Smart Business Scan
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition Matrix */}
      <section className="bg-[#050505] py-24 border-t border-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">Uncouple Revenue From Linear Effort</h2>
            <p className="text-gray-400 leading-relaxed">We transition your organization away from bottlenecked, founder-led marketing by systematizing your digital presence into highly scalable, AI-ready assets.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl hover:border-yellow-500/50 transition-colors group shadow-xl">
              <ShieldCheck className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={48}/>
              <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tighter">Entity Architecture</h3>
              <p className="text-gray-400 leading-relaxed text-sm">We establish baseline algorithmic trust by unifying your data across the entire Google Knowledge Graph.</p>
            </div>
            <div className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl hover:border-yellow-500/50 transition-colors group shadow-xl">
              <Zap className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={48}/>
              <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tighter">AI Visibility (AEO)</h3>
              <p className="text-gray-400 leading-relaxed text-sm">We utilize explicit RAG-ready formatting so AI models recommend your brand in conversational search.</p>
            </div>
            <div className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl hover:border-yellow-500/50 transition-colors group shadow-xl">
              <BarChart3 className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={48}/>
              <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tighter">Agentic Revenue</h3>
              <p className="text-gray-400 leading-relaxed text-sm">Automated qualification pipelines that convert attention into booked appointments 24/7.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
