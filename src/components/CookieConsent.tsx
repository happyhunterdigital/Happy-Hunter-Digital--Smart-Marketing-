import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { CONSENT_OPEN_EVENT, getConsent, setConsent } from '../lib/consent';

export const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(getConsent() === null);

    const reopen = () => setShow(true);
    document.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => document.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  const choose = (choice: 'accepted' | 'declined') => {
    setConsent(choice);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-[200] flex justify-center animate-fade-in pointer-events-none">
      <div
        role="dialog"
        aria-live="polite"
        aria-label="Cookie consent"
        className="w-full max-w-4xl bg-black/90 backdrop-blur-2xl border border-gray-800 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 p-8 pointer-events-auto"
      >
        <div className="flex items-start gap-5 text-left">
          <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500 shrink-0">
            <ShieldCheck size={28} />
          </div>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
            We use cookies to improve your experience and measure how our site performs. Analytics and
            marketing scripts stay off until you accept. Read our{' '}
            <Link to="/privacy-policy" className="text-amber-400 underline font-bold hover:text-white transition-colors">
              Privacy Policy
            </Link>{' '}
            for full details under <strong className="text-white font-black">POPIA</strong> and{' '}
            <strong className="text-white font-black">GDPR</strong>.
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
          <button
            onClick={() => choose('declined')}
            className="flex-1 md:flex-none text-gray-500 hover:text-white text-xs font-black uppercase tracking-widest px-6 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={() => choose('accepted')}
            className="flex-1 md:flex-none bg-yellow-500 text-black px-10 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-yellow-500/20"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};
