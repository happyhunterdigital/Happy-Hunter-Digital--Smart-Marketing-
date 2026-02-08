import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Services from './pages/Services';
import Audit from './pages/Audit';
import FAQ from './pages/FAQ';
import EarnedMedia from './pages/EarnedMedia';
import Admin from './pages/Admin';
import ArticleReader from './pages/ArticleReader';
import CoreServices from './pages/CoreServices';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white font-sans relative">
        <Navbar />
        <main className="animate-fade-in">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/core-services" element={<CoreServices />} />
            <Route path="/services" element={<Services />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/earned-media" element={<EarnedMedia />} />
            <Route path="/article/:id" element={<ArticleReader />} />
            <Route path="/admin-ops-center" element={<Admin />} />
          </Routes>
        </main>
        <Chatbot />
        <footer className="py-20 border-t border-slate-900 bg-slate-950/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761701/Logo_mock1_jmjuoe.png" 
                  alt="happyhunterdigital logo" 
                  className="h-8 w-auto grayscale opacity-50"
                />
                <span className="brand-name text-3xl text-slate-500">happyhunterdigital</span>
              </div>
              <p className="text-slate-700 text-xs max-w-xs leading-relaxed uppercase tracking-widest font-black">
                South African Digital Entity Specialist. // Handshake Protocol Active.
              </p>
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-800 italic">
              Managed by Thabo Leslie Motsumi
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
