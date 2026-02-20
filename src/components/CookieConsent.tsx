import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X } from 'lucide-react';

export const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('happyhunter_consent');
      if (!consent) {
        // Delay the popup so it doesn't interrupt the initial page load
        const timer = setTimeout(() => setShow(true), 3000);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // localStorage is not available (e.g., private browsing)
      console.warn("Storage not available for consent.");
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem('happyhunter_consent', 'true');
    } catch (e) {
      console.warn("Could not save consent.");
    }
    setShow(false);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 flex justify-center animate-fade-in pointer-events-none">
      <div className="w-full max-w-4xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 p-6 pointer-events-auto">
        
        <div className="flex items-start gap-4">
          <ShieldCheck className="text-yellow-500 shrink-0 mt-1" size={24} />
          <p className="text-gray-300 text-sm leading-relaxed">
            We use essential cookies for site functionality and analytics. By continuing, you agree to our data practices under the POPI Act. You can review our full{' '}
            <Link to="/faq" className="font-bold text-yellow-500 underline hover:text-white">
              Privacy Policy
            </Link>.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button onClick={() => setShow(false)} className="text-gray-500 hover:text-white text-sm font-bold uppercase transition-colors px-4 py-2">
            Decline
          </button>
          <button onClick={accept} className="bg-yellow-500 text-black px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors">
            Accept Protocol
          </button>
        </div>
      </div>
    </div>
  );
};
