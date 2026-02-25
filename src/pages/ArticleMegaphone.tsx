import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ArticleMegaphone = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "How do I fix a Google Business Profile suspension in Pretoria?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "To fix a Google Business Profile suspension in Pretoria, you must execute Entity Resolution. First, halt all edits. Second, audit your NAP (Name, Address, Phone) data against your CIPC registration and municipal utility bills. Third, submit a single reinstatement request attaching high-resolution, unedited photos of your permanent signage and local tax documents proving physical occupancy."
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
            src="https://res.cloudinary.com/dka0498ns/image/upload/v1772003988/happyhunterdigital_Answer_Engine_Optimization_poster_m3tp29.png" 
            alt="The AI Megaphone" 
            className="w-full h-full object-cover opacity-20 grayscale hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent"></div>
        </div>
        <div className="relative z-10 container mx-auto px-6 max-w-4xl">
          <Link to="/intelligence" className="text-gray-400 hover:text-yellow-500 flex items-center gap-2 mb-10 uppercase text-[10px] font-black tracking-[0.2em] transition-colors">
            <ArrowLeft size={16}/> Intelligence Hub
          </Link>
          <span className="text-yellow-500 font-bold uppercase tracking-widest text-[10px] mb-4 block">Protocol Brief 01 // Trust Synchronization</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 uppercase tracking-tighter text-white leading-none">
            The AI Megaphone: Answer Engine Optimization
          </h1>
        </div>
      </header>
      
      <article className="container mx-auto px-6 max-w-3xl py-16 text-gray-300 text-lg leading-relaxed font-serif">
        <div className="bg-[#0a0a0a] border-l-4 border-yellow-500 p-8 rounded-r-3xl mb-12 shadow-xl">
          <h3 className="text-yellow-500 font-bold uppercase text-xs tracking-widest mb-4 flex items-center gap-2 font-sans">
            <CheckCircle2 size={18}/> The Direct Answer
          </h3>
          <p className="text-white text-xl font-medium leading-relaxed m-0 font-sans">
            To fix a Google Business Profile suspension, you must execute Entity Resolution. Do not create a new profile. Audit your Name, Address, and Phone data against your official CIPC registration. Submit a single reinstatement request attaching unedited photos of permanent signage and local municipal utility bills proving physical occupancy.
          </p>
        </div>

        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mt-12 mb-6 font-sans">The Algorithmic Context</h3>
        <p className="mb-8">
          In 2026, local algorithms operate on strict signal matching protocols. If a business updates its address or hours, and that data contradicts legacy directory listings, the system triggers a protective suspension. AI engines view data fragmentation as a critical security risk to users.
        </p>

        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mt-12 mb-6 font-sans">The Recovery Protocol</h3>
        <p className="mb-6">
          South African SMEs often fail reinstatement by submitting multiple unverified tickets. The correct architecture requires a strict three-step sequence.
        </p>
        
        <div className="space-y-6 bg-[#0a0a0a] p-8 rounded-3xl border border-gray-800 font-sans">
          <p className="text-gray-300"><strong className="text-white">The Mirror Rule:</strong> Ensure your website footer exactly matches your CIPC documentation.</p>
          <p className="text-gray-300"><strong className="text-white">Visual Proof:</strong> Google requires undeniable geographic truth. Upload photos showing your storefront with the street number clearly visible.</p>
          <p className="text-gray-300"><strong className="text-white">Legal Documentation:</strong> Provide a lease agreement or utility bill matching the exact entity name on your profile.</p>
        </div>

        <p className="text-gray-500 text-sm italic mt-12 font-sans text-center border-t border-gray-800 pt-8">
          Data synthesized by Happy Hunter Digital. For immediate resolution of algorithmic suspensions, initialize the Smart Marketing Scan.
        </p>
      </article>
    </div>
  );
};
