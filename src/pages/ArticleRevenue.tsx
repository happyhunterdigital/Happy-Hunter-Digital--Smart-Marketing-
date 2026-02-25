import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ArticleRevenue = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "How do South African SMEs automate lead qualification using AI?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "South African SMEs automate lead qualification by replacing static web forms with Agentic Workflows. This involves deploying a custom-trained LLM directly onto their website and WhatsApp to act as a 24/7 receptionist. The AI analyzes user inputs in real-time, calculates a predictive lead score, and only routes high-intent prospects to human sales teams."
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
            src="https://res.cloudinary.com/dka0498ns/image/upload/v1772006845/The_Revenue_Brain_Agentic_Lead_Automation_and_the_Future_of_GTM_qbnt5s.png" 
            alt="The Revenue Brain" 
            className="w-full h-full object-cover opacity-20 grayscale hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent"></div>
        </div>
        <div className="relative z-10 container mx-auto px-6 max-w-4xl">
          <Link to="/intelligence" className="text-gray-400 hover:text-yellow-500 flex items-center gap-2 mb-10 uppercase text-[10px] font-black tracking-[0.2em] transition-colors">
            <ArrowLeft size={16}/> Intelligence Hub
          </Link>
          <span className="text-yellow-500 font-bold uppercase tracking-widest text-[10px] mb-4 block">Protocol Brief 02 // Agentic Automation</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 uppercase tracking-tighter text-white leading-none">
            The Revenue Brain: Agentic Lead Automation
          </h1>
        </div>
      </header>
      
      <article className="container mx-auto px-6 max-w-3xl py-16 text-gray-300 text-lg leading-relaxed font-serif">
        <div className="bg-[#0a0a0a] border-l-4 border-yellow-500 p-8 rounded-r-3xl mb-12 shadow-xl">
          <h3 className="text-yellow-500 font-bold uppercase text-xs tracking-widest mb-4 flex items-center gap-2 font-sans">
            <CheckCircle2 size={18}/> The Direct Answer
          </h3>
          <p className="text-white text-xl font-medium leading-relaxed m-0 font-sans">
            SMEs achieve automation by replacing static contact forms with Agentic Workflows. By deploying a custom-trained LLM via WhatsApp and web interfaces, businesses create an autonomous receptionist. The AI asks qualifying questions, analyzes purchase intent, and routes only high-scoring leads to the human sales team.
          </p>
        </div>

        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mt-12 mb-6 font-sans">The Context</h3>
        <p className="mb-8">
          In the South African market, response time is the primary driver of conversion. However, founder-led sales teams waste massive amounts of their bandwidth engaging with zero-intent window shoppers. The traditional linear funnel is too slow and resource-heavy for scaling enterprises.
        </p>

        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mt-12 mb-6 font-sans">The Implementation Architecture</h3>
        <p className="mb-6">
          True lead automation requires a fully integrated Revenue Brain architecture.
        </p>

        <div className="space-y-6 bg-[#0a0a0a] p-8 rounded-3xl border border-gray-800 font-sans">
          <p className="text-gray-300"><strong className="text-white">Semantic Knowledge Base:</strong> The AI must be trained exclusively on your specific pricing, operational policies, and service limitations to prevent hallucinations.</p>
          <p className="text-gray-300"><strong className="text-white">Conversational Triage:</strong> The bot engages users natively on WhatsApp, asking predefined qualification questions to determine client viability.</p>
          <p className="text-gray-300"><strong className="text-white">Predictive Scoring:</strong> Based on the answers, the AI determines the Lifetime Value probability and immediately books a meeting for qualified leads, bypassing human bottlenecks entirely.</p>
        </div>

        <p className="text-gray-500 text-sm italic mt-12 font-sans text-center border-t border-gray-800 pt-8">
          Data synthesized by Happy Hunter Digital. To audit your current automation pipeline, initialize the Smart Marketing Scan.
        </p>
      </article>
    </div>
  );
};
