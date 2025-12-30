import React from 'react';
import { ShieldCheck, Cpu, BrainCircuit, Zap, BarChart3, Users } from 'lucide-react';

export const Services: React.FC = () => {
  const services = [
    {
      id: 'trust-anchor',
      title: 'The Trust Anchor',
      subtitle: '(Compliance & Verification)',
      icon: <ShieldCheck size={32} className="text-brand-yellow" />,
      description: 'Prevent digital eviction. We enforce the "Mirror Rule" and manage your Google Profile as a high-security Digital Passport to ensure you pass the Smart Trust Filter.',
    },
    {
      id: 'megaphone',
      title: 'The Megaphone (LLMO)',
      subtitle: '(Large Language Model Ops)',
      icon: <Cpu size={32} className="text-blue-400" />,
      description: 'Stop writing blog fluff. We create Data-Rich content and Schema that teaches Smart Marketing engines to cite YOU as the primary authority.',
    },
    {
      id: 'revenue-brain',
      title: 'The Revenue Brain',
      subtitle: '(Agentic Automation)',
      icon: <BrainCircuit size={32} className="text-purple-400" />,
      description: 'Fix the leaky bucket. We deploy 24/7 Smart Agents that answer queries, book appointments, and capture revenue while you sleep.',
    },
    {
      id: 'performance',
      title: 'Performance Fuel',
      subtitle: '(Paid Traffic Acceleration)',
      icon: <Zap size={32} className="text-orange-400" />,
      description: 'We use high-intent Google & Social Ads to pour fuel on your Trust Ecosystem, driving immediate traffic to your automated funnels.',
    },
    {
      id: 'community',
      title: 'Community Engineering',
      subtitle: '(Social Brand Signals)',
      icon: <Users size={32} className="text-pink-400" />,
      description: 'The algorithm looks for "Brand Signals" on social platforms. We build an engaged community that proves you are culturally relevant.',
    },
    {
      id: 'truth-ledger',
      title: 'The Truth Ledger',
      subtitle: '(Analytics & ROI)',
      icon: <BarChart3 size={32} className="text-green-400" />,
      description: 'No more guessing. We provide a real-time dashboard showing exactly how your Digital Entity is performing in the eyes of the machine.',
    }
  ];

  return (
    <section id="services" className="bg-brand-dark py-20 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <h2 className="text-brand-yellow font-bold tracking-wider uppercase text-sm mb-3 animate-fadeIn">
            Our Core Service
          </h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            The Smart Authority <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-yellow-200">
              Ecosystem
            </span>
          </h3>
          <p className="text-gray-400 text-lg leading-relaxed">
            We don't just "do ads." We build an interconnected <strong>Digital Entity</strong> designed to survive the 2026 Smart Filter, specifically solving Invisibility, Trust Deficits, and Conversion Disconnects.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id}
              className="group relative bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-brand-yellow/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-yellow/10 cursor-pointer"
            >
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-yellow transition-colors duration-300">
                <div className="group-hover:text-brand-dark transition-colors duration-300">
                   {service.icon}
                </div>
              </div>

              <div className="relative">
                <h4 className="text-xl font-bold text-white mb-1 group-hover:text-brand-yellow transition-colors">
                  {service.title}
                </h4>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  {service.subtitle}
                </p>
                <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
