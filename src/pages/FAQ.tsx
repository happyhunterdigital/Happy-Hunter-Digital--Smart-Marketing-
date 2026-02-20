import React, { useState } from 'react';
import { Plus, Minus, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    q: "What does an 'AI Marketing Scan' actually do?",
    a: "Our scan analyzes how search engines (like Google) and AI assistants (like ChatGPT) view your business. It checks for missing data, broken links, and consistency errors that prevent you from ranking high in local searches."
  },
  {
    q: "Why is Google Maps so important for my business?",
    a: "For local businesses in South Africa, Google Maps is the modern-day yellow pages. If your profile isn't verified and optimized, your competitors are getting all the phone calls from people searching 'near me'."
  },
  {
    q: "Do I need technical skills to use your services?",
    a: "Not at all. We are a 'done-for-you' agency. We handle the complex technical setup, coding, and AI integration so you can focus on running your business."
  },
  {
    q: "How does the automated lead chatbot work?",
    a: "We train a custom AI assistant on your business's specific services, pricing, and FAQs. It sits on your website and WhatsApp, chatting with potential customers, answering their questions, and booking appointments for you 24/7."
  }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="container mx-auto px-6 py-20 animate-fade-in min-h-[85vh]">
      <div className="max-w-3xl mx-auto">
        <div className="mb-16">
          <span className="text-yellow-500 font-black uppercase tracking-widest text-[10px] mb-4 block">Knowledge Graph Initialization</span>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-6 text-white leading-none">
            System <span className="text-yellow-500">Intelligence</span>
          </h1>
          <p className="text-gray-400 text-lg">Direct, factual, and scientifically precise answers regarding our operational deployment methodologies.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div 
              key={i} 
              className={`border border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === i ? 'bg-[#0a0a0a] border-yellow-500/30' : 'bg-black hover:border-gray-600'}`}
            >
              <button 
                className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-bold text-base md:text-lg text-white pr-8">{faq.q}</span>
                {openIndex === i ? <Minus className="text-yellow-500 shrink-0" size={20} /> : <Plus className="text-gray-500 shrink-0" size={20} />}
              </button>
              
              <div className={`px-6 overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base border-l-2 border-yellow-500 pl-4">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

        {/* UPDATED CTA BOX */}
        <div className="mt-16 p-8 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl text-center shadow-xl">
          <Cpu className="mx-auto text-yellow-500 mb-4" size={32} />
          <h2 className="text-xl font-bold text-white mb-2">Require further diagnostic data?</h2>
          <p className="text-gray-400 mb-6 text-sm">Deploy our Smart Marketing Engine to analyze your specific BUSINESS architecture.</p>
          <Link to="/audit" className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-colors inline-block text-xs">
            Initialize Smart Business Scan
          </Link>
        </div>
      </div>
    </div>
  );
};
