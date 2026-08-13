import React, { useRef } from 'react';
import { useInView } from '../hooks/useInView';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, X as XIcon } from 'lucide-react';

const COMPARISONS = [
  { aspect: "Content Format", traditional: "Blog posts for humans", aiReady: "Structured pages + clear answers" },
  { aspect: "Search Visibility", traditional: "Rank on Google page 1", aiReady: "Mentioned by ChatGPT & Gemini" },
  { aspect: "Technical Setup", traditional: "Basic HTML website", aiReady: "Structured data code for AI" },
  { aspect: "Lead Capture", traditional: "Contact form (hours wait)", aiReady: "24/7 chatbot + WhatsApp replies" },
  { aspect: "Local Search", traditional: "Just a Google listing", aiReady: "Correct info everywhere online" },
  { aspect: "Conversion Rate", traditional: "1-3% website average", aiReady: "8-15% with instant replies" },
  { aspect: "Time to First Lead", traditional: "3-6 months SEO ramp", aiReady: "2-4 weeks with setup fixes" },
  { aspect: "Competitive Edge", traditional: "Same template as everyone", aiReady: "Complete, consistent presence" },
];

export const SeoVsAiComparison: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });

  return (
    <section ref={sectionRef} className="py-24 bg-[#050505]">
      <div className="container mx-auto px-6">
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">
            What Changed in 2026
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">
            Old SEO vs <span className="text-amber-500">AI-First Marketing</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            What worked in 2024 won't get you found in 2026. AI tools like ChatGPT and Google's AI Overviews now answer customer questions directly. Here's the difference.
          </p>
        </div>

        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid gap-0 border border-white/5 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 bg-white/[0.03] border-b border-white/5">
              <div className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">What Changed</div>
              <div className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Old Approach</div>
              <div className="p-4 text-[10px] font-black uppercase tracking-widest text-amber-400 text-center">AI-First Approach</div>
            </div>
            {COMPARISONS.map((row, i) => (
              <div key={i} className="grid grid-cols-3 border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors">
                <div className="p-4 text-sm font-bold text-white flex items-center">{row.aspect}</div>
                <div className="p-4 text-sm text-gray-500 flex items-center gap-2">
                  <XIcon size={14} className="text-red-500/60 shrink-0" />
                  <span>{row.traditional}</span>
                </div>
                <div className="p-4 text-sm text-gray-300 flex items-center gap-2">
                  <Check size={14} className="text-amber-500 shrink-0" />
                  <span>{row.aiReady}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/audit"
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-black font-black uppercase tracking-widest text-sm rounded-xl hover:bg-amber-400 transition-all hover:scale-[1.02]"
            >
              Find Out Where You Stand <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
