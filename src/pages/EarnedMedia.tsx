import React from 'react';
import { ArrowRight, TrendingUp, CheckCircle2 } from 'lucide-react';

const CASE_STUDIES = [
  {
    client: "Skubalisto",
    industry: "Art & Muralism",
    vulnerability: "High offline visibility but entirely subjected to the 'Ghost Effect' online. Technical architecture prevented Google Knowledge Graph generation.",
    protocol: "Entity Resolution. Fixed broken shop links, unblocked search bots, and injected explicit Person and LocalBusiness schema markup.",
    outcome: "Transformed a static portfolio into a commercially viable engine. Reached 4.5+ target rating via 100+ geo-tagged authoritative signals.",
    metrics: ["AI Training on Artist Narrative", "Local SEO Verification Active"]
  },
  {
    client: "Integrated Wellth Solutions",
    industry: "Financial Intelligence",
    vulnerability: "High TOFU (Top-of-Funnel) traffic (14,000 views) resulting in zero MQLs due to generic, ambiguous positioning.",
    protocol: "Rebranded as a 'Financial Intelligence Unit'. Deployed a RAG-ready FAQ architecture and automated inbound triage system.",
    outcome: "Created a category-of-one identity. AI acts as a 24/7 receptionist, qualifying high-LTV prospects before the first human handshake.",
    metrics: ["Lead Filtering Triage Active", "High-Speed Infrastructure Deployed"]
  },
  {
    client: "Khongoloti Training Academy",
    industry: "B2B Education",
    vulnerability: "Fragmented messaging causing high-friction user journeys from initial inquiry to final certification.",
    protocol: "Implemented an AEO-First approach. Restructured digital assets to create a 'Business Success Loop' with cross-channel data alignment.",
    outcome: "Dominant Share of Voice for 'SETA Training Giyani'. Automated inbound pipeline lowered CAC and drastically improved Activation metrics.",
    metrics: ["AEO FAQ Schema Active", "Automated Inbound Pipeline"]
  }
];

export const EarnedMedia = () => (
  <div className="container mx-auto px-6 py-20 animate-fade-in">
    <div className="max-w-4xl mx-auto mb-16 text-center">
      <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-white">
        Verified <span className="text-yellow-500">Outcomes</span>
      </h1>
      <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
        Initial performance validation and beta stage testing for ambitious brands. We measure success by increased Net Revenue Retention, not vanity metrics.
      </p>
    </div>

    <div className="grid gap-10 max-w-5xl mx-auto">
      {CASE_STUDIES.map((study, i) => (
        <div key={i} className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 md:p-12 hover:border-yellow-500/30 transition-all">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4 border-b border-gray-800/50 pb-6">
            <div>
              <h2 className="text-3xl font-black text-white">{study.client}</h2>
              <p className="text-yellow-500 font-bold uppercase tracking-widest text-[10px] mt-2 bg-yellow-500/10 inline-block px-3 py-1 rounded-md">{study.industry}</p>
            </div>
            <TrendingUp className="text-gray-700 hidden md:block" size={40} />
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 mb-8">
            <div>
              <h3 className="text-gray-500 uppercase text-[10px] font-black mb-3 tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Vulnerability
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm">{study.vulnerability}</p>
            </div>
            <div>
              <h3 className="text-gray-500 uppercase text-[10px] font-black mb-3 tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Execution Protocol
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm">{study.protocol}</p>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
            <h3 className="text-yellow-500 uppercase text-[10px] font-black mb-3 tracking-widest">Measurable ROI</h3>
            <p className="text-white text-base font-medium mb-4">{study.outcome}</p>
            <div className="flex flex-wrap gap-3">
              {study.metrics.map((metric, idx) => (
                <span key={idx} className="flex items-center gap-1.5 text-xs text-gray-400 bg-black px-3 py-1.5 rounded-lg border border-gray-800">
                  <CheckCircle2 size={12} className="text-green-500" /> {metric}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
