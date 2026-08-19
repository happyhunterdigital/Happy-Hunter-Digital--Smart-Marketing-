// src/components/Layout/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';

interface HeaderProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  isLandingPage: boolean;
}

const NAV_ITEMS = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'Smart News', href: '/smart-news' },
  { label: 'About', href: '/founders' },
];

export const Header: React.FC<HeaderProps> = ({ menuOpen, setMenuOpen, isLandingPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLandingPage) return null;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex flex-col ${
          scrolled
            ? 'bg-[#0a0a0f]/90 backdrop-blur-2xl border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-black h-8 overflow-hidden flex items-center relative z-20 shadow-md" role="marquee" aria-label="Latest updates">
           <div className="flex animate-marquee whitespace-nowrap items-center font-sans text-[10px] font-black uppercase tracking-[0.2em]">
             {[...Array(6)].map((_, i) => (
               <React.Fragment key={i}>
                 <span className="mx-8">New: Google now shows AI Overviews above regular search results</span>
                 <span className="mx-8 text-black/30" aria-hidden="true">/</span>
                 <span className="mx-8">Google Maps now shows owner-shot videos first</span>
                 <span className="mx-8 text-black/30" aria-hidden="true">/</span>
                 <span className="mx-8">ChatGPT and Gemini are answering local service questions — are you showing up?</span>
                 <span className="mx-8 text-black/30" aria-hidden="true">/</span>
               </React.Fragment>
             ))}
           </div>
        </div>

        <div className={`container mx-auto px-6 flex items-center justify-between transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="https://res.cloudinary.com/dkyg07qvv/image/upload/v1780205914/happyhunterdigital_logo_l61qn8.jpg" 
              alt="Happy Hunter Digital logo" 
              className="w-10 h-10 rounded-xl object-cover border border-amber-500/20 group-hover:scale-105 transition-transform" 
            />
            <div className="hidden sm:block">
              <span className="text-white font-bold text-lg tracking-tight">happyhunter</span>
              <span className="text-amber-500 font-bold text-lg">digital</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === item.href
                    ? 'text-amber-400 bg-amber-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/audit"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-xl transition-all hover:scale-[1.02]"
            >
              <Search size={16} />
              Free Online Business Health Check
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-2xl transition-all duration-500 lg:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-6">
          {NAV_ITEMS.map((item, i) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMenuOpen(false)}
              className="text-3xl font-black text-white hover:text-amber-400 transition-colors"
              style={{
                transitionDelay: menuOpen ? `${i * 50}ms` : '0ms',
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: menuOpen ? 1 : 0
              }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/audit"
            onClick={() => setMenuOpen(false)}
            className="mt-4 px-8 py-4 bg-amber-500 text-black font-black text-lg rounded-2xl"
            style={{
              transitionDelay: menuOpen ? '200ms' : '0ms',
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity: menuOpen ? 1 : 0
            }}
          >
            Start Free Audit
          </Link>
        </nav>
      </div>
    </>
  );
};
