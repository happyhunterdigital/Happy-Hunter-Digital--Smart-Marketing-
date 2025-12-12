
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AiAudit } from './components/AiAudit';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import { Footer } from './components/Footer';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { EarnedMedia } from './components/EarnedMedia';
import { BlogReader } from './components/BlogReader';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { CookieConsent } from './components/CookieConsent';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  const handleNavigate = (view: ViewState, blogId?: string) => {
    setCurrentView(view);
    if (blogId) {
      setSelectedBlogId(blogId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHomeScroll = (sectionId: string) => {
    setCurrentView('HOME');
    // Allow state update to propagate before scrolling
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-yellow selection:text-brand-dark">
      <Header onNavigate={handleNavigate} onScroll={handleHomeScroll} />
      
      <main className="flex-grow">
        {currentView === 'HOME' && (
          <div className="animate-fade-in">
            <Hero />
            <div id="audit" className="scroll-mt-24">
              <AiAudit />
            </div>
            <div id="services" className="scroll-mt-24">
              <Services />
            </div>
            <div id="portfolio" className="scroll-mt-24">
              <Portfolio />
            </div>
          </div>
        )}

        {currentView === 'EARNED_MEDIA' && (
          <EarnedMedia onReadBlog={(id) => handleNavigate('BLOG_READER', id)} />
        )}

        {currentView === 'BLOG_READER' && selectedBlogId && (
          <BlogReader 
            blogId={selectedBlogId} 
            onBack={() => handleNavigate('EARNED_MEDIA')} 
          />
        )}

        {currentView === 'PRIVACY_POLICY' && (
          <PrivacyPolicy onBack={() => handleNavigate('HOME')} />
        )}
      </main>
      
      <Footer onNavigate={handleNavigate} />
      <WhatsAppWidget />
      <CookieConsent />
    </div>
  );
};

export default App;
