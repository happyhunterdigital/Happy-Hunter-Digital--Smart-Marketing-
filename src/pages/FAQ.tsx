import React, { useState } from 'react';
import { Sparkles, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';

const FAQS = [
  { q: "How much does a website cost?", a: "It depends on what you need — a simple business site, an online store, or something custom. Check our Services page for exact pricing, or get a free online health check and we'll tell you what's right for your business." },
  { q: "How do I get my business to show up on Google?", a: "We check your website, your Google Business Profile, and your online listings, then fix whatever is stopping you from showing up. Usually it's things like missing information, a slow website, or an unverified Google listing." },
  { q: "How do I get my business mentioned by ChatGPT and AI search?", a: "AI tools like ChatGPT pull information from your website, your Google listing, and your reviews. We make sure that information is accurate, consistent, and easy for AI to read, so when someone asks \"who's the best plumber in Pretoria,\" your business comes up." },
  { q: "What is a smart chatbot?", a: "It's a chat assistant on your website that answers customer questions and books appointments automatically, 24 hours a day, so you never miss a lead after hours." },
  { q: "Can you help me sell through WhatsApp?", a: "Yes. We set up product catalogues, automatic replies, and order-taking so customers can browse and buy directly in WhatsApp — no app download needed." },
  { q: "Do you offer legal, medical, or financial advice?", a: "No — we're a digital marketing agency. We build the websites, chatbots, and WhatsApp tools that help legal, medical, and financial professionals get found and booked by more clients." }
];

export const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = FAQS.filter(faq => 
    faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-6 py-20 animate-fade-in min-h-[85vh]">
      <PageMeta
        title="Frequently Asked Questions | Happy Hunter Digital"
        description="Answers to common questions about getting found online, websites, AI chatbots, and WhatsApp sales for South African small businesses."
        path="/faq"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": FAQS.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": { "@type": "Answer", "text": faq.a }
          }))
        }}
      />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 text-white">Common <span className="text-yellow-500 italic">Questions</span></h1>
        
        <div className="relative mb-12">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-yellow-500" size={20} />
          </div>
          <input
            type="text"
            placeholder="Search our FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-gray-800 text-white pl-12 pr-6 py-5 rounded-2xl focus:border-yellow-500 focus:shadow-neural-glow outline-none font-mono transition-all text-sm"
          />
        </div>

        <div className="space-y-6">
          {filteredFaqs.length > 0 ? filteredFaqs.map((faq, i) => (
            <div key={i} className="bg-black border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-yellow-500/30 transition-all">
              <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-start gap-3 mb-4">
                <Sparkles className="text-yellow-500 shrink-0 mt-1" size={16} />
                <h3 className="font-bold text-lg text-white">{faq.q}</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed pl-7 border-l-2 border-gray-800 ml-2">{faq.a}</p>
            </div>
          )) : (
            <div className="text-center py-10 text-gray-500 font-mono">No FAQs match your search.</div>
          )}
        </div>

        <div className="mt-20 p-10 bg-black border border-yellow-500/30 rounded-[2rem] text-center shadow-neural-glow">
          <Sparkles className="mx-auto text-yellow-500 mb-6" size={40} />
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Still have questions?</h2>
          <p className="text-gray-400 mb-8 text-sm max-w-md mx-auto leading-relaxed">Get a free online health check and we'll tell you exactly what's stopping customers from finding you.</p>
          <Link to="/audit" className="bg-yellow-500 text-black px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all text-xs inline-block">Get My Free Health Check</Link>
        </div>
      </div>
    </div>
  );
};
