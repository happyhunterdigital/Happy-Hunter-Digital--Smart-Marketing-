import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AiAudit } from './components/AiAudit';
import { Chatbot } from './components/Chatbot';
import { Home } from './pages/Home';
import { Founders } from './pages/Founders';
import { CoreServices } from './pages/CoreServices';
import { EarnedMedia } from './pages/EarnedMedia';
import { FAQ } from './pages/FAQ';
import { Admin } from './pages/Admin';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* 2026 CAPSULE NAVBAR */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className="w-full max-w-6xl bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-4 py-3 flex justify-between items-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] pointer-events-auto">
          
          {/* HANDWRITTEN GRAPHIC LOGO */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity pl-2">
            <img 
              src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" 
              alt="Happy Hunter Logo" 
              className="w-10 h-10 rounded-full border border-yellow-500/30 object-cover"
            />
            {/* The Tri-Color Custom Typographic Logo */}
            <span className="font-handwriting text-3xl tracking-wide drop-shadow-lg">
              <span className="text-white">happy</span>
              <span className="text-yellow-500">hunter</span>
              <span className="text-gray-400">digital</span>
            </span>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden lg:flex items-center gap-8 px-4">
            <Link to="/services" className="text-[11px] font-black uppercase tracking-widest hover:text-yellow-500 transition-colors">Services</Link>
            <Link to="/earned-media" className="text-[11px] font-black uppercase tracking-widest hover:text-yellow-500 transition-colors">Earned Media</Link>
            <Link to="/blog" className="text-[11px] font-black uppercase tracking-widest hover:text-yellow-500 transition-colors">Intelligence</Link>
            <Link to="/founders" className="text-[11px] font-black uppercase tracking-widest hover:text-yellow-500 transition-colors">Founders</Link>
            <Link to="/faq" className="text-[11px] font-black uppercase tracking-widest hover:text-yellow-500 transition-colors">FAQ</Link>
          </div>

          {/* CTA BUTTON */}
          <div className="hidden lg:block pr-1">
            <Link to="/audit" className="bg-yellow-500 text-black px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              Start Audit
            </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <button className="lg:hidden text-white pr-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>
      </div>

      {/* MOBILE DROPDOWN (Floating below capsule) */}
      {menuOpen && (
        <div className="fixed top-24 left-4 right-4 z-40 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl animate-fade-in lg:hidden">
          <div className="flex flex-col space-y-6 text-center">
            <Link to="/services" className="text-sm font-black tracking-widest uppercase text-white hover:text-yellow-500">Services</Link>
            <Link to="/earned-media" className="text-sm font-black tracking-widest uppercase text-white hover:text-yellow-500">Earned Media</Link>
            <Link to="/blog" className="text-sm font-black tracking-widest uppercase text-white hover:text-yellow-500">Intelligence (Blog)</Link>
            <Link to="/founders" className="text-sm font-black tracking-widest uppercase text-white hover:text-yellow-500">Founders</Link>
            <Link to="/faq" className="text-sm font-black tracking-widest uppercase text-white hover:text-yellow-500">FAQ</Link>
            <div className="pt-4 border-t border-white/10">
              <Link to="/audit" className="inline-block bg-yellow-500 text-black px-8 py-3 rounded-full text-xs font-black tracking-widest uppercase w-full">Start Audit</Link>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT ROUTING */}
      <main className="pt-32">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/audit" element={<AiAudit />} />
          <Route path="/services" element={<CoreServices />} />
          <Route path="/earned-media" element={<EarnedMedia />} />
          <Route path="/founders" element={<Founders />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/hq-command" element={<Admin />} /> 
        </Routes>
      </main>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 text-center bg-black mt-20">
        <div className="flex justify-center mb-6">
            <span className="font-handwriting text-3xl tracking-wide">
              <span className="text-gray-500">happy</span><span className="text-yellow-600">hunter</span><span className="text-gray-700">digital</span>
            </span>
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
