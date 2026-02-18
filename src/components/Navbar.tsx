import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, Zap } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/founders', label: 'Founders' },
    { to: '/core-services', label: 'Strategy' },
    { to: '/earned-media', label: 'Case Studies' },
    { to: '/faq', label: 'Knowledge' },
  ];

  return (
    <div className="fixed top-12 left-0 w-full z-[90] px-4 sm:px-6 flex justify-center">
      <nav className={`
        w-full max-w-6xl bg-slate-900/80 backdrop-blur-xl border border-slate-800
        rounded-full px-4 sm:px-6 py-3 shadow-2xl flex items-center justify-between
        transition-all duration-300
        ${scrolled ? 'bg-slate-900/95' : ''}
      `}>
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
          <img
            src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761701/Logo_mock1_jmjuoe.png"
            className="h-6 sm:h-8"
            alt="logo"
            loading="eager"
          />
          <div className="flex flex-col pt-0.5">
            <span className="brand-name text-lg sm:text-2xl text-white">happyhunterdigital</span>
            <span className="text-[6px] sm:text-[7px] text-yellow-500 font-black uppercase tracking-[0.3em]">
              Smart Marketing
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">
          {navLinks.map(link => (
            <Link 
              key={link.to} 
              to={link.to} 
              className="hover:text-yellow-500 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link 
            to="/audit" 
            className="bg-yellow-500 text-slate-950 px-5 py-2 rounded-full font-bold hover:bg-yellow-400 transition-colors"
          >
            Analyze Business
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-yellow-500"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 top-12 z-[80] bg-slate-950/98 backdrop-blur-xl pt-24 px-6 lg:hidden">
          <div className="flex flex-col gap-6 text-center">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-2xl font-black uppercase text-slate-400 hover:text-yellow-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/audit"
              className="bg-yellow-500 text-slate-950 px-8 py-4 rounded-2xl font-black uppercase text-lg mt-4"
            >
              Analyze Business
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
