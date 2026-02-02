import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Services from './pages/Services';
import Audit from './pages/Audit';
import FAQ from './pages/FAQ';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white selection:bg-yellow-500/30 font-sans">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </main>
        <Chatbot />
        <footer className="py-20 border-t border-slate-900 bg-slate-950">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Happy Hunter Digital</h3>
              <p className="text-slate-500 text-sm max-w-sm">
                Digital Entity Management for the 2026 AI Era. Built by Thabo Leslie Motsumi.
              </p>
            </div>
            <div className="text-right text-[10px] font-black uppercase tracking-[0.3em] text-slate-800">
              Entity Protocol v2.0 // Signal Stable
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
