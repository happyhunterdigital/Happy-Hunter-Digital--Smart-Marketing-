import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check local storage to see if user has already accepted
    const consent = localStorage.getItem('happy_hunter_cookie_consent');
    if (!consent) {
      // Small delay for better UX (don't pop up instantly on load)
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('happy_hunter_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[60] flex justify-center animate-fade-in-up">
      <div className="max-w-4xl w-full bg-gray-900/95 backdrop-blur-md border border-gray-700 p-4 sm:p-5 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-5">
        
        {/* Icon Container */}
        <div className="bg-gray-800 p-3 rounded-xl hidden sm:block shrink-0">
          <ShieldCheck className="text-brand-yellow" size={28} />
        </div>

        {/* Text Content */}
        <div className="flex-1 text-center sm:text-left">
          <h4 className="text-white font-bold text-sm mb-1 flex items-center justify-center sm:justify-start gap-2">
            <Cookie size={16} className="text-brand-yellow sm:hidden" />
            We value your privacy
          </h4>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            We use cookies to enhance your browsing experience and analyze traffic. 
            By continuing, you agree to our data practices in accordance with the 
            <span className="text-brand-yellow font-semibold mx-1">POPI Act</span> 
            and 
            <span className="text-brand-yellow font-semibold mx-1">GDPR</span> 
            regulations.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={handleAccept}
            className="flex-1 sm:flex-none bg-brand-yellow text-brand-dark font-bold px-6 py-3 rounded-lg hover:bg-yellow-300 transition-colors text-sm shadow-lg shadow-yellow-500/10 whitespace-nowrap"
          >
            Accept & Continue
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="sm:hidden text-gray-500 hover:text-white p-2"
            aria-label="Dismiss"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};