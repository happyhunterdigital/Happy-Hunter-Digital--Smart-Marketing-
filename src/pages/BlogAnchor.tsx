import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Zap, Workflow } from 'lucide-react';

export const BlogAnchor = () => (
  <div className="bg-[#050505] min-h-screen pb-20 animate-fade-in">
    
    {/* CINEMATIC HERO HEADER */}
    <header className="relative pt-40 pb-24 border-b border-gray-800 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://res.cloudinary.com/dka0498ns/image/upload/v1772005724/The_Architecture_of_Digital_Authority_Integrating_Trust_Anchors_AI-Powered_Answer_Engines_and_Agentic_Revenue_Ecosystems_in_2026_i4tgjt.png" 
          alt="The Architecture of Digital Authority" 
          className="w-full h-full object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
      </div>
      <div className="relative z-10 container mx-auto px-6 max-w-5xl text-center">
        <span className="inline-block text-yellow-500 font-black uppercase tracking-[0.3em] text-[10px] mb-6 bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/20">
          Strategic Blueprint 2026
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tighter">
          The Architecture of Digital Authority
        </h1>
      </div>
    </header>

    <div className="container mx-auto px-6 max-w-5xl pt-20 grid md:grid-cols-3 gap-8">
      <Link to="/blog/ai-megaphone" className="group p-10 bg-[#0a0a0a] border border-gray-800 rounded-[2.5rem] hover:border-yellow-500 transition-all shadow-xl flex flex-col h-full">
        <BookOpen className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={40}/>
        <h2 className="text-2xl font-black mb-4 text-white leading-tight">The AI Megaphone</h2>
        <p className="text-gray-400 text-sm flex-grow leading-relaxed">Answer Engine Optimization (AEO) as the New Visibility Surface.</p>
        <span className="text-yellow-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mt-8 group-hover:translate-x-2 transition-transform">
          Read Protocol <ArrowRight size={14}/>
        </span>
      </Link>
      
      <Link to="/blog/revenue-brain" className="group p-10 bg-[#0a0a0a] border border-gray-800 rounded-[2.5rem] hover:border-yellow-500 transition-all shadow-xl flex flex-col h-full">
        <Zap className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={40}/>
        <h2 className="text-2xl font-black mb-4 text-white leading-tight">The Revenue Brain</h2>
        <p className="text-gray-400 text-sm flex-grow leading-relaxed">Agentic Lead Automation and the Future of Go-To-Market strategy.</p>
        <span className="text-yellow-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mt-8 group-hover:translate-x-2 transition-transform">
          Read Protocol <ArrowRight size={14}/>
        </span>
      </Link>

      <Link to="/blog/synthesis" className="group p-10 bg-[#0a0a0a] border border-gray-800 rounded-[2.5rem] hover:border-yellow-500 transition-all shadow-xl flex flex-col h-full">
        <Workflow className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform" size={40}/>
        <h2 className="text-2xl font-black mb-4 text-white leading-tight">GTM Synthesis 2026</h2>
        <p className="text-gray-400 text-sm flex-grow leading-relaxed">A comprehensive integration of Trust Anchors and Agentic Ecosystems.</p>
        <span className="text-yellow-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mt-8 group-hover:translate-x-2 transition-transform">
          Read Protocol <ArrowRight size={14}/>
        </span>
      </Link>
    </div>
  </div>
);
