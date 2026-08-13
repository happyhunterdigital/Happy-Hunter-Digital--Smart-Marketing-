import React, { useState } from 'react';
import { Search, Zap, Terminal, Code, Loader2, ChevronDown, User, Briefcase, Building2, Mail, Globe, Phone } from 'lucide-react';

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

const DESIGNATIONS = [
  'CEO / Founder',
  'Managing Director',
  'Marketing Manager',
  'Operations Manager',
  'Sales Director',
  'Business Owner',
  'Entrepreneur',
  'IT / Technical Lead',
  'Consultant',
  'Other',
];

interface AuditFormProps {
  step: number;
  form: {
    name: string;
    designation: string;
    biz: string;
    mail: string;
    web: string;
    loc: string;
    wa: string;
    countryCode: string;
  };
  setForm: (form: any) => void;
  phoneError: string;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCountryCodeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  runHealthCheck: () => void;
  scanProgress: number;
  loading: boolean;
}

export const AuditForm: React.FC<AuditFormProps> = ({ 
  step, form, setForm, phoneError, handlePhoneChange, handleCountryCodeChange, runHealthCheck, scanProgress, loading 
}) => {
  const [terminalFocus, setTerminalFocus] = useState(false);
  const [designationOpen, setDesignationOpen] = useState(false);

  const scanSteps = [
    "Checking your Google Business Profile...",
    "Looking at your website...",
    "Checking your listings across the web...",
    "Checking if AI tools can find you...",
    "Creating your report..."
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.designation || !form.biz || !form.mail || phoneError || !form.wa) return;
    runHealthCheck();
  };

  return (
    <>
      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }} 
          className="max-w-2xl mx-auto space-y-5 bg-black p-8 md:p-12 rounded-[2rem] border border-gray-800 shadow-2xl relative overflow-hidden group transition-all hover:border-yellow-500/50">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
          
            <div className="text-left mb-6 border-b border-gray-900 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                <Terminal size={12} /> Online Visibility Check
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none">
                Free Online Business<br/>Health Check
              </h2>
              <p className="text-gray-500 text-xs font-mono mt-2">Complete the fields below to see where your business stands online. This is completely free with no obligation.</p>
            </div>

            {/* 1. YOUR NAME */}
            <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50 focus-within:border-yellow-500 focus-within:shadow-[0_0_15px_rgba(234,179,8,0.2)] transition-all">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <User size={12} className="text-gray-600" /> Your Name
              </label>
              <input 
                className="w-full bg-transparent text-white font-mono text-base outline-none placeholder:text-gray-700" 
                placeholder="e.g. Thabo Motsumi" 
                onChange={e => setForm({...form, name: e.target.value})} 
                value={form.name}
                required 
              />
            </div>

            {/* 2. DESIGNATION */}
            <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50 transition-all">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Briefcase size={12} className="text-gray-600" /> Your Role
              </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDesignationOpen(!designationOpen)}
                className={`w-full flex items-center justify-between bg-transparent text-left font-mono text-base outline-none py-1 ${form.designation ? 'text-white' : 'text-gray-700'}`}
              >
                <span>{form.designation || 'Select your role...'}</span>
                <ChevronDown size={16} className={`text-gray-500 transition-transform ${designationOpen ? 'rotate-180' : ''}`} />
              </button>
              {designationOpen && (
                <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-2xl max-h-48 overflow-y-auto">
                  {DESIGNATIONS.map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => { setForm({...form, designation: d}); setDesignationOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-mono hover:bg-yellow-500 hover:text-black transition-colors ${form.designation === d ? 'bg-yellow-500/20 text-yellow-500' : 'text-gray-300'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

            {/* 3. BUSINESS NAME */}
            <div className={`p-4 rounded-xl border transition-all ${terminalFocus ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)] bg-black' : 'border-gray-800 bg-gray-900/50 focus-within:border-yellow-500 focus-within:shadow-[0_0_15px_rgba(234,179,8,0.2)]'}`}>
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Building2 size={12} className="text-gray-600" /> Business Name
              </label>
              <input 
                className="w-full bg-transparent text-white font-mono text-base outline-none placeholder:text-gray-700" 
                placeholder="e.g. Happy Hunter Digital" 
                onFocus={() => setTerminalFocus(true)}
                onBlur={() => setTerminalFocus(false)}
                onChange={e => setForm({...form, biz: e.target.value})} 
                value={form.biz}
                required 
              />
            </div>

            {/* 4. EMAIL */}
            <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50 focus-within:border-yellow-500 focus-within:shadow-[0_0_15px_rgba(234,179,8,0.2)] transition-all">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Mail size={12} className="text-gray-600" /> Email Address
              </label>
              <input 
                className="w-full bg-transparent text-white outline-none font-mono text-base placeholder:text-gray-700" 
                placeholder="you@company.com" 
                type="email" 
                onChange={e => setForm({...form, mail: e.target.value})} 
                value={form.mail} 
                required 
              />
            </div>

            {/* 5. WEBSITE (optional) */}
            <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50 focus-within:border-yellow-500 focus-within:shadow-[0_0_15px_rgba(234,179,8,0.2)] transition-all">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Globe size={12} className="text-gray-600" /> Website URL <span className="text-gray-700 normal-case font-normal">— optional</span>
              </label>
              <input 
                className="w-full bg-transparent text-white font-mono text-base outline-none placeholder:text-gray-700" 
                placeholder="e.g. https://happyhunterdigital.com" 
                type="text"
                onChange={e => setForm({...form, web: e.target.value})} 
                value={form.web}
              />
            </div>

            {/* 6. WHATSAPP NUMBER */}
            <div className={`p-4 rounded-xl border transition-all ${
              phoneError ? 'border-red-500' : (form.wa && !phoneError) ? 'border-green-500' : 'border-gray-800 bg-gray-900/50 focus-within:border-yellow-500 focus-within:shadow-[0_0_15px_rgba(234,179,8,0.2)]'
            }`}>
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Phone size={12} className="text-gray-600" /> WhatsApp Number
              </label>
            <div className="flex gap-2 mb-2">
              <div className="relative">
                <select
                  value={form.countryCode}
                  onChange={handleCountryCodeChange}
                  className="bg-gray-800 text-white text-sm font-mono p-2.5 pr-8 rounded-lg border border-gray-700 outline-none appearance-none cursor-pointer min-w-[85px]"
                >
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.code} {c.country}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
              <input
                className="flex-1 bg-transparent text-white outline-none font-mono text-base placeholder:text-gray-700"
                placeholder="e.g. 601016673"
                type="tel"
                inputMode="numeric"
                value={form.wa}
                onChange={handlePhoneChange}
                required
              />
            </div>
            {phoneError && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{phoneError}</p>}
            {!phoneError && form.wa && (
              <p className="text-green-500 text-[10px] font-mono uppercase mt-1">
                Full number: {form.countryCode}{form.wa.replace(/^0+/, '')}
              </p>
            )}
          </div>

          <button type="submit" disabled={!!phoneError || !form.wa || !form.name || !form.designation || !form.biz || !form.mail || loading} 
            className="w-full bg-yellow-500 p-5 rounded-xl font-black uppercase text-black flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Checking your business...
              </>
            ) : (
              <>Run Free Health Check <Code size={18}/></>
            )}
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="max-w-2xl mx-auto text-center py-24 bg-black border border-yellow-500/50 rounded-[3rem] shadow-[0_0_60px_rgba(234,179,8,0.15)] animate-fade-in relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(234,179,8,0.1)_0%,_transparent_70%)]"></div>
          <div className="relative z-10">
            <div className="w-24 h-24 mx-auto mb-8 relative">
              <div className="absolute inset-0 border-4 border-yellow-500/20 rounded-full animate-ping"></div>
              <div className="absolute inset-0 border-4 border-t-yellow-500 rounded-full animate-spin"></div>
              <Search className="absolute inset-0 m-auto text-yellow-500" size={32} />
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Checking Your Business Online</h2>
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
