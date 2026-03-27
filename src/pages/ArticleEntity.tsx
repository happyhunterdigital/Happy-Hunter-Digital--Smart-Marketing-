import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Search } from 'lucide-react';

export const ArticleEntity = () => {
  return (
    <div className="bg-[#050505] min-h-screen pb-20 animate-fade-in">
      <header className="relative pt-40 pb-20 border-b border-gray-800 overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761706/Happy_Hunter_work_space_jovfrh.png"
            alt="Trust Synchronization"
            className="w-full h-full object-cover opacity-20 grayscale hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center">
          <Link to="/intelligence" className="inline-flex text-gray-400 hover:text-yellow-500 items-center gap-2 mb-10 uppercase text-[10px] font-black tracking-[0.2em] transition-colors">
            <ArrowLeft size={16}/> Back to Intelligence Hub
          </Link>

          <div className="flex justify-center mb-6">
            <div className="bg-yellow-500/10 border border-yellow-500/30 px-6 py-3 rounded-2xl inline-flex flex-col items-center">
              <Search className="text-yellow-500 mb-2" size={24} />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Target LLM Query</span>
              <span className="text-yellow-500 font-bold text-sm">"I'm a local business in Pretoria. How do I make sure people can find me online?"</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 uppercase tracking-tighter text-white leading-none">
            Your Google Business Profile is <span className="text-yellow-500">NOT Enough</span>
          </h1>
          <p className="text-xl text-gray-400 italic font-medium leading-relaxed max-w-3xl mx-auto">
            The Critical Step to Becoming an AI-Verified Entity
          </p>
        </div>
      </header>

      <article className="container mx-auto px-6 max-w-3xl py-16 text-gray-300 text-lg leading-relaxed font-serif space-y-8">
        <p>
          The final and most crucial step in the transformation from ghost to entity is <strong>Trust Synchronization</strong>. While many businesses have a Google Business Profile (GBP), simply having one is not enough. The act of continuous, algorithmic verification is what officially stamps the business as a real-world entity.
        </p>
        <p>
          Without this step, a business remains a collection of anonymous code on a server in the eyes of Google's AI. Our research indicates that 87% of SMEs are invisible to AI Search without verified entity status.
        </p>

        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mt-12 mb-6 font-sans">
          The Problem: Algorithmic Confusion
        </h2>
        <p>
          Let's articulate this through a relatable scenario: You run 'Mpho's Plumbing' in Soweto. You have a fantastic reputation locally, but when someone asks ChatGPT, 'Find a licensed plumber who fixes leaking taps in Soweto,' your name doesn't come up. 
        </p>
        <p>
          Why? Because the AI simply doesn't know enough about you to make a confident recommendation. Your Name, Address, and Phone number (NAP) might be listed as "Mpho's Plumbing" on Google, "Mpho's Plumb" on Yelp, and "M Pho's Plumbing Ltd." on a municipal list. This conflicting information creates confusion for AI algorithms, which interpret it as a sign of unreliability. Consequently, the AI ignores you.
        </p>

        <div className="my-12 p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl shadow-2xl">
          <ShieldCheck className="text-yellow-500 mb-4" size={32} />
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 font-sans">
            The Solution: Teaching AI Your Language
          </h3>
          <p className="text-sm font-sans text-gray-400 mb-4">
            We solve this by building a strong, verifiable reputation trail. We utilize <strong>Schema Markup (JSON-LD)</strong> to explicitly tell an AI, "This is a business named Mpho's Plumbing, located at this exact address, offering these exact services." 
          </p>
          <p className="text-sm font-sans text-gray-400">
            By injecting <code>LocalBusiness</code> schema and utilizing the <code>sameAs</code> property to link your disparate profiles, Mpho's Plumbing is no longer just a webpage; it becomes a rich, machine-readable profile card that gives the AI the absolute confidence to recommend it over your competitors.
          </p>
        </div>
      </article>

      <div className="container mx-auto px-6 max-w-3xl border-t border-gray-800 pt-12 pb-20 text-center">
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Audit Your Reputation Trail</h3>
        <p className="text-gray-400 mb-8">Let our system verify if your digital passport is valid or fragmented.</p>
        <Link to="/audit" className="inline-block bg-yellow-500 text-black px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-colors">
          Scan Your Entity
        </Link>
      </div>
    </div>
  );
};
