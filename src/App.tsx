import { Routes, Route, Link } from 'react-router-dom';
import { AiAudit } from './components/AiAudit';
import { Chatbot } from './components/Chatbot';
import { Home } from './pages/Home';
import { Founders } from './pages/Founders';
import { CoreServices } from './pages/CoreServices';
import { EarnedMedia } from './pages/EarnedMedia';
import { FAQ } from './pages/FAQ';
import { ShieldCheck, Menu, X } from 'lucide-react';
import { useState } from 'react';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans selection:bg-brand-yellow selection:text-brand-dark">
      {/* Navigation Protocol */}
      <nav className="fixed w-full z-50 bg-brand-dark/90 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
            <ShieldCheck className="text-brand-yellow" size={24}/>
            HappyHunter<span className="text-brand-yellow">Systems</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/services" className="text-xs font-bold uppercase tracking-widest hover:text-brand-yellow transition-colors">Services</Link>
            <Link to="/earned-media" className="text-xs font-bold uppercase tracking-widest hover:text-brand-yellow transition-colors">Earned Media</Link>
            <Link to="/founders" className="text-xs font-bold uppercase tracking-widest hover:text-brand-yellow transition-colors">Founders</Link>
            <Link to="/faq" className="text-xs font-bold uppercase tracking-widest hover:text-brand-yellow transition-colors">FAQ</Link>
            <Link to="/audit" className="bg-brand-yellow text-brand-dark px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Start Audit</Link>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-brand-dark border-b border-white/5 p-6 space-y-4 animate-fade-in">
            <Link to="/services" onClick={() => setMenuOpen(false)} className="block text-sm font-bold uppercase">Services</Link>
            <Link to="/earned-media" onClick={() => setMenuOpen(false)} className="block text-sm font-bold uppercase">Earned Media</Link>
            <Link to="/founders" onClick={() => setMenuOpen(false)} className="block text-sm font-bold uppercase">Founders</Link>
            <Link to="/faq" onClick={() => setMenuOpen(false)} className="block text-sm font-bold uppercase">FAQ</Link>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="pt-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/audit" element={<AiAudit />} />
          <Route path="/services" element={<CoreServices />} />
          <Route path="/earned-media" element={<EarnedMedia />} />
          <Route path="/founders" element={<Founders />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </main>

      <footer className="py-20 border-t border-white/5 text-center bg-black/50">
        <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em]">
          &copy; 2026 Happy Hunter Systems // Smart Marketing for the AI Era.
        </p>
      </footer>

      <Chatbot />
    </div>
  );
}

export default App;
