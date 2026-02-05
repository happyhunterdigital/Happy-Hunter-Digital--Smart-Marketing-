import { Link } from 'react-router-dom';
import { Target, Menu, Zap, Globe, BookOpen } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed w-full z-[70] bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand Entity */}
        <Link to="/" className="flex items-center gap-2 group">
          <Target className="text-yellow-500 group-hover:rotate-90 transition-transform duration-500" size={28} />
          <div className="flex flex-col leading-none">
            <span className="font-black text-xl tracking-tighter uppercase text-white">Happy Hunter</span>
            <span className="text-[10px] text-yellow-500 font-black tracking-[0.2em] uppercase">Digital Entity Ops</span>
          </div>
        </Link>
        
        {/* Authority Links */}
        <div className="hidden lg:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <Link to="/core-services" className="hover:text-yellow-500 transition-all flex items-center gap-1">
            <Globe size={12} /> The 2026 Strategy
          </Link>
          <Link to="/earned-media" className="hover:text-yellow-500 transition-all flex items-center gap-1">
            <BookOpen size={12} /> Case Studies
          </Link>
          <Link to="/audit" className="hover:text-yellow-500 transition-all">Entity Audit</Link>
          <Link to="/faq" className="hover:text-yellow-500 transition-all">Knowledge</Link>
          
          {/* High-Conversion CTA */}
          <Link to="/audit" className="bg-yellow-500 text-slate-950 px-6 py-2.5 rounded-full hover:bg-yellow-400 transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/10">
            <Zap size={14} fill="currentColor" /> Analyze Business
          </Link>
        </div>
        
        {/* Mobile Trigger */}
        <button className="lg:hidden text-slate-400 p-2"><Menu /></button>
      </div>
    </nav>
  );
}
