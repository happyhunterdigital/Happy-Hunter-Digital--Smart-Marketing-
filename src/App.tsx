import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AiAudit } from './components/AiAudit';
import { Chatbot } from './components/Chatbot';
import { CookieConsent } from './components/CookieConsent';
import { ContentRibbon } from './components/ContentRibbon';
import { EventPopup } from './components/EventPopup';
import { Home } from './pages/Home';
import { Founders } from './pages/Founders';
import { CoreServices } from './pages/CoreServices';
import { EarnedMedia } from './pages/EarnedMedia';
import { FAQ } from './pages/FAQ';
import { Admin } from './pages/Admin';
import { BlogAnchor } from './pages/BlogAnchor';
import { ArticleMegaphone } from './pages/ArticleMegaphone';
import { ArticleRevenue } from './pages/ArticleRevenue';
import { ArticleSynthesis } from './pages/ArticleSynthesis';
import { SummitPage } from './pages/SummitPage';
import { Menu, X, Mail, Phone, Facebook, Linkedin, Instagram, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';

// SVG Icons for TikTok and 'X'
const TikTokIcon = () => <svg fill="currentColor" width="18" height="18" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.022 1.61-.013 1.91-.02.08.53.63.91.75 1.17.12.11.71.62.24.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01.92.01.84-.03.75-.03.4-.54.79-1.35.94-1.31.92-3.58.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.1-3.34-3.12-3.59-5.43-.29-2.42.75-4.79 2.59-6.27 1.62-1.33.79-1.84 5.92-1.32v4.03c-1.02-.35-2.23-.14-3.05.55-.9.7-1.15 1.91-.73 2.93.31.83 1.11 1.48 2.01 1.6.86.13 1.8-.12 2.4-.76.54-.53.76-1.28.76-2.02V.02z"/></svg>;
const XIcon = () => <svg fill="currentColor" width="18" height="18" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8l164.9-199.9L26.8 48h145.6l100.5 132.3L389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>;

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-500 selection:text-black pt-8">
      
      {/* 1. SUMMIT RIBBON (Fixed Top) */}
      <ContentRibbon />
      
      {/* 2. SUMMIT POPUP */}
      <EventPopup />

      {/* 3. CAPSULE NAVBAR (Fixed below ribbon) */}
      <div className="fixed top-10 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
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

      {/* MOBILE MENU */}
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

      {/* ROUTING */}
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
          <Route path="/summit-2026" element={<SummitPage />} />
          <Route path="/hq-command" element={<Admin />} /> 
        </Routes>
      </main>

      {/* FOOTER */}
      <footer className="py-20 border-t border-gray-900 bg-black text-left">
        <div className="container mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          <div className="space-y-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" alt="Logo" className="w-12 h-12 rounded-full border border-yellow-500/30 object-cover"/>
              <span className="font-handwriting text-3xl tracking-wide lowercase text-white">happyhunterdigital</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              We architect your digital presence for the AI era, turning your physical business into a verified digital authority.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 border-b border-gray-800 pb-3">Direct Lines</h3>
            <div className="space-y-3 text-sm">
              <a href="mailto:motsumitl@happyhunterdigital.com" className="flex items-center gap-3 text-gray-300 hover:text-yellow-500 transition-colors">
                <Mail size={16} className="text-yellow-500"/> motsumitl@happyhunterdigital.com
              </a>
              <a href="https://wa.me/27601016673" className="flex items-center gap-3 text-gray-300 hover:text-yellow-500 transition-colors">
                <Phone size={16} className="text-yellow-500"/> +27 (0) 60 101 6673
              </a>
              <a href="https://www.happyhunterdigital.com" className="flex items-center gap-3 text-gray-300 hover:text-yellow-500 transition-colors">
                <Globe size={16} className="text-yellow-500"/> www.happyhunterdigital.com
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 border-b border-gray-800 pb-3">Explore</h3>
            <div className="space-y-3 text-sm flex flex-col items-start">
              <Link to="/services" className="text-gray-300 hover:text-yellow-500">Services</Link>
              <Link to="/earned-media" className="text-gray-300 hover:text-yellow-500">Case Studies</Link>
              <Link to="/blog" className="text-gray-300 hover:text-yellow-500">Intelligence Hub</Link>
              <Link to="/founders" className="text-gray-300 hover:text-yellow-500">About the Founder</Link>
              <Link to="/faq" className="text-gray-300 hover:text-yellow-500">FAQ</Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 border-b border-gray-800 pb-3">Social Signals</h3>
            <div className="flex flex-wrap gap-4">
              <a href="https://za.linkedin.com/in/thabomotsumi" target="_blank" rel="noreferrer" className="p-3 bg-gray-900 rounded-xl text-gray-400 hover:text-yellow-500 hover:border-yellow-500 border border-gray-800 transition-all"><Linkedin/></a>
              <a href="https://x.com/HappyHunter35" target="_blank" rel="noreferrer" className="p-3 bg-gray-900 rounded-xl text-gray-400 hover:text-yellow-500 hover:border-yellow-500 border border-gray-800 transition-all"><XIcon/></a>
              <a href="https://www.instagram.com/happyhunterdigital/" target="_blank" rel="noreferrer" className="p-3 bg-gray-900 rounded-xl text-gray-400 hover:text-yellow-500 hover:border-yellow-500 border border-gray-800 transition-all"><Instagram/></a>
              <a href="https://www.tiktok.com/@happyhunterdigital" target="_blank" rel="noreferrer" className="p-3 bg-gray-900 rounded-xl text-gray-400 hover:text-yellow-500 hover:border-yellow-500 border border-gray-800 transition-all"><TikTokIcon/></a>
              <a href="https://www.facebook.com/Happyhunterdigital/" target="_blank" rel="noreferrer" className="p-3 bg-gray-900 rounded-xl text-gray-400 hover:text-yellow-500 hover:border-yellow-500 border border-gray-800 transition-all"><Facebook/></a>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-700 text-[10px] font-black uppercase tracking-[0.3em] mt-16 pt-8 border-t border-gray-900">
           &copy; 2026 HAPPYHUNTERDIGITAL // ENTITY ARCHITECTURE & AGENTIC REVENUE SYSTEMS
        </div>
      </footer>

      <Chatbot />
      <CookieConsent />
    </div>
  );
}

export default App;
