import { Link } from 'react-router-dom';
import { Target, Menu, Zap, Globe } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <Target className="text-yellow-500 group-hover:rotate-90 transition-transform duration-500" size={28} />
          <div className="flex flex-col leading-none">
            <span className="font-black text-xl tracking-tighter uppercase">Happy Hunter</span>
            <span className="text-[10px] text-yellow-500 font-bold tracking-[0.2em] uppercase">Digital Entity Ops</span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <Link to="/core-services" className="hover:text-yellow-500 transition-colors flex items-center gap-1">
            <Globe size={12} /> The Ecosystem
          </Link>
          <Link to="/earned-media" className="hover:text-yellow-500 transition-colors">Media</Link>
          <Link to="/audit" className="hover:text-yellow-500 transition-colors">Entity Audit</Link>
          <Link to="/faq" className="hover:text-yellow-500 transition-colors text-slate-600">Knowledge</Link>
