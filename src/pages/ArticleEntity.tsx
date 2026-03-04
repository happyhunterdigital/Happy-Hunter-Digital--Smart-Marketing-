import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Database, CheckCircle2 } from 'lucide-react';

export const ArticleEntity = () => {
  return (
    <div className="bg-[#050505] min-h-screen pb-20 animate-fade-in">
      <header className="relative pt-40 pb-20 border-b border-gray-800 overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761706/Happy_Hunter_work_space_jovfrh.png" 
            alt="Entity Architecture" 
            className="w-full h-full object-cover opacity-20 grayscale hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center">
          <Link to="/intelligence" className="inline-flex text-gray-400 hover:text-yellow-500 items-center gap-2 mb-10 uppercase text-[10px] font-black tracking-[0.2em] transition-colors">
            <ArrowLeft size={16}/> Back to Intelligence Hub
          </Link>

          <span className="text-yellow-500 font-bold uppercase tracking-widest text-[10px] mb-4 block">Strategic Intelligence</span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 uppercase tracking-tighter text-white leading-none">
            From Web Developer to <span className="text-yellow-500">Entity Architect</span>
          </h1>
        </div>
      </header>

      <article className="container mx-auto px-6 max-w-3xl py-16 text-gray-300 text-lg leading-relaxed font-serif space-y-8">
        <p>
          In the current 2026 AI landscape, building a &quot;website&quot; is no longer enough. The structural evolution of the digital economy demands that we move from building static pages to <strong>owning the digital truth</strong> for our clients.
        </p>

        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mt-12 mb-6 font-sans">
          1. Management of the &quot;Digital Passport&quot;
        </h2>
        <p>
          This is about creating a <strong>single source of truth</strong> for a brand that AI models (Gemini, GPT-4, SGE) trust implicitly.
        </p>
        <ul className="list-disc pl-6 space-y-4 marker:text-yellow-500">
          <li><strong>How it works:</strong> Instead of a client updating an &quot;About Us&quot; page, they update a <strong>Brand Identity</strong> document in our proprietary CMS.</li>
          <li><strong>The &quot;SameAs&quot; Logic:</strong> We link their core database to their official LinkedIn, X, and Google Maps profiles. This tells AI, &quot;This specific entity is the exact same one that exists on these high-authority platforms.&quot;</li>
          <li><strong>The Value:</strong> It prevents AI from hallucinating old information. The client remains a verified entity across the entire web.</li>
        </ul>

        <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl my-8 shadow-xl">
          <h3 className="text-yellow-500 font-bold text-sm uppercase tracking-widest mb-3 flex items-center gap-2"><Database size={16}/> Execution Example</h3>
          <p className="text-sm font-sans text-gray-400">If <em>Integrated Wellth</em> changes its physical office location, we update it once in the CMS. The system automatically recompiles the JSON-LD schema across their entire digital infrastructure, forcing AI crawlers to consume the new data instantly.</p>
        </div>

        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mt-12 mb-6 font-sans">
          2. The &quot;Truth Table&quot; for AEO
        </h2>
        <p>
          Traditional SEO focused on keywords; <strong>AEO (Answer Engine Optimization) focuses on facts and claims.</strong>
        </p>
        <ul className="list-disc pl-6 space-y-4 marker:text-yellow-500">
          <li><strong>Verified Claims Repository:</strong> We create a collection specifically for competitive claims. We link this claim to a URL showing third-party proof.</li>
          <li><strong>Direct Answer Engine:</strong> We manage strict FAQ schemas. When a user asks a voice assistant a question, it bypasses search results and pulls the answer directly from the Q&A pairs we&apos;ve defined.</li>
          <li><strong>Real-Time Agent Grounding:</strong> If we deploy an AI chatbot for a client, that chatbot never guesses. It strictly queries the Firestore &quot;Truth Table&quot;.</li>
        </ul>

        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mt-12 mb-6 font-sans">
          3. Strategic Agency Advantage
        </h2>
        <p>
          This shifts the business model from a &quot;one-off web project&quot; to a <strong>recurring high-value governance partnership.</strong>
        </p>
        <div className="overflow-x-auto my-10 border border-gray-800 rounded-xl shadow-2xl">
          <table className="w-full text-left border-collapse font-sans text-sm">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800 text-yellow-500">
                <th className="p-4 font-bold uppercase tracking-widest">Feature</th>
                <th className="p-4 font-bold uppercase tracking-widest">Traditional Web Management</th>
                <th className="p-4 font-bold uppercase tracking-widest">Happy Hunter Entity Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-black/50">
              <tr className="hover:bg-gray-900/30">
                <td className="p-4 font-bold text-white">Success Metric</td>
                <td className="p-4 text-gray-400">Page speed and layout beauty</td>
                <td className="p-4 text-green-500 font-bold flex items-center gap-2"><CheckCircle2 size={14}/> AI recognition & Knowledge Graph</td>
              </tr>
              <tr className="hover:bg-gray-900/30">
                <td className="p-4 font-bold text-white">Client Interaction</td>
                <td className="p-4 text-gray-400">&quot;Change this photo on the home page.&quot;</td>
                <td className="p-4 text-gray-300">&quot;Update our verified services for the AI Agent.&quot;</td>
              </tr>
              <tr className="hover:bg-gray-900/30">
                <td className="p-4 font-bold text-white">Core Technology</td>
                <td className="p-4 text-gray-400">HTML / CSS / Images</td>
                <td className="p-4 text-gray-300">JSON-LD / Firestore / Cloud Functions</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          By acting as the &quot;Gatekeeper&quot; of their data, clients pay to ensure their &quot;Digital Passport&quot; stays valid. Using a structured CMS, we prevent clients from entering garbage data, ensuring every node is perfectly formatted for AI ingestion.
        </p>
      </article>
    </div>
  );
};
