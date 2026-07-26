import React from 'react';
import { Linkedin, Mail, Code2, Database, Network } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';

export const Founders = () => (
  <div className="container mx-auto px-6 py-20 min-h-[85vh] flex items-center animate-fade-in">
    <PageMeta
      title="About Thabo Motsumi | Happy Hunter Digital"
      description="Meet the person behind Happy Hunter Digital. Thabo Leslie Motsumi helps South African small businesses get found online — websites, chatbots, and WhatsApp sales, no jargon."
      path="/founders"
    />
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
            I founded <span className="font-handwriting text-2xl lowercase text-white">happyhunterdigital</span> because I observed a systemic failure in how traditional agencies service modern businesses: they focus on <em>activity</em> rather than <em>architecture</em>.
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
        {/* IMAGE CONTAINER */}
        <div className="aspect-[3/4] bg-gray-900 border border-gray-800 rounded-[2rem] overflow-hidden relative shadow-2xl z-10">
             
             {/* Actual Founder Image */}
             <img 
               src="https://res.cloudinary.com/dka0498ns/image/upload/v1766069617/Thabo_Leslie_Motsumi._AI_Google_my_Business_profile_optimization_Search_Everywhere_Optimation_SEO_Automation_and_Smart_digital_marketing._vncyse.png"
               alt="Thabo Leslie Motsumi"
               className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
             />
             
             {/* Gradient overlay for text readability */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
             
             {/* BOTTOM RIGHT NAME PLATE (Touching Borders) */}
             <div className="absolute bottom-0 right-0 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-l border-gray-800 p-5 rounded-tl-3xl text-right">
               <p className="font-black uppercase tracking-widest text-yellow-500 text-lg leading-none">Thabo Leslie Motsumi</p>
               <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">Principal Strategist</p>
             </div>

             {/* Tech floating icons (Top left) */}
             <div className="absolute top-6 left-6 space-y-3 opacity-70">
                <div className="flex items-center gap-2 text-white bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-bold uppercase tracking-widest">
                  <Database size={12} className="text-yellow-500"/> Data Synthesis
                </div>
                <div className="flex items-center gap-2 text-white bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-bold uppercase tracking-widest">
                  <Code2 size={12} className="text-yellow-500"/> Schema Arch
                </div>
             </div>
        </div>
        
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-yellow-500/10 blur-[100px] rounded-full z-0 pointer-events-none"></div>
      </div>

    </div>
  </div>
);
