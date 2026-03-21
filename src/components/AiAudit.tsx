import React, { useState, useRef } from 'react';
import { Search, AlertTriangle, Loader2, Zap, CheckCircle, Download, MessageSquare, ArrowRight, ShieldCheck, XCircle, TrendingDown, Calendar, Database, CheckCircle2 } from 'lucide-react';
import { db, functions } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const AiAudit: React.FC = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ biz: '', loc: '', name: '', mail: '', wa: '' });
  const [loading, setLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [verdict, setVerdict] = useState<any>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  
  // Real-time phone validation state
  const [phoneError, setPhoneError] = useState('');

  const scanSteps =[
    "Verifying Google Business Profile...",
    "Extracting Star Rating & Review Count...",
    "Checking Website Signal Consistency...",
    "Scanning for AI Schema (JSON-LD)...",
    "Validating Answer Engine Compliance...",
    "Calculating AI Findability Index...",
    "Computing Digital Survival Score..."
  ];

  const calculateRevenueLoss = (score: number) => {
    if (score <= 30) return { amount: 'R18,500+', desc: 'Severe ghost entity status. Maximum revenue leakage.' };
    if (score <= 55) return { amount: 'R9,800+', desc: 'Critical signal failures. Significant monthly loss.' };
    return { amount: 'R3,200+', desc: 'Moderate gaps detected. Optimization required.' };
  };

  // Strict E.164 Regex: Must start with +, followed by 1-14 digits. No spaces.
  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phone) {
      setPhoneError('WhatsApp number is required.');
      return false;
    }
    if (!phone.startsWith('+')) {
      setPhoneError('Must start with a + country code.');
      return false;
    }
    if (phone.includes(' ')) {
      setPhoneError('Remove all spaces.');
      return false;
    }
    if (!phoneRegex.test(phone)) {
      setPhoneError('Invalid international format.');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setForm({ ...form, wa: input });
    if (input.length > 0) validatePhone(input);
  };

  const runForensicScan = async () => {
    if (!validatePhone(form.wa)) {
        alert("Please fix the WhatsApp number format before proceeding.");
        return;
    }

    setStep(3);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setScanProgress(progress);
      if (progress >= 95) clearInterval(interval);
    }, 50);

    try {
      const performAudit = httpsCallable(functions, 'performAudit');
      const response = await performAudit({
        businessName: form.biz,
        location: form.loc,
        clientEmail: form.mail,
        whatsapp: form.wa
      });
      const data = response.data as any;
      if (!data.success) throw new Error("Server rejected audit.");

      const rev = calculateRevenueLoss(data.score);
      setVerdict({ ...data, revenueLoss: rev });
      
      clearInterval(interval);
      setScanProgress(100);
      setTimeout(() => setStep(4), 500);

    } catch (err: any) {
      clearInterval(interval);
      console.error(err);
      alert("Neural Link Interrupted. Please check your connection and retry.");
      setStep(1);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { backgroundColor: '#050505', scale: 2 });
    const img = canvas.toDataURL('image/jpeg', 0.8);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight);
    pdf.save(`HH_Audit_${form.biz}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 pb-20">
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
            
            {/* STRICT NO-PACKAGE REGEX VALIDATION UI */}
            <div className="relative pt-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">
                Required Format: +CountryCode Number (NO SPACES)
              </label>
              <input 
                className={`w-full bg-black p-4 rounded-xl border ${phoneError ? 'border-red-500/50' : form.wa ? 'border-green-500/50' : 'border-gray-800'} text-white outline-none focus:border-yellow-500 transition-colors font-mono`} 
                placeholder="+27601016673" 
                type="tel" 
                value={form.wa}
                onChange={handlePhoneChange} 
                required 
              />
              {phoneError && (
                <p className="text-xs mt-2 font-medium text-red-500 flex items-center gap-1">
                  <XCircle size={12} /> {phoneError}
                </p>
              )}
            </div>

          </div>
          <button 
            type="submit" 
            disabled={!!phoneError || !form.wa}
            className="w-full bg-yellow-500 p-5 rounded-2xl font-black uppercase text-black flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reveal Intelligence <Zap size={20}/>
          </button>
        </form>
      )}

      {step === 3 && (
        <div className="text-center py-24 bg-gray-900/20 border border-gray-800 rounded-[3rem] animate-fade-in shadow-2xl">
          <div className="relative w-32 h-32 mx-auto mb-10">
            <div className="absolute inset-0 rounded-full border-4 border-yellow-500/10"></div>
            <div className="absolute inset-0 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin"></div>
            <Search className="absolute inset-0 m-auto text-yellow-500" size={40} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase mb-4">Scanning Digital Entity...</h2>
          <p className="text-yellow-500 font-mono text-xs mb-8">{scanSteps[Math.min(Math.floor(scanProgress / 14), 6)]}</p>
          <div className="w-64 h-1 bg-gray-800 mx-auto rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
          </div>
        </div>
      )}

      {step === 4 && verdict && (
        <div className="space-y-8 animate-fade-in pb-10">
          <div ref={reportRef} className="p-8 md:p-12 bg-[#050505] border border-gray-800 rounded-[3rem] shadow-2xl relative overflow-hidden">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10 border-b border-gray-800 pb-10">
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-2">Your Digital Survival Score</p>
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <span className={`text-7xl md:text-8xl font-black leading-none ${verdict.score >= 80 ? 'text-green-500' : verdict.score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>{verdict.score}</span>
                  <span className="text-gray-700 text-2xl font-bold">%</span>
                </div>
              </div>
              
              <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-3xl flex items-center gap-4 w-full md:w-auto">
                <TrendingDown className="text-red-500" size={32} />
                <div>
                  <p className="text-red-500 font-black text-2xl leading-none">{verdict.revenueLoss?.amount || 'R18,500+'}</p>
                  <p className="text-red-500/70 text-[9px] uppercase font-bold mt-1 tracking-widest">Est. Monthly Revenue Recovery</p>
                </div>
              </div>
            </div>

            {/* HEADER: DIAGNOSIS */}
            <div className="mb-10 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
              <h3 className="text-red-500 font-black uppercase tracking-tight flex items-center gap-2 mb-2">
                <AlertTriangle size={18} /> CRITICAL VULNERABILITY
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                <strong>Diagnosis:</strong> {verdict.diagnosis}
              </p>
            </div>

            <div className="space-y-10">
              
              {/* SECTION 1: IDENTITY CRISIS */}
              <div>
                <h3 className="text-white font-black uppercase text-xl md:text-2xl tracking-tight mb-4 flex items-center gap-3 border-b border-gray-800 pb-4">
                  <ShieldCheck size={24} className={verdict.identityCrisis?.status === 'Aligned' ? 'text-green-500' : 'text-yellow-500'}/> 
                  Section 1: The Identity Crisis <span className="text-sm font-medium text-gray-500 ml-auto tracking-widest bg-gray-900 px-3 py-1 rounded-full">{verdict.identityCrisis?.status}</span>
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-300 text-sm"><strong>The Problem:</strong> {verdict.identityCrisis?.problem}</p>
                  <p className="text-gray-300 text-sm"><strong>Why it matters:</strong> {verdict.identityCrisis?.whyItMatters}</p>
                </div>
              </div>

              {/* SECTION 2: THE GAP ANALYSIS */}
              <div>
                <h3 className="text-white font-black uppercase text-xl md:text-2xl tracking-tight mb-4 flex items-center gap-3 border-b border-gray-800 pb-4">
                  <Database size={24} className="text-red-500"/> 
                  Section 2: The Gap Analysis
                </h3>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-6 border-l-2 border-red-500 pl-3">These are the "silent killers" of your local ranking.</p>
                
                <div className="grid gap-4">
                  {verdict.gapAnalysis?.map((gap: any, i: number) => (
                    <div key={i} className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden relative">
                       <div className={`absolute top-0 left-0 w-1 h-full ${gap.status === 'HEALTHY' || gap.status === 'VERIFIED' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                       <div className="p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                         <div className="w-full">
                           <div className="flex items-center justify-between mb-2">
                             <h4 className="text-white font-bold text-sm tracking-wide">• {gap.title}</h4>
                             <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${gap.status === 'HEALTHY' || gap.status === 'VERIFIED' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>[{gap.status}]</span>
                           </div>
                           <p className="text-gray-400 text-xs leading-relaxed"><strong>Urgency:</strong> {gap.urgency}</p>
                         </div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: COMPETITOR CANNIBALIZATION */}
              <div>
                <h3 className="text-white font-black uppercase text-xl md:text-2xl tracking-tight mb-4 flex items-center gap-3 border-b border-gray-800 pb-4">
                  <TrendingDown size={24} className="text-orange-500"/> 
                  Section 3: The Competitor Cannibalization Report
                </h3>
                <div className="bg-orange-500/5 border border-orange-500/20 p-6 rounded-2xl">
                  <p className="text-orange-500 text-sm mb-3"><strong>Live Threat:</strong> {verdict.competitorThreat?.threatLevel}</p>
                  <p className="text-gray-300 text-sm"><strong>The Reality:</strong> {verdict.competitorThreat?.reality}</p>
                </div>
              </div>

            </div>

            {/* SECTION 4: RECOVERY ROADMAP & PITCH */}
            <div className="mt-12 p-8 md:p-10 bg-gradient-to-br from-[#0a0a0a] to-black border border-yellow-500/30 rounded-[2rem] text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
              <p className="text-yellow-500 font-black uppercase tracking-widest text-xs mb-2">Section 4: The Recovery Roadmap</p>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-4">Immediate Entity Alignment</h3>
              <p className="text-gray-400 mb-8 text-sm md:text-base max-w-xl mx-auto leading-relaxed border-t border-gray-800 pt-6 mt-6">
                <strong>Recommendation:</strong> {verdict.recoveryRoadmap?.recommendedAction}
              </p>
              <a href="https://calendly.com/motsumitl/30min" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-3 bg-yellow-500 text-black px-8 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_30px_rgba(234,179,8,0.2)] w-full md:w-auto">
                <Calendar size={18} /> Book Your 15-Minute Alignment Call
              </a>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-4 italic">Secure your territory before your competitors lock you out of the 2026 Knowledge Graph.</p>
            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <button onClick={downloadPDF} className="w-full p-5 bg-[#0a0a0a] border border-gray-800 text-white rounded-2xl font-bold uppercase text-xs hover:bg-gray-900 transition-all flex items-center justify-center gap-3">
              <Download size={18}/> Export Report to PDF
            </button>
            <a 
              href={`https://wa.me/27601016673?text=Hi%20Thabo!%20I%20just%20completed%20the%20Survival%20Scan%20for%20${form.biz}%20and%20scored%20${verdict.score}/100.%20Let%27s%20talk%20about%20my%20Recovery%20Protocol.`}
              target="_blank"
              rel="noreferrer"
              className="w-full p-5 bg-[#0a0a0a] border border-gray-800 text-white rounded-2xl font-bold uppercase text-xs hover:text-yellow-500 hover:border-yellow-500 transition-all flex items-center justify-center gap-3"
            >
              <MessageSquare size={18}/> Message Thabo on WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
