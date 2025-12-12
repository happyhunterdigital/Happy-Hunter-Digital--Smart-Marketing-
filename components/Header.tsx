import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS, CALENDLY_LINK } from '../constants';
import { ViewState } from '../types';

interface HeaderProps {
  onNavigate?: (view: ViewState) => void;
  onScroll?: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onNavigate = (view: ViewState) => {}, 
  onScroll = (id: string) => {} 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    
    // Check if the link is a ViewState or a scroll target
    if (href === 'HOME' || href === 'EARNED_MEDIA') {
      onNavigate(href as ViewState);
    } else {
      onScroll(href);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/95 backdrop-blur-md border-b border-gray-800 w-full transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button onClick={() => handleLinkClick('HOME')} className="flex-shrink-0 flex items-center gap-3 group">
              <img 
                src="https://res.cloudinary.com/dka0498ns/image/upload/v1765280886/Happy_Hunter_-Smart_Marketing-_Logo._Digital_Marketing_uupsop.jpg" 
                alt="Happy Hunter Logo" 
                className="h-10 w-10 rounded-full border border-gray-700 object-cover group-hover:border-brand-yellow transition-colors"
              />
              <div className="flex items-center font-bold text-lg sm:text-xl tracking-tight">
                <span className="bg-brand-yellow text-brand-dark px-1.5 py-0.5 rounded-sm">Happy</span>
                <span className="bg-black text-brand-yellow px-1.5 py-0.5 rounded-sm border border-brand-yellow ml-1">Hunter</span>
                <span className="text-gray-300 ml-2 text-sm hidden sm:inline">- Smart Marketing -</span>
              </div>
            </button>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <button 
                key={link.name} 
                onClick={() => handleLinkClick(link.href)}
                className="text-gray-300 hover:text-brand-yellow px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.name}
              </button>
            ))}
            <a 
              href={CALENDLY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-yellow text-brand-dark px-5 py-2 rounded-lg font-bold hover:bg-yellow-300 transition-transform transform hover:scale-105 shadow-lg shadow-yellow-500/20"
            >
              Book A Free Discovery Call
            </a>
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 border-b border-gray-800 shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_LINKS.map((link) => (
              <button
                key={link.name}
                onClick={() => handleLinkClick(link.href)}
                className="text-left w-full text-gray-300 hover:text-brand-yellow block px-3 py-2 rounded-md text-base font-medium"
              >
                {link.name}
              </button>
            ))}
             <a 
              href={CALENDLY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center mt-4 bg-brand-yellow text-brand-dark px-5 py-3 rounded-lg font-bold hover:bg-yellow-300"
            >
              Book A Free Discovery Call
            </a>
          </div>
        </div>
      )}
    </header>
  );
};