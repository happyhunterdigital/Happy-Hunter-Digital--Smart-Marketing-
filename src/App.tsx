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
import { Architecture } from './pages/Architecture';
import { ClientPortal } from './pages/ClientPortal';
import { SummitPoster } from './pages/SummitPoster';
import { MegaphoneLanding } from './pages/MegaphoneLanding';
import { LiveSummit } from './pages/LiveSummit';
import { Menu, X, Mail, Phone, Facebook, Linkedin, Instagram, Globe, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';

// FIREBASE IMPORTS FOR ENTITY ENGINE
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';

const TikTokIcon = () => <svg fill="currentColor" width="18" height="18" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.022 1.61-.013 1.91-.02.08.53.63.91.75 1.17.12.11.71.62.24.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01.92.01.84-.03.75-.03.4-.54.79-1.35.94-1.31.92-3.58.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.1-3.34-3.12-3.59-5.43-.29-2.42.75-4.79 2.59-6.27 1.62-1.33.79-1.84 5.92-1.32v4.03c-1.02-.35-2.23-.14-3.05.55-.9.7-1.15 1.91-.73 2.93.31.83 1.11 1.48 2.01 1.6.86.13 1.8-.12 2.4-.76.54-.53.76-1.28.76-2.02V.02z"/></svg>;
const XIcon = () => <svg fill="currentColor" width="18" height="18" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8l164.9-199.9L26.8 48h145.6l100.5 132.3L389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>;

// AI ENTITY ENGINE
const AIEntityEngine = () => {
  const [jsonLd, setJsonLd] = useState('');
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "public_seo", "master_schema"), (doc) => {
      if (doc.exists()) setJsonLd(doc.data().compiled_json_ld);
    });
    return () => unsubscribe();
  }, []);
  return jsonLd ? <script type="application/ld+json">{jsonLd}</script> : null;
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isLandingPage = location.pathname === '/the-ai-megaphone';

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={`min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-500 selection:text-black ${isLandingPage ? '' : 'pt-12'}`}>
      
      <AIEntityEngine />

      {!isLandingPage && <ContentRibbon />}
      {!isLandingPage && <EventPopup />}

      {/* NAVBAR */}
      {!isLandingPage && (
        <div className="fixed top-16 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
          <nav className="w-full max-w-7xl bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-5 py-3 flex justify-between items-center shadow-2xl pointer-events-auto">
            <Link to="/" className="flex items-center gap-2 pl-1 shrink-0">
              <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" alt="Logo" className="w-9 h-9 rounded-full border border-yellow-500/30 object-cover" />
              <span className="font-handwriting text-2xl md:text-3xl tracking-wide lowercase whitespace-nowrap text-white">
                happy<span className="text-yellow-500">hunter</span>digital
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-4 xl:gap-6 px-4">
              <Link to="/architecture" className="text-[9px] font-black uppercase tracking-[0.1em] text-yellow-500 hover:text-white transition-all whitespace-nowrap">Architecture</Link>
              <Link to="/services" className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-300 hover:text-yellow-500 transition-all whitespace-nowrap">Services</Link>
              <Link to="/earned-media" className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-300 hover:text-yellow-500 transition-all whitespace-nowrap">Earned Media</Link>
              <Link to="/live" className="text-[9px] font-black uppercase tracking-[0.15em] text-red-500 hover:text-white transition-all whitespace-nowrap flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>LIVE
              </Link>
              <Link to="/intelligence" className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-300 hover:text-yellow-500 transition-all whitespace-nowrap">Intelligence</Link>
              <Link to="/founders" className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-300 hover:text-yellow-500 transition-all whitespace-nowrap">Founders</Link>
              <Link to="/portal" className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-500 hover:text-yellow-500 transition-all whitespace-nowrap flex items-center gap-1"><Lock size={10}/> Portal</Link>
            </div>

            <Link to="/audit" className="hidden lg:block bg-yellow-500 text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-xl whitespace-nowrap shrink-0">
              Start Audit
            </Link>

            <button className="lg:hidden text-white pr-2 shrink-0" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
          </nav>
        </div>
      )}

      {/* MOBILE MENU */}
      {menuOpen && !isLandingPage && (
        <div className="fixed top-32 left-4 right-4 z-[100] bg-black/95 backdrop-blur-2xl border border-gray-800 rounded-3xl p-8 shadow-2xl animate-fade-in lg:hidden">
          <div className="flex flex-col space-y-6 text-center font-bold uppercase tracking-widest text-sm">
            <Link to="/architecture" className="text-yellow-500 hover:text-white">Architecture</Link>
            <Link to="/services" className="hover:text-yellow-500 text-white">Services</Link>
            <Link to="/live" className="text-red-500 hover:text-white flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> LIVE BROADCAST
            </Link>
            <Link to="/earned-media" className="hover:text-yellow-500 text-white">Earned Media</Link>
            <Link to="/intelligence" className="hover:text-yellow-500 text-white">Intelligence Hub</Link>
            <Link to="/founders" className="hover:text-yellow-500 text-white">Founders</Link>
            <Link to="/faq" className="hover:text-yellow-500 text-white">FAQ</Link>
            <Link to="/portal" className="text-gray-500 flex items-center justify-center gap-2 hover:text-yellow-500"><Lock size={14}/> Client Portal</Link>
            <div className="pt-4 border-t border-white/10">
              <Link to="/audit" className="inline-block bg-yellow-500 text-black px-8 py-3 rounded-full text-xs font-black w-full uppercase">Start Audit</Link>
            </div>
          </div>
        </div>
      )}

      {/* ROUTES */}
      <main className={isLandingPage ? "" : "pt-24"}>
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
          <Route path="/summit-2026" element={<SummitPage />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/portal" element={<ClientPortal />} />
          <Route path="/promo" element={<SummitPoster />} />
          <Route path="/the-ai-megaphone" element={<MegaphoneLanding />} />
          <Route path="/hq-command" element={<Admin />} />
          <Route path="/live" element={<LiveSummit />} />
        </Routes>
      </main>

      {/* FOOTER */}
      {!isLandingPage && (
        <footer className="py-24 border-t border-gray-900 bg-black text-left mt-20 px-6">
          <div className="container mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" className="w-12 h-12 rounded-full border border-yellow-500/30 object-cover" alt="Logo" />
                <span className="font-handwriting text-3xl lowercase"><span className="text-white">happy</span><span className="text-yellow-500">hunter</span><span className="text-gray-400">digital</span></span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">Architecting digital dominance for ambitious South African entities.</p>
            </div>

            <div className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 border-b border-gray-900 pb-4">Direct Lines</h3>
              <div className="space-y-4 text-xs font-medium">
                <a href="mailto:motsumitl@happyhunterdigital.com" className="flex items-center gap-3 text-gray-300 hover:text-yellow-500 transition-all"><Mail size={16} className="text-yellow-500"/> motsumitl@happyhunterdigital.com</a>
                <a href="https://wa.me/27601016673" className="flex items-center gap-3 text-gray-300 hover:text-yellow-500 transition-all"><Phone size={16} className="text-yellow-500"/> +27 (0) 60 101 6673</a>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 border-b border-gray-900 pb-4">Internal Hubs</h3>
              <div className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                <Link to="/architecture" className="text-yellow-500">Master Architecture</Link>
                <Link to="/services" className="text-white">The Protocol</Link>
                <Link to="/earned-media" className="text-white">Success Nodes</Link>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 border-b border-gray-900 pb-4">Social Signals</h3>
              <div className="flex flex-wrap gap-4">
                <a href="https://za.linkedin.com/in/thabomotsumi" target="_blank" rel="noreferrer" className="p-3 bg-[#0a0a0a] rounded-xl text-gray-400 border border-gray-800"><Linkedin size={20}/></a>
                <a href="https://x.com/HappyHunter35" target="_blank" rel="noreferrer" className="p-3 bg-[#0a0a0a] rounded-xl text-gray-400 border border-gray-800"><XIcon/></a>
                <a href="https://www.instagram.com/happyhunterdigital/" target="_blank" rel="noreferrer" className="p-3 bg-[#0a0a0a] rounded-xl text-gray-400 border border-gray-800"><Instagram size={20}/></a>
              </div>
            </div>
          </div>
          <div className="container mx-auto mt-24 border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500">
            <p className="text-gray-800 text-[9px] font-black uppercase tracking-[0.5em] opacity-40">&copy; 2026 // HAPPYHUNTERDIGITAL SYSTEMS</p>
          </div>
        </footer>
      )}

      {/* CHATBOT & COOKIES */}
      {!isLandingPage && <Chatbot />}
      <CookieConsent />
    </div>
  );
}

export default App;
