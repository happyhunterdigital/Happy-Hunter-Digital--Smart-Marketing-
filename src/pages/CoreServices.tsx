import React from 'react';
import { Target, Globe, Smartphone, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const SERVICES = [
  {
    title: "Local Search Optimization",
    desc: "If you aren't in the top 3 on Google Maps, you are losing money to competitors. We claim, verify, and optimize your digital footprint to ensure you dominate local searches.",
    icon: <Globe size={40}/>
  },
  {
    title: "AI Answer Engine Optimization (AEO)",
    desc: "People are asking AI for recommendations instead of scrolling Google. We format your business data so AI engines (like ChatGPT) confidently recommend your brand.",
    icon: <Target size={40}/>
  },
  {
    title: "Smart Chatbots & Automation",
    desc: "Never miss a lead again. We install intelligent assistants on your site that answer questions, capture contact info, and schedule appointments 24/7.",
    icon: <MessageSquare size={40}/>
  },
  {
    title: "High-Conversion Web Design",
    desc: "We build blazing-fast, mobile-first websites designed for one purpose: turning your casual visitors into paying customers.",
    icon: <Smartphone size={40}/>
  }
];

export const CoreServices = () => (
  <div className="container mx-auto px-6 py-20 animate-fade-in">
    <div className="text-center max-w-3xl mx-auto mb-20">
      <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-white">
        Smart <span className="text-yellow-500">Solutions</span>
      </h2>
      <p className="text-gray-400 text-lg">We don't just sell marketing; we build digital assets that actively generate revenue for your business.</p>
    </div>

    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {SERVICES.map((s, i) => (
        <div key={i} className="p-10 bg-[#0a0a0a] border border-gray-800 rounded-3xl hover:border-yellow-500/40 transition-all group shadow-lg">
          <div className="text-yellow-500 mb-6 bg-yellow-500/10 w-fit p-4 rounded-2xl group-hover:scale-110 transition-transform">
            {s.icon}
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">{s.title}</h3>
          <p className="text-gray-400 leading-relaxed">{s.desc}</p>
        </div>
      ))}
    </div>

    <div className="mt-20 text-center">
      <Link to="/audit" className="inline-block bg-white text-black px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-yellow-500 transition-colors shadow-xl">
        Get A Custom Strategy
      </Link>
    </div>
  </div>
);
