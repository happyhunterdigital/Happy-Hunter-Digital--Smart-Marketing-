import React, { useState, useRef } from 'react';
import { Search, AlertTriangle, Loader2, Zap, CheckCircle, Download, MessageSquare, ArrowRight, ShieldCheck, XCircle, TrendingDown, Calendar, Database, CheckCircle2 } from 'lucide-react';
import { db, functions } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// The new library that provides the flag dropdown and strict formatting
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; 

export const AiAudit: React.FC = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ biz: '', loc: '', name: '', mail: '', wa: '' });
  const [loading, setLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [verdict, setVerdict] = useState<any>(null);
  const reportRef = useRef<HTMLDivElement>(null);

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

  const handlePhoneChange = (value?: string) => {
    // react-phone-number-input handles formatting. Value is returned as E.164 (e.g. +27601016673)
    setForm({ ...form, wa: value || '' });
  };

  const runForensicScan = async () => {
    // Strict Validation Check
    if (!form.wa || !isValidPhoneNumber(form.wa)) {
        alert("Please provide a valid WhatsApp number.");
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

  // UI Helper to show if phone is valid as they type
  const isPhoneValid = form.wa ? isValidPhoneNumber(form.wa) : false;

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
            
            {/* NEW: Robust Phone Input with Flag Selector */}
            <div className="relative pt-2">
              <PhoneInput
                international
                defaultCountry="ZA"
                value={form.wa}
                onChange={handlePhoneChange}
                className={`w-full bg-black p-4 rounded-xl border ${form.wa && isPhoneValid ? 'border-green-500/50' : 'border-gray-800'} text-white focus-within:border-yellow-500 transition-colors`}
                style={{ '--PhoneInput-color--focus': 'transparent' } as React.CSSProperties} // removes default focus ring
              />
              <style dangerouslySetInnerHTML={{__html: `
                .PhoneInputInput {
                  background: transparent;
                  border: none;
                  color: white;
                  outline: none;
                  width: 100%;
                  font-family: inherit;
                }
                .PhoneInputCountryIcon {
                  width: 1.5em;
                  height: 1em;
                  margin-right: 0.5em;
                }
              `}} />
              {form.wa && !isPhoneValid && (
                <p className="text-xs mt-2 font-medium text-red-500">
                  Please enter a valid complete number.
                </p>
              )}
            </div>

          </div>
          <button 
            type="submit" 
            disabled={!isPhoneValid}
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
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-2">Digital Survival Score</p>
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <span className={`text-7xl md:text-8xl font-black leading-none ${verdict.score >= 70 ? 'text-green-500' : verdict.score >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>{verdict.score}</span>
                  <span className="text-gray-700 text-2xl font-bold">/ 100</span>
                </div>
              </div>
              
              {verdict.score < 80 && (
                <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-3xl flex items-center gap-4 w-full md:w-auto">
                  <TrendingDown className="text-red-500" size={32} />
                  <div>
                    <p className="text-red-500 font-black text-2xl leading-none">{verdict.revenueLoss?.amount || 'R9,800+'}</p>
                    <p className="text-red-500/70 text-[9px] uppercase font-bold mt-1 tracking-widest">Est. Monthly Revenue Loss</p>
                  </div>
                </div>
              )}
            </div>

            {verdict.score >= 70 ? (
               <div className="mb-10 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
                 <h3 className="text-green-500 font-black uppercase tracking-tight flex items-center gap-2 mb-2">
                   <CheckCircle size={18} /> Entity Verified: Strong Baseline
                 </h3>
                 <p className="text-gray-300 text-sm leading-relaxed">
                   Congratulations. Your traditional SEO and Google Maps foundation is solid. However, standard search is evolving rapidly. To prevent competitors from overtaking you in AI-driven search (ChatGPT, Gemini, SGE), you must upgrade from basic SEO to <strong>Generative Engine Optimization (GEO)</strong>.
                 </p>
               </div>
            ) : (
               <div className="mb-10 p-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                 <h3 className="text-orange-500 font-black uppercase tracking-tight flex items-center gap-2 mb-2">
                   <AlertTriangle size={18} /> Critical Vulnerability Detected
                 </h3>
                 <p className="text-gray-300 text-sm leading-relaxed">
                   Your digital architecture is actively repelling algorithms. You are experiencing the "Ghost Effect"—meaning high-intent customers searching for your services are being routed directly to your competitors. Immediate intervention is required.
                 </p>
               </div>
            )}

            <div className="space-y-10">
              <div>
                <h3 className="text-yellow-500 font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                  <ShieldCheck size={16}/> Forensic AI Summary
                </h3>
                <p className="text-white text-lg font-medium leading-relaxed italic border-l-4 border-gray-800 pl-4">"{verdict.summary}"</p>
              </div>

              <div className="mb-10 bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
                <div className="bg-[#111827] p-4 border-b border-gray-800 flex justify-between items-center">
                  <h3 className="text-white font-bold text-sm flex items-center gap-2 uppercase tracking-wide">
                    <Database size={16} className="text-yellow-500" /> Entity Schema Parsing
                  </h3>
                  <span className="text-[10px] text-yellow-500 font-mono uppercase tracking-widest bg-yellow-500/10 px-2 py-1 rounded">happyhunterdigital // AEO Core</span>
                </div>
                <div className="p-6">
                  <div className={`flex items-center gap-4 mb-6 p-4 rounded-xl border ${verdict.telemetry?.schema && verdict.telemetry?.schemasDetected?.length > 0 ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                    {verdict.telemetry?.schema && verdict.telemetry?.schemasDetected?.length > 0 ? (
                      <React.Fragment>
                        <CheckCircle2 size={32} className="text-green-500 shrink-0" />
                        <div>
                          <h4 className="text-lg font-black text-green-500">{verdict.telemetry.schemasDetected.length} Valid Protocols Detected</h4>
                          <p className="text-xs text-gray-400 mt-1">These items are explicitly structured for AI Overviews and Generative Engine extraction.</p>
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <XCircle size={32} className="text-red-500 shrink-0" />
                        <div>
                          <h4 className="text-lg font-black text-red-500">0 Valid Protocols Detected</h4>
                          <p className="text-xs text-gray-400 mt-1">This entity is missing machine-readable code. You are invisible to AI agents.</p>
                        </div>
                      </React.Fragment>
                    )}
                  </div>

                  {verdict.telemetry?.schema && verdict.telemetry?.schemasDetected?.length > 0 && (
                    <div className="border border-gray-800 rounded-xl divide-y divide-gray-800 overflow-hidden">
                      <div className="p-3 bg-[#111827] text-[10px] font-black text-gray-500 uppercase tracking-widest">Extracted Structured Data</div>
                      {verdict.telemetry.schemasDetected.map((schemaType: string, idx: number) => (
                        <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-900/50 cursor-pointer transition-colors bg-black">
                           <div className="flex items-center gap-4">
                             <CheckCircle size={18} className="text-green-500" />
                             <span className="text-white font-bold">{schemaType}</span>
                           </div>
                           <span className="text-gray-500 text-xs font-medium bg-gray-900 px-3 py-1 rounded-full border border-gray-800">1 Item Active</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4">
                <h3 className="text-gray-500 font-black uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
                  <XCircle size={16}/> Specific Technical Weak Spots
                </h3>
                {verdict.truths.map((t: string, i: number) => (
                  <div key={i} className="p-5 bg-gray-900/30 border border-gray-800 rounded-xl text-gray-300 text-sm flex gap-4 items-start">
                    <span className="text-yellow-500 font-black bg-yellow-500/10 px-2 py-1 rounded">0{i+1}</span>
                    <p className="mt-1">{t}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 p-8 md:p-10 bg-gradient-to-br from-[#0a0a0a] to-black border border-yellow-500/30 rounded-[2rem] text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-4">Stop The Revenue Leakage</h3>
              <p className="text-gray-400 mb-8 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                Book a Free 30-Minute Discovery Call with <strong>Thabo</strong>, Head of happyhunterdigital. We will review this exact report together and map out your custom Recovery Protocol.
              </p>
              <a href="https://calendly.com/motsumitl/30min" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-3 bg-yellow-500 text-black px-8 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_30px_rgba(234,179,8,0.2)] w-full md:w-auto">
                <Calendar size={18} /> Schedule Strategy Call
              </a>
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
