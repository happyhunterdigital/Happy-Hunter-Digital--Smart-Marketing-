// src/pages/Playbook/PlaybookAnchor.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, ArrowRight } from 'lucide-react';

export const PlaybookAnchor = () => {
  return (
    <div className="bg-[#050505] min-h-screen pb-20 animate-fade-in font-sans">
      <header className="relative pt-40 pb-20 border-b border-gray-800 bg-[#0a0a0a] text-center">
        <div className="container mx-auto px-6 max-w-4xl">
          <Link to="/smart-news" className="inline-flex text-gray-500 hover:text-yellow-500 items-center gap-2 mb-10 uppercase text-[10px] font-black tracking-[0.2em] transition-colors">
            <ArrowLeft size={16}/> Back to Smart News
          </Link>
          
          <div className="flex justify-center mb-6">
            <BookOpen className="text-yellow-500" size={48} />
          </div>

          <p className="text-yellow-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">The 2026 Marketing Report</p>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6">
            Your Competitors Are Already Using <span className="text-yellow-500 italic">These Strategies.</span> Are You?
          </h1>
          
          <p className="text-xl text-gray-400 font-medium max-w-3xl mx-auto leading-relaxed">
            The complete playbook for AI-powered personalization, conversational commerce, and the trust-driven future of digital marketing written for brands who want to win.
          </p>
        </div>
      </header>

      <article className="container mx-auto px-6 max-w-3xl py-16 text-gray-300 text-lg leading-relaxed space-y-8">
        <p className="text-2xl font-black text-white leading-relaxed">
          If your digital marketing strategy still looks the way it did in 2023, you are not just behind. You are invisible.
        </p>
        <p>
          The marketing landscape of 2026 is a full-blown reinvention. Artificial intelligence has stopped being a future-forward buzzword and become the everyday engine running the brands that are winning right now. The old playbook of third-party cookies, batch-blast emails, static lead magnets, and commission-hungry booking platforms is dead.
        </p>
        <p>
          This is a wide-open opportunity. The brands that understand what is actually happening will capture the market share of every competitor still clinging to legacy tactics.
        </p>
        <p>
          This guide is your complete briefing. We provide a clear, practical picture of the most important shifts in digital marketing right now and exactly what you need to do about each one.
        </p>

        <div className="my-12 p-8 bg-yellow-500/10 border-l-4 border-yellow-500 rounded-r-3xl">
          <p className="text-white text-lg font-medium italic">
            "The competitive advantage no longer lives in the tools you own. It lives in how intelligently and ethically you use them to build genuine human trust."
          </p>
        </div>

        <div className="mt-20 p-10 bg-[#0a0a0a] border border-gray-800 rounded-3xl shadow-2xl">
          <h3 className="text-yellow-500 font-black uppercase tracking-widest text-sm mb-8 border-b border-gray-800 pb-4">What is Inside This Guide</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link to="/smart-news/playbook/chapter-1" className="group flex items-center justify-between p-4 bg-black border border-gray-800 rounded-xl hover:border-yellow-500 transition-colors">
              <div>
                <span className="text-yellow-500 font-black text-xs uppercase tracking-widest block mb-1">Chapter 1</span>
                <span className="text-white font-bold text-sm">Personalization & Email</span>
              </div>
              <ArrowRight size={16} className="text-gray-600 group-hover:text-yellow-500 transition-colors" />
            </Link>
            <Link to="/smart-news/playbook/chapter-2" className="group flex items-center justify-between p-4 bg-black border border-gray-800 rounded-xl hover:border-yellow-500 transition-colors">
              <div>
                <span className="text-yellow-500 font-black text-xs uppercase tracking-widest block mb-1">Chapter 2</span>
                <span className="text-white font-bold text-sm">WhatsApp & Content E-E-A-T</span>
              </div>
              <ArrowRight size={16} className="text-gray-600 group-hover:text-yellow-500 transition-colors" />
            </Link>
            <Link to="/smart-news/playbook/chapter-3" className="group flex items-center justify-between p-4 bg-black border border-gray-800 rounded-xl hover:border-yellow-500 transition-colors">
              <div>
                <span className="text-yellow-500 font-black text-xs uppercase tracking-widest block mb-1">Chapter 3</span>
                <span className="text-white font-bold text-sm">Live Chat & Direct Bookings</span>
              </div>
              <ArrowRight size={16} className="text-gray-600 group-hover:text-yellow-500 transition-colors" />
            </Link>
            <Link to="/smart-news/playbook/chapter-4" className="group flex items-center justify-between p-4 bg-black border border-gray-800 rounded-xl hover:border-yellow-500 transition-colors">
              <div>
                <span className="text-yellow-500 font-black text-xs uppercase tracking-widest block mb-1">Chapter 4</span>
                <span className="text-white font-bold text-sm">Lead Magnets, Ethics & Synthesis</span>
              </div>
              <ArrowRight size={16} className="text-gray-600 group-hover:text-yellow-500 transition-colors" />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};
