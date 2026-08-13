// src/components/ProcessSection.tsx
import React, { useRef } from 'react';
import { useInView } from '../hooks/useInView';
import { Search, Shield, Megaphone, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const STEPS = [
  {
    number: "1",
    title: "Free Health Check",
    description: "We scan where your business appears online — your website, Google, Facebook, and directories. We find where your business information is wrong, missing, or inconsistent so you know exactly what to fix. Free, no strings attached.",
    icon: <Search size={24} />,
    color: "from-blue-500 to-cyan-500"
  },
  {
    number: "2",
    title: "Fix Your Foundation",
    description: "We make sure your business name, address, phone number, and services are identical everywhere. Then we add structured code to your website so Google and AI assistants know exactly what you do.",
    icon: <Shield size={24} />,
    color: "from-emerald-500 to-teal-500"
  },
  {
    number: "3",
    title: "Create AI-Friendly Content",
    description: "We write articles, service pages, and FAQs that AI tools like ChatGPT, Gemini, and Perplexity can easily find and quote as the answer. This helps you get recommended, not just ranked.",
    icon: <Megaphone size={24} />,
    color: "from-amber-500 to-orange-500"
  },
  {
    number: "4",
    title: "Automate Your Sales",
    description: "We set up smart chatbots and WhatsApp automation that answer questions, qualify leads, and book appointments 24/7 — so you never miss an opportunity, even when you're not at your desk.",
    icon: <Zap size={24} />,
    color: "from-red-500 to-pink-500"
  }
];

export const ProcessSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { threshold: 0.2 });

  return (
    <section ref={ref} className="py-32 bg-white/[0.02]">
      <div className="container mx-auto px-6">
        <div className={`text-center max-w-2xl mx-auto mb-20 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Our <span className="gradient-text">4-Step Process</span>
          </h2>
          <p className="text-gray-400 text-lg">
            A proven, simple system to transform your business from invisible to unmissable online.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-amber-500 to-red-500 opacity-20 hidden md:block" />
          
          <div className="space-y-12">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                className={`relative flex flex-col md:flex-row gap-8 items-start transition-all duration-700 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
                style={{ transitionDelay: `${i * 200}ms` }}
              >
                <div className={`hidden md:flex absolute left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} items-center justify-center text-white shadow-lg z-10`}>
                  {step.icon}
                </div>
                
                <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:pr-20 md:text-right' : 'md:pl-20 md:ml-auto'}`}>
                  <div className="glass-card-hover p-8">
                    <div className="flex items-center gap-3 mb-4 md:hidden">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white`}>
                        {step.icon}
                      </div>
                      <span className="text-5xl font-black text-white/5">{step.number}</span>
                    </div>
                    <span className="hidden md:block text-6xl font-black text-white/5 mb-2">{step.number}</span>
                    <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`text-center mt-20 transition-all duration-1000 delay-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link to="/audit" className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-2xl transition-all hover:scale-[1.02] hover:shadow-glow">
            Start Free Health Check
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};
