import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Facebook, Linkedin, Instagram, Leaf } from 'lucide-react';

const TikTokIcon = () => <svg fill="currentColor" width="18" height="18" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.022 1.61-.013 1.91-.02.08.53.63.91.75 1.17.12.11.71.62.24.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01.92.01.84-.0 3.75-.03.4-.54.79-1.35.94-1.31.92-3.58.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.1-3.34-3.12-3.59-5.43-.29-2.42.75-4.79 2.59-6.27 1.62-1.33.79-1.84 5.92-1.32v4.03c-1.02-.35-2.23-.14-3.05.55-.9.7-1.15 1.91-.73 2.93.31.83 1.11 1.48 2.01 1.6.86.13 1.8-.12 2.4-.76.54-.53.76-1.28.76-2.02V.02z"/></svg>;
const XIcon = () => <svg fill="currentColor" width="18" height="18" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8l164.9-199.9L26.8 48h145.6l100.5 132.3L389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>;

interface FooterProps {
  isLandingPage: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isLandingPage }) => {
  if (isLandingPage) return null;

  return (
    <footer className="py-24 border-t border-gray-900 bg-black text-left mt-20 px-6">
      <div className="container mx-auto grid md:grid-cols-2 lg:grid-cols-5 gap-16">
        
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img 
              src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" 
              className="w-12 h-12 rounded-full border border-yellow-500/30 object-cover" 
              alt="Logo" 
            />
            <span className="font-handwriting text-3xl lowercase">
              <span className="text-white">happy</span><span className="text-yellow-500">hunter</span><span className="text-gray-400">digital</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs">Architecting digital dominance for ambitious South African entities.</p>
        </div>

        <div className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 border-b border-gray-900 pb-4">Direct Lines</h3>
          <div className="space-y-4 text-xs font-medium">
            <a href="mailto:motsumitl@happyhunterdigital.com" className="flex items-center gap-3 text-gray-300 hover:text-yellow-500 transition-all"><Mail size={16} className="text-yellow-500"/> motsumitl@happyhunterdigital.com</a>
            <a href="https://wa.me/27601016673" className="flex items-center gap-3 text-gray-300 hover:text-yellow-500 transition-all"><Phone size={16} className="text-yellow-500"/> +27 (0) 60 101 6673</a>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 border-b border-gray-900 pb-4">Entity Location</h3>
          <p className="text-gray-400 text-[10px] leading-relaxed">
            First floor, Unit 35, 29 Rhodes Ave,<br />
            Florida North, Roodepoort, 1710<br />
            Johannesburg, South Africa
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 border-b border-gray-900 pb-4">Internal Hubs</h3>
          <div className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
            <Link to="/architecture" className="text-yellow-500">Master Architecture</Link>
            <Link to="/services" className="text-white">The Protocol</Link>
            <Link to="/earned-media" className="text-white">Success Nodes</Link>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 border-b border-gray-900 pb-4">Social Signals</h3>
          <div className="flex flex-wrap gap-4">
            <a href="https://za.linkedin.com/in/thabomotsumi" target="_blank" rel="noreferrer" className="p-3 bg-black rounded-xl text-gray-400 border border-gray-800 hover:text-yellow-500 hover:shadow-neural-glow transition-all"><Linkedin size={20}/></a>
            <a href="https://x.com/HappyHunter35" target="_blank" rel="noreferrer" className="p-3 bg-black rounded-xl text-gray-400 border border-gray-800 hover:text-yellow-500 hover:shadow-neural-glow transition-all"><XIcon/></a>
            <a href="https://www.instagram.com/happyhunterdigital/" target="_blank" rel="noreferrer" className="p-3 bg-black rounded-xl text-gray-400 border border-gray-800 hover:text-yellow-500 hover:shadow-neural-glow transition-all"><Instagram size={20}/></a>
            <a href="https://www.tiktok.com/@happyhunterdigital" target="_blank" rel="noreferrer" className="p-3 bg-black rounded-xl text-gray-400 border border-gray-800 hover:text-yellow-500 hover:shadow-neural-glow transition-all"><TikTokIcon/></a>
            <a href="https://www.facebook.com/Happyhunterdigital/" target="_blank" rel="noreferrer" className="p-3 bg-black rounded-xl text-gray-400 border border-gray-800 hover:text-yellow-500 hover:shadow-neural-glow transition-all"><Facebook size={20}/></a>
          </div>
        </div>

      </div>

      <div className="container mx-auto mt-24 border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <p className="text-gray-700 text-[9px] font-black uppercase tracking-[0.5em]">&copy; 2026 // HAPPYHUNTERDIGITAL SYSTEMS</p>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 text-[9px] font-bold uppercase tracking-widest">
            <Leaf size={10} />
            <span>0.01g CO₂/visit — SSR Optimized</span>
          </div>
        </div>
        <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
          <Link to="/privacy-policy" className="hover:text-yellow-500 transition-colors">Privacy Protocol</Link>
        </div>
      </div>
    </footer>
  );
};
