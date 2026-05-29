// src/pages/ArticleLocalSearch.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Target, ShieldCheck, Video, Flame, Sparkles } from 'lucide-react';

export const ArticleLocalSearch = () => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const metrics = [
    {
      static: "Local Citations / Directories",
      dynamic: "Social Signal Velocity",
      impact: "Verifies active consumer engagement and real-world relevance."
    },
    {
      static: "Keyword-Optimized Text",
      dynamic: "Entity Alignment (DNA Match)",
      impact: "Ensures the website schema matches hidden GBP secondary categories."
    },
    {
      static: "Studio-Branded Media",
      dynamic: "Owner-Shot Job Site Video",
      impact: "Confirms geospatial presence and operational authenticity."
    },
    {
      static: "Total Review Count",
      dynamic: "Review Velocity & Semantics",
      impact: "Measures how frequently fresh, keyword-rich testimonials are published."
    }
  ];

  return (
    <div className="bg-[#0a0a0f] min-h-screen pb-20 animate-fade-in pt-32">
      <header className="relative pb-16 border-b border-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.08)_0%,transparent_50%)]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center">
          <Link to="/smart-news" className="inline-flex text-gray-400 hover:text-amber-400 items-center gap-2 mb-10 uppercase text-[10px] font-black tracking-[0.2em] transition-colors">
            <ArrowLeft size={16}/> Back to Smart News
          </Link>
          
          <div className="flex justify-center mb-6">
            <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-full inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">2026 Core Intelligence</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter text-white leading-none text-balance">
            The Evolution of Local Search: <span className="gradient-text">Entity Alignment</span> & Authentic Video
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-3xl mx-auto">
            Local search is governed by dynamic Entity Authority, not static keywords. Discover why raw, owner-shot video has become the ultimate proof of life.
          </p>
        </div>
      </header>

      <article className="container mx-auto px-6 max-w-3xl py-16 text-gray-300 text-lg leading-relaxed space-y-8">
        <p className="text-xl font-light text-gray-400 italic border-l-2 border-amber-500 pl-4">
          Executive Summary: Google's algorithm has evolved from a simple text-matching engine into a forensic verification system designed to map real-world activity.
        </p>

        <p>
          Traditional Local SEO was a static checklist. A clean website, basic local directory citations, and a handful of reviews were once enough to secure a top-three Map Pack ranking. Today, that static formula is obsolete. If a business maintains an immaculate website but shows zero real-world activity across the web, the algorithm flags it as a Ghost Entity.
        </p>

        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mt-12 mb-6">
          How Dynamic Signals Outperform Traditional SEO
        </h2>
        <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">
          Interactive Comparison Matrix (Hover to Analyze Algorithmic Impact)
        </p>

        <div className="overflow-x-auto border border-white/5 rounded-2xl bg-white/[0.01] shadow-2xl">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-amber-500 font-bold uppercase tracking-widest text-[10px]">
                <th className="p-4">Static SEO Metric</th>
                <th className="p-4">2026 GEO Ranking Metric</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {metrics.map((m, idx) => (
                <tr 
                  key={idx} 
                  className="transition-colors duration-300 cursor-help"
                  onMouseEnter={() => setHoveredRow(idx)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="p-4 font-mono text-gray-500 strike-through line-through">{m.static}</td>
                  <td className="p-4 font-bold text-white relative">
                    {m.dynamic}
                    {hoveredRow === idx && (
                      <div className="absolute left-0 right-0 top-full mt-1 z-20 p-4 rounded-xl bg-deep-900 border border-amber-500/20 shadow-glow text-xs text-gray-300 leading-relaxed animate-fade-in">
                        <span className="font-bold text-amber-400 block mb-1">Algorithmic Impact:</span>
                        {m.impact}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mt-16 mb-6">
          Why Owner-Shot Video is the Ultimate Ranking Signal
        </h2>
        <p>
          The single most disruptive variable in local search performance is raw, unedited video captured directly by the business owner. High-budget, polished commercial clips do not move the needle. Instead, the algorithm rewards a 30-second clip of an owner standing on a job site talking directly to the camera about a specific problem they just solved.
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-10">
          <div className="p-6 rounded-2xl bg-[#111827] border border-white/5 hover:border-amber-500/10 transition-colors">
            <Video className="text-amber-500 mb-4" size={28} />
            <h3 className="text-lg font-bold text-white mb-2">Geospatial & Contextual Verification</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              When an owner captures footage on-site, visual context clues allow search engine Vision AIs to cross-reference and confirm that the business is actively operating within its claimed service area.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#111827] border border-white/5 hover:border-amber-500/10 transition-colors">
            <Flame className="text-amber-500 mb-4" size={28} />
            <h3 className="text-lg font-bold text-white mb-2">Overcoming the "Invisibility Tax"</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Many owners spend R30,000 per month on paid search ads to remain anonymous. Business owners who push past this friction point and document their daily expertise organically displace their competitors.
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mt-12 mb-6">
          How Do You Achieve True Entity Alignment?
        </h2>
        <p>
          To ensure your business is accurately indexed and recommended across the 2026 Knowledge Graph, you must execute precise data alignment across all customer-facing assets.
        </p>

        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#111827] to-[#0a0a0f] border border-amber-500/20 shadow-glow my-12 text-center relative overflow-hidden">
          <Sparkles className="text-amber-500 mx-auto mb-4 animate-pulse" size={32} />
          <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Diagnose Your Entity Vulnerabilities</h3>
          <p className="text-sm text-gray-400 max-w-xl mx-auto mb-6">
            Is your business actively recommended by AI search engines, or are you paying a premium to stay visible? Let us run a forensic data scan on your digital footprint.
          </p>
          <Link to="/audit" className="inline-block bg-amber-500 text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-lg">
            Initialize Free Survival Scan
          </Link>
        </div>
      </article>
    </div>
  );
};
