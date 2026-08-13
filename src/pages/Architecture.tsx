import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Zap, ShieldCheck, Database, Plus, Minus, Cpu } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';

const ARCHITECTURE_FAQS = [
  {
    category: "Fixing Your Business Info",
    questions: [
      { q: "What is a 'Digital Passport' in 2026?", a: "Your Digital Passport is your business information across the internet — your Google Business Profile, your website, your LinkedIn, and local directories. If these don't all match, AI tools like ChatGPT and Google may not trust your business. We make sure they're all connected and consistent." },
      { q: "How do you stop our business from being invisible?", a: "We fix the 'Ghost Effect'. We make sure your business name, address, and phone number are correct everywhere online, and remove old, conflicting information. This proves to Google and AI that you're a real business worth recommending." },
      { q: "Why is my 15-year-old business ranking below new startups?", a: "Older businesses often have outdated information online — old addresses, old phone numbers from years ago. New businesses start clean. AI tools see inconsistent information as a red flag. We clean up your old data so your experience counts for something." }
    ]
  },
  {
    category: "Getting Found by AI",
    questions: [
      { q: "What's the difference between SEO and AI visibility?", a: "SEO helps you rank higher in Google search results with links. AI visibility helps you get recommended by ChatGPT, Gemini, and Google's AI Overviews when people ask questions. We do both so you get found everywhere.", },
      { q: "Why did my website traffic drop recently?", a: "People aren't just clicking links anymore — they're asking questions in AI chatbots. Up to 40% of searches now end in an AI tool answering directly. We shift your strategy so you're the answer, not just a link.", },
      { q: "How do you make my content show up in AI answers?", a: "We write your content in a question-and-answer format that AI tools can easily find and quote. We make sure your business information is structured so that when someone asks 'who's the best [your service] in [your area]', your business is the answer AI gives." }
    ]
  },
  {
    category: "Chatbots & WhatsApp Automation",
    questions: [
      { q: "How does AI lead capture work?", a: "We replace your static contact form with smart chatbots on your website and WhatsApp. These chatbots ask visitors the right questions, qualify them as leads, and book appointments — 24 hours a day, even when you're asleep. Hot leads go to you; the rest are filtered out." },
      { q: "Will the AI sound robotic to my South African customers?", a: "No. We customize the AI to match your brand's voice and train it to understand local context — whether that's South African English, Afrikaans, or local slang. The result is a natural, professional conversation." },
      { q: "Is AI lead capture compliant with POPIA?", a: "Absolutely. Our system asks for explicit consent before collecting any personal information, ensuring everything we capture through your chatbots and WhatsApp follows POPIA and GDPR rules." }
    ]
  }
];

export const Architecture = () => {
  const [openId, setOpenId] = useState<string | null>(null);
  
  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="bg-[#050505] min-h-screen pb-20 animate-fade-in pt-32">
      
      {/* 1. Header Section */}
     <PageMeta
        title="Our 4-Step Marketing Process | Happy Hunter Digital"
        description="The proven four-step system we use to get South African businesses found on Google, AI chatbots, and WhatsApp."
        path="/architecture"
      />

      <header className="px-6 max-w-4xl mx-auto text-center mb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
           <Database size={14} /> Our Process
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6">
          How We Make <span className="text-yellow-500 italic">Your Business Unmissable</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          A proven four-step process that gets your business found on Google, recommended by AI tools like ChatGPT, and turning WhatsApp into a sales channel. Based in Pretoria, serving South African SMEs.
        </p>
      </header>

      {/* 2. The Four Steps Summary */}
      <section className="container mx-auto px-6 max-w-6xl mb-32">
        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-[2.5rem] p-8 md:p-10 flex flex-col h-full relative overflow-hidden group hover:border-yellow-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldCheck size={120} /></div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4 relative z-10">Step 1: Fix Your Foundation</h2>
            <p className="text-gray-400 leading-relaxed mb-8 relative z-10 flex-grow">
              We fix your business name, address, and phone number so they match everywhere online — your website, Google listing, and directories. This is the trust foundation that Google and AI check first.
            </p>
            <Link to="/blog/synthesis" className="inline-flex items-center gap-2 text-yellow-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors relative z-10">
              How It Works <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-[#0a0a0a] border border-gray-800 rounded-[2.5rem] p-8 md:p-10 flex flex-col h-full relative overflow-hidden group hover:border-yellow-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><BookOpen size={120} /></div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4 relative z-10">Step 2: Get Found by AI</h2>
            <p className="text-gray-400 leading-relaxed mb-8 relative z-10 flex-grow">
              We write content that AI tools like ChatGPT, Gemini, and Google's AI Overviews can find and quote. When someone asks for your service, your business becomes the answer — not just a link.
            </p>
            <Link to="/blog/ai-megaphone" className="inline-flex items-center gap-2 text-yellow-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors relative z-10">
              AI Visibility <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-[#0a0a0a] border border-gray-800 rounded-[2.5rem] p-8 md:p-10 flex flex-col h-full relative overflow-hidden group hover:border-yellow-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Zap size={120} /></div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4 relative z-10">Step 3: Sell on Autopilot</h2>
            <p className="text-gray-400 leading-relaxed mb-8 relative z-10 flex-grow">
              We set up chatbots and WhatsApp automation that answer customer questions, qualify leads, and book appointments 24/7. Capture opportunities even when your office is closed.
            </p>
            <Link to="/blog/revenue-brain" className="inline-flex items-center gap-2 text-yellow-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors relative z-10">
              See Automation <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </section>

      {/* 3. FAQ Section */}
      <section className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">Common Questions</h2>
          <p className="text-gray-400">Plain answers to the questions we get about modern digital marketing.</p>
        </div>

        <div className="space-y-16">
          {ARCHITECTURE_FAQS.map((section, sIdx) => (
            <div key={sIdx} className="space-y-6">
              
              <div className="border-b border-gray-800 pb-4">
                <h3 className="text-xl md:text-2xl font-black text-yellow-500 uppercase tracking-tight">{section.category}</h3>
              </div>

              <div className="space-y-4">
                {section.questions.map((item, qIdx) => {
                  const id = `${sIdx}-${qIdx}`;
                  const isOpen = openId === id;
                  return (
                    <div 
                      key={id} 
                      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-[#0a0a0a] border-yellow-500/30' : 'bg-black border-gray-800 hover:border-gray-600'}`}
                    >
                      <button 
                        className="w-full px-6 py-6 flex justify-between items-center text-left focus:outline-none"
                        onClick={() => toggle(id)}
                      >
                        <span className="font-bold text-base md:text-lg text-white pr-8">{item.q}</span>
                        {isOpen ? <Minus className="text-yellow-500 shrink-0" size={20} /> : <Plus className="text-gray-500 shrink-0" size={20} />}
                      </button>
                      
                      <div className={`px-6 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="text-gray-400 leading-relaxed text-sm md:text-base border-l-2 border-yellow-500 pl-4">{item.a}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="mt-24 p-10 bg-gradient-to-br from-gray-900 to-black border border-yellow-500/20 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
          <Cpu className="mx-auto text-yellow-500 mb-6" size={48} />
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Start Your Free Check</h2>
          <p className="text-gray-400 mb-8 text-base max-w-lg mx-auto leading-relaxed">See exactly what's missing from your online presence. Our free health check shows you where customers can't find you — no sales call required.</p>
          <Link to="/audit" className="inline-block bg-yellow-500 text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_30px_rgba(234,179,8,0.2)]">
            Run Free Health Check
          </Link>
        </div>

      </section>
    </div>
  );
};