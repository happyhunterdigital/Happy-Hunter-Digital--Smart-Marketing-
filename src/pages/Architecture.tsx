import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Zap, ShieldCheck, Database, Plus, Minus, Cpu } from 'lucide-react';

const ARCHITECTURE_FAQS = [
  {
    category: "Entity Management & The Trust Anchor",
    questions: [
      { q: "What is a 'Digital Passport' in 2026?", a: "Your Digital Passport is the interconnected web of structured data that proves your business exists. It starts with your Google Business Profile but must be explicitly linked via Schema.org to your official website, LinkedIn, and local directories. If this passport is fragmented, AI models will ignore you." },
      { q: "How do you solve the 'Ghost Effect'?", a: "By executing Entity Resolution. We unify your Name, Address, and Phone (NAP) data across the internet and remove conflicting 'data debris' from old directories. This mathematically proves to algorithms like Gemini that you are a singular, safe entity to recommend." },
      { q: "Why is my 15-year-old business ranking below new startups?", a: "Legacy businesses often have a massive trail of outdated information (old addresses, phone numbers from 10 years ago). New startups have a clean slate. AI models penalize inconsistency as a trust risk. We clean your historical data to restore your authority." }
    ]
  },
  {
    category: "Generative Engine Optimization (GEO)",
    questions: [
      { q: "What is the exact difference between SEO and GEO?", a: "Traditional SEO (Search Engine Optimization) focuses on optimizing keywords to rank a hyperlink on a search page. GEO (Generative Engine Optimization) focuses on structuring factual data so that AI models (ChatGPT, Copilot, Gemini) synthesize and cite your brand directly within their conversational answers." },
      { q: "Why did my website traffic drop recently?", a: "You are experiencing the 'Zero-Click Crisis'. Up to 40% of complex B2B searches now end within the AI interface because the AI answers the user directly. We shift your strategy to secure 'Share of Model' rather than chasing traditional clicks." },
      { q: "How do you make my content 'Citable' for AI?", a: "We utilize RAG-Ready (Retrieval-Augmented Generation) formatting. We restructure your website into semantic Q&A blocks under 300 characters, front-loaded with statistical evidence, making it exceptionally easy for AI to extract and cite." }
    ]
  },
  {
    category: "The Revenue Brain & Automation",
    questions: [
      { q: "How does Agentic Lead Automation work?", a: "We replace static contact forms with intelligent, LLM-powered chatbots deployed on your site and WhatsApp. These 'agents' act as 24/7 receptionists, asking predefined questions to calculate a predictive lead score before passing them to your human sales team." },
      { q: "Does the AI sound like a robot to my South African customers?", a: "No. We fine-tune the system prompts to reflect your specific brand tone and train the models to understand local context, ensuring a natural, highly professional engagement that represents your company perfectly." },
      { q: "Is AI lead capture compliant with the POPI Act?", a: "Absolutely. Our 'Handshake Protocol' integrates explicit consent nodes before data collection begins, ensuring all information gathered by the Revenue Brain adheres strictly to POPIA and GDPR standards." }
    ]
  }
];

