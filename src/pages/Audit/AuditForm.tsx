import React, { useState } from 'react';
import { Search, Zap, Terminal, Code, Loader2, ChevronDown } from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+27', country: 'ZA', name: 'South Africa', digits: 9 },
  { code: '+1', country: 'US', name: 'United States', digits: 10 },
  { code: '+44', country: 'UK', name: 'United Kingdom', digits: 10 },
  { code: '+61', country: 'AU', name: 'Australia', digits: 9 },
  { code: '+353', country: 'IE', name: 'Ireland', digits: 9 },
  { code: '+33', country: 'FR', name: 'France', digits: 9 },
  { code: '+49', country: 'DE', name: 'Germany', digits: 11 },
  { code: '+31', country: 'NL', name: 'Netherlands', digits: 9 },
  { code: '+7', country: 'RU', name: 'Russia', digits: 10 },
  { code: '+86', country: 'CN', name: 'China', digits: 11 },
  { code: '+91', country: 'IN', name: 'India', digits: 10 },
  { code: '+234', country: 'NG', name: 'Nigeria', digits: 10 },
  { code: '+254', country: 'KE', name: 'Kenya', digits: 10 },
  { code: '+255', country: 'TZ', name: 'Tanzania', digits: 10 },
  { code: '+256', country: 'UG', name: 'Uganda', digits: 9 },
];

interface AuditFormProps {
  step: number;
  form: {
    biz: string;
    loc: string;
    web: string;
    name: string;
    mail: string;
    wa: string;
    countryCode: string;
  };
  setForm: (form: any) => void;
  setStep: (step: number) => void;
  phoneError: string;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCountryCodeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  runForensicScan: () => void;
  scanProgress: number;
  loading: boolean;
}

export const AuditForm: React.FC<AuditFormProps> = ({ 
  step, form, setForm, setStep, phoneError, handlePhoneChange, handleCountryCodeChange, runForensicScan, scanProgress, loading 
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
              <b>TARGET_WEBSITE_URL</b> <span className="text-gray-700 normal-case">— optional</span>
            </label>
            <input 
              className="w-full bg-transparent text-white font-mono text-lg outline-none placeholder:text-gray-700" 
              placeholder="e.g. https://happyhunterdigital.com" 
              type="text"
              onFocus={() => setTerminalFocus(true)}
              onBlur={() => setTerminalFocus(false)}
              onChange={e => setForm({...form, web: e.target.value})} 
              value={form.web}
            />
            <p className="text-[10px] font-mono text-gray-600 mt-2">
              No website? Paste your Google Maps / GBP link instead — we'll run a GBP-only audit.
            </p>
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

            <div className={`p-4 bg-gray-900 rounded-xl border transition-all ${
              phoneError ? 'border-red-500' : (form.wa && !phoneError) ? 'border-green-500' : 'border-gray-800 focus-within:border-yellow-500 focus-within:shadow-[0_0_15px_rgba(234,179,8,0.2)]'
            }`}>
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2 block">
                <b>WHATSAPP_NODE (For Live Briefing)</b>
              </label>
              <div className="flex gap-2 mb-2">
                <div className="relative">
                  <select
                    value={form.countryCode}
                    onChange={handleCountryCodeChange}
                    className="bg-gray-800 text-white text-sm font-mono p-2 pr-8 rounded-lg border border-gray-700 outline-none appearance-none cursor-pointer min-w-[80px]"
                  >
                    {COUNTRY_CODES.map(c => (
                      <option key={c.code} value={c.code}>{c.code} {c.country}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
                <input
                  className="flex-1 bg-transparent text-white outline-none font-mono text-lg placeholder:text-gray-700"
                  placeholder="e.g. 601016673"
                  type="tel"
                  inputMode="numeric"
                  value={form.wa}
                  onChange={handlePhoneChange}
                  required
                />
              </div>
              {phoneError && <p className="text-red-500 text-[10px] font-bold uppercase">{phoneError}</p>}
              {!phoneError && form.wa && (
                <p className="text-green-500 text-[10px] font-mono uppercase mt-1">
                  Full number: {form.countryCode}{form.wa.replace(/^0+/, '')}
                </p>
              )}
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
