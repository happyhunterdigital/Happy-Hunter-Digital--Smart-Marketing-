// src/components/CaseStudyCard.tsx
import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface CaseStudyProps {
  client: string;
  logo: string;
  industry: string;
  beforeImage: string;
  afterImage: string;
  metrics: { label: string; value: string; icon: React.ReactNode }[];
  onOpenLightbox: () => void;
}

export const CaseStudyCard: React.FC<CaseStudyProps> = ({
  client, logo, industry, afterImage, metrics, onOpenLightbox
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative rounded-3xl overflow-hidden bg-white/[0.02] border border-white/5 hover:border-amber-500/20 transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[16/10] overflow-hidden cursor-pointer" onClick={onOpenLightbox}>
        <img src={afterImage} alt={client} className="w-full h-full object-cover" />
        <div className={`absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/50 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full text-white font-semibold text-sm flex items-center gap-2 border border-white/20">
            View Transformation
          </div>
        </div>
        <div className="absolute top-4 left-4 flex items-center gap-3">
          <img src={logo} alt={client} className="h-10 w-auto object-contain bg-white/10 backdrop-blur-xl rounded-xl p-2" />
          <div>
            <p className="text-white font-bold text-sm">{client}</p>
            <p className="text-amber-400 text-[10px] font-bold uppercase tracking-widest">{industry}</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {metrics.map((metric, i) => (
            <div key={i} className="text-center">
              <div className="flex justify-center mb-2 text-amber-500/60">{metric.icon}</div>
              <p className="text-xl font-black text-white">{metric.value}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{metric.label}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onOpenLightbox}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 hover:bg-amber-500/10 text-gray-400 hover:text-amber-400 transition-all text-sm font-semibold border border-white/5 hover:border-amber-500/20"
        >
          Read Full Case Study <ArrowUpRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
