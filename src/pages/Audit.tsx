import { useState, useRef, useEffect } from 'react';
import { db, performAuditAnalysis } from '../firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, ShieldCheck, Mail, Phone, User, Download, ArrowRight, Building2, MapPin, Globe, MessageCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import emailjs from '@emailjs/browser';

export default function Audit() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing...");
  const [result, setResult] = useState("");
  const [score, setScore] = useState("0");
  const reportRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ bizName: "", location: "", fullName: "", email: "", whatsapp: "" });

  useEffect(() => { emailjs.init("YZ8FDMJ7-_7FL5vhT"); }, []);

  const runAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingText("Querying Smart Marketing Graph...");
    
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
        
        await emailjs.send('service_ac75cu8', 'template_9i2cl2c', {
          to_name: formData.fullName,
          to_email: formData.email,
          business_name: formData.bizName,
          audit_content: aiResponse,
          score: extractedScore
        });
      }
      setStep(3);
    } catch (err) {
      setResult("SYSTEM_ERROR: Protocol interrupted.");
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
    pdf.save(`Forensic-Verdict.pdf`);
  };

  const renderText = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      if (line.includes('[SECTION]')) return <h4 key={i} className="text-yellow-500 font-black text-xl uppercase mt-12 mb-6 border-b-2 border-yellow-500/20 pb-4">{line.replace('[SECTION]', '')}</h4>;
      if (line.includes('[FIX]')) return <div key={i} className="bg-yellow-500/10 border-l-4 border-yellow-500 p-8 my-10 text-white font-bold tracking-tight uppercase italic">Strategic Requirement: {line.replace('[FIX]', '')}</div>;
      const parts = line.split(/([A-Z]{4,})/g);
      return <p key={i} className="mb-6 text-slate-300 leading-relaxed text-base font-medium">{parts.map((part, j) => /^[A-Z]{4,}$/.test(part) ? <span key={j} className="text-yellow-500 font-black">{part}</span> : part)}</p>;
    });
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen">
      {step === 1 && (
        <div className="max-w-2xl mx-auto text-center animate-in fade-in zoom-in duration-500">
          <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-12">Entity <span className="text-yellow-500">Scan</span></h2>
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
            <div className="relative">
              <Building2 className="absolute left-6 top-6 text-slate-700" size={24}/>
              <input required className="w-full bg-slate-900 border-2 border-slate-800 p-6 pl-16 rounded-3xl text-white outline-none focus:border-yellow-500 transition-all text-lg" placeholder="Business Name" value={formData.bizName} onChange={e => setFormData({...formData, bizName: e.target.value})} />
            </div>
            <div className="relative">
              <MapPin className="absolute left-6 top-6 text-slate-700" size={24}/>
              <input required className="w-full bg-slate-900 border-2 border-slate-800 p-6 pl-16 rounded-3xl text-white outline-none focus:border-yellow-500 transition-all text-lg" placeholder="City" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
            <button type="submit" className="w-full bg-yellow-500 text-slate-950 py-6 rounded-3xl font-black text-xl uppercase shadow-xl">Assess your Business</button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-xl mx-auto p-12 border-2 border-slate-800 rounded-[3.5rem] bg-slate-900/40 shadow-2xl animate-in slide-in-from-bottom-10 text-center">
          <ShieldCheck className="mx-auto text-yellow-500 mb-6" size={50} />
          <h3 className="text-3xl font-black uppercase text-white mb-8 tracking-tighter">Secure Your Results</h3>
          <form onSubmit={runAudit} className="space-y-4">
            <input required className="w-full bg-slate-950 border-2 border-slate-800 p-5 rounded-2xl text-white outline-none focus:border-yellow-500" placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
            <input required type="email" className="w-full bg-slate-950 border-2 border-slate-800 p-5 rounded-2xl text-white outline-none focus:border-yellow-500" placeholder="Business Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <input required className="w-full bg-slate-950 border-2 border-slate-800 p-5 rounded-2xl text-white outline-none focus:border-yellow-500" placeholder="WhatsApp Number" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
            <button disabled={loading} className="w-full bg-yellow-500 text-slate-950 py-6 rounded-2xl font-black uppercase tracking-widest text-lg shadow-xl shadow-yellow-500/10">
              {loading ? <span className="flex items-center justify-center gap-3"><Loader2 className="animate-spin" size={20}/> {loadingText}</span> : "Initiate Smart Analysis"}
            </button>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="animate-in fade-in duration-1000">
          <div className="bg-yellow-500 p-12 rounded-[3rem] mb-16 text-slate-950 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-3 text-center md:text-left max-w-xl">
                <h3 className="text-4xl font-black uppercase leading-none italic tracking-tight underline decoration-slate-900/20">The Verdict is Ready</h3>
                <p className="font-bold text-lg leading-tight">Download your report below. A master digital copy has also been dispatched to your email at <span className="underline decoration-slate-900/50">{formData.email}</span>.</p>
              </div>
              <button onClick={downloadPDF} className="bg-slate-950 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-2xl">
                <Download size={24}/> Download PDF
              </button>
            </div>
          </div>

          <div ref={reportRef} className="p-12 md:p-24 border-2 border-slate-800 rounded-[4rem] bg-slate-900/40 relative shadow-2xl overflow-hidden text-left">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 border-b-2 border-slate-800 pb-12 gap-8">
               <div className="space-y-1">
                 <h3 className="text-yellow-500 font-black uppercase tracking-[0.5em] text-[10px] flex items-center gap-2 italic animate-pulse"><Globe size={14}/> Smart Marketing Protocol Analysis</h3>
                 <h4 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">{formData.bizName}</h4>
                 <p className="text-slate-500 font-black uppercase tracking-widest flex items-center gap-2 text-xs italic"><MapPin size={14}/> {formData.location}</p>
               </div>
               <div className="text-right">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 italic">Survival Score</p>
                 <p className="text-6xl font-black text-yellow-500 leading-none">{score}<span className="text-lg text-slate-700">/100</span></p>
               </div>
             </div>
             <div className="max-w-4xl">{renderText(result)}</div>
             <div className="mt-32 p-16 bg-yellow-500 rounded-[3rem] text-slate-950 text-center relative overflow-hidden shadow-2xl">
               <div className="relative z-10">
                 <h4 className="text-5xl font-black uppercase mb-6 leading-none tracking-tighter">Mend Your Architecture</h4>
                 <p className="font-bold text-xl mb-12 italic opacity-90 max-w-xl mx-auto underline decoration-black/20 leading-relaxed text-slate-800">Secure your recovery call with Thabo today to claim your R16,300 value stack.</p>
                 <a href="https://calendly.com/motsumitl/30min" className="bg-slate-950 text-white px-16 py-6 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-2xl inline-block">Schedule Recovery Call</a>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
