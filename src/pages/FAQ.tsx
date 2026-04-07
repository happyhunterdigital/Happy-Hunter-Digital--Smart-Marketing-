import React, { useState } from 'react';
import { Sparkles, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
  { q: "What is the difference between standard SEO and GEO?", a: "SEO optimizes for ranking links. Generative Engine Optimization (GEO) is the practice of structuring content so AI models (ChatGPT, Gemini) synthesize and cite your brand as the definitive answer." },
  { q: "What is Vibe-Coding?", a: "Vibe-Coding is our proprietary method of translating your brand's core identity, voice, and target market into a fully operational, autonomous AI marketing engine." },
  { q: "Why is my traffic dropping despite high SEO rankings?", a: "You are in the 'Zero-Click' crisis. 40% of B2B queries are now answered within the AI interface. We shift your strategy from chasing clicks to securing your 'Share of Model'." },
  { q: "How do you solve the 'Ghost Effect'?", a: "By establishing a Trust Anchor. We unify your fragmented digital data points and deploy strict JSON-LD schema so AI agents can resolve your identity with 100% confidence." },
  { q: "What is an AI Receptionist?", a: "A 24/7 automated agent deployed via WhatsApp or web that qualifies leads, answers complex FAQs based on your proprietary data, and books appointments autonomously." },
  { q: "Do you provide legal, medical, or financial services?", a: "No. We are a Digital Entity Architecture Firm. We build the websites, automated WhatsApp bots, and AI search strategies that help legal, medical, and financial professionals get found and booked by more clients." }
];

const FAQSchema = () => (
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": FAQS.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    })}
  </script>
);

export const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = FAQS.filter(faq => 
    faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-6 py-20 animate-fade-in min-h-[85vh]">
      <FAQSchema />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 text-white">Zero-Click <span className="text-yellow-500 italic">Insights</span></h1>
        
        <div className="relative mb-12">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-yellow-500" size={20} />
          </div>
          <input
            type="text"
            placeholder="Ask the AI Knowledge Base..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-gray-800 text-white pl-12 pr-6 py-5 rounded-2xl focus:border-yellow-500 focus:shadow-neural-glow outline-none font-mono transition-all text-sm"
          />
        </div>

        <div className="space-y-6">
          {filteredFaqs.length > 0 ? filteredFaqs.map((faq, i) => (
            <div key={i} className="bg-black border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-yellow-500/30 transition-all">
              <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-start gap-3 mb-4">
                <Sparkles className="text-yellow-500 shrink-0 mt-1" size={16} />
                <h3 className="font-bold text-lg text-white">{faq.q}</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed pl-7 border-l-2 border-gray-800 ml-2">{faq.a}</p>
            </div>
          )) : (
            <div className="text-center py-10 text-gray-500 font-mono">No relevant insights found in the current vector database.</div>
          )}
        </div>

        <div className="mt-20 p-10 bg-black border border-yellow-500/30 rounded-[2rem] text-center shadow-neural-glow">
          <Sparkles className="mx-auto text-yellow-500 mb-6" size={40} />
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Require customized architecture?</h2>
          <p className="text-gray-400 mb-8 text-sm max-w-md mx-auto leading-relaxed">Deploy our Smart Marketing Engine to analyze your specific BUSINESS footprint.</p>
          <Link to="/audit" className="bg-yellow-500 text-black px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all text-xs inline-block">Initialize Smart Business Scan</Link>
        </div>
      </div>
    </div>
  );
};
