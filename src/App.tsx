import { Routes, Route, Link } from 'react-router-dom';
import { AiAudit } from './components/AiAudit';
import { Chatbot } from './components/Chatbot';
import { Home } from './pages/Home';
import { Founders } from './pages/Founders';
import { CoreServices } from './pages/CoreServices';
import { EarnedMedia } from './pages/EarnedMedia';
import { FAQ } from './pages/FAQ';
import { Admin } from './pages/Admin';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-yellow-500 selection:text-black">
      {/* Navigation Protocol */}
      <nav className="fixed w-full z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* BRANDING UPDATE */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img 
              src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" 
              alt="Happy Hunter Logo" 
              className="w-10 h-10 rounded-full border border-yellow-500/30 object-cover"
            />
            <span className="font-handwriting text-3xl tracking-wide lowercase text-white">
              happyhunterdigital
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/services" className="text-[11px] font-black uppercase tracking-widest hover:text-yellow-500 transition-colors">Services</Link>
            <Link to="/earned-media" className="text-[11px] font-black uppercase tracking-widest hover:text-yellow-500 transition-colors">Earned Media</Link>
            <Link to="/founders" className="text-[11px] font-black uppercase tracking-widest hover:text-yellow-500 transition-colors">Founders</Link>
            <Link to="/faq" className="text-[11px] font-black uppercase tracking-widest hover:text-yellow-500 transition-colors">FAQ</Link>
            <Link to="/audit" className="bg-yellow-500 text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)]">Start Audit</Link>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-black border-b border-white/5 p-6 space-y-6 animate-fade-in">
            <Link to="/services" onClick={() => setMenuOpen(false)} className="block text-sm font-black tracking-widest uppercase">Services</Link>
            <Link to="/earned-media" onClick={() => setMenuOpen(false)} className="block text-sm font-black tracking-widest uppercase">Earned Media</Link>
            <Link to="/founders" onClick={() => setMenuOpen(false)} className="block text-sm font-black tracking-widest uppercase">Founders</Link>
            <Link to="/faq" onClick={() => setMenuOpen(false)} className="block text-sm font-black tracking-widest uppercase">FAQ</Link>
            <Link to="/audit" onClick={() => setMenuOpen(false)} className="block text-sm font-black tracking-widest uppercase text-yellow-500">Start Audit</Link>
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
          <Route path="/hq-command" element={<Admin />} /> 
        </Routes>
      </main>

      <footer className="py-12 border-t border-white/5 text-center bg-black">
        <div className="flex justify-center mb-4">
            <span className="font-handwriting text-2xl text-gray-500 lowercase">happyhunterdigital</span>
        </div>
        <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.3em]">
          &copy; 2026 // Smart Marketing for the AI Era.
        </p>
      </footer>

      <Chatbot />
    </div>
  );
}

export default App;