export const Architecture = () => {
  const [openId, setOpenId] = useState<string | null>(null);
  
  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="bg-[#050505] min-h-screen pb-20 animate-fade-in pt-32">
      
      {/* 1. Header Section */}
      <header className="px-6 max-w-4xl mx-auto text-center mb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
           <Database size={14} /> The Master Protocol
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6">
          The Architecture of <span className="text-yellow-500 italic">Digital Authority</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          The structural evolution of the digital economy toward 2026 is defined by the convergence of identity verification, generative information retrieval, and autonomous agentic action.
        </p>
      </header>

      {/* 2. The Three Pillars Summary */}
      <section className="container mx-auto px-6 max-w-6xl mb-32">
        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-[2.5rem] p-8 md:p-10 flex flex-col h-full relative overflow-hidden group hover:border-yellow-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldCheck size={120} /></div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4 relative z-10">01. The Trust Anchor</h2>
            <p className="text-gray-400 leading-relaxed mb-8 relative z-10 flex-grow">
              In an era of synthetic content, the Trust Anchor is your foundational necessity. We establish the root of certainty through Google Business Profile management, "Mirror Rule" data alignment, and precise Schema.org markup.
            </p>
            <Link to="/blog/synthesis" className="inline-flex items-center gap-2 text-yellow-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors relative z-10">
              Read Technical Synthesis <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-[#0a0a0a] border border-gray-800 rounded-[2.5rem] p-8 md:p-10 flex flex-col h-full relative overflow-hidden group hover:border-yellow-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><BookOpen size={120} /></div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4 relative z-10">02. The AI Megaphone</h2>
            <p className="text-gray-400 leading-relaxed mb-8 relative z-10 flex-grow">
              We shift your strategy from "thinking in keywords" to "thinking in questions." By deploying Answer Engine Optimization (AEO), we format your content specifically for LLM retrieval and zero-click search synthesis.
            </p>
            <Link to="/blog/ai-megaphone" className="inline-flex items-center gap-2 text-yellow-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors relative z-10">
              Read AEO Intelligence <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-[#0a0a0a] border border-gray-800 rounded-[2.5rem] p-8 md:p-10 flex flex-col h-full relative overflow-hidden group hover:border-yellow-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Zap size={120} /></div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4 relative z-10">03. The Revenue Brain</h2>
            <p className="text-gray-400 leading-relaxed mb-8 relative z-10 flex-grow">
              We replace linear, manual sales funnels with dynamic, AI-guided processes. Our agentic systems integrate marketing and pre-sales to qualify leads autonomously, drastically shortening your CAC payback period.
            </p>
            <Link to="/blog/revenue-brain" className="inline-flex items-center gap-2 text-yellow-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors relative z-10">
              Read Automation Protocol <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </section>

      {/* 3. Extensive FAQ Section */}
      <section className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">Deep Diagnostics FAQ</h2>
          <p className="text-gray-400">Exhaustive answers addressing the technical realities of the 2026 digital economy.</p>
        </div>

        <div className="space-y-16">
          {ARCHITECTURE_FAQS.map((section, sIdx) => (
            <div key={sIdx} className="space-y-6">
              
              <div className="border-b border-gray-800 pb-4">
                <h3 className="text-xl md:text-2xl font-black text-yellow-500 uppercase tracking-tight">{section.category}</h3>
              </div>

              <div className="space-y-4">
                {section.questions.map((item, qIdx) => {
                  const id = `${sIdx}-${qIdx}`;
                  const isOpen = openId === id;
                  return (
                    <div 
                      key={id} 
                      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-[#0a0a0a] border-yellow-500/30' : 'bg-black border-gray-800 hover:border-gray-600'}`}
                    >
                      <button 
                        className="w-full px-6 py-6 flex justify-between items-center text-left focus:outline-none"
                        onClick={() => toggle(id)}
                      >
                        <span className="font-bold text-base md:text-lg text-white pr-8">{item.q}</span>
                        {isOpen ? <Minus className="text-yellow-500 shrink-0" size={20} /> : <Plus className="text-gray-500 shrink-0" size={20} />}
                      </button>
                      
                      <div className={`px-6 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-400 leading-relaxed text-sm md:text-base border-l-2 border-yellow-500 pl-4">{item.a}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="mt-24 p-10 bg-gradient-to-br from-gray-900 to-black border border-yellow-500/20 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
          <Cpu className="mx-auto text-yellow-500 mb-6" size={48} />
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Execute The Architecture</h2>
          <p className="text-gray-400 mb-8 text-base max-w-lg mx-auto leading-relaxed">Stop reading and start optimizing. Deploy the Smart Marketing Engine to analyze your specific business footprint right now.</p>
          <Link to="/audit" className="inline-block bg-yellow-500 text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_30px_rgba(234,179,8,0.2)]">
            Initialize Live Scan
          </Link>
        </div>

      </section>
    </div>
  );
};
