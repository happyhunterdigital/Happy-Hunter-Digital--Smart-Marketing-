import React from 'react';
import { Target, Zap, ShieldCheck, Search, ArrowRight, BarChart3, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="animate-fade-in">
      
      {/* 
        "DIGITAL JOBURG" HERO SECTION
        This uses a cinematic South African skyline (Johannesburg) overlaid with 
        an advanced CSS gradient mask and SVG "Data Nodes" to create the requested graphic.
      */}
      <section className="relative container-fluid px-6 text-center py-32 md:py-48 overflow-hidden min-h-[90vh] flex flex-col justify-center">
        
        {/* The Cinematic Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 grayscale"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1580982335165-27a3c7746187?q=80&w=2000&auto=format&fit=crop')" }}
        ></div>

        {/* The "Slate 950" Moody Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#020617]/80 via-[#020617]/90 to-[#050505]"></div>

        {/* The Cybernetic Yellow Data Nodes (SVG) */}
        <div className="absolute inset-0 z-10 opacity-30 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
             {/* Connection Lines */}
             <path d="M 10% 20% L 30% 50% L 60% 30% L 80% 70% L 95% 40%" fill="none" stroke="#eab308" strokeWidth="1" strokeDasharray="4,4" className="animate-pulse" />
             <path d="M 20% 80% L 40% 60% L 70% 80% L 85% 50%" fill="none" stroke="#eab308" strokeWidth="0.5" />
             {/* Data Nodes */}
             <circle cx="10%" cy="20%" r="4" fill="#eab308" />
             <circle cx="30%" cy="50%" r="6" fill="#eab308" className="animate-ping" />
             <circle cx="60%" cy="30%" r="4" fill="#eab308" />
             <circle cx="80%" cy="70%" r="8" fill="#eab308" className="animate-pulse" />
             <circle cx="95%" cy="40%" r="3" fill="#eab308" />
             <circle cx="40%" cy="60%" r="5" fill="#eab308" />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 container mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-[10px] font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
            <Database size={14} className="animate-pulse" />
            Generative Engine Optimization (GEO)
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-black uppercase tracking-tighter leading-[0.9] mb-8 text-white drop-shadow-2xl">
            We Turn Physical Businesses <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-yellow-600 italic">Into Digital Powerhouses</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-300 text-lg md:text-xl font-medium mb-12 leading-relaxed drop-shadow-md">
            Standard SEO is obsolete. We format your digital intellectual property so AI engines—ChatGPT, Gemini, SearchGPT—synthesize and cite you as the definitive local authority.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/audit" className="bg-yellow-500 text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(234,179,8,0.3)]">
              <Search size={20} /> Initiate Smart Scan
            </Link>
            <Link to="/services" className="border border-gray-600 bg-black/50 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:border-yellow-500 hover:text-yellow-500 transition-all flex items-center justify-center gap-2">
              View Architecture <ArrowRight size={18} />
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
              <h3 className="text-xl font-bold text-white mb-3">Entity Synchronization</h3>
              <p className="text-gray-400 leading-relaxed text-sm">We establish baseline algorithmic trust by unifying your Name, Address, and Phone (NAP) data across the entire Google Knowledge Graph.</p>
            </div>
            <div className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl hover:border-yellow-500/50 transition-colors group shadow-xl">
              <Zap className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={48}/>
              <h3 className="text-xl font-bold text-white mb-3">Answer Engine Optimization</h3>
              <p className="text-gray-400 leading-relaxed text-sm">We utilize explicit RAG-ready formatting and Schema.org JSON-LD to ensure LLMs synthesize your brand directly into zero-click conversational responses.</p>
            </div>
            <div className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl hover:border-yellow-500/50 transition-colors group shadow-xl">
              <BarChart3 className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={48}/>
              <h3 className="text-xl font-bold text-white mb-3">Lead-to-MQL Velocity</h3>
              <p className="text-gray-400 leading-relaxed text-sm">Stop paying for zero-intent traffic. We refine search intent modeling to double your Lead-to-MQL conversion rate using automated qualification pipelines.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
