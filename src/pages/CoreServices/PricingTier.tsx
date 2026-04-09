import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PricingTierProps {
  phase: number;
  title: string;
  subtitle: string;
  target: string;
  description: string;
  priceStart: string;
  priceEnd?: string;
  period?: string;
  features: string[];
  isPopular?: boolean;
  highlightColor: string;
  icon?: React.ReactNode;
}

export const PricingTier: React.FC<PricingTierProps> = ({
  title, subtitle, target, description, priceStart, priceEnd, period, features, isPopular, highlightColor, icon
}) => {
  return (
    <div className={`p-8 rounded-3xl flex flex-col relative transition-all ${
      isPopular 
        ? `bg-gradient-to-br from-[#111827] to-[#0a0a0a] border-2 border-${highlightColor}/50 shadow-[0_0_40px_rgba(234,179,8,0.1)] transform lg:-translate-y-4 z-10 hover:border-${highlightColor}` 
        : `bg-[#0a0a0a] border border-gray-800 hover:border-${highlightColor}/30`
    }`}>
      {isPopular && (
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-${highlightColor} text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest`}>
          Most Popular
        </div>
      )}

      <div className="mb-8">
        {icon && <div className={`mb-4 ${highlightColor === 'yellow-500' ? 'text-yellow-500' : 'text-white'}`}>{icon}</div>}
        <h4 className="text-2xl font-black text-white mb-1">{title}</h4>
        <p className={`text-${highlightColor} text-xs font-bold uppercase tracking-widest`}>{subtitle}</p>
      </div>

      <p className="text-sm text-gray-400 mb-8 pb-8 border-b border-gray-800">Best for: {target}</p>

      <div className="flex-grow space-y-4 mb-10">
        <p className="text-white text-sm font-medium">{description}</p>
        <ul className="space-y-3 text-sm text-gray-300">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 size={16} className={`text-${highlightColor} shrink-0 mt-0.5`} />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-6 border-t border-gray-800/50">
        <p className={`text-3xl font-black ${isPopular ? `text-${highlightColor}` : 'text-white'}`}>
          {priceStart} {priceEnd && <span className="text-lg text-gray-500 font-medium">to</span>} {priceEnd}
        </p>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 mb-6">
          {period ? `for the period of ${period}` : 'Once-Off Investment'}
        </p>
        
        <Link 
          to="/audit" 
          className={`w-full block text-center py-4 rounded-xl font-black uppercase tracking-widest transition-all ${
            isPopular 
              ? 'bg-yellow-500 text-black hover:bg-white shadow-lg' 
              : 'bg-gray-800 text-white hover:bg-yellow-500 hover:text-black'
          }`}
        >
          Invest Now
        </Link>
      </div>
    </div>
  );
};
