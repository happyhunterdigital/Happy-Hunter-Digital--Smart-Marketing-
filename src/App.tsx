import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// --- CORE INTERFACE COMPONENTS ---
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import ContentRibbon from './components/ContentRibbon';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import EventPopup from './components/EventPopup';

// --- AUTHENTICATED LOADERS (The Anomaly Prevention) ---
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

// --- BLOG CLUSTER: THE ARCHITECTURE OF AUTHORITY ---
const PillarAuthority = lazy(() => import('./pages/blog/PillarAuthority'));
const TrustAnchor = lazy(() => import('./pages/blog/TrustAnchor'));
const AiMegaphone = lazy(() => import('./pages/blog/AiMegaphone'));
const RevenueBrain = lazy(() => import('./pages/blog/RevenueBrain'));

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white font-sans relative flex flex-col">
        
        {/* COMPLIANCE & SIGNAL LAYERS */}
        <CookieConsent />
        <EventPopup />
        
        {/* NAVIGATION PROTOCOL */}
        <Navbar />

        {/* MAIN ENGINE */}
        <main className="flex-grow pt-24">
          <Suspense fallback={
            <div className="h-screen flex items-center justify-center bg-slate-950">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
                <p className="text-yellow-500 font-black uppercase text-[10px] tracking-[0.4em] animate-pulse">Establishing Handshake...</p>
              </div>
            </div>
          }>
            <Routes>
              {/* Primary Nodes */}
              <Route path="/" element={<Home />} />
              <Route path="/founders" element={<Founders />} />
              <Route path="/core-services" element={<CoreServices />} />
              <Route path="/earned-media" element={<EarnedMedia />} />
              <Route path="/audit" element={<Audit />} />
              <Route path="/faq" element={<FAQ />} />
              
              {/* Dynamic Content Nodes */}
              <Route path="/article/:id" element={<ArticleReader />} />
              
              {/* Blog Cluster Nodes */}
              <Route path="/blog/digital-authority-architecture" element={<PillarAuthority />} />
              <Route path="/blog/trust-anchor" element={<TrustAnchor />} />
              <Route path="/blog/ai-megaphone" element={<AiMegaphone />} />
              <Route path="/blog/revenue-brain" element={<RevenueBrain />} />

              {/* Summit & Asset Nodes */}
              <Route path="/integrated-wellth-summit" element={<SummitPage />} />
              <Route path="/poster" element={<SummitPoster />} />

              {/* Secured Ops Node */}
              <Route path="/admin-ops-center" element={<Admin />} />
            </Routes>
          </Suspense>
        </main>

        {/* RETENTION & AUTHORITY LAYERS */}
        <Chatbot />
        <Footer />
        
      </div>
    </Router>
  );
}
