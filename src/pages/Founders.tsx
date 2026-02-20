import React from 'react';
import { Linkedin, Mail, Code2, Database, Network } from 'lucide-react';

export const Founders = () => (
  <div className="container mx-auto px-6 py-20 min-h-[85vh] flex items-center animate-fade-in">
    <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-16 items-center">
      
      <div className="md:col-span-7 space-y-8">
        <div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-2 leading-[0.9]">
            Thabo Leslie <br/><span className="text-yellow-500">Motsumi</span>
          </h1>
          <p className="text-gray-500 uppercase tracking-widest font-bold text-xs mt-4">Principal Strategist & Entity Architect</p>
        </div>

        <div className="space-y-6 text-gray-300 leading-relaxed text-lg border-l-2 border-gray-800 pl-6">
          <p>
            The digital landscape of 2026 is hostile to "unverified" entities. 
            I founded Happy Hunter Systems because I observed a systemic failure in how traditional agencies service modern businesses: they focus on <em>activity</em> rather than <em>architecture</em>.
          </p>
          <p>
            We do not engage in superficial lead generation. My operational mandate is to execute focused, dedicated sprints that systematize your intellectual property into highly scalable, AI-ready digital assets.
          </p>
          <p className="text-white font-medium italic">
            "We align incentives and share operational risk. If your digital footprint isn't mathematically sound and strictly formatted for LLM ingestion, you are handing market share directly to your competitors."
          </p>
        </div>

        <div className="flex flex-wrap gap-4 pt-4">
          <a href="https://www.linkedin.com/in/thabomotsumi" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-[#0a0a0a] border border-gray-800 rounded-xl hover:text-yellow-500 hover:border-yellow-500 transition-all font-bold text-sm uppercase tracking-wider">
            <Linkedin size={18} /> Network Link
          </a>
          <a href="mailto:hello@happyhunterdigital.com" className="flex items-center gap-2 px-6 py-3 bg-[#0a0a0a] border border-gray-800 rounded-xl hover:text-yellow-500 hover:border-yellow-500 transition-all font-bold text-sm uppercase tracking-wider">
            <Mail size={18} /> Direct Comms
          </a>
        </div>
      </div>

      <div className="md:col-span-5 relative">
        <div className="aspect-[3/4] bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden relative shadow-2xl z-10 flex flex-col justify-end p-8">
             {/* Replace with real image: Add <img src="..." className="absolute inset-0 w-full h-full object-cover opacity-50" /> here */}
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-0"></div>
             
             <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Database size={16} className="text-yellow-500"/> Data Synthesis
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Code2 size={16} className="text-yellow-500"/> Schema Architecture
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Network size={16} className="text-yellow-500"/> Entity Resolution
                </div>
             </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-yellow-500/5 blur-[120px] rounded-full z-0 pointer-events-none"></div>
      </div>

    </div>
  </div>
);
