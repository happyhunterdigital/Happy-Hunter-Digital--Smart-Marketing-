import React from 'react';
import { ArrowUpRight, CheckCircle2, Globe } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';

const CASE_STUDIES = [
  {
    client: "Skubalisto",
    logo: "https://res.cloudinary.com/dka0498ns/image/upload/v1770623694/IMG-20260209-WA0025_zgpgf7.jpg",
    website: "https://skubalisto.com",
    industry: "Art & Muralism",
    vulnerability: "Global physical fame but a 'Ghost' online. Technical blocks prevented Knowledge Graph generation.",
    protocol: "Entity Resolution. Injected Person & LocalBusiness schema to align physical murals with digital data.",
    outcome: "Dominant AI search ranking for 'South African Muralists'. Reached 4.5+ target rating via verified signal updates.",
    metrics: ["AI Training on Narrative", "Local SEO Verified"]
  },
  {
    client: "Integrated Wellth Solutions",
    logo: "https://res.cloudinary.com/dka0498ns/image/upload/v1765747667/Integrated_Wellth_Solutions_Logo_bodmyc1_iiervl.png",
    website: "https://www.integratedwellth.co.za",
    industry: "Financial Intelligence",
    vulnerability: "High traffic resulting in zero sales due to generic, ambiguous template-based positioning.",
    protocol: "Rebranded as a 'Financial Intelligence Unit'. Deployed automated inbound triage for high-LTV qualification.",
    outcome: "300% increase in qualified inquiries. AI acts as a 24/7 receptionist, ensuring the founder only speaks to pre-convinced leads.",
    metrics: ["Lead Filtering Triage", "Agentic Revenue System"]
  },
  {
    client: "Khongoloti Academy",
    logo: "https://res.cloudinary.com/dka0498ns/image/upload/v1762927791/logo_Khongoloti_1_e4k887.png",
    website: "https://khongoloti.co.za",
    industry: "B2B Education",
    vulnerability: "Fragmented messaging causing high-friction user journeys from inquiry to certification.",
    protocol: "Implemented AEO-First approach. Restructured digital assets to create a 'Business Success Loop'.",
    outcome: "Dominant visibility for 'SETA Training Giyani'. Automated inbound pipeline drastically improved student acquisition velocity.",
    metrics: ["AEO FAQ Schema", "Automated Pipeline"]
  }
];

export const EarnedMedia = () => (
  <div className="container mx-auto px-6 py-20 animate-fade-in">
    <PageMeta
      title="Client Results | Happy Hunter Digital"
      description="Real results for real South African businesses — websites, chatbots, and WhatsApp sales that got clients found online and got them more customers."
      path="/earned-media"
    />
    <div className="max-w-4xl mx-auto mb-16 text-center">
      <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-white leading-none">
        Verified <span className="text-yellow-500 italic">Success</span>
      </h1>
      <p className="text-gray-400 text-lg md:text-xl leading-relaxed">The proof of the protocol. Verifiable data on how we transform invisible entities into market authorities.</p>
    </div>
    <div className="grid gap-12 max-w-5xl mx-auto">
      {CASE_STUDIES.map((study, i) => (
        <div key={i} className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 md:p-12 hover:border-yellow-500/30 transition-all group">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-white/5 pb-8">
            <div className="flex items-center gap-6">
              <img src={study.logo} alt={study.client} className="h-16 w-auto object-contain grayscale group-hover:grayscale-0 transition-all rounded-lg bg-white/5 p-2" />
              <div>
                <h2 className="text-3xl font-black text-white">{study.client}</h2>
                <p className="text-yellow-500 font-bold uppercase tracking-widest text-[10px] mt-1">{study.industry}</p>
              </div>
            </div>
            <a href={study.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-yellow-500 transition-colors">
              Visit Site <ArrowUpRight size={14}/>
            </a>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <p className="text-sm leading-relaxed text-gray-400"><span className="text-red-500 font-black uppercase text-[10px] block mb-2 tracking-widest">Vulnerability</span> {study.vulnerability}</p>
            <p className="text-sm leading-relaxed text-gray-400"><span className="text-yellow-500 font-black uppercase text-[10px] block mb-2 tracking-widest">Protocol</span> {study.protocol}</p>
          </div>
          <div className="mt-10 p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl">
            <p className="text-white font-medium text-lg italic mb-4">"{study.outcome}"</p>
            <div className="flex flex-wrap gap-3">
              {study.metrics.map((m, idx) => (
                <span key={idx} className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400 bg-black px-3 py-1.5 rounded-lg border border-white/5">
                  <CheckCircle2 size={12} className="text-yellow-500"/> {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
