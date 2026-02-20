import React, { useState } from 'react';
import { Plus, Minus, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
  { q: "What is the difference between standard SEO and GEO?", a: "SEO optimizes for ranking links. Generative Engine Optimization (GEO) is the practice of structuring content so AI models (ChatGPT, Gemini) synthesize and cite your brand as the definitive answer." },
  { q: "Why is my traffic dropping despite high SEO rankings?", a: "You are in the 'Zero-Click' crisis. 40% of B2B queries are now answered within the AI interface. We shift your strategy from chasing clicks to securing your 'Share of Model'." },
  { q: "How do you solve the 'Ghost Effect'?", a: "By establishing a Trust Anchor. We unify your fragmented digital data points and deploy strict JSON-LD schema so AI agents can resolve your identity with 100% confidence." }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className="container mx-auto px-6 py-20 animate-fade-in min-h-[85vh]">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-12 text-white">System <span className="text-yellow-500 italic">Intelligence</span></h1>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className={`border border-white/5 rounded-2xl overflow-hidden transition-all ${openIndex === i ? 'bg-white/5 border-yellow-500/30' : 'bg-black hover:border-white/20'}`}>
              <button className="w-full px-6 py-6 flex justify-between items-center text-left" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                <span className="font-bold text-base text-white">{faq.q}</span>
                {openIndex === i ? <Minus className="text-yellow-500" size={20} /> : <Plus className="text-gray-500" size={20} />}
              </button>
              <div className={`px-6 overflow-hidden transition-all ${openIndex === i ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-yellow-500 pl-4">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-20 p-10 bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-[2rem] text-center shadow-2xl">
          <Cpu className="mx-auto text-yellow-500 mb-6" size={40} />
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Require further diagnostic data?</h2>
          <p className="text-gray-400 mb-8 text-sm max-w-md mx-auto leading-relaxed">Deploy our Smart Marketing Engine to analyze your specific BUSINESS architecture.</p>
          <Link to="/audit" className="bg-yellow-500 text-black px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all text-xs inline-block">Initialize Smart Business Scan</Link>
        </div>
      </div>
    </div>
  );
};
