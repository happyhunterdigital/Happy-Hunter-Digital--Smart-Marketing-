import { useState } from 'react';
import { 
  ShieldCheck, Megaphone, BrainCircuit, 
  Plus, Minus, HelpCircle, AlertCircle 
} from 'lucide-react';

const FAQ_DATA = [
  {
    category: "The Trust Anchor (Entity Management)",
    icon: <ShieldCheck size={24} className="text-yellow-500" />,
    description: "Building the foundation that Google and Gemini trust.",
    questions: [
      {
        q: "Why do you call my Google Business Profile a 'Digital Passport'?",
        a: "In the 2026 AI era, your GBP is no longer a 'listing'; it is a government-grade identity document within the search ecosystem. Google's Knowledge Graph uses it as the primary 'source of truth'. If your passport is fragmented or doesn't match other digital nodes, AI systems effectively revoke your entry rights to the search results."
      },
      {
        q: "I've been in business for 15 years. Why am I ranking lower than startups?",
        a: "You are likely suffering from the 'Ghost Effect'. Legacy businesses often have a trail of 'data debris' across the web (old numbers, expired addresses). Startups have pristine data. Modern AI models view inconsistencies as signs of an unreliable entity. We perform 'Entity Resolution' to clean this debris."
      },
      {
        q: "Is 'Video Verification' in South Africa genuinely broken?",
        a: "It isn't broken, but it is hostile to local infrastructure. Rejections usually happen due to 'Geo-Location Mismatches' caused by signal instability or GPS drift. We guide you through the precise 'Mirror Rule' choreography required to pass these automated checks on the first attempt."
      }
    ]
  },
  {
    category: "The AI Megaphone (AEO Strategy)",
    icon: <Megaphone size={24} className="text-yellow-500" />,
    description: "Becoming the direct answer for smart search engines.",
    questions: [
      {
        q: "What is the difference between SEO and AEO?",
        a: "SEO is about Retrieval (ranking a link). AEO (Answer Engine Optimization) is about Synthesis (being cited in an AI's direct answer). In the AEO era, there is no 'Page 2'. You are either one of the 3 cited sources in the AI's answer, or you are invisible."
      },
      {
        q: "My website traffic is dropping, but my business is fine. Why?",
        a: "You are experiencing the 'Zero-Click Crisis'. Over 60% of searches now end without a click because AI answers the user directly. We shift your strategy from 'Click-Chasing' to 'Share of Voice'—positioning your brand as the primary expert in the AI's response."
      },
      {
        q: "How do you make my content 'Citable' for AI?",
        a: "We use RAG-Ready (Retrieval Augmented Generation) formatting. We restructure your business data into semantic clusters and schema that AI models can ingest instantly. If your prices and services are locked inside images or messy text, the AI is effectively blind to them."
      }
    ]
  },
  {
    category: "The Conversion Brain (Automation)",
    icon: <BrainCircuit size={24} className="text-yellow-500" />,
    description: "Turning digital attention into automated revenue.",
    questions: [
      {
        q: "Can AI bots actually understand South African accents?",
        a: "Yes. Our Smart Agents use localized Large Language Models trained on diverse datasets, including South African English, Afrikaans-inflected English, and local dialects. They aren't just 'chatbots'; they are intelligent receptionists designed for the SA market."
      },
      {
        q: "Will my automation still work during Load Shedding?",
        a: "Absolutely. Your Digital Entity is Cloud-Based, running on global infrastructure that is immune to local power cuts. Even if your physical office is dark, your AI agents are online, qualifying leads and booking appointments 24/7."
      },
      {
        q: "Is using AI for customer data legal under the POPI Act?",
        a: "Yes. We use enterprise-grade systems that adhere to strict POPIA and GDPR standards. We ensure your 'Handshake Protocol' includes the necessary consent nodes to keep your data collection 100% compliant."
      }
    ]
  }
];

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-16 lg:mb-32 space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full">
          <AlertCircle size={14} className="text-yellow-500" />
          <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">
            Protocol Intelligence Base
          </span>
        </div>
        <h2 className="text-4xl sm:text-6xl lg:text-7xl xl:text-9xl font-black uppercase tracking-tighter text-white">
          Strategic <span className="text-yellow-500">Knowledge</span>
        </h2>
        <p className="text-slate-500 text-base lg:text-lg xl:text-xl italic font-medium leading-relaxed">
          Addressing the technical realities and survival requirements of the 2026 South African digital economy.
        </p>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-16 lg:space-y-24">
        {FAQ_DATA.map((section, sIdx) => (
          <div key={sIdx} className="space-y-6 lg:space-y-8 animate-fade-in">
            {/* Category Marker */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-900 pb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-yellow-500 shadow-xl">
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl font-black uppercase tracking-tight text-white">
                    {section.category}
                  </h3>
                  <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                    {section.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="grid gap-4">
              {section.questions.map((item, qIdx) => {
                const id = `${sIdx}-${qIdx}`;
                const isOpen = openId === id;

                return (
                  <div
                    key={qIdx}
                    className={`group border rounded-[1.5rem] lg:rounded-[2rem] transition-all duration-500 overflow-hidden ${
                      isOpen
                        ? 'bg-slate-900/40 border-yellow-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.3)]'
                        : 'bg-slate-900/10 border-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <button
                      onClick={() => toggle(id)}
                      className="w-full p-6 lg:p-8 text-left flex justify-between items-center gap-4 lg:gap-6"
                    >
                      <span className={`font-black text-base lg:text-lg xl:text-xl leading-tight transition-colors uppercase tracking-tighter ${
                        isOpen ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                      }`}>
                        {item.q}
                      </span>
                      <div className={`shrink-0 p-2 rounded-full transition-all duration-500 ${
                        isOpen 
                          ? 'bg-yellow-500 text-slate-950 rotate-0' 
                          : 'bg-slate-800 text-slate-500 rotate-180'
                      }`}>
                        {isOpen ? <Minus size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />}
                      </div>
                    </button>
                    
                    <div className={`transition-all duration-500 ease-in-out ${
                      isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="px-6 lg:px-8 pb-8 lg:pb-10">
                        <div className="border-l-2 border-yellow-500/30 pl-6 lg:pl-8">
                          <p className="text-slate-400 leading-relaxed text-sm lg:text-base font-medium italic">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-20 lg:mt-40 p-10 lg:p-16 border-2 border-slate-900 rounded-[3rem] lg:rounded-[4rem] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-500/5 via-slate-950 to-slate-950 text-center relative overflow-hidden">
        <HelpCircle className="mx-auto text-yellow-500/20 mb-6 lg:mb-8" size={60} />
        <h3 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tighter mb-4 lg:mb-6 text-white leading-none">
          Still Being <br />
          <span className="text-yellow-500">Filtered Out?</span>
        </h3>
        <p className="text-slate-500 mb-8 lg:mb-12 max-w-xl mx-auto italic font-medium text-sm lg:text-base">
          Technical uncertainty is the #1 reason why SA businesses remain invisible. Let's discuss your survival strategy.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 lg:gap-6">
          <a
            href="https://calendly.com/motsumitl/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-500 text-slate-950 px-8 lg:px-12 py-4 lg:py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl"
          >
            Book Strategy Session
          </a>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="border-2 border-slate-800 text-slate-500 px-8 lg:px-12 py-4 lg:py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-all"
          >
            Review Pillars
          </button>
        </div>
      </div>
    </div>
  );
}
