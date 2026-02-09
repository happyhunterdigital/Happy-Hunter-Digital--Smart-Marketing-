import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Zap, Globe, BookOpen, ShieldCheck, HelpCircle, User } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { name: 'Founders', path: '/founders', icon: <User size={14} /> },
    { name: 'The Strategy', path: '/core-services', icon: <Globe size={14} /> },
    { name: 'Case Studies', path: '/earned-media', icon: <BookOpen size={14} /> },
    { name: 'Entity Audit', path: '/audit', icon: <ShieldCheck size={14} /> },
    { name: 'Knowledge', path: '/faq', icon: <HelpCircle size={14} /> },
  ];

  return (
    <>
      <div className="fixed top-6 left-0 w-full z-[100] px-6 flex justify-center">
        <nav className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-full px-6 py-3 shadow-2xl flex items-center gap-10 transition-all hover:border-yellow-500/30">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-3 group">
            <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761701/Logo_mock1_jmjuoe.png" className="h-7 w-auto" alt="logo" />
            <div className="flex flex-col pt-1">
              <span className="brand-name text-2xl text-white">happyhunterdigital</span>
              <span className="text-[7px] text-yellow-500 font-black uppercase tracking-[0.4em]">Smart Marketing</span>
            </div>
          </Link>
          <div className="hidden lg:flex items-center gap-6 text-[10px] font-black uppercase text-slate-400">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className="hover:text-yellow-500 transition-all flex items-center gap-2">
                {link.icon}{link.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link to="/audit" className="hidden sm:flex bg-yellow-500 text-slate-950 px-6 py-2 rounded-full font-black hover:bg-white transition-all text-[10px] uppercase">
              Analyze Business
            </Link>
            <button onClick={toggleMenu} className="lg:hidden text-slate-400 p-1"><Menu size={24} /></button>
          </div>
        </nav>
      </div>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-[90] lg:hidden transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={closeMenu} />
        <div className={`absolute right-0 top-0 h-full w-[80%] max-w-sm bg-slate-900 border-l border-slate-800 p-10 flex flex-col justify-center gap-12 transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="space-y-8">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={closeMenu} className="flex items-center gap-4 text-2xl font-black uppercase text-white hover:text-yellow-500 transition-colors">
                {link.icon}{link.name}
              </Link>
            ))}
          </div>
          <Link to="/audit" onClick={closeMenu} className="w-full bg-yellow-500 text-slate-950 p-6 rounded-3xl font-black text-center shadow-2xl">ANALYZE BUSINESS</Link>
          <button onClick={closeMenu} className="absolute top-10 right-10 text-slate-500"><X size={32} /></button>
        </div>
      </div>
    </>
  );
}
