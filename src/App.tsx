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
      <div className="min-h-screen bg-slate-950 text-white selection:bg-yellow-500/30 font-sans relative">
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
        <footer className="py-20 border-t border-slate-900 bg-slate-950/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-left">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Happy Hunter Digital</h3>
              <p className="text-slate-500 text-xs max-w-xs leading-relaxed uppercase tracking-widest">
                Digital Entity Management for South African SMEs. // Protocol Active.
              </p>
            </div>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">
              <span>Mirror Rule Applied</span>
              <span>Information Gain High</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
