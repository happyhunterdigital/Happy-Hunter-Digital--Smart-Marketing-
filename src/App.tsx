import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Global Components
import { AIEntityEngine } from './components/AIEntityEngine';
import { CookieConsent } from './components/CookieConsent';
import { ContentRibbon } from './components/ContentRibbon';
import { Chatbot } from './components/Chatbot';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';

// Pages
import { Home } from './pages/Home';
import { AiAudit } from './pages/Audit/AiAudit';
import { CoreServices } from './pages/CoreServices/CoreServices';
import { EarnedMedia } from './pages/EarnedMedia';
import { FAQ } from './pages/FAQ';
import { Founders } from './pages/Founders';
import { Blog } from './pages/Blog';
import { ArticleMegaphone } from './pages/ArticleMegaphone';
import { ArticleRevenue } from './pages/ArticleRevenue';
import { ArticleSynthesis } from './pages/ArticleSynthesis';
import { ArticleEntity } from './pages/ArticleEntity';
import { ArticleBlueLink } from './pages/ArticleBlueLink';
import { SummitPage } from './pages/SummitPage';
import { Architecture } from './pages/Architecture';
import { ClientPortal } from './pages/ClientPortal/ClientPortal';
import { SummitPoster } from './pages/SummitPoster';
import { Admin } from './pages/Admin';
import { Workspace } from './pages/Workspace/Workspace';
import { LiveSummit } from './pages/LiveSummit';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import ViewGuide from './pages/ViewGuide';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isLandingPage = location.pathname === '/the-ai-megaphone' || location.pathname === '/view/guide';

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-500 selection:text-black">
      <AIEntityEngine />
      <CookieConsent />
      
      {!isLandingPage && <ContentRibbon />}
      
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} isLandingPage={isLandingPage} />

      <main className={!isLandingPage ? "pt-32 md:pt-40" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/audit" element={<AiAudit />} />
          <Route path="/services" element={<CoreServices />} />
          <Route path="/earned-media" element={<EarnedMedia />} />
          <Route path="/founders" element={<Founders />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/intelligence" element={<Blog />} />
          <Route path="/blog/ai-megaphone" element={<ArticleMegaphone />} />
          <Route path="/blog/revenue-brain" element={<ArticleRevenue />} />
          <Route path="/blog/synthesis" element={<ArticleSynthesis />} />
          <Route path="/blog/entity-architect" element={<ArticleEntity />} />
          <Route path="/blog/beyond-the-blue-link" element={<ArticleBlueLink />} />
          <Route path="/summit-2026" element={<SummitPage />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/portal" element={<ClientPortal />} />
          <Route path="/promo" element={<SummitPoster />} />
          <Route path="/hq-command" element={<Admin />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/live" element={<LiveSummit />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/the-ai-megaphone" element={<MegaphoneLanding />} />
          <Route path="/view/guide" element={<ViewGuide />} />
        </Routes>
      </main>

      <Footer isLandingPage={isLandingPage} />
      
      {!isLandingPage && <Chatbot />}
    </div>
  );
}

export default App;
