import { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

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
    <div className="fixed bottom-6 left-6 right-6 z-[150] flex justify-center">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 rounded-[2.5rem] shadow-2xl max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500"><ShieldCheck size={24}/></div>
          <p className="text-slate-300 text-xs font-medium leading-relaxed">
            This entity uses protocol-cookies to ensure the highest authority delivery. By continuing, you agree to our data practices under the <span className="text-white font-bold">POPI Act</span> and <span className="text-white font-bold">GDPR</span> regulations.
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/privacy-policy" className="text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Review Policy</Link>
          <button onClick={accept} className="bg-yellow-500 text-slate-950 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white transition-all">Accept Protocol</button>
        </div>
      </div>
    </div>
  );
}
