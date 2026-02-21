import React, { useState, useRef } from 'react';
import { Search, AlertTriangle, Loader2, Zap, CheckCircle, Download, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { db, functions } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const AiAudit: React.FC = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ biz: '', loc: '', name: '', mail: '', wa: '' });
  const [loading, setLoading] = useState(false);
  const [verdict, setVerdict] = useState<any>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const runAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const performAudit = httpsCallable(functions, 'performAudit');
      const response = await performAudit({
        businessName: form.biz,
        location: form.loc,
        clientEmail: form.mail
      });
      setVerdict(response.data);
      setStep(3);
    } catch (err) { alert("Handshake Interrupted. AI Core Busy."); }
    setLoading(false);
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { backgroundColor: '#050505', scale: 2 });
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`HH_Audit.pdf`);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6 bg-gray-900/50 p-10 rounded-[2.5rem] border border-gray-800">
          <h2 className="text-3xl font-black text-white uppercase text-center tracking-widest">Business <span className="text-yellow-500">Scan</span></h2>
          <input className="w-full bg-black p-5 rounded-2xl border border-gray-800 text-white outline-none focus:border-yellow-500" placeholder="Business Name" onChange={e => setForm({...form, biz: e.target.value})} required />
          <input className="w-full bg-black p-5 rounded-2xl border border-gray-800 text-white outline-none focus:border-yellow-500" placeholder="City" onChange={e => setForm({...form, loc: e.target.value})} required />
          <button type="submit" className="w-full bg-yellow-500 p-5 rounded-2xl font-black uppercase text-black flex items-center justify-center gap-3">Analyze Architecture <ArrowRight/></button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={runAnalysis} className="space-y-6 bg-gray-900/50 p-10 rounded-[2.5rem] border border-yellow-500/30">
          <div className="text-center space-y-2 mb-8">
            <ShieldCheck className="mx-auto text-yellow-500" size={40}/>
            <h2 className="text-2xl font-black text-white uppercase">Secure Results</h2>
          </div>
          <input className="w-full bg-black p-4 rounded-xl border border-gray-800 text-white" placeholder="Full Name" onChange={e => setForm({...form, name: e.target.value})} required />
          <input className="w-full bg-black p-4 rounded-xl border border-gray-800 text-white" placeholder="Email" type="email" onChange={e => setForm({...form, mail: e.target.value})} required />
          <input className="w-full bg-black p-4 rounded-xl border border-gray-800 text-white" placeholder="WhatsApp" type="tel" onChange={e => setForm({...form, wa: e.target.value})} required />
          <button disabled={loading} className="w-full bg-yellow-500 p-5 rounded-2xl font-black uppercase text-black flex items-center justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" /> : <Zap size={20}/>} Reveal Intelligence
          </button>
        </form>
      )}

      {step === 3 && verdict && (
        <div className="space-y-6 animate-fade-in">
          <div ref={reportRef} className="p-10 bg-black border border-gray-800 rounded-[2.5rem]">
            <h3 className="text-yellow-500 font-black text-5xl mb-4">{verdict.score}/100</h3>
            <p className="text-gray-300 leading-relaxed">{verdict.summary}</p>
          </div>
          <button onClick={downloadPDF} className="w-full p-4 bg-gray-900 text-white rounded-2xl font-bold uppercase"><Download className="inline mr-2"/> Download PDF</button>
        </div>
      )}
    </div>
  );
};
