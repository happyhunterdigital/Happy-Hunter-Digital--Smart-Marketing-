// src/components/ServicesSection.tsx
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import { HeroCarousel, HeroSlide } from './HeroCarousel';
import { Sparkles } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });
  const navigate = useNavigate();

  const slides: HeroSlide[] = [
    {
      id: 'local-search-2026',
      title: 'THE EVOLUTION OF LOCAL SEARCH IN 2026',
      description: 'Local search is now governed by dynamic Entity Authority and Social Signal Velocity. Find out why raw, owner-shot video has become Google\'s ultimate ranking signal.',
      buttonText: 'Read Local Search Protocol',
      onButtonClick: () => navigate('/blog/local-search-2026'),
      bgType: 'image',
      bgUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
      overlayElement: (
        <div className="bg-[#18191bba] backdrop-blur-md border border-[#ffffff15] p-5 rounded-2xl text-white w-72 shadow-xl animate-pulse">
          <p className="text-xs text-amber-500 uppercase tracking-widest font-bold mb-2">Live Signals</p>
          <p className="text-xs text-[#9ca3af]">Google Vision AI is indexing owner-shot job site footage in Pretoria.</p>
        </div>
      )
    },
    {
      id: 'aeo- megaphone',
      title: 'CONFUSED AI = INVISIBLE BUSINESS',
      description: 'The Zero-Click Crisis is here. Up to 40% of queries end inside the AI interface. Shift your strategy to secure Share of Model rather than traditional clicks.',
      buttonText: 'Read AEO Blueprint',
      onButtonClick: () => navigate('/blog/ai-megaphone'),
      bgType: 'image',
      bgUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'revenue-brain',
      title: 'THE REVENUE BRAIN: AGENTIC QUALIFICATION',
      description: 'Uncouple your revenue from linear human effort. Deploy 24/7 intelligent AI receptionists to qualify leads and book consultations directly via WhatsApp.',
      buttonText: 'Explore Automation',
      onButtonClick: () => navigate('/blog/revenue-brain'),
      bgType: 'image',
      bgUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80',
      overlayElement: (
        <div className="bg-[#18191bba] backdrop-blur-md border border-[#ffffff15] p-5 rounded-2xl text-white w-72 shadow-xl">
          <p className="text-xs text-green-400 uppercase tracking-widest font-bold mb-2">Agent Metrics</p>
          <div className="text-2xl font-black text-white leading-none">2.8x</div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Higher cart recovery rate</p>
        </div>
      )
    }
  ];

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden bg-[#0a0a0f]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className={`text-center max-w-2xl mx-auto mb-20 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">
            Smart News Carousel
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">
            The <span className="gradient-text">Pillars</span> of Strategic Marketing
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            From entity architecture to autonomous revenue. Experience the structural and conversational blueprint of modern web visibility.
          </p>
        </div>

        <div className={`transition-all duration-1000 ${isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <HeroCarousel slides={slides} autoPlaySpeed={6000} />
        </div>
      </div>
    </section>
  );
};
