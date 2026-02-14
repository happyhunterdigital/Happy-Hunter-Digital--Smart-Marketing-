import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// --- COMPONENTS (Found in src/components/) ---
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import EventPopup from './components/EventPopup';

// --- PAGES (Found in src/pages/) ---
import Home from './pages/Home';
import Founders from './pages/Founders';
import CoreServices from './pages/CoreServices';
import EarnedMedia from './pages/EarnedMedia';
import Audit from './pages/Audit';
import FAQ from './pages/FAQ';
import ArticleReader from './pages/ArticleReader';
import Admin from './pages/Admin';
import SummitPage from './pages/SummitPage';
import SummitPoster from './pages/SummitPoster';

// --- BLOG PAGES (Found in src/pages/blog/) ---
import PillarAuthority from './pages/blog/PillarAuthority';
import TrustAnchor from './pages/blog/TrustAnchor';
import AiMegaphone from './pages/blog/AiMegaphone';
import RevenueBrain from './pages/blog/RevenueBrain';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#020617] text-white font-sans relative flex flex-col">
        <CookieConsent />
        <EventPopup />
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/founders" element={<Founders />} />
            <Route path="/core-services" element={<CoreServices />} />
            <Route path="/earned-media" element={<EarnedMedia />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/article/:id" element={<ArticleReader />} />
            <Route path="/admin-ops-center" element={<Admin />} />
            <Route path="/integrated-wellth-summit" element={<SummitPage />} />
            <Route path="/poster" element={<SummitPoster />} />
            
            {/* Blog Routes */}
            <Route path="/blog/digital-authority-architecture" element={<PillarAuthority />} />
            <Route path="/blog/trust-anchor" element={<TrustAnchor />} />
            <Route path="/blog/ai-megaphone" element={<AiMegaphone />} />
            <Route path="/blog/revenue-brain" element={<RevenueBrain />} />
          </Routes>
        </main>

        <Chatbot />
        <Footer />
      </div>
    </Router>
  );
}
