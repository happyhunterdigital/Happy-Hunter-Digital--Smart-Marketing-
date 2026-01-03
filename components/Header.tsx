import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Smart Link: Scrolls if on home, navigates home then scrolls if on other pages
  const handleScrollLink = (sectionId: string) => {
    setIsMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed w-full bg-brand-dark/95 backdrop-blur-sm z-50 border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold flex items-center gap-2 text-white" onClick={() => window.scrollTo(0,0)}>
          <span className="bg-brand-yellow text-brand-dark px-2 py-1 rounded">Happy</span>
          <span className="border-2 border-brand-yellow px-2 py-1 rounded text-brand-yellow">Hunter</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => handleScrollLink('services')} className="text-gray-300 hover:text-brand-yellow transition-colors">Services</button>
          <button onClick={() => handleScrollLink('portfolio')} className="text-gray-300 hover:text-brand-yellow transition-colors">Case Studies</button>
          <Link to="/earned-media" className="text-gray-300 hover:text-brand-yellow transition-colors">Earned Media</Link>
          
          {/* UPDATED: Direct Calendly Link */}
          <a 
            href="https://calendly.com/motsumitl/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-yellow text-brand-dark px-6 py-2 rounded font-bold hover:bg-white transition-all flex items-center gap-2"
          >
            Book Discovery Call <ArrowRight size={18} />
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-brand-dark border-t border-gray-800 p-4 flex flex-col gap-4 md:hidden shadow-xl">
            <button onClick={() => handleScrollLink('services')} className="text-left text-gray-300 hover:text-brand-yellow py-2">Services</button>
            <button onClick={() => handleScrollLink('portfolio')} className="text-left text-gray-300 hover:text-brand-yellow py-2">Case Studies</button>
            <Link to="/earned-media" className="text-gray-300 hover:text-brand-yellow py-2" onClick={() => setIsMenuOpen(false)}>Earned Media</Link>
            
            {/* UPDATED: Direct Calendly Link (Mobile) */}
            <a 
              href="https://calendly.com/motsumitl/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-yellow text-brand-dark px-6 py-3 rounded font-bold text-center block"
            >
              Book Discovery Call
            </a>
          </div>
        )}
      </div>
    </header>
  );
};
