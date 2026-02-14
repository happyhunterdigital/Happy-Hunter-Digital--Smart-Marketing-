import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // CRITICAL FIX
import { ShieldCheck } from 'lucide-react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('entity_consent');
    if (!consent) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem('entity_consent', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-[200] flex justify-center animate-fade-in">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 p-6 rounded-[2.5rem] shadow-2xl max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-left">
          <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500">
            <ShieldCheck size={24}/>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed font-medium">
            This entity uses protocol-cookies. By continuing, you agree to our data practices under the <b>POPI Act</b> and <b>GDPR</b> regulations. Review our <Link to="/faq" className="text-yellow-500 underline">Privacy Policy</Link>.
          </p>
        </div>
        <button 
          onClick={accept} 
          className="bg-yellow-500 text-slate-950 px-10 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl whitespace-nowrap"
        >
          Accept Protocol
        </button>
      </div>
    </div>
  );
}
