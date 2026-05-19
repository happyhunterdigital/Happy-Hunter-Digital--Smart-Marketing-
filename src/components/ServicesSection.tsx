// src/components/ServicesSection.tsx
import React, { useRef } from 'react';
import { useInView } from '../hooks/useInView';
import { ServiceCard } from './ServiceCard';
import { Database, Mic, MessageSquareCode } from 'lucide-react';

const SERVICES = [
  {
    phase: "01",
    title: "AI-Ready Websites",
    subtitle: "Entity Architecture",
    description: "Stop losing customers to outdated websites. We build lightning-fast, modern platforms that Google and AI assistants love to recommend.",
    features: [
      "SSR-optimized for instant load speeds",
      "Schema.org JSON-LD structured data",
      "RAG-ready content formatting"
    ],
    priceStart: "R3,950",
    icon: <Database size={28} />,
    isPopular: false
  },
  {
    phase: "02",
    title: "24/7 Digital Receptionists",
    subtitle: "Agentic Revenue",
    description: "Never let a customer wait. Our AI agents answer questions, qualify leads, and book appointments around the clock.",
    features: [
      "Smart FAQ handling & ticket routing",
      "AI-powered lead qualification",
      "Automated calendar booking"
    ],
    priceStart: "R1,800",
    icon: <Mic size={28} />,
    isPopular: true
  },
  {
    phase: "03",
    title: "WhatsApp Commerce",
    subtitle: "Conversational Sales",
    description: "Turn the app your customers already use into your most powerful and frictionless sales channel.",
    features: [
      "Official WhatsApp API integration",
      "Interactive product catalogues",
      "Native in-chat payments"
    ],
    priceStart: "R4,500",
    icon: <MessageSquareCode size={28} />,
    isPopular: false
  }
];

export const ServicesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden bg-deep-950">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className={`text-center max-w-2xl mx-auto mb-20 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">
            Our Protocols
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Three Phases of <span className="gradient-text">Digital Dominance</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            From entity architecture to autonomous revenue. Each phase builds upon the last to create an unstoppable digital presence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((service, i) => (
            <div
              key={service.phase}
              className={`transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <ServiceCard {...service} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
