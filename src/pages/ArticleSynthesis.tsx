import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ArticleSynthesis = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "What is Entity Resolution in the context of South African Local SEO?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Entity Resolution is the algorithmic process where search engines like Google and AI models like Gemini verify that a business is a singular, trustworthy entity. It requires unifying Name, Address, and Phone data across all digital directories and injecting JSON-LD schema."
      }
    }]
  };

  return (
    <div className="bg-[#050505] min-h-screen pb-20 animate-fade-in">
      <script type="application/ld+json">{JSON.stringify(schema)}</script>

      {/* CINEMATIC HERO HEADER */}
      <header className="relative pt-40 pb-20 border-b border-gray-800 overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/dka0498ns/image/upload/v1772008921/Yellow_and_Orange_Simple_Page_Border_Double-Sided_Poster_A3_Landscape_lylnxz.png" 
            alt="Synthesis Go To Market" 
            className="w-full h-full object-cover opacity-20 grayscale hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent"></div>
        </div>
        <div className="relative z-10 container mx-auto px-6 max-w-4xl">
          <Link to="/intelligence" className="text-gray-400 hover:text-yellow-500 flex items-center gap-2 mb-10 uppercase text-[10px] font-black tracking-[0.2em] transition-colors">
            <ArrowLeft size={16}/> Intelligence Hub
          </Link>
          <span className="text-yellow-500 font-bold uppercase tracking-widest text-[10px] mb-4 block">Protocol Brief 03 // Generative Engine Optimization</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 uppercase tracking-tighter text-white leading-none">
            Synthesis: A 2026 Go-to-Market Strategy
          </h1>
        </div>
      </header>
      
      <article className="container mx-auto px-6 max-w-3xl py-16 text-gray-300 text-lg leading-relaxed font-serif">
        <div className="bg-[#0a0a0a] border-l-4 border-yellow-500 p-8 rounded-r-3xl mb-12 shadow-xl">
          <h3 className="text-yellow-500 font-bold uppercase text-xs tracking-widest mb-4 flex items-center gap-2 font-sans">
            <CheckCircle2 size={18}/> The Direct Answer
          </h3>
          <p className="text-white text-xl font-medium leading-relaxed m-0 font-sans">
            Entity Resolution is the mathematical process by which AI models verify a business's existence. It is achieved by unifying your Name, Address, and Phone data across the entire web and injecting strict JSON-LD LocalBusiness schema into your website. This eliminates ambiguity, proving to the algorithm that you are a singular, trusted authority.
          </p>
        </div>

        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mt-12 mb-6 font-sans">The Context</h3>
        <p className="mb-8">
          The internet is no longer a collection of hyperlinked pages; it is a Knowledge Graph of interconnected Entities. If a South African business has an old address on Facebook, a different phone number on their website, and an unverified Google profile, the AI cannot resolve the entity. The result is the Ghost Effect, leading to total exclusion from Answer Engine recommendations.
        </p>

        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mt-12 mb-6 font-sans">The Structural Mandate</h3>
        <p className="mb-6">
          To achieve absolute Entity Resolution, an organization must adhere to a strict operational checklist.
        </p>

        <div className="space-y-6 bg-[#0a0a0a] p-8 rounded-3xl border border-gray-800 font-sans">
          <p className="text-gray-300"><strong className="text-white">Claim the Knowledge Panel:</strong> Assert administrative ownership over the primary Google entity.</p>
          <p className="text-gray-300"><strong className="text-white">Implement Schema Verification:</strong> Hard-code explicit links between the official website and highly trusted institutional databases like LinkedIn and CIPC.</p>
          <p className="text-gray-300"><strong className="text-white">Eradicate Data Debris:</strong> Systematically close or update obsolete local directory listings that feed conflicting data into the LLM training models.</p>
        </div>

        <p className="text-gray-500 text-sm italic mt-12 font-sans text-center border-t border-gray-800 pt-8">
          Data synthesized by Happy Hunter Digital. Evaluate your entity architecture by running the Smart Marketing Scan.
        </p>
      </article>
    </div>
  );
};
