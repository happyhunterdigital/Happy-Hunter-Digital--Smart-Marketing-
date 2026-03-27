import React from 'react';
import { Search, Zap, ArrowRight, ShieldCheck, XCircle } from 'lucide-react';

interface AuditFormProps {
  step: number;
  form: any;
  setForm: (form: any) => void;
  setStep: (step: number) => void;
  phoneError: string;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  runForensicScan: () => void;
  scanProgress: number;
}

export const AuditForm: React.FC<AuditFormProps> = ({ step, form, setForm, setStep, phoneError, handlePhoneChange, runForensicScan, scanProgress }) => {
  const scanSteps =[
    "Verifying Google Business Profile...",
    "Extracting Star Rating & Review Count...",
    "Checking Website Signal Consistency...",
    "Scanning for AI Schema (JSON-LD)...",
    "Validating Answer Engine Compliance...",
    "Calculating AI Findability Index...",
    "Computing Digital Survival Score..."
  ];

  return (
    <>
      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6 bg-gray-900/40 p-10 rounded-[2.5rem] border border-gray-800 backdrop-blur-xl animate-fade-in text-center shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest mb-4">
            Signal Mismatch Detected
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">Is your business a <span className="text-yellow-500 italic">Ghost?</span></h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8">Enter your coordinates to see if algorithms can find your entity.</p>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <input className="w-full bg-black p-5 rounded-2xl border border-gray-800 text-white outline-none focus:border-yellow-500 transition-all" placeholder="Business Name" onChange={e => setForm({...form, biz: e.target.value})} required />
            <input className="w-full bg-black p-5 rounded-2xl border border-gray-800 text-white outline-none focus:border-yellow-500 transition-all" placeholder="City / Area" onChange={e => setForm({...form, loc: e.target.value})} required />
          </div>
          <button type="submit" className="w-full bg-yellow-500 p-5 rounded-2xl font-black uppercase text-black flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl">
            Analyze Business Architecture <ArrowRight size={20}/>
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={(e) => { e.preventDefault(); runForensicScan(); }} className="space-y-6 bg-gray-900/40 p-10 rounded-[2.5rem] border border-yellow-500/20 backdrop-blur-xl animate-fade-in shadow-2xl">
          <div className="text-center mb-8">
            <ShieldCheck className="mx-auto text-yellow-500 mb-4" size={48}/>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Secure Your Results</h2>
            <p className="text-gray-400 text-sm">Where should we dispatch your Forensic Intelligence Report?</p>
          </div>
          <div className="space-y-4 mb-6">
            <input className="w-full bg-black p-4 rounded-xl border border-gray-800 text-white outline-none focus:border-yellow-500" placeholder="Full Name" onChange={e => setForm({...form, name: e.target.value})} required />
            <input className="w-full bg-black p-4 rounded-xl border border-gray-800 text-white outline-none focus:border-yellow-500" placeholder="Email Address" type="email" onChange={e => setForm({...form, mail: e.target.value})} required />
            <div className="relative pt-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block text-left">WhatsApp Number (For Instant Delivery)</label>
              <input className={`w-full bg-black p-4 rounded-xl border ${phoneError ? 'border-red-500/50' : form.wa ? 'border-green-500/50' : 'border-gray-800'} text-white outline-none focus:border-yellow-500 transition-colors font-mono`} placeholder="+27601016673" type="tel" value={form.wa} onChange={handlePhoneChange} required />
              {phoneError && (
                <div className="text-[10px] mt-2 text-red-400 bg-red-900/10 p-3 rounded-lg border border-red-900/20 animate-fade-in text-left">
                  <p className="font-black uppercase tracking-widest mb-1 flex items-center gap-2"><XCircle size={12}/> Format Required:</p>
                  <p className="font-mono">+27601016673 (Country code + number, no spaces)</p>
                </div>
              )}
            </div>
          </div>
          <button type="submit" disabled={!!phoneError || !form.wa} className="w-full bg-yellow-500 p-5 rounded-2xl font-black uppercase text-black flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
            Reveal Intelligence <Zap size={20}/>
          </button>
        </form>
      )}

      {step === 3 && (
        <div className="text-center py-24 bg-gray-900/20 border border-gray-800 rounded-[3rem] animate-fade-in shadow-2xl">
          <div className="relative w-32 h-32 mx-auto mb-10 text-yellow-500">
            <div className="absolute inset-0 rounded-full border-4 border-current opacity-10"></div>
            <div className="absolute inset-0 rounded-full border-4 border-current border-t-transparent animate-spin"></div>
            <Search className="absolute inset-0 m-auto" size={40} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase mb-4">Scanning Digital Entity...</h2>
          <p className="text-yellow-500 font-mono text-xs mb-8">{scanSteps[Math.min(Math.floor(scanProgress / 14), 6)]}</p>
          <div className="w-64 h-1 bg-gray-800 mx-auto rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
          </div>
        </div>
      )}
    </>
  );
};
