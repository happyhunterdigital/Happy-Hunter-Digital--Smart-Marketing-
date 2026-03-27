import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, PlusSquare, Lock } from 'lucide-react';

interface HeaderProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  isLandingPage: boolean;
}

export const Header: React.FC<HeaderProps> = ({ menuOpen, setMenuOpen, isLandingPage }) => {
  if (isLandingPage) return null;

  return (
    <>
      <div className="fixed top-16 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
        <nav className="w-full max-w-7xl bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-5 py-3 flex justify-between items-center shadow-2xl pointer-events-auto">
          <Link to="/" className="flex items-center gap-2 pl-1 shrink-0">
            <img
              src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg"
              alt="Logo"
              className="w-9 h-9 rounded-full border border-yellow-500/30 object-cover"
            />
            <span className="font-handwriting text-2xl md:text-3xl tracking-wide lowercase whitespace-nowrap text-white">
              happy<span className="text-yellow-500">hunter</span>digital
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-4 xl:gap-6 px-4">
            <Link to="/architecture" className="text-[9px] font-black uppercase tracking-[0.1em] text-yellow-500 hover:text-white transition-all whitespace-nowrap">Architecture</Link>
            <Link to="/services" className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-300 hover:text-yellow-500 transition-all whitespace-nowrap">Services</Link>
            <Link to="/earned-media" className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-300 hover:text-yellow-500 transition-all whitespace-nowrap">Earned Media</Link>
            <Link to="/live" className="text-[9px] font-black uppercase tracking-[0.15em] text-red-500 hover:text-white transition-all whitespace-nowrap flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>LIVE
            </Link>
            <Link to="/intelligence" className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-300 hover:text-yellow-500 transition-all whitespace-nowrap">Intelligence</Link>
            <Link to="/founders" className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-300 hover:text-yellow-500 transition-all whitespace-nowrap">Founders</Link>
            <Link to="/workspace" className="text-[9px] font-black uppercase tracking-[0.15em] text-yellow-500 hover:text-white transition-all whitespace-nowrap flex items-center gap-1"><PlusSquare size={10}/> Workspace</Link>
            <Link to="/portal" className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-500 hover:text-yellow-500 transition-all whitespace-nowrap flex items-center gap-1"><Lock size={10}/> Portal</Link>
          </div>

          <Link to="/audit" className="hidden lg:block bg-yellow-500 text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-xl whitespace-nowrap shrink-0">
            Start Audit
          </Link>
          
          <button className="lg:hidden text-white pr-2 shrink-0" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </nav>
      </div>

      {menuOpen && (
        <div className="fixed top-32 left-4 right-4 z-[100] bg-black/95 backdrop-blur-2xl border border-gray-800 rounded-3xl p-8 shadow-2xl animate-fade-in lg:hidden">
          <div className="flex flex-col space-y-6 text-center font-bold uppercase tracking-widest text-sm">
            <Link to="/architecture" className="text-yellow-500 hover:text-white">Architecture</Link>
            <Link to="/services" className="hover:text-yellow-500 text-white">Services</Link>
            <Link to="/live" className="text-red-500 hover:text-white flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> LIVE BROADCAST
            </Link>
            <Link to="/earned-media" className="hover:text-yellow-500 text-white">Earned Media</Link>
            <Link to="/intelligence" className="hover:text-yellow-500 text-white">Intelligence Hub</Link>
            <Link to="/founders" className="hover:text-yellow-500 text-white">Founders</Link>
            <Link to="/workspace" className="text-yellow-500 flex items-center justify-center gap-2 hover:text-white"><PlusSquare size={14}/> HQ Workspace</Link>
            <Link to="/faq" className="hover:text-yellow-500 text-white">FAQ</Link>
            <Link to="/portal" className="text-gray-500 flex items-center justify-center gap-2 hover:text-yellow-500"><Lock size={14}/> Client Portal</Link>
            <div className="pt-4 border-t border-white/10">
              <Link to="/audit" className="inline-block bg-yellow-500 text-black px-8 py-3 rounded-full text-xs font-black w-full uppercase">Start Audit</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
