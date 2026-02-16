import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// 🛡️ IRON DOME: Use barrel imports to avoid case sensitivity issues
import {
  Navbar,
  Chatbot,
  Footer,
  CookieConsent,
  EventPopup,
  ContentRibbon,
} from './components';

import {
  Home,
  Founders,
  CoreServices,
  EarnedMedia,
  Audit,
  FAQ,
  ArticleReader,
  Admin,
  SummitPage,
  SummitPoster,
} from './pages';

// Lazy load blog pages
const PillarAuthority = lazy(() => import('./pages/blog/PillarAuthority'));
const TrustAnchor = lazy(() => import('./pages/blog/TrustAnchor'));
const AiMegaphone = lazy(() => import('./pages/blog/AiMegaphone'));
const RevenueBrain = lazy(() => import('./pages/blog/RevenueBrain'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950">
    <div className="animate-pulse text-yellow-500 font-black uppercase tracking-widest">
      Initializing...
    </div>
  </div>
);

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#020617] text-white font-sans relative flex flex-col">
        <ContentRibbon />
        <div className="mt-12">
          <Navbar />
        </div>
        <CookieConsent />
        <EventPopup />
        
        <main className="flex-grow pt-24">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/founders" element={<Founders />} />
              <Route path="/core-services" element={<CoreServices />} />
              <Route path="/earned-media" element={<EarnedMedia />} />
              <Route path="/audit" element={<Audit />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/article/:id" element={<ArticleReader />} />
              <Route path="/integrated-wellth-summit" element={<SummitPage />} />
              <Route path="/poster" element={<SummitPoster />} />
              <Route path="/blog/digital-authority-architecture" element={<PillarAuthority />} />
              <Route path="/blog/trust-anchor" element={<TrustAnchor />} />
              <Route path="/blog/ai-megaphone" element={<AiMegaphone />} />
              <Route path="/blog/revenue-brain" element={<RevenueBrain />} />
              <Route path="/admin-ops-center" element={<Admin />} />
            </Routes>
          </Suspense>
        </main>
        
        <Chatbot />
        <Footer />
      </div>
    </Router>
  );
}
