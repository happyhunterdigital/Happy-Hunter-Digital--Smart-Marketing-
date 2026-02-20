import React from 'react';
import { Target, Globe, Server, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

const SERVICES = [
  {
    title: "Generative Engine Optimization (GEO)",
    quickAnswer: "We engineer inbound search pipelines that systematically lower your Customer Acquisition Cost (CAC) by making your brand the primary cited source in AI models.",
    methodology: [
      "Source Citation Integration & Footnoting",
      "Statistical Injection & Benchmarking",
      "Expert Quotation Formatting"
    ],
    evidence: "Princeton University research indicates a +40% improvement in AI impression scores when rigorous GEO frameworks are deployed.",
    icon: <Globe size={40}/>
  },
  {
    title: "Answer Engine Optimization (AEO)",
    quickAnswer: "We map your content directly to the conversational funnel, focusing on Middle-of-Funnel (MOFU) and Bottom-of-Funnel (BOFU) assets that AI engines rely on for synthesis.",
    methodology: [
      "Natural Language Q&A Architecture",
      "FAQPage & HowTo Schema.org deployment",
      "Semantic Entity Linking"
    ],
    evidence: "Secures your Share of Model (SoM) and directly addresses the 60% of B2B searches that now end in 'zero-click' outcomes.",
    icon: <Target size={40}/>
  },
  {
    title: "Automated AARRR Pipeline Infrastructure",
    quickAnswer: "We construct digital retention loops and qualification architectures that drive Net Revenue Retention (NRR) well above B2B SaaS industry benchmarks.",
    methodology: [
      "LLM-powered Chatbot Integration",
      "Lead-to-MQL Qualification Scoring",
      "Cross-channel data alignment"
    ],
    evidence: "Drastically shortens your overall CAC payback period to under three months by eliminating manual founder-led sales bottlenecks.",
    icon: <Server size={40}/>
  }
];

export const CoreServices = () => (
  <div className="container mx-auto px-6 py-20 animate-fade-in">
    <div className="text-center max-w-4xl mx-auto mb-20">
      <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-white">
        Architectural <span className="text-yellow-500">Alignment</span>
      </h1>
      <p className="text-gray-400 text-lg leading-relaxed">
        We execute complex structural optimization to ensure AI engines accurately parse, trust, and cite your corporate language.
      </p>
    </div>

    <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {SERVICES.map((s, i) => (
        <div key={i} className="p-8 bg-[#0a0a0a] border border-gray-800/60 rounded-3xl hover:border-yellow-500/40 transition-all group flex flex-col h-full">
          <div className="text-yellow-500 mb-6 bg-yellow-500/10 w-fit p-4 rounded-2xl group-hover:scale-110 transition-transform">
            {s.icon}
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 leading-tight">{s.title}</h2>
          
          <div className="space-y-6 flex-grow">
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-2 block">Executive Summary</span>
              <p className="text-gray-300 text-sm leading-relaxed">{s.quickAnswer}</p>
            </div>
            
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-2 block">Deployment Methodology</span>
              <ul className="space-y-2">
                {s.methodology.map((method, idx) => (
                  <li key={idx} className="text-gray-400 text-sm flex items-start gap-2">
                    <Code size={14} className="text-yellow-500 shrink-0 mt-0.5" /> {method}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-gray-900 rounded-xl border border-gray-800 mt-auto">
              <span className="text-[10px] uppercase font-black tracking-widest text-yellow-500 mb-1 block">Performance Data</span>
              <p className="text-gray-400 text-xs italic">{s.evidence}</p>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-20 text-center">
      <Link to="/audit" className="inline-block bg-yellow-500 text-black px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-colors shadow-xl">
        Initiate System Analysis
      </Link>
    </div>
  </div>
);
