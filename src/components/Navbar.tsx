import { Link } from 'react-router-dom';
import { Menu, Zap } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed w-full z-[70] bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand Identity */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761701/Logo_mock1_jmjuoe.png" 
            alt="happyhunterdigital logo" 
            className="h-10 w-auto object-contain transition-transform group-hover:scale-110"
          />
          <div className="flex flex-col leading-none pt-1">
            <span className="brand-name text-3xl text-white tracking-tight">happyhunterdigital</span>
            <span className="text-[8px] text-yellow-500 font-black tracking-[0.4em] uppercase opacity-70">Smart Marketing</span>
          </div>
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <Link to="/core-services" className="hover:text-yellow-500 transition-all">The Strategy</Link>
          <Link to="/earned-media" className="hover:text-yellow-500 transition-all">Case Studies</Link>
          <Link to="/audit" className="hover:text-yellow-500 transition-all">Audit</Link>
          <Link to="/faq" className="hover:text-yellow-500 transition-all">Knowledge</Link>
          
          <Link to="/audit" className="bg-yellow-500 text-slate-950 px-6 py-2.5 rounded-full hover:bg-yellow-400 transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/10">
            <Zap size={14} fill="currentColor" /> Analyze Business
          </Link>
        </div>
        
        <button className="lg:hidden text-slate-400 p-2"><Menu /></button>
      </div>
    </nav>
  );
}
