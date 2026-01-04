import React, { useState } from 'react';
import { ShieldCheck, Megaphone, BrainCircuit, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQ_DATA = [
  {
    category: "The Trust Anchor (Digital Entity Management)",
    icon: <ShieldCheck size={24} className="text-yellow-600" />,
    questions: [
      {
        q: "Why do you call my Google Business Profile a 'Digital Passport'?",
        a: "In 2026, a Google Business Profile (GBP) is no longer a creative asset; it is a government-grade identity document within the search ecosystem. Google's Knowledge Graph uses your GBP as the primary 'source of truth' to verify your existence. If your 'passport' has expired data or doesn't match other records, AI systems effectively revoke your entry rights to search results."
      },
      {
        q: "My business has been around for 20 years. Why am I ranking lower than new competitors?",
        a: "You are likely suffering from the 'Ghost Effect'. Legacy businesses often have a trail of 'data debris' across the web (old numbers, name variations). New businesses have pristine data. Modern AI models view inconsistencies as signs of an unreliable entity. We perform 'Entity Resolution' to clean this debris."
      },
      {
        q: "I’m struggling to get 'Video Verified' by Google. Is the system broken?",
        a: "It isn't broken, but it is hostile to South African infrastructure. Rejections often happen due to 'Geo-Location Mismatches' caused by signal instability or GPS drift. We guide you through the precise choreography required to pass these automated checks."
      },
      {
        q: "Why does 'NAP Consistency' matter so much now?",
        a: "NAP (Name, Address, Phone) consistency is now a training validator for Large Language Models. If an AI finds conflicting phone numbers, it calculates a high 'Hallucination Risk' and simply won't mention you. We ensure your NAP data is identical across every node of the web."
      }
    ]
  },
  {
    category: "The AI Megaphone (Generative Engine Optimization)",
    icon: <Megaphone size={24} className="text-blue-600" />,
    questions: [
      {
        q: "What is the difference between SEO and GEO?",
        a: "SEO is about Retrieval (ranking a link). GEO is about Synthesis (being cited in an answer). In the GEO era, there is no 'Page 2'—you are either one of the cited sources in the AI's answer, or you are invisible."
      },
      {
        q: "My website traffic is dropping, but I'm still getting business. What's happening?",
        a: "You are experiencing the 'Zero-Click Crisis'. nearly 60% of searches now end without a click because AI answers directly. We shift your strategy to capture 'Share of Voice'—positioning your brand as the expert in the AI's answer, even if they don't click."
      },
      {
        q: "How do you get an AI to associate my brand with a specific service?",
        a: "We use 'Vector Embeddings'. AI stores concepts as numbers in 3D space. We create content that creates 'Semantic Proximity', pushing your brand's vector closer to your service keywords so the AI sees them as related concepts."
      },
      {
        q: "What is 'RAG-Ready' content?",
        a: "RAG (Retrieval Augmented Generation) is how AI looks up facts. For an AI to 'read' your site, content must be 'RAG-Ready': crawlable, dense, and structured. If prices are locked in PDFs or images, the AI can't see them."
      }
    ]
  },
  {
    category: "The Conversion Brain (Intelligent Automation)",
    icon: <BrainCircuit size={24} className="text-purple-600" />,
    questions: [
      {
        q: "Why do I need an AI Receptionist? Can't I just call people back?",
        a: "The odds of qualifying a lead drop by 2100% if you wait just 30 minutes. An AI receptionist stops the clock instantly, ensuring you capture the lead while intent is highest."
      },
      {
        q: "Can these AI bots actually understand South African accents?",
        a: "Yes. Modern AI Voice Agents use localized Large Language Models trained on diverse datasets, including South African English and Afrikaans-inflected English."
      },
      {
        q: "Will an AI chatbot work during Load Shedding?",
        a: "Absolutely. Our AI agents are Cloud-Based, running on global infrastructure (AWS/Google Cloud) that is immune to local power cuts."
      },
      {
        q: "Is using AI for customer data legal in South Africa?",
        a: "Yes, provided you are POPIA compliant. We use enterprise-grade systems that adhere to strict data security standards."
      },
      {
        q: "Is an AI Receptionist expensive?",
        a: "It is a fraction of the cost of a human. It works 168 hours/week, handles 100+ simultaneous calls, and never takes sick leave."
      }
    ]
  }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFAQ = (index: string) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pt-28 relative z-10">
      
      {/* HERO HEADER */}
      <section className="bg-gray-900 text-white py-20 px-6 border-b border-gray-800">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 font-bold px-4 py-1.5 rounded-full text-sm uppercase tracking-wider">
            <HelpCircle size={16} /> Knowledge Base
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
            The 2026 Strategic FAQ
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Stop Guessing. <span className="text-yellow-400 font-bold">Start Winning Smart.</span> <br/>
            Addressing the fears and technical realities of the South African market.
          </p>
        </div>
      </section>

      {/* FAQ CONTENT */}
      <div className="max-w-4xl mx-auto px-6 py-20 space-y-12">
        {FAQ_DATA.map((section, sIndex) => (
          <div key={sIndex} className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-white p-6 border-b border-gray-200 flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-lg border border-gray-200 shadow-inner">{section.icon}</div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">{section.category}</h2>
            </div>

            <div className="divide-y divide-gray-200">
              {section.questions.map((item, qIndex) => {
                const uniqueId = `${sIndex}-${qIndex}`;
                const isOpen = openIndex === uniqueId;

                return (
                  <div key={qIndex} className="group bg-white">
                    <button
                      onClick={() => toggleFAQ(uniqueId)}
                      className="w-full text-left p-6 flex justify-between items-start gap-4 hover:bg-gray-50 transition-colors focus:outline-none"
                    >
                      <span className={`font-bold text-lg ${isOpen ? 'text-yellow-600' : 'text-gray-800'}`}>
                        {item.q}
                      </span>
                      {isOpen ? <ChevronUp className="text-gray-400 flex-shrink-0" /> : <ChevronDown className="text-gray-400 flex-shrink-0" />}
                    </button>
                    
                    {isOpen && (
                      <div className="px-6 pb-6 text-gray-600 leading-relaxed animate-fade-in">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* CTA FOOTER WITH NEW LINK */}
      <section className="bg-yellow-400 py-16 px-6 text-center">
        <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">Still have questions?</h3>
        <a 
          href="https://calendly.com/motsumitl/30min"
          target="_blank"
          rel="noreferrer" 
          className="inline-block bg-gray-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl"
        >
          Book a 15-Min Strategy Call
        </a>
      </section>

    </div>
  );
};
