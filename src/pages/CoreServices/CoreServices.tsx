import React from 'react';
import { Database, BrainCircuit, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PricingTier } from './PricingTier';
import { CoreServicesForm } from './CoreServicesForm';
import { SERVICES_DATA, STANDALONE_SERVICES, GROWTH_SERVICES } from '../../data/servicesData';

const ICONS: Record<string, React.ReactNode> = {
  Database: <Database size={32} />, 
  BrainCircuit: <BrainCircuit size={32} />, 
  ShieldCheck: <ShieldCheck size={32} />
};

export const CoreServices: React.FC = () => {
  return (
    <div className="bg-[#050505] min-h-screen pb-0 animate-fade-in font-sans selection:bg-yellow-500 selection:text-black">
      <header className="relative pt-40 pb-24 border-b border-gray-800 overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
        </div>
        <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">The 2026 Protocol</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none text-white">
            Stop being a <span className="text-yellow-500 italic text-white underline decoration-yellow-500/30 underline-offset-[12px]">Ghost</span> to AI.
          </h1>
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
            We build AI-ready Entity Architectures, verify Google Business Profiles, and deploy Agentic WhatsApp Revenue Systems. Choose your dominance tier.
          </p>
        </div>
      </header>

      <div className="bg-[#050505]">
        {SERVICES_DATA.map((phase, idx) => (
          <section key={phase.phase} className={`py-24 px-6 relative border-b border-gray-900 ${idx % 2 !== 0 ? 'bg-[#020202]' : ''}`}>
            <div className="container mx-auto max-w-7xl">
              <div className="mb-16 text-center">
                <h2 className="text-sm font-black text-yellow-500 uppercase tracking-widest mb-2">Phase {phase.phase}</h2>
                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">{phase.title}</h3>
                <p className="text-gray-400 mt-4 max-w-2xl mx-auto">{phase.description}</p>
              </div>
              <div className="grid lg:grid-cols-1 max-w-lg mx-auto items-stretch">
                {phase.tiers.map(tier => (
                  <PricingTier
                    key={tier.title}
                    phase={phase.phase}
                    title={tier.title}
                    subtitle={tier.subtitle}
                    target={tier.target}
                    description={tier.description}
                    priceStart={tier.priceStart}
                    features={tier.features}
                    isPopular={tier.isPopular}
                    highlightColor={tier.isPopular ? "yellow-500" : "white"}
                    icon={ICONS[phase.iconType as keyof typeof ICONS] || ICONS.Database}
                  />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* STANDALONE SERVICES SECTION */}
      <section className="py-24 px-6 relative border-b border-gray-900 bg-[#0a0a0a]">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">Standalone Services</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Once-off foundational upgrades to verify your digital entity, including dedicated Google Business Profile verification.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {STANDALONE_SERVICES.map((item, i) => (
              <div key={i} className="bg-[#050505] border border-gray-800 p-6 rounded-2xl hover:border-yellow-500/50 transition-colors flex flex-col">
                <h4 className="text-lg font-black text-white mb-2">{item.title}</h4>
                <p className="text-sm text-gray-400 mb-6 flex-grow">{item.desc}</p>
                <p className="text-xl font-black text-yellow-500 mb-6">{item.price}</p>
                <Link to="/audit" className="w-full block text-center py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all bg-gray-800 text-white hover:bg-yellow-500 hover:text-black mt-auto">Invest Now</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GROWTH SERVICES SECTION */}
      <section className="py-24 px-6 relative border-b border-gray-900 bg-[#050505]">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">Growth Retainers</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Monthly intelligence injection, continuous AEO optimization, and GBP management.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {GROWTH_SERVICES.map((item, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-2xl hover:border-yellow-500/50 transition-colors flex flex-col">
                <h4 className="text-lg font-black text-white mb-2">{item.title}</h4>
                <p className="text-sm text-gray-400 mb-6 flex-grow">{item.desc}</p>
                <p className="text-xl font-black text-yellow-500 mb-6">{item.price}</p>
                <Link to="/audit" className="w-full block text-center py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all bg-gray-800 text-white hover:bg-yellow-500 hover:text-black mt-auto">Invest Now</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <CoreServicesForm />
    </div>
  );
};
