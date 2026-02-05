import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Services from './pages/Services';
import Audit from './pages/Audit';
import FAQ from './pages/FAQ';
import EarnedMedia from './pages/EarnedMedia';
import Admin from './pages/Admin'; // NEW IMPORT

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white font-sans relative">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/earned-media" element={<EarnedMedia />} />
            <Route path="/admin" element={<Admin />} /> {/* NEW ROUTE */}
          </Routes>
        </main>
        <Chatbot />
        <footer className="py-20 border-t border-slate-900 bg-slate-950/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-left">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2 text-yellow-500">Happy Hunter Digital</h3>
              <p className="text-slate-500 text-xs max-w-xs leading-relaxed uppercase tracking-widest font-medium">
                Digital Entity Management for SA SMEs. // Protocol Active.
              </p>
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-800">
              Protocol v2.0 // Firebase High-Availability Engine
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
