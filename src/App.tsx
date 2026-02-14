import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import ContentRibbon from './components/ContentRibbon';
import Home from './pages/Home';
import CoreServices from './pages/CoreServices';
import EarnedMedia from './pages/EarnedMedia';
import Audit from './pages/Audit';
import FAQ from './pages/FAQ';
import ArticleReader from './pages/ArticleReader';
import Admin from './pages/Admin';
import SummitPage from './pages/SummitPage';
import Founders from './pages/Founders';
import SummitPoster from './pages/SummitPoster';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#020617] text-white font-sans relative">
        <Navbar />
        <main>
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
          </Routes>
        </main>
        <Chatbot />
        <footer className="py-20 border-t border-slate-900 bg-slate-950/50 backdrop-blur-sm text-center">
            <h3 className="brand-name text-3xl text-yellow-500 mb-4">happyhunterdigital</h3>
            <p className="text-slate-700 text-[10px] font-black uppercase tracking-[0.4em] italic">
              Digital Entity Protocol v2.0 // Managed by Thabo Leslie Motsumi
            </p>
        </footer>
      </div>
    </Router>
  );
}
