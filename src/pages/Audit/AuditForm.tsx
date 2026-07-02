// src/pages/Audit/AuditForm.tsx
import React, { useState } from 'react';
import { Search, Zap, Terminal, Code, Loader2 } from 'lucide-react';

interface AuditFormProps {
  step: number;
  form: any;
  setForm: (form: any) => void;
  setStep: (step: number) => void;
  phoneError: string;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  runForensicScan: () => void;
  scanProgress: number;
  loading: boolean;
}

export const AuditForm: React.FC<AuditFormProps> = ({ 
  step, form, setForm, setStep, phoneError, handlePhoneChange, runForensicScan, scanProgress, loading 
}) => {
  const [terminalFocus, setTerminalFocus] = useState(false);

  const scanSteps = [
    "Establishing Neural Link to Google Maps API...",
    "Extracting schema architecture and node health...",
    "Cross-referencing AEO guidelines...",
    "Calculating Entity Visibility Index...",
    "Generating actionable payload..."
  ];

  return (
    <>
      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} 
          className="max-w-2xl mx-auto space-y-6 bg-black p-8 md:p-12 rounded-[2rem] border border-gray-800 shadow-2xl relative overflow-hidden group transition-all hover:border-yellow-500/50">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
          
          <div className="text-left mb-8 border-b border-gray-900 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <Terminal size={12} /> Ghost Interface Active
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none">
              Initialize Target <br/>Architecture
            </h2>
          </div>

          <div className={`p-4 rounded-xl border transition-all ${terminalFocus ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)] bg-black' : 'border-gray-800 bg-gray-900/50'}`}>
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2 block">
              <b>TARGET_ENTITY_NAME</b>
            </label>
            <input 
              className="w-full bg-transparent text-white font-mono text-lg outline-none placeholder:text-gray-700" 
              placeholder="e.g. Happy Hunter Digital" 
              onFocus={() => setTerminalFocus(true)}
              onBlur={() => setTerminalFocus(false)}
              onChange={e => setForm({...form, biz: e.target.value})} 
              value={form.biz}
              required 
            />
          </div>

          <div className={`p-4 rounded-xl border transition-all ${terminalFocus ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)] bg-black' : 'border-gray-800 bg-gray-900/50'}`}>
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2 block">
              <b>OPERATIONAL_COORDINATES</b>
            </label>
            <input 
              className="w-full bg-transparent text-white font-mono text-lg outline-none placeholder:text-gray-700" 
              placeholder="e.g. Pretoria" 
              onFocus={() => setTerminalFocus(true)}
              onBlur={() => setTerminalFocus(false)}
              onChange={e => setForm({...form, loc: e.target.value})} 
              value={form.loc}
              required 
            />
          </div>

          <button type="submit" className="w-full bg-yellow-500 p-5 rounded-xl font-black uppercase text-black flex items-center justify-center gap-3 hover:bg-white transition-all">
            Execute Neural Handshake <Zap size={18}/>
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={(e) => { e.preventDefault(); runForensicScan(); }} 
          className="max-w-2xl mx-auto space-y-6 bg-black p-8 md:p-12 rounded-[2rem] border border-yellow-500/30 shadow-[0_0_40px_rgba(234,179,8,0.2)] animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500 animate-pulse"></div>
          
          <div className="text-left mb-8 border-b border-gray-900 pb-6">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Secure Data Channel</h2>
            <p className="text-gray-400 text-sm mt-2 font-mono">Routing diagnostic payload to secure vectors.</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="p-4 bg-gray-900 rounded-xl border border-gray-800 focus-within:border-yellow-500 focus-within:shadow-[0_0_15px_rgba(234,179,8,0.2)] transition-all">
               <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1 block"><b>ADMIN_NAME</b></label>
               <input className="w-full bg-transparent text-white outline-none font-mono" placeholder="Commander Name" 
                 onChange={e => setForm({...form, name: e.target.value})} value={form.name} required />
            </div>

            <div className="p-4 bg-gray-900 rounded-xl border border-gray-800 focus-within:border-yellow-500 focus-within:shadow-[0_0_15px_rgba(234,179,8,0.2)] transition-all">
               <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1 block"><b>ADMIN_EMAIL</b></label>
               <input className="w-full bg-transparent text-white outline-none font-mono" placeholder="Secure Email" type="email" 
                 onChange={e => setForm({...form, mail: e.target.value})} value={form.mail} required />
            </div>

            <div className={`p-4 bg-gray-900 rounded-xl border transition-all ${phoneError ? 'border-red-500' : form.wa ? 'border-green-500' : 'border-gray-800 focus-within:border-yellow-500 focus-within:shadow-[0_0_15px_rgba(234,179,8,0.2)]'}`}>
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1 block"><b>WHATSAPP_NODE (For Live Briefing)</b></label>
              <input className="w-full bg-transparent text-white outline-none font-mono" placeholder="+27601016673" type="tel" 
                value={form.wa} onChange={handlePhoneChange} required />
              {phoneError && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase">{phoneError}</p>}
            </div>
          </div>

          <button type="submit" disabled={!!phoneError || !form.wa || loading} 
            className="w-full bg-yellow-500 p-5 rounded-xl font-black uppercase text-black flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Deploying Forensic Scan...
              </>
            ) : (
              <>Deploy Forensic Scan <Code size={18}/></>
            )}
          </button>
        </form>
      )}

      {step === 3 && (
        <div className="max-w-2xl mx-auto text-center py-24 bg-black border border-yellow-500/50 rounded-[3rem] shadow-[0_0_60px_rgba(234,179,8,0.15)] animate-fade-in relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(234,179,8,0.1)_0%,_transparent_70%)]"></div>
          <div className="relative z-10">
            <div className="w-24 h-24 mx-auto mb-8 relative">
              <div className="absolute inset-0 border-4 border-yellow-500/20 rounded-full animate-ping"></div>
              <div className="absolute inset-0 border-4 border-t-yellow-500 rounded-full animate-spin"></div>
              <Search className="absolute inset-0 m-auto text-yellow-500" size={32} />
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Neural Handshake In Progress</h2>
            <p className="text-yellow-500 font-mono text-sm mb-8">{scanSteps[Math.min(Math.floor(scanProgress / 20), scanSteps.length - 1)]}</p>
            <div className="w-64 h-2 bg-gray-900 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-yellow-500 rounded-full transition-all duration-500" style={{ width: `${scanProgress}%` }}></div>
            </div>
            <p className="text-gray-600 font-mono text-xs mt-4">{scanProgress}% Complete</p>
          </div>
        </div>
      )}
    </>
  );
};
