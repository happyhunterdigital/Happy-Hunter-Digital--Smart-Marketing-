import React, { useState } from 'react';
import { Plus, Minus, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    q: "What is the difference between standard SEO and Generative Engine Optimization (GEO)?",
    a: "SEO optimizes content for ranking hyperlinks against search engine algorithms. GEO is the systematic practice of structuring digital content so that generative AI models (ChatGPT, Gemini) accurately extract, synthesize, and cite your brand as the definitive answer."
  },
  {
    q: "Why is my current website traffic dropping despite maintaining SEO efforts?",
    a: "You are experiencing the 'Zero-Click Crisis'. Approximately 40% of B2B searches now end within the AI interface because the engine answers the user directly. We shift your strategy from 'Click-Chasing' to securing 'Share of Voice' within the AI response itself."
  },
  {
    q: "How do you make our content 'citable' for Large Language Models?",
    a: "We utilize RAG-Ready (Retrieval-Augmented Generation) formatting. We restructure your business data into semantic clusters and deploy strict JSON-LD Schema.org markup. This ensures AI models can parse your data deterministically, eliminating algorithmic ambiguity."
  },
  {
    q: "What is the 'Ghost Effect' and how does it impact B2B SaaS?",
    a: "The Ghost Effect occurs when a business has high physical competence but fragmented digital data. If your citations, NAP data, and service pages lack consistency, AI models classify your entity as unreliable and refuse to recommend you to decision-makers."
  },
  {
    q: "How does your system reduce our overall Customer Acquisition Cost (CAC)?",
    a: "By shifting reliance away from volatile paid advertising to organic, LLM-driven visibility. Our automated qualification pipelines immediately filter zero-intent traffic, effectively doubling your Lead-to-MQL conversion rate and shortening your CAC payback period."
  }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="container mx-auto px-6 py-20 animate-fade-in min-h-[85vh]">
      <div className="max-w-3xl mx-auto">
        <div className="mb-16">
          <span className="text-yellow-500 font-black uppercase tracking-widest text-[10px] mb-4 block">Knowledge Graph Initialization</span>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-6 text-white leading-none">
            System <span className="text-yellow-500">Intelligence</span>
          </h1>
          <p className="text-gray-400 text-lg">Direct, factual, and scientifically precise answers regarding our operational deployment methodologies.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div 
              key={i} 
              className={`border border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === i ? 'bg-[#0a0a0a] border-yellow-500/30' : 'bg-black hover:border-gray-600'}`}
            >
              <button 
                className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-bold text-base md:text-lg text-white pr-8">{faq.q}</span>
                {openIndex === i ? <Minus className="text-yellow-500 shrink-0" size={20} /> : <Plus className="text-gray-500 shrink-0" size={20} />}
              </button>
              
              <div className={`px-6 overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base border-l-2 border-yellow-500 pl-4">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl text-center shadow-xl">
          <Cpu className="mx-auto text-yellow-500 mb-4" size={32} />
          <h2 className="text-xl font-bold text-white mb-2">Require further diagnostic data?</h2>
          <p className="text-gray-400 mb-6 text-sm">Deploy our Gemini 3 Engine to analyze your specific domain architecture.</p>
          <Link to="/audit" className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-colors inline-block text-xs">
            Initialize Entity Scan
          </Link>
        </div>
      </div>
    </div>
  );
};
