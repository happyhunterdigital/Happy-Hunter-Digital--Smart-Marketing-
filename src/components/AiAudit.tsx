import React, { useState } from 'react';
import { Search, AlertTriangle, Loader2, Zap, CheckCircle, MessageSquare, ArrowRight, ShieldCheck, XCircle, TrendingDown } from 'lucide-react';

export const AiAudit: React.FC = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ biz: '', loc: '', name: '', mail: '', wa: '' });
  const [loading, setLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [verdict, setVerdict] = useState<any>(null);

  const scanSteps = [
    "Verifying Google Business Profile...",
    "Extracting Star Rating & Review Count...",
    "Checking Website Signal Consistency...",
    "Auditing Operating Hours Data...",
    "NAP Consistency Check (Signal Mismatch)...",
    "Calculating AI Findability Index...",
    "Computing Digital Survival Score..."
  ];

  const calculateRevenueLoss = (score: number) => {
    if (score <= 30) return { amount: 'R18,500+', desc: 'Severe ghost entity status. Maximum revenue leakage.' };
    if (score <= 55) return { amount: 'R9,800+', desc: 'Critical signal failures. Significant monthly loss.' };
    return { amount: 'R3,200+', desc: 'Moderate gaps detected. Optimization required.' };
  };

  const runForensicScan = async () => {
    setStep(3); // Start scanning animation
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setScanProgress(progress);
      if (progress >= 95) clearInterval(interval);
    }, 50);

    try {
      // Direct call to your backend function URL
      const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
      const res = await fetch(`https://us-central1-${PROJECT_ID}.cloudfunctions.net/performAudit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { businessName: form.biz, location: form.loc, clientEmail: form.mail } })
      });

      if (!res.ok) throw new Error("Server Error");
      
      const json = await res.json();
      const data = json.result; // httpsCallable format wraps in 'result'

      const rev = calculateRevenueLoss(data.score);
      setVerdict({ ...data, revenueLoss: rev });
      
      clearInterval(interval);
      setScanProgress(100);
      setTimeout(() => setStep(4), 500);

    } catch (err) {
      clearInterval(interval);
      alert("Neural Link Interrupted. Please check your connection and retry.");
      setStep(1);
    }
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
            <input className="w-full bg-black p-4 rounded-xl border border-gray-800 text-white outline-none focus:border-yellow-500" placeholder="WhatsApp Number" type="tel" onChange={e => setForm({...form, wa: e.target.value})} required />
          </div>
          <button type="submit" className="w-full bg-yellow-500 p-5 rounded-2xl font-black uppercase text-black flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl">
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
          <p className="text-yellow-500 font-mono text-xs mb-8">{scanSteps[Math.min(Math.floor(scanProgress / 15), 6)]}</p>
          <div className="w-64 h-1 bg-gray-800 mx-auto rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
          </div>
        </div>
      )}

      {step === 4 && verdict && (
        <div className="space-y-8 animate-fade-in pb-10">
          <div className="p-10 bg-black border border-gray-800 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10"><Zap size={100} /></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 border-b border-gray-800 pb-10">
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-2">Survival Score</p>
                <div className="flex items-center gap-4 justify-center md:justify-start">
                   <span className={`text-8xl font-black leading-none ${verdict.score < 55 ? 'text-red-500' : 'text-yellow-500'}`}>{verdict.score}</span>
                   <span className="text-gray-700 text-2xl font-bold">/ 100</span>
                </div>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl flex items-center gap-4">
                <TrendingDown className="text-red-500" size={32} />
                <div>
                  <p className="text-red-500 font-black text-xl leading-none">{verdict.revenueLoss.amount}</p>
                  <p className="text-red-500/60 text-[10px] uppercase font-bold mt-1">Est. Monthly Revenue Loss</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-yellow-500 font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                  <ShieldCheck size={16}/> Forensic Summary
                </h3>
                <p className="text-white text-xl font-medium leading-relaxed italic">"{verdict.summary}"</p>
              </div>

              <div className="grid gap-4">
                <h3 className="text-red-500 font-black uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
                  <XCircle size={16}/> Technical Vulnerabilities
                </h3>
                {verdict.truths.map((t: string, i: number) => (
                  <div key={i} className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl text-gray-300 text-sm flex gap-3">
                    <span className="text-yellow-500 font-black">0{i+1}</span> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
             <a 
               href={`https://wa.me/27601016673?text=Hi%20Thabo!%20I%20just%20completed%20the%20Survival%20Scan%20for%20${form.biz}%20and%20scored%20${verdict.score}/100.%20I%20need%20the%20Recovery%20Protocol.`} 
               target="_blank" 
               rel="noreferrer"
               className="w-full md:w-auto px-12 py-5 bg-yellow-500 text-black rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-yellow-500/20"
             >
               <MessageSquare size={20}/> Claim Recovery Protocol
             </a>
          </div>
        </div>
      )}
    </div>
  );
};
