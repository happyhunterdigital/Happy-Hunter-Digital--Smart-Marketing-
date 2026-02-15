import { Link } from 'react-router-dom';
import { Menu, Zap } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="fixed top-12 left-0 w-full z-[90] px-6 flex justify-center">
      <nav className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-full px-6 py-3 shadow-2xl flex items-center gap-10">
        <Link to="/" className="flex items-center gap-3 group">
          <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761701/Logo_mock1_jmjuoe.png" className="h-8" alt="logo" />
          <div className="flex flex-col pt-1">
            <span className="brand-name text-2xl text-white">happyhunterdigital</span>
            <span className="text-[7px] text-yellow-500 font-black uppercase tracking-[0.4em]">Smart Marketing</span>
          </div>
        </Link>
        <div className="hidden lg:flex items-center gap-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">
          <Link to="/founders" className="hover:text-yellow-500">Founders</Link>
          <Link to="/core-services" className="hover:text-yellow-500">Strategy</Link>
          <Link to="/earned-media" className="hover:text-yellow-500">Case Studies</Link>
          <Link to="/blog/digital-authority-architecture" className="hover:text-yellow-500">Intelligence</Link>
          <Link to="/faq" className="hover:text-yellow-500">Knowledge</Link>
          <Link to="/audit" className="bg-yellow-500 text-slate-950 px-5 py-2 rounded-full font-bold">Analyze Business</Link>
        </div>
      </nav>
    </div>
  );
}
