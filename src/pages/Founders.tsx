import React from 'react';
import { Linkedin, Mail, Code2, Database, Network, Target, CheckCircle2 } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';

const ICP_ITEMS = [
  "South African businesses with R1M-R50M revenue",
  "Service-based businesses (legal, medical, financial, trades)",
  "Businesses with physical locations needing local visibility",
  "Companies frustrated with agencies that deliver activity, not results",
  "Businesses ready to invest in AI-era digital infrastructure",
];

export const Founders = () => (
  <div className="container mx-auto px-6 py-20 min-h-[85vh] animate-fade-in">
    <PageMeta
      title="About Thabo Motsumi | Happy Hunter Digital"
      description="Meet Thabo Leslie Motsumi, founder of Happy Hunter Digital. A digital marketing strategist helping South African businesses get found by AI, Google, and new customers."
      path="/founders"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Thabo Leslie Motsumi",
        "jobTitle": "Principal Strategist & Entity Architect",
        "worksFor": { "@type": "Organization", "name": "Happy Hunter Digital" },
        "url": "https://www.happyhunterdigital.com/founders",
        "sameAs": [
          "https://www.linkedin.com/in/thabomotsumi",
          "https://x.com/HappyHunter35"
        ]
      }}
    />
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-12 gap-16 items-start">
        
        <div className="md:col-span-7 space-y-8">
          <div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-2 leading-[0.9]">
              Thabo Leslie <br/><span className="text-yellow-500">Motsumi</span>
            </h1>
            <p className="text-gray-500 uppercase tracking-widest font-bold text-xs mt-4">Principal Strategist & Entity Architect</p>
          </div>

          <div className="space-y-6 text-gray-300 leading-relaxed text-lg border-l-2 border-gray-800 pl-6">
            <p>
              I founded <span className="font-handwriting text-2xl lowercase text-white">happyhunterdigital</span> because traditional digital agencies in South Africa were failing their clients. They focused on <em>activity</em> — posts, emails, "SEO" — rather than <em>architecture</em>.
            </p>
            <p>
              In 2026, the game changed. ChatGPT, Gemini, and Google AI Overviews don't care about your Instagram posts. They care about your data structure, your entity verification, and whether your business information is formatted for machine consumption. That's what we build.
            </p>
            <p>
              We execute focused sprints that systematize your intellectual property into highly scalable, AI-ready digital assets. We align incentives and share operational risk — if your digital footprint isn't mathematically sound and strictly formatted for LLM ingestion, you are handing market share directly to your competitors.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <a href="https://www.linkedin.com/in/thabomotsumi" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-[#0a0a0a] border border-gray-800 rounded-xl hover:text-yellow-500 hover:border-yellow-500 transition-all font-bold text-sm uppercase tracking-wider">
              <Linkedin size={18} /> LinkedIn
            </a>
            <a href="mailto:hello@happyhunterdigital.com" className="flex items-center gap-2 px-6 py-3 bg-[#0a0a0a] border border-gray-800 rounded-xl hover:text-yellow-500 hover:border-yellow-500 transition-all font-bold text-sm uppercase tracking-wider">
              <Mail size={18} /> Email
            </a>
          </div>
        </div>

        <div className="md:col-span-5 space-y-8">
          <div className="aspect-[3/4] bg-gray-900 border border-gray-800 rounded-[2rem] overflow-hidden relative shadow-2xl">
            <img 
              src="https://res.cloudinary.com/dka0498ns/image/upload/v1766069617/Thabo_Leslie_Motsumi._AI_Google_my_Business_profile_optimization_Search_Everywhere_Optimation_SEO_Automation_and_Smart_digital_marketing._vncyse.png"
              alt="Thabo Leslie Motsumi - Founder of Happy Hunter Digital"
              className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 right-0 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-l border-gray-800 p-5 rounded-tl-3xl text-right">
              <p className="font-black uppercase tracking-widest text-yellow-500 text-lg leading-none">Thabo Leslie Motsumi</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">Principal Strategist</p>
            </div>
            <div className="absolute top-6 left-6 space-y-3 opacity-70">
              <div className="flex items-center gap-2 text-white bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-bold uppercase tracking-widest">
                <Database size={12} className="text-yellow-500"/> Data Synthesis
              </div>
              <div className="flex items-center gap-2 text-white bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-bold uppercase tracking-widest">
                <Code2 size={12} className="text-yellow-500"/> Schema Arch
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ICP Section */}
      <div className="mt-24 max-w-4xl mx-auto">
        <div className="bg-white/[0.02] border border-amber-500/20 rounded-3xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <Target className="text-amber-500" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Ideal Client Profile</h2>
              <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Who we work best with</p>
            </div>
          </div>
          <ul className="space-y-3">
            {ICP_ITEMS.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);
