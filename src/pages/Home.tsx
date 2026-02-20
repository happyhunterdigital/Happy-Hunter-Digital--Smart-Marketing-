import React from 'react';
import { Target, Zap, ShieldCheck, Search, ArrowRight, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="container mx-auto px-6 text-center py-24 md:py-32">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold uppercase tracking-widest mb-8">
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
          Smart Marketing for the AI Era
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8 text-white">
          Don't Let AI Make Your <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-yellow-600 italic">Business Invisible</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl font-medium mb-12 leading-relaxed">
          The way customers find businesses has changed forever. We help South African brands dominate AI search engines, rank higher on Google Maps, and automate their lead generation.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/audit" className="bg-yellow-500 text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20">
            <Search size={20} /> Get Your Free AI Scan
          </Link>
          <Link to="/services" className="border border-gray-700 bg-gray-900/50 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:border-yellow-500 transition-all flex items-center justify-center gap-2">
            Explore Services <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-[#0a0a0a] py-24 border-y border-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">How We Grow Your Business</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">We replace guesswork with data-driven systems designed to capture attention and convert it into revenue.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-black border border-gray-800 rounded-3xl hover:border-yellow-500/50 transition-colors group">
              <ShieldCheck className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={48}/>
              <h3 className="text-xl font-bold text-white mb-3">Google Maps Dominance</h3>
              <p className="text-gray-400 leading-relaxed text-sm">We optimize your Google Business Profile so you show up first when local customers search for your services.</p>
            </div>
            <div className="p-8 bg-black border border-gray-800 rounded-3xl hover:border-yellow-500/50 transition-colors group">
              <Zap className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={48}/>
              <h3 className="text-xl font-bold text-white mb-3">AI Search Readiness</h3>
              <p className="text-gray-400 leading-relaxed text-sm">We structure your website's data so ChatGPT, Gemini, and AI assistants recommend you as the top expert in your field.</p>
            </div>
            <div className="p-8 bg-black border border-gray-800 rounded-3xl hover:border-yellow-500/50 transition-colors group">
              <BarChart3 className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={48}/>
              <h3 className="text-xl font-bold text-white mb-3">Automated Lead Systems</h3>
              <p className="text-gray-400 leading-relaxed text-sm">Stop manually chasing leads. We build smart funnels that capture, qualify, and book appointments while you sleep.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
