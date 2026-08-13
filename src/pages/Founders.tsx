import React from 'react';
import { Linkedin, Mail, Target, CheckCircle2 } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';

const ICP_ITEMS = [
  "South African businesses with R1M-R50M annual revenue",
  "Service-based businesses (legal, medical, financial, trades)",
  "Businesses with physical locations needing local customers",
  "Companies frustrated with agencies that look busy but don't deliver results",
  "Businesses ready to invest in a digital presence that actually works",
];

export const Founders = () => (
  <div className="container mx-auto px-6 py-20 min-h-[85vh] animate-fade-in">
    <PageMeta
      title="About Thabo Motsumi | Happy Hunter Digital"
      description="Meet Thabo Leslie Motsumi, founder of Happy Hunter Digital. A digital marketing strategist helping South African businesses get found by Google, AI, and new customers."
      path="/founders"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Thabo Leslie Motsumi",
        "jobTitle": "Growth Strategist",
        "worksFor": { "@type": "Organization", "name": "Happy Hunter Digital" },
        "url": "https://www.happyhunterdigital.com/founders",
        "sameAs": [
          "https://www.linkedin.com/in/thabomotsumi",
          "https://x.com/HappyHunter35"
        ]
      }}
    />
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-12 gap-16 items-start">
        
        <div className="md:col-span-7 space-y-8">
          <div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-2 leading-[0.9]">
              Thabo Leslie <br/><span className="text-yellow-500">Motsumi</span>
            </h1>
            <p className="text-gray-500 uppercase tracking-widest font-bold text-xs mt-4">Growth Strategist & Founder</p>
          </div>

          <div className="space-y-6 text-gray-300 leading-relaxed text-lg border-l-2 border-gray-800 pl-6">
            <p>
              I founded <span className="font-handwriting text-2xl lowercase text-white">happyhunterdigital</span> because most digital marketing agencies in South Africa were failing their clients. They measured success by activity — how many posts they published, how many reports they sent — not by whether you actually got more customers.
            </p>
            <p>
              In 2026, the rules changed. ChatGPT, Gemini, and Google AI Overviews don't care about your Instagram posts. They care about whether your business information is correct, consistent, and easy for them to find and understand. That's what we focus on now.
            </p>
            <p>
              We help your business show up everywhere your customers are looking — Google search, Google Maps, AI chatbots, and WhatsApp. When someone in Johannesburg or Pretoria asks "who's the best plumber near me," or asks ChatGPT for a recommendation, we make sure your business is the answer.
            </p>
            <p>
              Unlike other agencies, we don't just publish content and hope for the best. We fix the foundation: your website, your Google listing, your reviews, and your customer communication — all working together so nothing gets lost in the gaps.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <a href="https://www.linkedin.com/in/thabomotsumi" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-[#0a0a0a] border border-gray-800 rounded-xl hover:text-yellow-500 hover:border-yellow-500 transition-all font-bold text-sm uppercase tracking-wider">
              <Linkedin size={18} /> LinkedIn
            </a>
            <a href="mailto:hello@happyhunterdigital.com" className="flex items-center gap-2 px-6 py-3 bg-[#0a0a0a] border border-gray-800 rounded-xl hover:text-yellow-500 hover:border-yellow-500 transition-all font-bold text-sm uppercase tracking-wider">
              <Mail size={18} /> Email
            </a>
          </div>
        </div>

        <div className="md:col-span-5 space-y-8">
          <div className="aspect-[3/4] bg-gray-900 border border-gray-800 rounded-[2rem] overflow-hidden relative shadow-2xl">
            <img 
              src="https://res.cloudinary.com/dka0498ns/image/upload/v1766069617/Thabo_Leslie_Motsumi._AI_Google_my_Business_profile_optimization_Search_Everywhere_Optimation_SEO_Automation_and_Smart_digital_marketing._vncyse.png"
              alt="Thabo Leslie Motsumi - Founder of Happy Hunter Digital"
              className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 right-0 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-l border-gray-800 p-5 rounded-tl-3xl text-right">
              <p className="font-black uppercase tracking-wider text-yellow-500 text-lg leading-none">Thabo Leslie Motsumi</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">Founder</p>
            </div>
          </div>
        </div>
      </div>

      {/* ICP Section */}
      <div className="mt-24 max-w-4xl mx-auto">
        <div className="bg-white/[0.02] border border-amber-500/20 rounded-3xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <Target className="text-amber-500" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Who We Help</h2>
              <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">The businesses that benefit most from our work</p>
            </div>
          </div>
          <ul className="space-y-3">
            {ICP_ITEMS.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);
