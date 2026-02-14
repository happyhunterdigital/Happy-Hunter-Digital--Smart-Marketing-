import { Link } from 'react-router-dom';
import { Mail, Phone, Instagram, Facebook, Twitter, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-16">
        
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-3">
            <img src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761701/Logo_mock1_jmjuoe.png" className="h-8" alt="logo" />
            <span className="brand-name text-3xl text-white">happyhunterdigital</span>
          </Link>
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest leading-relaxed">
            South African Digital Entity Specialist. // Handshake Protocol Active.
          </p>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-black uppercase text-[10px] tracking-[0.4em] border-b border-slate-900 pb-2">Direct Lines</h4>
          <div className="space-y-4">
            <a href="mailto:motsumitl@happyhunterdigital.com" className="flex items-center gap-3 text-slate-400 hover:text-yellow-500 transition-colors text-sm font-medium">
              <Mail size={16} className="text-yellow-500" /> motsumitl@happyhunterdigital.com
            </a>
            <a href="https://wa.me/27601016673" className="flex items-center gap-3 text-slate-400 hover:text-yellow-500 transition-colors text-sm font-medium">
              <Phone size={16} className="text-yellow-500" /> +27 (0) 60 101 6673
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-black uppercase text-[10px] tracking-[0.4em] border-b border-slate-900 pb-2">Digital Signals</h4>
          <div className="flex gap-4">
            {[
              { icon: <Twitter size={18} />, url: "https://x.com/HappyHunter35" },
              { icon: <Instagram size={18} />, url: "https://www.instagram.com/happyhunterdigital/" },
              { icon: <Facebook size={18} />, url: "https://www.facebook.com/Happyhunterdigital/" }
            ].map((soc, i) => (
              <a key={i} href={soc.url} target="_blank" className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-yellow-500 transition-all">
                {soc.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-black uppercase text-[10px] tracking-[0.4em] border-b border-slate-900 pb-2">Compliance</h4>
          <div className="space-y-3 text-[10px] font-black uppercase tracking-widest text-slate-600">
             <p>POPIA & GDPR Verified</p>
             <p className="pt-4 text-slate-800">Managed by Thabo Leslie Motsumi</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
