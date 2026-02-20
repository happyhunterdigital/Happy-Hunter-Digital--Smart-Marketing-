import { Routes, Route, Link, useLocation } from 'react-router-dom';
// ... other imports ...
import { Menu, X, Mail, Phone, Facebook, Linkedin, Instagram } from 'lucide-react'; // Add new icons
import { useState, useEffect } from 'react';

// A simple SVG for TikTok and 'X'
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
      
      {/* ... (Keep your existing Capsule Navbar) ... */}
      
      <main className="pt-32">
        <Routes>
          {/* ... (Keep all your existing routes) ... */}
        </Routes>
      </main>

      {/* NEW PREMIUM FOOTER */}
      <footer className="py-20 border-t border-gray-900 bg-black text-left">
        <div className="container mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" alt="Logo" className="w-12 h-12 rounded-full border border-yellow-500/30 object-cover"/>
              <span className="font-handwriting text-3xl tracking-wide lowercase text-white">happyhunterdigital</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              We architect your digital presence for the AI era, turning your physical business into a verified digital authority.
            </p>
          </div>

          {/* Column 2: Direct Lines */}
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

          {/* Column 3: Navigation */}
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
          
          {/* Column 4: Social Signals */}
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
    </div>
  );
}

export default App;
