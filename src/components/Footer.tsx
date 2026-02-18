import { Link } from 'react-router-dom';
import { Mail, Phone, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socials = [
    { name: 'LinkedIn', icon: <Linkedin size={18} />, url: "https://www.linkedin.com/in/thabomotsumi" },
    { name: 'X', icon: <Twitter size={18} />, url: "https://x.com/HappyHunter35" },
    {
      name: 'TikTok',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.022 1.61-.013 1.91-.02.08.53.63.91.75 1.17.12.11.71.62.24.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01.92.01.84-.03.75-.03.4-.54.79-1.35.94-1.31.92-3.58.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.1-3.34-3.12-3.59-5.43-.29-2.42.75-4.79 2.59-6.27 1.62-1.33.79-1.84 5.92-1.32v4.03c-1.02-.35-2.23-.14-3.05.55-.9.7-1.15 1.91-.73 2.93.31.83 1.11 1.48 2.01 1.6.86.13 1.8-.12 2.4-.76.54-.53.76-1.28.76-2.02V.02z"/>
        </svg>
      ),
      url: "https://www.tiktok.com/@happyhunterdigital"
    },
    { name: 'Instagram', icon: <Instagram size={18} />, url: "https://www.instagram.com/happyhunterdigital/" },
    { name: 'Facebook', icon: <Facebook size={18} />, url: "https://www.facebook.com/Happyhunterdigital/" }
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-16 sm:py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
        {/* Brand Column */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761701/Logo_mock1_jmjuoe.png"
              className="h-8"
              alt="logo"
              loading="lazy"
            />
            <span className="brand-name text-2xl sm:text-3xl text-white">happyhunterdigital</span>
          </Link>
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest leading-relaxed">
            South African Digital Entity Specialist. // Handshake Protocol Active.
          </p>
        </div>

        {/* Contact Column */}
        <div className="space-y-6 text-left">
          <h4 className="text-white font-black uppercase text-[10px] tracking-[0.4em] border-b border-slate-900 pb-2">
            Direct Lines
          </h4>
          <div className="space-y-4">
            <a 
              href="mailto:hello@happyhunterdigital.com" 
              className="flex items-center gap-3 text-slate-400 hover:text-yellow-500 transition-colors text-sm font-medium"
            >
              <Mail size={16} className="text-yellow-500 shrink-0" />
              hello@happyhunterdigital.com
            </a>
            <a 
              href="https://wa.me/27601016673" 
              className="flex items-center gap-3 text-slate-400 hover:text-yellow-500 transition-colors text-sm font-medium"
            >
              <Phone size={16} className="text-yellow-500 shrink-0" />
              +27 (0) 60 101 6673
            </a>
          </div>
        </div>

        {/* Social Nodes */}
        <div className="space-y-6 text-left">
          <h4 className="text-white font-black uppercase text-[10px] tracking-[0.4em] border-b border-slate-900 pb-2">
            Digital Signals
          </h4>
          <div className="flex flex-wrap gap-3">
            {socials.map((soc, i) => (
              <a
                key={i}
                href={soc.url}
                target="_blank"
                rel="noreferrer"
                title={soc.name}
                className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-yellow-500 hover:border-yellow-500/30 transition-all"
                aria-label={soc.name}
              >
                {soc.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Compliance Node */}
        <div className="space-y-6 text-left">
          <h4 className="text-white font-black uppercase text-[10px] tracking-[0.4em] border-b border-slate-900 pb-2">
            Compliance
          </h4>
          <div className="space-y-3">
            <Link 
              to="/faq" 
              className="block text-slate-600 hover:text-slate-400 text-[10px] font-black uppercase tracking-widest"
            >
              Privacy & POPI Act
            </Link>
            <Link 
              to="/faq" 
              className="block text-slate-600 hover:text-slate-400 text-[10px] font-black uppercase tracking-widest"
            >
              Terms of Service
            </Link>
            <p className="text-[9px] text-slate-800 font-bold uppercase tracking-[0.2em] pt-4 italic">
              © {currentYear} Thabo Leslie Motsumi
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
