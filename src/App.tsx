import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AiAudit } from './components/AiAudit';
import { Chatbot } from './components/Chatbot';
import { ContentRibbon } from './components/ContentRibbon';
import { Home } from './pages/Home';
import { Founders } from './pages/Founders';
import { CoreServices } from './pages/CoreServices';
import { EarnedMedia } from './pages/EarnedMedia';
import { FAQ } from './pages/FAQ';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-500 selection:text-black pt-10">
      
      {/* 1. GLOBAL NEWS TICKER */}
      <ContentRibbon />

      {/* 2. CAPSULE NAVBAR (Sit 10px below ribbon) */}
      <div className="fixed top-[50px] left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className="w-full max-w-5xl bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-5 py-3 flex justify-between items-center shadow-2xl pointer-events-auto">
          <Link to="/" className="flex items-center gap-3 pl-2">
            <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" alt="Logo" className="w-10 h-10 rounded-full border border-yellow-500/30 object-cover" />
            <span className="font-handwriting text-3xl tracking-wide lowercase">
              <span className="text-white">happy</span><span className="text-yellow-500">hunter</span><span className="text-gray-400">digital</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 px-4">
            <Link to="/services" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 hover:text-yellow-500 transition-all">Services</Link>
            <Link to="/earned-media" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 hover:text-yellow-500 transition-all">Earned Media</Link>
            <Link to="/founders" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 hover:text-yellow-500 transition-all">Founders</Link>
            <Link to="/faq" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 hover:text-yellow-500 transition-all">FAQ</Link>
          </div>

          <Link to="/audit" className="hidden lg:block bg-yellow-500 text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white shadow-xl transition-all">Start Audit</Link>
          <button className="lg:hidden text-white pr-2" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={24}/> : <Menu size={24}/>}</button>
        </nav>
      </div>

      {/* MOBILE INTERFACE */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl p-8 pt-32 lg:hidden flex flex-col space-y-8 text-center animate-fade-in">
          <Link to="/services" className="text-2xl font-black uppercase tracking-widest text-white">Services</Link>
          <Link to="/earned-media" className="text-2xl font-black uppercase tracking-widest text-white">Earned Media</Link>
          <Link to="/founders" className="text-2xl font-black uppercase tracking-widest text-white">Founders</Link>
          <Link to="/faq" className="text-2xl font-black uppercase tracking-widest text-white">FAQ</Link>
          <Link to="/audit" className="bg-yellow-500 text-black py-4 rounded-2xl font-black uppercase">Start Audit</Link>
        </div>
      )}

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

      <Chatbot />
    </div>
  );
}

export default App;
