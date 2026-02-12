import { useState, useRef } from 'react';
import { db, performAuditAnalysis } from '../firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Search, Loader2, ShieldCheck, Mail, Phone, User, Download, Calendar, ArrowRight } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Audit() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [score, setScore] = useState("0");
  const reportRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ bizName: "", location: "", fullName: "", email: "", whatsapp: "" });

  const runAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const aiResponse = await performAuditAnalysis(formData.bizName, formData.location);
      const scoreMatch = aiResponse.match(/FINAL_SCORE:\s*(\d+)/);
      const extractedScore = scoreMatch ? scoreMatch[1] : "??";
      setScore(extractedScore);
      setResult(aiResponse.replace(/FINAL_SCORE:\s*\d+/, '').trim());

      if (db) {
        await addDoc(collection(db, "audits"), { 
          ...formData, 
          analysis: aiResponse, 
          timestamp: serverTimestamp(), 
          score: extractedScore 
        });
      }
      setStep(3);
    } catch (err) {
      setResult("SYSTEM_ERROR: The Smart Marketing Graph is recalibrating.");
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: '#020617' });
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`Forensic-Audit.pdf`);
  };

  const renderText = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      if (line.includes('[SECTION]')) {
        return <h4 key={i} className="text-yellow-500 font-black text-2xl uppercase mt-12 mb-6 border-b border-yellow-500/20 pb-4">{line.replace('[SECTION]', '')}</h4>;
      }
      if (line.includes('[FIX]')) {
        return <div key={i} className="bg-yellow-500/10 border-l-4 border-yellow-500 p-6 my-8 text-white font-bold italic">STRATEGIC REQUIREMENT: {line.replace('[FIX]', '')}</div>;
      }
      // Bold text using yellow instead of asterisks
      const parts = line.split(/([A-Z]{4,})/g);
      return (
        <p key={i} className="mb-6 text-slate-300 leading-relaxed text-base md:text-lg">
          {parts.map((part, j) => (
            /^[A-Z]{4,}$/.test(part) ? <span key={j} className="text-yellow-500 font-black">{part}</span> : part
          ))}
        </p>
      );
    });
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen font-sans">
      {step === 1 && (
        <div className="max-w-2xl mx-auto text-center animate-in fade-in zoom-in">
          <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-12">Entity <span className="text-yellow-500">Scan</span></h2>
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
            <input required className="w-full bg-slate-900 border border-slate-800 p-6 rounded-3xl text-white outline-none focus:border-yellow-500" placeholder="Business Name" value={formData.bizName} onChange={e => setFormData({...formData, bizName: e.target.value})} />
            <input required className="w-full bg-slate-900 border border-slate-800 p-6 rounded-3xl text-white outline-none focus:border-yellow-500" placeholder="City" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            <button type="submit" className="w-full bg-yellow-500 text-slate-950 py-6 rounded-3xl font-black text-xl">ASSESS YOUR BUSINESS</button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-xl mx-auto p-12 border border-slate-800 rounded-[3rem] bg-slate-900/40 shadow-2xl animate-in slide-in-from-bottom-10">
          <h3 className="text-2xl font-black uppercase text-yellow-500 mb-8 text-center">Secure Your Results</h3>
          <form onSubmit={runAudit} className="space-y-4">
            <input required className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl text-white outline-none" placeholder="Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
            <input required type="email" className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl text-white outline-none" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <input required className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl text-white outline-none" placeholder="WhatsApp" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
            <button disabled={loading} className="w-full bg-yellow-500 text-slate-950 py-6 rounded-2xl font-black uppercase shadow-xl">{loading ? <Loader2 className="animate-spin mx-auto" /> : "Initiate Smart Analysis"}</button>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="animate-in fade-in">
          <div className="bg-yellow-500 p-10 rounded-[3.5rem] mb-12 text-slate-950 text-center space-y-4 shadow-2xl">
            <h3 className="text-3xl font-black uppercase italic leading-none">The Verdict is Ready</h3>
            <p className="font-bold text-lg">Check your inbox at {formData.email}. Download the master PDF below for your records.</p>
            <button onClick={downloadPDF} className="bg-slate-950 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform flex items-center justify-center gap-3 mx-auto">
              <Download size={20}/> Download Free PDF
            </button>
          </div>

          <div ref={reportRef} className="p-16 border border-slate-800 rounded-[4rem] bg-slate-900/40 relative shadow-2xl overflow-hidden">
             <div className="flex justify-between items-center mb-16 border-b-2 border-slate-800 pb-12">
               <div><h3 className="text-yellow-500 font-black uppercase tracking-[0.5em] text-[10px]">Smart Marketing // Protocol Analysis</h3><h4 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">{formData.bizName}</h4></div>
               <div className="text-right">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Survival Score</p>
                 <p className="text-6xl font-black text-yellow-500 leading-none">{score}<span className="text-lg text-slate-700">/100</span></p>
               </div>
             </div>
             <div className="max-w-4xl">{renderText(result)}</div>
             <div className="mt-32 p-16 bg-yellow-500 rounded-[3rem] text-slate-950 text-center relative overflow-hidden shadow-2xl">
               <h4 className="text-5xl font-black uppercase mb-6 leading-none">Mend Your Architecture</h4>
               <p className="font-bold text-xl mb-12 italic opacity-90 max-w-xl mx-auto underline decoration-black/20">Secure your recovery call with Thabo Leslie Motsumi today.</p>
               <a href="https://calendly.com/motsumitl/30min" className="bg-slate-950 text-white px-16 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-105 transition-all shadow-2xl inline-block">Schedule Strategy Session</a>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
