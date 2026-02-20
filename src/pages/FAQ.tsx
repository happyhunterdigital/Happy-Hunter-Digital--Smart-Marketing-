import { HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: "Why is my business a 'Ghost' to AI?",
    a: "Fragmented data. If your GMB, website, and citations don't match 100%, AI models view you as unverified and unsafe to recommend."
  },
  {
    q: "What is Entity Management?",
    a: "It is the strategic alignment of your digital data points so that search engines treat your business as a factual 'Entity' rather than just a collection of keywords."
  },
  {
    q: "Will this fix my Google Maps ranking?",
    a: "Immediately. Our protocol applies the 'Mirror Rule' which is the #1 signal for local map pack dominance."
  }
];

export const FAQ = () => (
  <div className="container mx-auto px-6 py-20">
    <div className="max-w-3xl">
      <h2 className="text-5xl font-black uppercase tracking-tighter mb-16">
        Strategic <span className="text-brand-yellow">Knowledge</span>
      </h2>
      <div className="space-y-8">
        {FAQS.map((item, i) => (
          <div key={i} className="border-b border-white/5 pb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <HelpCircle size={20} className="text-brand-yellow"/> {item.q}
            </h3>
            <p className="text-gray-400 leading-relaxed pl-8">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
