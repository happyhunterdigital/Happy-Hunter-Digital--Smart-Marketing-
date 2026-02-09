import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Zap, Globe, BookOpen, ShieldCheck, HelpCircle } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { name: 'The Strategy', path: '/core-services', icon: <Globe size={14} /> },
    { name: 'Case Studies', path: '/earned-media', icon: <BookOpen size={14} /> },
    { name: 'Entity Audit', path: '/audit', icon: <ShieldCheck size={14} /> },
    { name: 'Knowledge', path: '/faq', icon: <HelpCircle size={14} /> },
  ];

  return (
    <>
      <div className="fixed top-6 left-0 w-full z-[100] px-6 flex justify-center">
        {/* THE CAPSULE */}
        <nav className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-full px-6 py-3 max-w-7xl w-fit shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-10 transition-all hover:border-yellow-500/30">
          
          {/* Brand Anchor */}
          <Link to="/" onClick={closeMenu} className="flex items-center gap-3 group">
            <img 
              src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761701/Logo_mock1_jmjuoe.png" 
              alt="happyhunterdigital logo" 
              className="h-7 w-auto object-contain transition-transform group-hover:scale-110 group-hover:rotate-12"
            />
            <div className="flex flex-col leading-none pt-1">
              <span className="brand-name text-2xl text-white tracking-tight leading-none">happyhunterdigital</span>
              <span className="text-[7px] text-yellow-500 font-black tracking-[0.4em] uppercase opacity-60">Smart Marketing</span>
            </div>
          </Link>
          
          {/* Desktop Intelligence Links */}
          <div className="hidden lg:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className="hover:text-yellow-500 transition-all flex items-center gap-2 group"
              >
                <span className="group-hover:animate-pulse">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Engine */}
          <div className="flex items-center gap-4">
            <Link to="/audit" className="hidden sm:flex bg-yellow-500 text-slate-950 px-6 py-2 rounded-full font-black hover:bg-white transition-all items-center gap-2 shadow-lg shadow-yellow-500/10 text-[10px] uppercase">
              <Zap size={14} fill="currentColor" /> Analyze Business
            </Link>
            
            {/* Mobile Menu Trigger */}
            <button 
              onClick={toggleMenu}
              className="lg:hidden text-slate-400 hover:text-yellow-500 transition-colors p-1"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={24} className="text-yellow-500" /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div className={`fixed inset-0 z-[90] lg:hidden transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={closeMenu} />
        
        <div className={`absolute right-0 top-0 h-full w-[80%] max-w-sm bg-slate-900 border-l border-slate-800 p-10 flex flex-col justify-center gap-12 transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          <div className="space-y-8">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-700 border-b border-slate-800 pb-4">Navigation Protocol</p>
            
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={closeMenu}
                className="flex items-center gap-4 text-2xl font-black uppercase tracking-tighter text-white hover:text-yellow-500 transition-colors"
              >
                <div className="p-3 bg-slate-800 rounded-2xl text-yellow-500">
                  {link.icon}
                </div>
                {link.name}
              </Link>
            ))}
          </div>

          <div className="space-y-6 pt-12 border-t border-slate-800">
            <Link 
              to="/audit" 
              onClick={closeMenu}
              className="w-full bg-yellow-500 text-slate-950 p-6 rounded-3xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-2xl"
            >
              <Zap size={20} fill="currentColor" /> Analyze Business
            </Link>
            <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">
              Digital Entity Management v2.0
            </p>
          </div>

          {/* Close button for mobile menu */}
          <button 
            onClick={closeMenu}
            className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors"
          >
            <X size={32} />
          </button>
        </div>
      </div>
    </>
  );
}
