
import React from 'react';
import { Linkedin, Instagram, Facebook, Phone, Mail, Clock, Globe, Shield } from 'lucide-react';
import { ViewState } from '../types';

interface FooterProps {
  onNavigate?: (view: ViewState) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-brand-dark border-t border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" 
                alt="Happy Hunter Logo" 
                className="h-10 w-10 rounded-full border border-gray-700 object-cover"
              />
              <div className="flex items-center font-bold text-xl">
                <span className="bg-brand-yellow text-brand-dark px-1.5 py-0.5 rounded-sm">Happy</span>
                <span className="bg-black text-brand-yellow px-1.5 py-0.5 rounded-sm border border-brand-yellow ml-1">Hunter</span>
                <span className="text-gray-300 ml-2 text-sm sm:text-base">- Smart Marketing -</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
              We help South African SMEs stop wasting money on fluff marketing and start building automated assets that generate revenue while they sleep.
            </p>
          </div>
          
          {/* Services Column */}
          <div>
            <h4 className="text-white font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#services" className="hover:text-brand-yellow">GMB Optimization</a></li>
              <li><a href="#services" className="hover:text-brand-yellow">SEO & Content</a></li>
              <li><a href="#services" className="hover:text-brand-yellow">Paid Advertising</a></li>
              <li><a href="#services" className="hover:text-brand-yellow">Email Automation</a></li>
            </ul>
          </div>

          {/* Contact Column - Replaces "Company" */}
          <div>
            <h4 className="text-white font-bold mb-4">Contact & Support</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <Globe size={16} className="text-brand-yellow mt-0.5 flex-shrink-0" />
                <a href="https://www.happyhunterdigital.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow hover:underline transition-colors">
                  www.happyhunterdigital.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={16} className="text-brand-yellow mt-0.5 flex-shrink-0" />
                <a href="mailto:motsumitl@happyhunterdigital.com" className="hover:text-brand-yellow hover:underline transition-colors break-all">
                  motsumitl@happyhunterdigital.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={16} className="text-brand-yellow mt-0.5 flex-shrink-0" />
                <a 
                  href="https://wa.me/27601016673" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-brand-yellow hover:underline transition-colors"
                >
                  +27 (0) 60 101 6673
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={16} className="text-brand-yellow mt-0.5 flex-shrink-0" />
                <span>Mon-Fri: 10:00 - 15:00</span>
              </li>
              
              <li className="pt-3 mt-1 border-t border-gray-800">
                 <button 
                   onClick={() => onNavigate && onNavigate('PRIVACY_POLICY')} 
                   className="flex items-center gap-2 hover:text-brand-yellow transition-colors group"
                 >
                   <Shield size={14} className="group-hover:text-brand-yellow" /> Privacy Policy
                 </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Happy Hunter - Smart Marketing Systems. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <a 
              href="https://www.linkedin.com/in/thabomotsumi" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn"
              className="text-gray-400 hover:text-brand-yellow transition-colors"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="https://www.instagram.com/happyhunterdigital" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram"
              className="text-gray-400 hover:text-brand-yellow transition-colors"
            >
              <Instagram size={20} />
            </a>
            <a 
              href="https://www.facebook.com/Happyhunterdigital" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Facebook"
              className="text-gray-400 hover:text-brand-yellow transition-colors"
            >
              <Facebook size={20} />
            </a>
            <a 
              href="https://www.tiktok.com/@happyhunterdigital" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="TikTok"
              className="text-gray-400 hover:text-brand-yellow transition-colors"
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5"
              >
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            </a>
            <a 
              href="https://x.com/HappyHunter35" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="X (Twitter)"
              className="text-gray-400 hover:text-brand-yellow transition-colors"
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-5 h-5"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
