// src/components/ServiceCard.tsx
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface ServiceCardProps {
  phase: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  priceStart: string;
  isPopular?: boolean;
  icon: React.ReactNode;
  index: number;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  phase, title, subtitle, description, features, priceStart, isPopular, icon, index
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTransform({
      rotateX: (y - 0.5) * -10,
      rotateY: (x - 0.5) * 10
    });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      className={`relative group transition-all duration-500 ${index === 1 ? 'lg:-translate-y-4' : ''}`}
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`relative p-8 rounded-3xl backdrop-blur-xl border transition-all duration-300 ${
          isPopular
            ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/30 shadow-[0_8px_32px_rgba(251,191,36,0.1)]'
            : 'bg-white/[0.03] border-white/10 hover:border-white/20'
        }`}
        style={{
          transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
          transition: isHovered ? 'none' : 'transform 0.5s ease-out'
        }}
      >
        {isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full">
            Most Popular
          </div>
        )}
        
        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} style={{ filter: 'blur(20px)' }} />
        
        <div className="relative z-10">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${isPopular ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-gray-400'}`}>
            {icon}
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/70 mb-2">
            Phase {phase}
          </div>
          <h3 className="text-2xl font-black text-white mb-1 tracking-tight">{title}</h3>
          <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">{description}</p>
          <ul className="space-y-3 mb-8">
            {features.slice(0, 3).map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <CheckCircle2 size={14} className="text-amber-500/60 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Starting from</span>
              <p className="text-3xl font-black text-white">{priceStart}</p>
            </div>
            <Link to="/services" className="group/btn flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-amber-500 text-gray-300 hover:text-black transition-all text-sm font-semibold">
              Details
              <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
