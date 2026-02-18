import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X } from 'lucide-react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('entity_consent');
      if (!consent) {
        const timer = setTimeout(() => setShow(true), 2000);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // localStorage not available (private mode)
      console.log('Storage not available');
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem('entity_consent', 'true');
    } catch (e) {
      console.log('Could not save consent');
    }
    setShow(false);
  };

  const decline = () => {
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[200] flex justify-center animate-fade-in">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-[2rem] shadow-2xl max-w-4xl w-full flex flex-col md:flex-row justify-between gap-4 p-4 sm:p-6 items-center">
        <div className="flex items-center gap-4 text-left">
          <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500 shrink-0">
            <ShieldCheck size={24} />
          </div>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
            This entity uses protocol-cookies. By continuing, you agree to our data practices under the{' '}
            <b>POPI Act</b> and <b>GDPR</b> regulations. Review our{' '}
            <Link to="/faq" className="text-yellow-500 underline hover:text-yellow-400">
              Privacy Policy
            </Link>.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-slate-500 text-xs font-bold uppercase hover:text-white transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="bg-yellow-500 text-slate-950 px-6 sm:px-10 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl whitespace-nowrap"
          >
            Accept Protocol
          </button>
        </div>
      </div>
    </div>
  );
}
