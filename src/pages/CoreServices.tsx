import React from 'react';
import { Target, Globe, Server, Code, ShoppingCart, LayoutTemplate, Smartphone, BrainCircuit, Mail, MapPin, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const SMART_MARKETING = [
  {
    title: "AI-Powered Marketing Strategy",
    desc: "We integrate elite AI tools for content creation, customer service, and predictive data analysis to help startups scale efficiently. Work smarter, not harder.",
    icon: <BrainCircuit size={32}/>
  },
  {
    title: "Local Lead Generation (ZA Long-Tail)",
    desc: "We execute hyper-localized SEO protocols (e.g., 'best solar installers in Pretoria East'). We map intent to capture the South African 'Near Me' economy.",
    icon: <MapPin size={32}/>
  },
  {
    title: "Marketing Automation & Personalization",
    desc: "We deploy automated email drip campaigns and real-time customer personalization to remove manual operational tasks from your sales funnel.",
    icon: <Mail size={32}/>
  },
  {
    title: "Strategic Opportunity Audits",
    desc: "We perform intense marketing gap analyses to identify exactly where competitors are winning and how AI can lower your Customer Acquisition Cost (CAC).",
    icon: <Search size={32}/>
  }
];

const DIGITAL_INFRASTRUCTURE = [
  {
    title: "eCommerce Architecture",
    desc: "Scalable Shopify and WooCommerce stores designed for the complete customer journey, maximizing Return on Ad Spend (ROAS) via mobile-first design.",
    icon: <ShoppingCart size={32}/>
  },
  {
    title: "Corporate Authority Sites",
    desc: "Clean, modern layouts with clear value propositions and integrated trust-building elements (case studies, reviews) designed to generate high-quality B2B leads.",
    icon: <LayoutTemplate size={32}/>
  },
  {
    title: "Performance Landing Pages",
    desc: "Single-purpose, high-velocity assets built for A/B testing and heavy optimization across Google and Meta ad traffic.",
    icon: <Target size={32}/>
  },
  {
    title: "Custom Web Applications",
    desc: "Engineering complex technical builds including secure Client Portals, Project Management dashboards, and Automated Catalogues.",
    icon: <Code size={32}/>
  }
];

export const CoreServices = () => (
  <div className="bg-[#050505] min-h-screen pb-20 animate-fade-in pt-32">
    
    <div className="container mx-auto px-6 text-center max-w-4xl mb-24">
      <span className="inline-block px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
        The Dual-Threat Agency
      </span>
      <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-white leading-none">
        Architectural <span className="text-yellow-500 italic">Alignment</span>
      </h1>
      <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
        We operate at the intersection of Technical Web Development and Agentic AI Strategy. We build the infrastructure, and we deploy the intelligence.
      </p>
    </div>

    {/* Division 1: Smart Marketing */}
    <section className="container mx-auto px-6 max-w-6xl mb-32">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-12 border-b border-gray-800 pb-6">
        <h2 className="text-4xl font-black text-white uppercase tracking-tight">
          Happy Hunter <span className="text-yellow-500">Smart Marketing</span>
        </h2>
        <span className="hidden md:block text-gray-700">|</span>
        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">AI Strategy & Growth Automation</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {SMART_MARKETING.map((s, i) => (
          <div key={i} className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl hover:border-yellow-500/30 transition-all group flex gap-6 items-start">
            <div className="text-yellow-500 bg-yellow-500/10 p-4 rounded-2xl group-hover:scale-110 transition-transform shrink-0">
              {s.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Division 2: Digital Infrastructure */}
    <section className="container mx-auto px-6 max-w-6xl mb-24">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-12 border-b border-gray-800 pb-6">
        <h2 className="text-4xl font-black text-white uppercase tracking-tight">
          Happy Hunter <span className="text-white">Digital</span>
        </h2>
        <span className="hidden md:block text-gray-700">|</span>
        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Web Dev & eCommerce Builds</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {DIGITAL_INFRASTRUCTURE.map((web, index) => (
          <div key={index} className="p-8 bg-[#0a0a0a] border border-gray-800 rounded-3xl hover:border-white/30 transition-all group flex gap-6 items-start">
            <div className="text-white bg-white/5 p-4 rounded-2xl group-hover:scale-110 transition-transform shrink-0">
              {web.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">{web.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{web.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <div className="container mx-auto px-6 max-w-4xl">
      <div className="p-10 bg-gradient-to-br from-gray-900 to-black border border-yellow-500/20 rounded-[3rem] text-center shadow-2xl">
        <Server className="mx-auto text-yellow-500 mb-6" size={40} />
        <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-4">Identify Your Untapped Opportunities</h3>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          Whether you need a high-converting Shopify store or an AI workflow to handle your local lead generation, it begins with an audit of your current digital entity.
        </p>
        <Link to="/audit" className="inline-block bg-yellow-500 text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-colors shadow-lg">
          Execute 15-Minute Audit
        </Link>
      </div>
    </div>

  </div>
);
