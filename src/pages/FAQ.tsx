import { useState } from 'react';
import { ShieldCheck, Megaphone, BrainCircuit, ChevronDown, ChevronUp, HelpCircle, Zap } from 'lucide-react';

const FAQ_DATA = [
  {
    category: "The Trust Anchor (Entity Management)",
    icon: <ShieldCheck size={24} className="text-yellow-500" />,
    questions: [
      {
        q: "Why do you call my Google Business Profile a 'Digital Passport'?",
        a: "In 2026, Google's Knowledge Graph uses your GBP as the primary 'source of truth' to verify your existence. If your 'passport' data is fragmented or doesn't match other records, AI systems effectively revoke your entry rights to search results. We ensure your passport is government-grade."
      },
      {
        q: "My business is 20 years old. Why am I ranking lower than new competitors?",
        a: "You are likely suffering from the 'Ghost Effect'. Legacy businesses often have a trail of 'data debris' across the web (old numbers, name variations). New businesses have pristine data. Modern AI models view inconsistencies as signs of an unreliable entity. We perform 'Entity Resolution' to clean this debris."
      },
      {
        q: "I’m struggling with 'Video Verification' in South Africa. Can you help?",
        a: "Google’s automated verification is often hostile to SA infrastructure. Rejections usually happen due to 'Geo-Location Mismatches' caused by signal instability. We guide you through the precise 'Mirror Rule' choreography required to pass these automated checks on the first try."
      }
    ]
  },
  {
    category: "The AI Megaphone (AEO Strategy)",
    icon: <Megaphone size={24} className="text-yellow-500" />,
    questions: [
      {
        q: "What is the difference between SEO and AEO?",
        a: "SEO is about Retrieval (ranking a link). AEO (Answer Engine Optimization) is about Synthesis (being cited in an AI's direct answer). In the AEO era, there is no 'Page 2'—you are either one of the cited sources in the AI's answer, or you are invisible."
      },
      {
        q: "My website traffic is dropping, but I'm still getting business. What's happening?",
        a: "You are experiencing the 'Zero-Click Crisis'. Nearly 60% of searches now end without a click because AI answers directly. We shift your strategy to capture 'Share of Voice'—positioning your brand as the expert in the AI's answer, even if they don't click."
      },
      {
        q: "What is 'RAG-Ready' content?",
        a: "RAG (Retrieval Augmented Generation) is how AI looks up facts. For an AI to 'read' your site, content must be dense and structured. If your service details are locked in images or PDFs, the AI is blind to them. We make your data citable."
      }
    ]
  },
  {
    category: "The Conversion Brain (Automation)",
    icon: <BrainCircuit size={24} className="text-yellow-500" />,
    questions: [
      {
        q: "Can AI bots actually understand South African accents?",
        a: "Yes. Our Smart Agents use localized Large Language Models trained on diverse datasets, including South African English, Afrikaans-inflected English, and local dialects. They aren't just 'bots'; they are intelligent receptionists."
      },
      {
        q: "Will an AI chatbot work during Load Shedding?",
        a: "Absolutely. Our AI agents are Cloud-Based, running on global infrastructure that is immune to local power cuts. Even if your office is dark, your Digital Entity is online, qualifying leads and booking appointments 24/7."
      },
      {
        q: "Is using AI for customer data legal under POPIA?",
        a: "Yes. We use enterprise-grade systems that adhere to strict POPIA and GDPR standards. Data is encrypted and used only for the specific purpose of lead qualification and service delivery."
      }
    ]
  }
];

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen font-sans">
      {/* Hero Header */}
      <div className="text-center mb-24 space-y-4">
        <span className="text-yellow-500 font-black uppercase tracking-[0.4em] text-[10px]">Intelligence Hub</span>
        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white">
          The 2026 <span className="text-yellow-500">FAQ</span>
        </h2>
        <p className="text-slate-500 text-lg md:text-xl italic font-medium leading-relaxed">
          Addressing the technical realities and survival requirements of the South African digital landscape.
        </p>
      </div>

      {/* FAQ Sections */}
      <div className="space-y-16">
        {FAQ_DATA.map((section, sIdx) => (
          <div key={sIdx} className="space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-900 pb-4">
              {section.icon}
              <h3 className="text-xl font-black uppercase tracking-tight text-white">{section.category}</h3>
            </div>

            <div className="grid gap-3">
              {section.questions.map((item, qIdx) => {
                const id = `${sIdx}-${qIdx}`;
                const isOpen = openId === id;
                return (
                  <div key={qIdx} className={`border border-slate-900 rounded-3xl transition-all overflow-hidden ${isOpen ? 'bg-slate-900/40 border-yellow-500/20' : 'bg-slate-900/10 hover:bg-slate-900/20'}`}>
                    <button 
                      onClick={() => toggle(id)}
                      className="w-full p-6 text-left flex justify-between items-center gap-4 group"
                    >
                      <span className={`font-bold text-lg leading-tight transition-colors ${isOpen ? 'text-yellow-500' : 'text-slate-300 group-hover:text-white'}`}>
                        {item.q}
                      </span>
                      {isOpen ? <ChevronUp className="text-yellow-500 shrink-0" /> : <ChevronDown className="text-slate-700 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-8 text-slate-400 leading-relaxed text-sm italic border-l-2 border-yellow-500/30 ml-6 mr-6">
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

      {/* Closing CTA */}
      <div className="mt-40 p-16 border border-slate-900 rounded-[3rem] bg-slate-900/40 text-center relative overflow-hidden">
        <Zap className="mx-auto text-yellow-500 mb-6 animate-pulse" size={32} />
        <h3 className="text-3xl font-black uppercase mb-4 text-white">Still in the Dark?</h3>
        <p className="text-slate-500 mb-10 max-w-md mx-auto italic font-medium">Don't let technical uncertainty stop your growth. Let's discuss your survival strategy personally.</p>
        <a 
          href="https://calendly.com/motsumitl/30min" 
          target="_blank" 
          className="bg-yellow-500 text-slate-950 px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all inline-block shadow-2xl shadow-yellow-500/10"
        >
          Book 15-Min Strategy Call
        </a>
      </div>
    </div>
  );
}
