import { useState, useRef, useEffect } from 'react';
import { db, performAuditAnalysis } from '../firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, ShieldCheck, Mail, Phone, User, Download, ArrowRight, Globe, MessageCircle, Building2, MapPin } from 'lucide-react';
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
        await addDoc(collection(db, "audits"), { ...formData, analysis: aiResponse, timestamp: serverTimestamp(), score: extractedScore });
        await emailjs.send('service_ac75cu8', 'template_9i2cl2c', {
          to_name: formData.fullName, to_email: formData.email, business_name: formData.bizName, audit_content: aiResponse, score: extractedScore
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
    return text.split('\n').map((line, i) => {
      if (line.includes('[SECTION]')) return <h4 key={i} className="text-yellow-500 font-black text-xl uppercase mt-12 mb-6 border-b-2 border-yellow-500/20 pb-4">{line.replace('[SECTION]', '')}</h4>;
      if (line.includes('[FIX]')) return <div key={i} className="bg-yellow-500/10 border-l-4 border-yellow-500 p-8 my-10 text-white font-bold tracking-tight uppercase shadow-xl italic">Strategic Requirement: {line.replace('[FIX]', '')}</div>;
      const parts = line.split(/([A-Z]{4,})/g);
      return <p key={i} className="mb-6 text-slate-300 leading-relaxed text-base md:text-lg font-medium">{parts.map((part, j) => /^[A-Z]{4,}$/.test(part) ? <span key={j} className="text-yellow-500 font-black">{part}</span> : part)}</p>;
    });
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen">
      {step === 1 && (
        <div className="max-w-2xl mx-auto text-center animate-in fade-in zoom-in">
          <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-12">Entity <span className="text-yellow-500">Scan</span></h2>
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
            <div className="relative"><Building2 className="absolute left-6 top-6 text-slate-700" size={24}/><input required className="w-full bg-slate-900 border-2 border-slate-800 p-6 pl-16 rounded-3xl text-white outline-none focus:border-yellow-500 transition-all text-lg" placeholder="Business Name" value={formData.bizName} onChange={e => setFormData({...formData, bizName: e.target.value})} /></div>
            <div className="relative"><MapPin className="absolute left-6 top-6 text-slate-700" size={24}/><input required className="w-full bg-slate-900 border-2 border-slate-800 p-6 pl-16 rounded-3xl text-white outline-none focus:border-yellow-500 transition-all text-lg" placeholder="City" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
            <button type="submit" className="w-full bg-yellow-500 text-slate-950 py-6 rounded-3xl font-black text-xl hover:scale-95 transition-all shadow-xl shadow-yellow-500/10 uppercase">Assess your Business</button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-xl mx-auto p-12 border-2 border-slate-800 rounded-[3.5rem] bg-slate-900/40 shadow-2xl animate-in slide-in-from-bottom-10 text-center">
          <ShieldCheck className="mx-auto text-yellow-500 mb-6" size={50} />
          <h3 className="text-3xl font-black uppercase text-white mb-8">Secure Results</h3>
          <form onSubmit={runAudit} className="space-y-4">
            <input required className="w-full bg-slate-950 border-2 border-slate-800 p-5 rounded-2xl text-white outline-none" placeholder="Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
            <input required type="email" className="w-full bg-slate-950 border-2 border-slate-800 p-5 rounded-2xl text-white outline-none" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <input required className="w-full bg-slate-950 border-2 border-slate-800 p-5 rounded-2xl text-white outline-none" placeholder="WhatsApp" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
            <button disabled={loading} className="w-full bg-yellow-500 text-slate-950 py-6 rounded-2xl font-black uppercase shadow-xl">{loading ? <><Loader2 className="animate-spin mx-auto" /> {loadingText}</> : "Initiate Smart Analysis"}</button>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="animate-in fade-in">
          <div className="bg-yellow-500 p-10 rounded-[3.5rem] mb-12 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
            <div className="text-center md:text-left"><h3 className="text-3xl font-black uppercase leading-none italic">The Verdict is Ready</h3><p className="font-bold">Protocol results retrieved. Download your master copy below.</p></div>
            <div className="flex gap-4">
              <button onClick={downloadPDF} className="bg-slate-950 text-white px-10 py-4 rounded-2xl font-black flex items-center justify-center gap-3 mx-auto transition-all hover:scale-105 shadow-2xl uppercase text-[10px] tracking-widest"><Download size={20}/> Download PDF</button>
              <a href={`https://wa.me/27601016673?text=My Score: ${score}/100`} target="_blank" className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black flex items-center justify-center gap-3 mx-auto transition-all hover:scale-105 shadow-2xl uppercase text-[10px] tracking-widest"><MessageCircle size={20}/> WhatsApp Thabo</a>
            </div>
          </div>
          <div ref={reportRef} className="p-16 border-2 border-slate-800 rounded-[4rem] bg-slate-900/40 shadow-2xl overflow-hidden text-left">
             <div className="flex justify-between items-center mb-16 border-b-2 border-slate-800 pb-12">
               <div><h3 className="text-yellow-500 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse italic"><Globe size={14} className="inline mr-2" /> Smart Marketing Graph Analysis</h3><h4 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">{formData.bizName}</h4></div>
               <div className="text-right"><p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 italic">Score</p><p className="text-6xl font-black text-yellow-500 leading-none">{score}<span className="text-lg text-slate-700">/100</span></p></div>
             </div>
             {renderText(result)}
             <div className="mt-32 p-16 bg-yellow-500 rounded-[3rem] text-slate-950 text-center">
               <h4 className="text-5xl font-black uppercase mb-6 leading-none">Mend Your Architecture</h4>
               <a href="https://calendly.com/motsumitl/30min" className="bg-slate-950 text-white px-16 py-6 rounded-2xl font-black uppercase text-sm hover:bg-white hover:text-black transition-all shadow-2xl inline-block">Schedule Recovery Call</a>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
