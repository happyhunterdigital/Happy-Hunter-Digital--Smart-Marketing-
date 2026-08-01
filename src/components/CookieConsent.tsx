import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('hh_compliance_active');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }
    return () => {};
  }, []);

  const accept = () => {
    localStorage.setItem('hh_compliance_active', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-[200] flex justify-center animate-fade-in pointer-events-none">
      <div className="w-full max-w-4xl bg-black/90 backdrop-blur-2xl border border-gray-800 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 p-8 pointer-events-auto">
        <div className="flex items-start gap-5 text-left">
          <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500 shrink-0">
            <ShieldCheck size={28} />
          </div>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
            This entity uses protocol-cookies for analytics and security. By continuing, you agree to our data processing standards under the <strong className="text-white font-black">POPI Act (South Africa)</strong> and <strong className="text-white font-black">GDPR</strong> regulations. Review our <Link to="/faq" className="text-yellow-500 underline font-bold hover:text-white transition-colors">Privacy Policy</Link>.
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
          <button onClick={() => setShow(false)} className="flex-1 md:flex-none text-gray-500 hover:text-white text-xs font-black uppercase tracking-widest px-6 transition-colors">Decline</button>
          <button onClick={accept} className="flex-1 md:flex-none bg-yellow-500 text-black px-10 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-yellow-500/20">Accept Protocol</button>
        </div>
      </div>
    </div>
  );
};
