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
      title: 'The 2026 Digital Marketing Playbook',
      description: 'Your competitors are already using these strategies. Are you? The complete guide to showing up on Google, ChatGPT, and WhatsApp for South African businesses.',
      buttonText: 'Read the Playbook',
      onButtonClick: () => navigate('/smart-news/playbook'),
      bgType: 'image',
      bgUrl: 'https://res.cloudinary.com/dka0498ns/image/upload/v1774976519/happyhunterdigital_Email_Marketing_zqxmk4.png'
    },
    {
      id: 'local-search-2026',
      title: 'The Evolution of Local Search',
      description: 'Google now prioritizes real, owner-shot videos and social proof over static listings. Find out what this means for your local business.',
      buttonText: 'Read the Local Search Guide',
      onButtonClick: () => navigate('/blog/local-search-2026'),
      bgType: 'image',
      bgUrl: 'https://res.cloudinary.com/dka0498ns/image/upload/v1770623694/IMG-20260209-WA0025_zgpgf7.jpg',
    },
    {
      id: 'ai-megaphone',
      title: 'Confused AI = Invisible Business',
      description: 'Why isn\'t ChatGPT recommending your business? We write your content in a way that AI assistants can find and quote when customers ask for you.',
      buttonText: 'Read the AI Guide',
      onButtonClick: () => navigate('/blog/ai-megaphone'),
      bgType: 'image',
      bgUrl: 'https://res.cloudinary.com/dka0498ns/image/upload/v1772003988/happyhunterdigital_Answer_Engine_Optimization_poster_m3tp29.png',
    },
    {
      id: 'beyond-the-blue-link',
      title: 'Beyond the Blue Link',
      description: 'Why just ranking on page one of Google is no longer enough in 2026. Your website needs to be built for AI tools to find and recommend.',
      buttonText: 'Read the Strategy Guide',
      onButtonClick: () => navigate('/blog/beyond-the-blue-link'),
      bgType: 'image',
      bgUrl: 'https://res.cloudinary.com/dka0498ns/image/upload/v1780147383/Beyond_the_Blue_Link_Why_Ranking_on_Page_One_is_Obsolete_in_2026_nyrxwv.jpg'
    },
    {
      id: 'entity-architect',
      title: 'Your Google Business Profile Is Not Enough',
      description: 'The critical step to becoming a verified business. We make sure your business information is consistent everywhere so Google and AI trust you.',
      buttonText: 'See How to Get Verified',
      onButtonClick: () => navigate('/blog/entity-architect'),
      bgType: 'image',
      bgUrl: 'https://res.cloudinary.com/dka0498ns/image/upload/v1762761706/Happy_Hunter_work_space_jovfrh.png'
    },
    {
      id: 'revenue-brain',
      title: 'Automate Your Sales 24/7',
      description: 'Stop losing leads because you missed a message after hours. Chatbots and WhatsApp automation qualify leads and book appointments while you sleep.',
      buttonText: 'Explore Automation',
      onButtonClick: () => navigate('/blog/revenue-brain'),
      bgType: 'image',
      bgUrl: 'https://res.cloudinary.com/dka0498ns/image/upload/v1780147988/pomelli_photoshoot-4_na38o8.jpg',
    },
    {
      id: 'synthesis',
      title: 'How It All Works Together',
      description: 'How fixing your business info, AI-friendly content, and automated sales connect into a system that grows your business.',
      buttonText: 'Read the Full Guide',
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
            What Helps You Grow
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">
            The <span className="gradient-text">3 Levers</span> That Bring Customers
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            From fixing your business info to automating your sales. The essential foundation for getting found by Google, AI, and your next customer.
          </p>
        </div>

        <div className={`transition-all duration-1000 ${isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <HeroCarousel slides={slides} autoPlaySpeed={6000} />
        </div>
      </div>
    </section>
  );
};
