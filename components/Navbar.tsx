import React, { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Core Services', href: '/core-services' },
    { name: 'Case Studies', href: '/#case-studies' },
    { name: 'Earned Media', href: '/earned-media' },
    { name: 'FAQ', href: '/faq' }, // Added FAQ Link
  ];

  return (
    <nav className="bg-gray-900 fixed w-full z-50 top-0 start-0 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between py-4">
          
          {/* --- BRANDING --- */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Logo Image */}
            <img 
              src="https://res.cloudinary.com/dka0498ns/image/upload/v1762761701/Logo_mock1_jmjuoe.png" 
              alt="Happy Hunter Logo" 
              className="h-10 w-auto object-contain" 
            />
            {/* Text Branding */}
            <div className="flex flex-col leading-none">
              <span className="text-yellow-400 font-black text-xl md:text-2xl tracking-tighter lowercase group-hover:text-yellow-300 transition-colors">
                happyhunterdigital
              </span>
              <span className="text-gray-400 text-[10px] md:text-xs font-bold italic tracking-wider">
                -Smart Marketing-
              </span>
            </div>
          </Link>

          {/* --- DESKTOP MENU --- */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-8">
              {navLinks.map((link) => (
                <li key={link.name}>
                  {/* Handle Hash Links vs Page Routes */}
                  {link.href.startsWith('/#') ? (
                    <a 
                      href={link.href} 
                      className="text-gray-300 hover:text-yellow-400 font-medium transition-colors text-sm uppercase tracking-wide"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link 
                      to={link.href} 
                      className="text-gray-300 hover:text-yellow-400 font-medium transition-colors text-sm uppercase tracking-wide"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <a 
              href="https://calendly.com/happyhunterdigital/discovery"
              target="_blank"
              rel="noreferrer"
              className="bg-yellow-400 text-gray-900 px-5 py-2.5 rounded font-bold hover:bg-yellow-300 transition-all flex items-center gap-2 text-sm shadow-lg shadow-yellow-400/20"
            >
              Book Discovery Call <ArrowRight size={16} />
            </a>
          </div>

          {/* --- MOBILE BUTTON --- */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-400 rounded-lg md:hidden hover:bg-gray-800"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* --- MOBILE DROPDOWN --- */}
          <div className={`${isOpen ? 'block' : 'hidden'} w-full md:hidden mt-4 border-t border-gray-800 pt-4`}>
            <ul className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="block py-2 px-3 text-gray-300 rounded hover:bg-gray-800 hover:text-yellow-400"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <a 
                  href="https://calendly.com/happyhunterdigital/discovery"
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full text-center bg-yellow-400 text-gray-900 px-5 py-3 rounded font-bold hover:bg-yellow-300"
                >
                  Book Discovery Call
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};
