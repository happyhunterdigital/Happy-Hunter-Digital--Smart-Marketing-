import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AiAudit } from './components/AiAudit';
import { Chatbot } from './components/Chatbot';
import { Home } from './pages/Home';
import { Founders } from './pages/Founders';
import { CoreServices } from './pages/CoreServices';
import { EarnedMedia } from './pages/EarnedMedia';
import { FAQ } from './pages/FAQ';
import { Admin } from './pages/Admin';
// NEW, CORRECTED BLOG IMPORTS
import { BlogAnchor } from './pages/BlogAnchor';
import { ArticleMegaphone } from './pages/ArticleMegaphone';
import { ArticleRevenue } from './pages/ArticleRevenue';
import { ArticleSynthesis } from './pages/ArticleSynthesis';
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
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-500 selection:text-black">
      
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className="w-full max-w-5xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800/80 rounded-full px-5 py-3 flex justify-between items-center shadow-[0_8px_32px_rgba(0,0,0,0.6)] pointer-events-auto">
          
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img 
              src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" 
              alt="Logo" 
              className="w-10 h-10 rounded-full border border-yellow-500/30 object-cover"
            />
            <span className="font-handwriting text-2xl md:text-3xl tracking-wide drop-shadow-md pb-1">
              <span className="text-white">happy</span>
              <span className="text-yellow-500">hunter</span>
              <span className="text-gray-400">digital</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6 xl:gap-8 px-4">
            <Link to="/services" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 hover:text-yellow-500 transition-colors">Services</Link>
            <Link to="/earned-media" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 hover:text-yellow-500 transition-colors">Earned Media</Link>
            <Link to="/blog" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 hover:text-yellow-500 transition-colors">Intelligence</Link>
            <Link to="/founders" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 hover:text-yellow-500 transition-colors">Founders</Link>
            <Link to="/faq" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 hover:text-yellow-500 transition-colors">FAQ</Link>
          </div>

          <div className="hidden lg:block">
            <Link to="/audit" className="bg-yellow-500 text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)]">
              Start Audit
            </Link>
          </div>

          <button className="lg:hidden text-white pr-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {menuOpen && (
        <div className="fixed top-28 left-4 right-4 z-40 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-gray-800 rounded-3xl p-6 shadow-2xl animate-fade-in lg:hidden">
          <div className="flex flex-col space-y-6 text-center">
            <Link to="/services" className="text-sm font-black tracking-widest uppercase text-white hover:text-yellow-500">Services</Link>
            <Link to="/earned-media" className="text-sm font-black tracking-widest uppercase text-white hover:text-yellow-500">Earned Media</Link>
            <Link to="/blog" className="text-sm font-black tracking-widest uppercase text-white hover:text-yellow-500">Intelligence</Link>
            <Link to="/founders" className="text-sm font-black tracking-widest uppercase text-white hover:text-yellow-500">Founders</Link>
            <Link to="/faq" className="text-sm font-black tracking-widest uppercase text-white hover:text-yellow-500">FAQ</Link>
            <div className="pt-4 border-t border-gray-800">
              <Link to="/audit" className="inline-block bg-yellow-500 text-black px-8 py-3 rounded-full text-xs font-black tracking-widest uppercase w-full">Start Audit</Link>
            </div>
          </div>
        </div>
      )}

      <main className="pt-32">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/audit" element={<AiAudit />} />
          <Route path="/services" element={<CoreServices />} />
          <Route path="/earned-media" element={<EarnedMedia />} />
          <Route path="/founders" element={<Founders />} />
          <Route path="/faq" element={<FAQ />} />
          
          <Route path="/blog" element={<BlogAnchor />} />
          <Route path="/blog/ai-megaphone" element={<ArticleMegaphone />} />
          <Route path="/blog/revenue-brain" element={<ArticleRevenue />} />
          <Route path="/blog/synthesis" element={<ArticleSynthesis />} />
          
          <Route path="/hq-command" element={<Admin />} /> 
        </Routes>
      </main>

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
