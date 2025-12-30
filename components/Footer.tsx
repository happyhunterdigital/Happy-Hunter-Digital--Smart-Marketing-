import React from 'react';
import { Linkedin, Instagram, Facebook, Phone, Mail, Clock, Globe, Shield, Bot, Zap } from 'lucide-react';
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
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" 
                alt="Happy Hunter Logo" 
                className="h-10 w-10 rounded-full border border-gray-700 object-cover"
              />
              <div className="flex flex-col">
                <span className="font-bold text-white text-lg leading-none">Happy Hunter</span>
                <span className="text-brand-yellow text-[10px] uppercase tracking-wider font-bold">Digital Entity Ops</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              We help SA businesses survive the <strong className="text-gray-300">"Great AI Filter."</strong> Stop being invisible to the algorithm and start building a Trusted Digital Entity.
            </p>
            
            {/* System Status Indicator */}
            <div className="flex items-center gap-2 text-[10px] font-bold text-brand-yellow uppercase tracking-wider bg-brand-yellow/5 border border-brand-yellow/20 px-3 py-1.5 rounded-full w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-yellow opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-yellow"></span>
              </span>
              System Operational
            </div>
          </div>
          
          {/* Services Column (Renamed to Ecosystem) */}
          <div>
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <Zap size={16} className="text-brand-yellow" /> The Ecosystem
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#services" className="hover:text-brand-yellow transition-colors">The Trust Anchor (Compliance)</a></li>
              <li><a href="#services" className="hover:text-brand-yellow transition-colors">The Megaphone (LLMO)</a></li>
              <li><a href="#services" className="hover:text-brand-yellow transition-colors">The Revenue Brain (Auto)</a></li>
              <li><a href="#audit" className="hover:text-brand-yellow text-brand-yellow font-semibold transition-colors">2026 Readiness Audit</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-white font-bold mb-4">Direct Line</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <Globe size={16} className="text-brand-yellow mt-0.5 flex-shrink-0" />
                <a href="https://www.happyhunterdigital.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow transition-colors">
                  www.happyhunterdigital.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={16} className="text-brand-yellow mt-0.5 flex-shrink-0" />
                <a href="mailto:motsumitl@happyhunterdigital.com" className="hover:text-brand-yellow transition-colors break-all">
                  motsumitl@happyhunterdigital.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={16} className="text-brand-yellow mt-0.5 flex-shrink-0" />
                <a href="https://wa.me/27601016673" target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow transition-colors">
                  +27 (0) 60 101 6673
                </a>
              </li>
            </ul>
          </div>

          {/* Operational Reality (The Upgrade) */}
          <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <Clock size={16} className="text-brand-yellow" /> Operational Status
            </h4>
            
            <div className="space-y-4">
              {/* Human Hours */}
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Human Support</p>
                <p className="text-sm text-white font-medium">Mon - Fri: 10:00 - 15:00</p>
                <p className="text-[10px] text-gray-600 italic">(Lifestyle Design Strategy)</p>
              </div>

              {/* AI Hours - The Flex */}
              <div className="pt-3 border-t border-gray-800">
                <p className="text-[10px] font-bold text-brand-yellow uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <Bot size={12} /> AI Agents
                </p>
                <p className="text-white text-sm font-bold flex items-center gap-2">
                  Online 24/7/365
                  <span className="text-[9px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded border border-green-500/20">Active</span>
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-gray-500 text-xs text-center md:text-left">
            <p>© {new Date().getFullYear()} Happy Hunter - Digital Entity Management.</p>
            <div className="hidden md:block h-3 w-px bg-gray-800"></div>
            <button 
              onClick={() => onNavigate && onNavigate('PRIVACY_POLICY')} 
              className="hover:text-brand-yellow transition-colors flex items-center gap-1"
            >
              <Shield size={12} /> Privacy Policy
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <a href="https://www.linkedin.com/in/thabomotsumi" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-yellow transition-colors"><Linkedin size={20} /></a>
            <a href="https://www.instagram.com/happyhunterdigital" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-yellow transition-colors"><Instagram size={20} /></a>
            <a href="https://www.facebook.com/Happyhunterdigital" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-yellow transition-colors"><Facebook size={20} /></a>
            <a href="https://www.tiktok.com/@happyhunterdigital" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-yellow transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
            </a>
            <a href="https://x.com/HappyHunter35" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-yellow transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
