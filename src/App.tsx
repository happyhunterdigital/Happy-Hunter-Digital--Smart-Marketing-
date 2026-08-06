// src/App.tsx
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Layout & UI Components
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { Chatbot } from './components/Chatbot';
import { WhatsAppButton } from './components/WhatsAppButton';
import { CookieConsent } from './components/CookieConsent';
import { ExitIntentModal } from './components/ExitIntentModal';
import { AIEntityEngine } from './components/AIEntityEngine';
import { OrganizationSchema } from './components/OrganizationSchema';

// Pages
import { Home } from './pages/Home';
import { Work } from './pages/Work';
import { AiAudit } from './pages/Audit/AiAudit';
import { Founders } from './pages/Founders';
import { CoreServices } from './pages/CoreServices/CoreServices';
import { EarnedMedia } from './pages/EarnedMedia';
import { FAQ } from './pages/FAQ';
import { Admin } from './pages/Admin';
import { Blog } from './pages/Blog';
import { ArticleMegaphone } from './pages/ArticleMegaphone';
import { ArticleRevenue } from './pages/ArticleRevenue';
import { ArticleSynthesis } from './pages/ArticleSynthesis';
import { ArticleEntity } from './pages/ArticleEntity';
import { ArticleBlueLink } from './pages/ArticleBlueLink';
import { ArticleLocalSearch } from './pages/ArticleLocalSearch';
import { SummitPage } from './pages/SummitPage';
import { Architecture } from './pages/Architecture';
import { ClientPortal } from './pages/ClientPortal/ClientPortal';
import { SummitPoster } from './pages/SummitPoster';
import { MegaphoneLanding } from './pages/MegaphoneLanding';
import { LiveSummit } from './pages/LiveSummit';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import ViewGuide from './pages/ViewGuide';
import { Workspace } from './pages/Workspace/Workspace';
import { PlaybookAnchor } from './pages/Playbook/PlaybookAnchor';
import { PlaybookChapter1 } from './pages/Playbook/PlaybookChapter1';
import { PlaybookChapter2 } from './pages/Playbook/PlaybookChapter2';
import { PlaybookChapter3 } from './pages/Playbook/PlaybookChapter3';
import { PlaybookChapter4 } from './pages/Playbook/PlaybookChapter4';
import { PretoriaLanding } from './pages/PretoriaLanding';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isLandingPage = location.pathname === '/the-ai-megaphone' || location.pathname === '/view/guide';

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-500 selection:text-black">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[300] focus:bg-amber-500 focus:text-black focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:text-sm">
        Skip to main content
      </a>
      <AIEntityEngine />
      <OrganizationSchema />
      <CookieConsent />
      <ExitIntentModal />
      
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} isLandingPage={isLandingPage} />

      <main id="main-content" className={!isLandingPage ? "pt-32 md:pt-40" : ""}>
        <Routes>
          <Route path="/the-ai-megaphone" element={<MegaphoneLanding />} />
          <Route path="/view/guide" element={<ViewGuide />} />
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/audit" element={<AiAudit />} />
          <Route path="/services" element={<CoreServices />} />
          <Route path="/services/:category" element={<CoreServices />} />
          <Route path="/earned-media" element={<EarnedMedia />} />
          <Route path="/founders" element={<Founders />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/smart-news" element={<Blog />} />
          <Route path="/blog/ai-megaphone" element={<ArticleMegaphone />} />
          <Route path="/blog/revenue-brain" element={<ArticleRevenue />} />
          <Route path="/blog/synthesis" element={<ArticleSynthesis />} />
          <Route path="/blog/entity-architect" element={<ArticleEntity />} />
          <Route path="/blog/beyond-the-blue-link" element={<ArticleBlueLink />} />
          <Route path="/blog/local-search-2026" element={<ArticleLocalSearch />} />
          <Route path="/smart-news/playbook" element={<PlaybookAnchor />} />
          <Route path="/smart-news/playbook/chapter-1" element={<PlaybookChapter1 />} />
          <Route path="/smart-news/playbook/chapter-2" element={<PlaybookChapter2 />} />
          <Route path="/smart-news/playbook/chapter-3" element={<PlaybookChapter3 />} />
          <Route path="/smart-news/playbook/chapter-4" element={<PlaybookChapter4 />} />
          <Route path="/summit-2026" element={<SummitPage />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/portal" element={<ClientPortal />} />
          <Route path="/promo" element={<SummitPoster />} />
          <Route path="/hq-command" element={<Admin />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/live" element={<LiveSummit />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/pretoria" element={<PretoriaLanding />} />
        </Routes>
      </main>

      <Footer isLandingPage={isLandingPage} />
      {!isLandingPage && (
        <>
          <Chatbot />
          <WhatsAppButton />
        </>
      )}
    </div>
  );
}

export default App;
