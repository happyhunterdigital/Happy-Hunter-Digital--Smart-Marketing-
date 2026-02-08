import { Link } from 'react-router-dom';
import { Menu, Zap, Globe, BookOpen, ShieldCheck, HelpCircle } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="fixed top-6 left-0 w-full z-[100] px-6 flex justify-center">
      {/* THE CAPSULE */}
      <nav className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-full px-6 py-3 max-w-7xl w-fit shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-12 transition-all hover:border-yellow-500/30">
        
        {/* Brand Anchor */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761701/Logo_mock1_jmjuoe.png" 
            alt="happyhunterdigital logo" 
            className="h-8 w-auto object-contain transition-transform group-hover:scale-110 group-hover:rotate-12"
          />
          <div className="flex flex-col leading-none pt-1">
            <span className="brand-name text-2xl text-white tracking-tight leading-none">happyhunterdigital</span>
            <span className="text-[7px] text-yellow-500 font-black tracking-[0.4em] uppercase opacity-60">Smart Marketing</span>
          </div>
        </Link>
        
        {/* Desktop Intelligence Links */}
        <div className="hidden lg:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <Link to="/core-services" className="hover:text-yellow-500 transition-all flex items-center gap-2 group">
            <Globe size={12} className="group-hover:animate-spin-slow" /> The Strategy
          </Link>
          <Link to="/earned-media" className="hover:text-yellow-500 transition-all flex items-center gap-2">
            <BookOpen size={12} /> Case Studies
          </Link>
          <Link to="/audit" className="hover:text-yellow-500 transition-all flex items-center gap-2">
            <ShieldCheck size={12} /> Entity Audit
          </Link>
          <Link to="/faq" className="hover:text-yellow-500 transition-all flex items-center gap-2">
            <HelpCircle size={12} /> Knowledge
          </Link>
        </div>

        {/* Action Engine */}
        <div className="flex items-center gap-4">
          <Link to="/audit" className="hidden sm:flex bg-yellow-500 text-slate-950 px-6 py-2 rounded-full font-black hover:bg-white transition-all items-center gap-2 shadow-lg shadow-yellow-500/10 text-[10px] uppercase">
            <Zap size={14} fill="currentColor" /> Analyze Business
          </Link>
          
          {/* Mobile Menu Trigger */}
          <button className="lg:hidden text-slate-400 hover:text-yellow-500 transition-colors p-1">
            <Menu size={20} />
          </button>
        </div>
        
      </nav>
    </div>
  );
}
