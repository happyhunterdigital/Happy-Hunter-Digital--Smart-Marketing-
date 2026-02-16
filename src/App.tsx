import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// 🛡️ IRON DOME: Explicit case-sensitive imports
// Use exact file names as they appear on disk (Linux is case-sensitive!)

// Components
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import EventPopup from './components/EventPopup';
import ContentRibbon from './components/ContentRibbon';

// Pages (lazy-loaded for security)
const Home = lazy(() => import('./pages/Home'));
const Founders = lazy(() => import('./pages/Founders'));
const CoreServices = lazy(() => import('./pages/CoreServices'));
const EarnedMedia = lazy(() => import('./pages/EarnedMedia'));
const Audit = lazy(() => import('./pages/Audit'));
const FAQ = lazy(() => import('./pages/FAQ'));
const ArticleReader = lazy(() => import('./pages/ArticleReader'));
const Admin = lazy(() => import('./pages/Admin'));
const SummitPage = lazy(() => import('./pages/SummitPage'));
const SummitPoster = lazy(() => import('./pages/SummitPoster'));

// Blog pages
const PillarAuthority = lazy(() => import('./pages/blog/PillarAuthority'));
const TrustAnchor = lazy(() => import('./pages/blog/TrustAnchor'));
const AiMegaphone = lazy(() => import('./pages/blog/AiMegaphone'));
const RevenueBrain = lazy(() => import('./pages/blog/RevenueBrain'));

// 🛡️ Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950">
    <div className="animate-pulse text-yellow-500 font-black uppercase tracking-widest">
      Initializing Secure Protocol...
    </div>
  </div>
);

// 🛡️ Error boundary for route failures
const RouteError = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
    <div className="text-center">
      <h1 className="text-4xl font-black text-red-500 mb-4">SYSTEM FAILURE</h1>
      <p className="text-slate-400 mb-6">Route could not be loaded securely.</p>
      <button 
        onClick={() => window.location.reload()}
        className="bg-yellow-500 text-slate-950 px-6 py-3 rounded-xl font-black"
      >
        Re-Initialize
      </button>
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
              <Route path="/" element={<Home />} errorElement={<RouteError />} />
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
              <Route path="*" element={<RouteError />} />
            </Routes>
          </Suspense>
        </main>
        
        <Chatbot />
        <Footer />
      </div>
    </Router>
  );
}
