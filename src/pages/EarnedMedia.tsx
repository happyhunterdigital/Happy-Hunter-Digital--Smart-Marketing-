import React from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';

const CASE_STUDIES = [
  {
    client: "Skubalisto",
    industry: "Art & Muralism",
    problem: "A world-class artist with massive physical fame, but completely invisible on Google when people searched for 'South African Muralists'.",
    solution: "We restructured his website data, claimed his knowledge panels, and trained AI models on his portfolio.",
    result: "Dominant page-one visibility and direct AI recommendations for high-ticket art commissions."
  },
  {
    client: "Integrated Wellth Solutions",
    industry: "Financial Services",
    problem: "Getting lots of website traffic, but zero booked appointments. Visitors didn't trust a generic-looking site.",
    solution: "Rebranded them as a 'Financial Intelligence Unit' and installed an automated lead-qualification system.",
    result: "300% increase in high-quality inbound leads, saving the founder hours of manual screening."
  },
  {
    client: "Profuse Beauty",
    industry: "Cosmetics & Beauty",
    problem: "Struggling to stand out in a highly saturated local beauty market in Pretoria.",
    solution: "Hyper-localized Google Business optimization and automated review collection.",
    result: "Became the #1 locally recommended brand for 'Sensitive Skin Makeup' in their service radius."
  }
];

export const EarnedMedia = () => (
  <div className="container mx-auto px-6 py-20 animate-fade-in">
    <div className="max-w-4xl mx-auto mb-16 text-center">
      <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-white">
        Client <span className="text-yellow-500">Success</span>
      </h2>
      <p className="text-gray-400 text-lg md:text-xl">
        Real results for ambitious South African businesses. See how we turn digital friction into seamless growth.
      </p>
    </div>

    <div className="grid gap-10 max-w-5xl mx-auto">
      {CASE_STUDIES.map((study, i) => (
        <div key={i} className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 md:p-12 hover:border-yellow-500/30 transition-all">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
            <div>
              <h3 className="text-3xl font-black text-white">{study.client}</h3>
              <p className="text-yellow-500 font-bold uppercase tracking-widest text-xs mt-2">{study.industry}</p>
            </div>
            <TrendingUp className="text-gray-700 hidden md:block" size={48} />
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-gray-500 uppercase text-xs font-bold mb-2 tracking-widest">The Challenge</h4>
              <p className="text-gray-300 leading-relaxed">{study.problem}</p>
            </div>
            <div>
              <h4 className="text-gray-500 uppercase text-xs font-bold mb-2 tracking-widest">Our Solution</h4>
              <p className="text-gray-300 leading-relaxed">{study.solution}</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800">
            <h4 className="text-yellow-500 uppercase text-xs font-bold mb-2 tracking-widest">The Result</h4>
            <p className="text-white text-lg font-medium">{study.result}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
