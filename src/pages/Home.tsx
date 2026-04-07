import React from 'react';
import { Target, Zap, ShieldCheck, Search, ArrowRight, BarChart3, Database, TrendingDown, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="animate-fade-in">
      {/* HERO SECTION */}
      <section className="relative container-fluid px-6 text-center py-32 md:py-48 overflow-hidden min-h-[90vh] flex flex-col justify-center">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 grayscale"
          style={{ backgroundImage: "url('https://res.cloudinary.com/dka0498ns/image/upload/v1762761706/Happy_Hunter_work_space_jovfrh.png')" }}
        ></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#020617]/90 via-[#020617]/90 to-[#050505]"></div>
        
        <div className="relative z-20 container mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-widest mb-8 backdrop-blur-md">
            <TrendingDown size={14} className="animate-pulse" />
            Alert: 87% of South African SMEs are invisible to AI Search
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-black uppercase tracking-tighter leading-[0.9] mb-8 text-white drop-shadow-2xl">
            Is Your Business a <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-yellow-600 italic text-white underline decoration-red-600 underline-offset-[15px]">Ghost to AI?</span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-gray-300 text-lg md:text-xl font-medium mb-12 leading-relaxed drop-shadow-md">
            In 2026, your customers aren't scrolling through pages of blue links anymore. They are asking ChatGPT, Gemini, and Google's AI Overviews for direct recommendations. If you aren't a <b>Verified Entity</b>, you simply do not exist.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/audit" 
              className="bg-yellow-500 text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2 shadow-[0_0_50px_rgba(234,179,8,0.5)] animate-subtle-pulse"
            >
              <Search size={20} /> Initialize Your Survival Scan
            </Link>
          </div>
        </div>
      </section>

      {/* REST OF NARRATIVE MATRIX SECTION */}
      <section className="bg-[#050505] py-24 border-t border-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">The Tripartite Protocol</h2>
            <p className="text-gray-400 leading-relaxed text-lg">We transition your organization away from superficial marketing tactics. We build mathematically sound, AI-ready digital assets that force algorithms to recommend you.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl hover:border-yellow-500/50 transition-colors group shadow-xl">
              <ShieldCheck className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={48}/>
              <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tighter">1. The Trust Anchor</h3>
              <p className="text-gray-400 leading-relaxed text-sm mb-6">Before an AI will risk recommending your business, it must trust you. We establish your baseline algorithmic trust through rigorous Google Business Profile verification and advanced Schema architecture.</p>
              <Link to="/architecture" className="text-[10px] font-black uppercase tracking-widest text-yellow-500 hover:text-white flex items-center gap-1">Explore Architecture <ArrowRight size={12}/></Link>
            </div>
            
            <div className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl hover:border-yellow-500/50 transition-colors group shadow-xl">
              <Database className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={48}/>
              <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tighter">2. The AI Megaphone</h3>
              <p className="text-gray-400 leading-relaxed text-sm mb-6">Traditional SEO chases clicks. Answer Engine Optimization (AEO) secures citations. We format your content using explicit RAG-ready structures so your brand is the definitive source of truth.</p>
              <Link to="/blog/ai-megaphone" className="text-[10px] font-black uppercase tracking-widest text-yellow-500 hover:text-white flex items-center gap-1">Read AEO Intel <ArrowRight size={12}/></Link>
            </div>
            
            <div className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl hover:border-yellow-500/50 transition-colors group shadow-xl">
              <Zap className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={48}/>
              <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tighter">3. The Revenue Brain</h3>
              <p className="text-gray-400 leading-relaxed text-sm mb-6">Visibility without orchestration is useless. We deploy 24/7 intelligent AI receptionists to your website and WhatsApp to automate lead qualification and revenue growth.</p>
              <Link to="/blog/revenue-brain" className="text-[10px] font-black uppercase tracking-widest text-yellow-500 hover:text-white flex items-center gap-1">View Automation <ArrowRight size={12}/></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
