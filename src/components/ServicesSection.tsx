// src/components/ServicesSection.tsx
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import { HeroCarousel, HeroSlide } from './HeroCarousel';

export const ServicesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });
  const navigate = useNavigate();

  const slides: HeroSlide[] = [
    {
      id: 'playbook',
      title: 'THE 2026 DIGITAL MARKETING PLAYBOOK',
      description: 'Your Competitors Are Already Using These Strategies. Are You? The complete playbook for AI-powered personalization, conversational commerce, and the trust-driven future of digital marketing.',
      buttonText: 'Open Playbook',
      onButtonClick: () => navigate('/smart-news/playbook'),
      bgType: 'image',
      bgUrl: 'https://res.cloudinary.com/dka0498ns/image/upload/v1774976519/happyhunterdigital_Email_Marketing_zqxmk4.png'
    },
    {
      id: 'local-search-2026',
      title: 'THE EVOLUTION OF LOCAL SEARCH',
      description: 'Entity Alignment & Authentic Video. Google is prioritizing real-world, high-velocity social signals and raw, owner-shot video over traditional static citations.',
      buttonText: 'Read Local Search Protocol',
      onButtonClick: () => navigate('/blog/local-search-2026'),
      bgType: 'image',
      bgUrl: 'https://res.cloudinary.com/dka0498ns/image/upload/v1770623694/IMG-20260209-WA0025_zgpgf7.jpg',
      overlayElement: (
        <div className="bg-[#18191bba] backdrop-blur-md border border-amber-500/20 p-5 rounded-2xl text-white w-72 shadow-xl relative overflow-hidden">
          <p className="text-xs text-amber-500 uppercase tracking-widest font-bold mb-2">Live Verification</p>
          <div className="w-full h-20 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg flex items-center justify-center relative overflow-hidden border border-white/5">
            <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400">Processing Geospatial Signal...</span>
          </div>
        </div>
      )
    },
    {
      id: 'ai-megaphone',
      title: 'CONFUSED AI = INVISIBLE BUSINESS',
      description: 'Why isn\'t my business showing up in Google\'s AI Overviews? We format your content specifically for RAG retrieval so ChatGPT, Gemini, and Perplexity cite you as the authority.',
      buttonText: 'Read AEO Blueprint',
      onButtonClick: () => navigate('/blog/ai-megaphone'),
      bgType: 'image',
      bgUrl: 'https://res.cloudinary.com/dka0498ns/image/upload/v1772003988/happyhunterdigital_Answer_Engine_Optimization_poster_m3tp29.png',
      overlayElement: (
        <div className="bg-[#18191bba] backdrop-blur-md border border-amber-500/20 p-5 rounded-2xl text-white w-72 shadow-xl">
          <p className="text-xs text-amber-500 uppercase tracking-widest font-bold mb-2">AEO Score</p>
          <div className="text-3xl font-black text-amber-500 leading-none">94/100</div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Algorithmic Confidence</p>
        </div>
      )
    },
    {
      id: 'beyond-the-blue-link',
      title: 'BEYOND THE BLUE LINK',
      description: 'Why Ranking on Page One is Obsolete in 2026. Static websites are liabilities. Reframe your website as an AI-ready digital asset formatted specifically for LLM ingestion.',
      buttonText: 'Read GEO Strategy',
      onButtonClick: () => navigate('/blog/beyond-the-blue-link'),
      bgType: 'image',
      bgUrl: 'https://res.cloudinary.com/dka0498ns/image/upload/v1780147383/Beyond_the_Blue_Link_Why_Ranking_on_Page_One_is_Obsolete_in_2026_nyrxwv.jpg'
    },
    {
      id: 'entity-architect',
      title: 'YOUR GOOGLE BUSINESS PROFILE IS NOT ENOUGH',
      description: 'The critical step to becoming an AI-verified entity. Align your public categories with your website schema markup to prevent downscoring from data fragmentation.',
      buttonText: 'Resolve Identity Crisis',
      onButtonClick: () => navigate('/blog/entity-architect'),
      bgType: 'image',
      bgUrl: 'https://res.cloudinary.com/dka0498ns/image/upload/v1762761706/Happy_Hunter_work_space_jovfrh.png'
    },
    {
      id: 'revenue-brain',
      title: 'THE REVENUE BRAIN: AGENTIC LEAD AUTOMATION',
      description: 'Uncouple your revenue from linear human effort. Deploy 24/7 intelligent AI receptionists to qualify leads and book appointments autonomously.',
      buttonText: 'Explore Automation',
      onButtonClick: () => navigate('/blog/revenue-brain'),
      bgType: 'image',
      bgUrl: 'https://res.cloudinary.com/dka0498ns/image/upload/v1780147988/pomelli_photoshoot-4_na38o8.jpg',
      overlayElement: (
        <div className="bg-[#18191bba] backdrop-blur-md border border-amber-500/20 p-5 rounded-2xl text-white w-72 shadow-xl">
          <p className="text-xs text-green-400 uppercase tracking-widest font-bold mb-2">Agent Active</p>
          <div className="text-2xl font-black text-white leading-none">24/7</div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Autonomous Lead Triaging</p>
        </div>
      )
    },
    {
      id: 'synthesis',
      title: 'SYNTHESIS: COMPREHENSIVE GTM',
      description: 'How the Trust Anchor, AI Megaphone, and Revenue Brain converge into a self-reinforcing revenue loop to scale your digital presence.',
      buttonText: 'Read Synthesis Blueprint',
      onButtonClick: () => navigate('/blog/synthesis'),
      bgType: 'image',
      bgUrl: 'https://res.cloudinary.com/dka0498ns/image/upload/v1772008921/Yellow_and_Orange_Simple_Page_Border_Double-Sided_Poster_A3_Landscape_lylnxz.png'
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
