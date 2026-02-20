import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X } from 'lucide-react';

export const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('hh_consent_v1');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('hh_consent_v1', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-[100] flex justify-center animate-fade-in pointer-events-none">
      <div className="w-full max-w-4xl bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 p-6 pointer-events-auto">
        <div className="flex items-start gap-4">
          <ShieldCheck className="text-yellow-500 shrink-0 mt-1" size={24} />
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
            This entity uses protocol-cookies to enhance your experience. By continuing, you agree to our data practices under the <strong className="text-white">POPI Act</strong> and <strong className="text-white">GDPR</strong> regulations. Review our <Link to="/faq" className="text-yellow-500 underline">Privacy Policy</Link>.
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <button onClick={() => setShow(false)} className="text-gray-500 hover:text-white text-xs font-black uppercase tracking-widest px-4">Decline</button>
          <button onClick={accept} className="bg-yellow-500 text-black px-8 py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-yellow-500/20">Accept Protocol</button>
        </div>
      </div>
    </div>
  );
};
