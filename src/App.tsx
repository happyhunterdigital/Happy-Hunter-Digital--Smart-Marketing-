import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Services from './pages/Services';
import Audit from './pages/Audit';
import FAQ from './pages/FAQ';
import { ApiTest } from './components/ApiTest'; // DIAGNOSTIC TOOL

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white selection:bg-yellow-500/30 font-sans relative">
        <ApiTest /> {/* REMOVE THIS AFTER WE FIX THE CONNECTION */}
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
        <footer className="py-20 border-t border-slate-900 text-center text-slate-500 text-xs uppercase tracking-widest">
          Happy Hunter Digital // Entity Protocol v2.0
        </footer>
      </div>
    </Router>
  );
}
