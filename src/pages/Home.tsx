import React from 'react';
import { Target, Zap, ShieldCheck, Search, ArrowRight, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="container mx-auto px-6 text-center py-24 md:py-32">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase tracking-widest mb-8">
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
          Generative Engine Optimization (GEO)
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8 text-white">
          Survive The <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-yellow-600 italic">Great AI Filter</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl font-medium mb-12 leading-relaxed">
          Standard SEO is obsolete. We format your digital intellectual property so AI engines—ChatGPT, Gemini, Copilot—synthesize and cite you as the definitive industry authority.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/audit" className="bg-yellow-500 text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
            <Search size={20} /> Run Entity Scan
          </Link>
          <Link to="/services" className="border border-gray-700 bg-[#0a0a0a] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:border-yellow-500 transition-all flex items-center justify-center gap-2">
            View Architecture <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Value Proposition Matrix */}
      <section className="bg-[#0a0a0a] py-24 border-y border-gray-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">Uncouple Revenue From Linear Effort</h2>
            <p className="text-gray-400 leading-relaxed">We transition your organization away from bottlenecked, founder-led marketing by systematizing your digital presence into highly scalable, AI-ready assets.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-black border border-gray-800 rounded-3xl hover:border-yellow-500/50 transition-colors group">
              <ShieldCheck className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={48}/>
              <h3 className="text-xl font-bold text-white mb-3">Entity Synchronization</h3>
              <p className="text-gray-400 leading-relaxed text-sm">We establish baseline algorithmic trust by unifying your Name, Address, and Phone (NAP) data across the entire Google Knowledge Graph.</p>
            </div>
            <div className="p-8 bg-black border border-gray-800 rounded-3xl hover:border-yellow-500/50 transition-colors group">
              <Zap className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={48}/>
              <h3 className="text-xl font-bold text-white mb-3">Answer Engine Optimization</h3>
              <p className="text-gray-400 leading-relaxed text-sm">We utilize explicit RAG-ready formatting and Schema.org JSON-LD to ensure LLMs synthesize your brand directly into zero-click conversational responses.</p>
            </div>
            <div className="p-8 bg-black border border-gray-800 rounded-3xl hover:border-yellow-500/50 transition-colors group">
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
