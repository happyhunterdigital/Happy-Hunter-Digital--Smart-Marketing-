import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AiAudit } from './components/AiAudit';
import { Chatbot } from './components/Chatbot';
import { CookieConsent } from './components/CookieConsent';
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
import { Menu, X, Mail, Phone, Facebook, Linkedin, Instagram, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';

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
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* 2026 CAPSULE NAVBAR */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className="w-full max-w-5xl bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-5 py-3 flex justify-between items-center shadow-2xl pointer-events-auto">
          <Link to="/" className="flex items-center gap-3 pl-2">
            <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" alt="Logo" className="w-10 h-10 rounded-full border border-yellow-500/30 object-cover" />
            <span className="font-handwriting text-2xl md:text-3xl tracking-wide lowercase">
              <span className="text-white">happy</span><span className="text-yellow-500">hunter</span><span className="text-gray-400">digital</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6 px-4">
            {["Services", "Earned Media", "Intelligence", "Founders", "FAQ"].map((link) => (
              <Link key={link} to={`/${link.toLowerCase().replace(" ", "-")}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 hover:text-yellow-500 transition-all">{link}</Link>
            ))}
          </div>

          <div className="hidden lg:block pr-1">
            <Link to="/audit" className="bg-yellow-500 text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)]">Start Audit</Link>
          </div>

          <button className="lg:hidden text-white pr-2" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={24}/> : <Menu size={24}/>}</button>
        </nav>
      </div>

      {menuOpen && (
        <div className="fixed top-28 left-4 right-4 z-40 bg-black/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-fade-in lg:hidden">
          <div className="flex flex-col space-y-6 text-center">
            {["Services", "Earned Media", "Intelligence", "Founders", "FAQ"].map((link) => (
              <Link key={link} to={`/${link.toLowerCase().replace(" ", "-")}`} className="text-sm font-black tracking-widest uppercase hover:text-yellow-500">{link}</Link>
            ))}
            <div className="pt-4 border-t border-white/10">
              <Link to="/audit" className="inline-block bg-yellow-500 text-black px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest w-full">Start Audit</Link>
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
          <Route path="/intelligence" element={<BlogAnchor />} />
          <Route path="/blog/ai-megaphone" element={<ArticleMegaphone />} />
          <Route path="/blog/revenue-brain" element={<ArticleRevenue />} />
          <Route path="/blog/synthesis" element={<ArticleSynthesis />} />
          <Route path="/hq-command" element={<Admin />} /> 
        </Routes>
      </main>

      <footer className="py-20 border-t border-white/5 bg-black text-left">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <span className="font-handwriting text-3xl lowercase"><span className="text-white">happy</span><span className="text-yellow-500">hunter</span><span className="text-gray-400">digital</span></span>
            <p className="text-gray-500 text-sm leading-relaxed">Architecting digital dominance for the AI era.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Direct Lines</h3>
            <div className="space-y-2 text-xs">
              <a href="mailto:motsumitl@happyhunterdigital.com" className="flex items-center gap-2 text-gray-300 hover:text-yellow-500 transition-all font-medium"><Mail size={14} className="text-yellow-500"/> motsumitl@happyhunterdigital.com</a>
              <a href="https://wa.me/27601016673" className="flex items-center gap-2 text-gray-300 hover:text-yellow-500 transition-all font-medium"><Phone size={14} className="text-yellow-500"/> +27 (0) 60 101 6673</a>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Explore</h3>
            <div className="flex flex-col gap-2 text-xs text-gray-300">
              <Link to="/services" className="hover:text-yellow-500">Protocol</Link>
              <Link to="/earned-media" className="hover:text-yellow-500">Success Nodes</Link>
              <Link to="/intelligence" className="hover:text-yellow-500">Intelligence Hub</Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Social Signals</h3>
            <div className="flex gap-4">
              <a href="https://za.linkedin.com/in/thabomotsumi" className="text-gray-400 hover:text-yellow-500 transition-all"><Linkedin size={20}/></a>
              <a href="https://www.tiktok.com/@happyhunterdigital" className="text-gray-400 hover:text-yellow-500 transition-all"><TikTokIcon/></a>
              <a href="https://x.com/HappyHunter35" className="text-gray-400 hover:text-yellow-500 transition-all"><XIcon/></a>
            </div>
          </div>
        </div>
        <p className="text-center text-[8px] font-black uppercase tracking-[0.4em] text-gray-800 mt-20">&copy; 2026 HAPPYHUNTERDIGITAL // AGENTIC SYSTEMS</p>
      </footer>

      <Chatbot />
      <CookieConsent />
    </div>
  );
}

export default App;
