// src/pages/Home.tsx
import { HeroSection } from '../components/HeroSection';
import { ServicesSection } from '../components/ServicesSection';
import { ProcessSection } from '../components/ProcessSection';
import { SeoVsAiComparison } from '../components/SeoVsAiComparison';
import { PageMeta } from '../components/PageMeta';

export const Home = () => {
  return (
    <div className="min-h-screen bg-deep-950">
      <PageMeta
        title="Happy Hunter Digital | Web Development & Marketing Engineering for SA Businesses"
        description="Web development and marketing engineering for SA SMEs. We engineer AI-ready websites, get you found on Google and AI, and turn WhatsApp into a sales channel. Pretoria + Johannesburg."
        path="/"
      />
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
      <SeoVsAiComparison />
    </div>
  );
};
