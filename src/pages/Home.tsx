// src/pages/Home.tsx
import { HeroSection } from '../components/HeroSection';
import { ServicesSection } from '../components/ServicesSection';
import { ProcessSection } from '../components/ProcessSection';
import { PageMeta } from '../components/PageMeta';

export const Home = () => {
  return (
    <div className="min-h-screen bg-deep-950">
      <PageMeta
        title="Happy Hunter Digital | Websites, Google Visibility & WhatsApp Sales for SA Businesses"
        description="Get found online. Get more customers. We build websites, set up smart chat assistants, and turn WhatsApp into a sales channel for small businesses in Pretoria and Johannesburg."
        path="/"
      />
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
    </div>
  );
};
