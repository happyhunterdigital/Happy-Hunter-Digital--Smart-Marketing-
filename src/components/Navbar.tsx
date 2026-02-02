import { Link } from 'react-router-dom';
import { Target, Zap } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <Target className="text-yellow-500" size={28} />
          <span className="font-black text-xl uppercase tracking-tighter">Happy Hunter</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <Link to="/services" className="hover:text-yellow-500">Services</Link>
          <Link to="/audit" className="hover:text-yellow-500">Audit</Link>
          <Link to="/faq" className="hover:text-yellow-500">FAQ</Link>
          <Link to="/audit" className="bg-yellow-500 text-slate-950 px-6 py-2 rounded-full font-bold flex items-center gap-2">
            <Zap size={14} /> Analyze
          </Link>
        </div>
      </div>
    </nav>
  );
}
