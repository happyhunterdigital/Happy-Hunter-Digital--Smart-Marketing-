import { useState, useRef, useEffect } from 'react';
import { db, performAuditAnalysis } from '../firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, ShieldCheck, Mail, Phone, User, Download, ArrowRight } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import emailjs from '@emailjs/browser';

export default function Audit() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const reportRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ bizName: "", location: "", fullName: "", email: "", whatsapp: "" });

  // CRITICAL: Initialize your EmailJS Public Key
  useEffect(() => {
    emailjs.init("YZ8FDMJ7-_7FL5vhT");
  }, []);

  const runAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const aiResponse = await performAuditAnalysis(formData.bizName, formData.location);
      setResult(aiResponse);

      if (db) {
        // Save to Database
        await addDoc(collection(db, "audits"), { ...formData, analysis: aiResponse, timestamp: serverTimestamp() });
        
        // TRIGGER EMAIL (EmailJS)
        await emailjs.send(
          'service_ac75cu8', 
          'template_9i2cl2c', // Ensure this matches your EmailJS template ID
          {
            to_name: formData.fullName,
            to_email: formData.email,
            business_name: formData.bizName,
            audit_content: aiResponse
          }
        );
      }
      setStep(3);
    } catch (err) { setStep(3); }
    finally { setLoading(false); }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: '#020617' });
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`Forensic-Verdict.pdf`);
  };

  return (
    <div className="pt-40 pb-20 px-6 max-w-6xl mx-auto min-h-screen">
      {step === 1 && (
        <div className="max-w-2xl mx-auto text-center animate-fade-in">
          <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-12">Entity <span className="text-yellow-500">Scan</span></h2>
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
            <input required className="w-full bg-slate-900 border border-slate-800 p-6 rounded-3xl text-white outline-none focus:border-yellow-500" placeholder="Business Name" value={formData.bizName} onChange={e => setFormData({...formData, bizName: e.target.value})} />
            <input required className="w-full bg-slate-900 border border-slate-800 p-6 rounded-3xl text-white outline-none focus:border-yellow-500" placeholder="City" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            <button type="submit" className="w-full bg-yellow-500 text-slate-950 py-6 rounded-3xl font-black text-xl uppercase">Next Step</button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-xl mx-auto p-12 border border-slate-800 rounded-[3rem] bg-slate-900/40 shadow-2xl animate-fade-in">
          <h3 className="text-2xl font-black uppercase text-yellow-500 mb-8 text-center tracking-tighter">Authorize Results</h3>
          <form onSubmit={runAudit} className="space-y-4">
            <input required className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl text-white outline-none" placeholder="Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
            <input required type="email" className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl text-white outline-none" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <input required className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl text-white outline-none" placeholder="WhatsApp" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
            <button disabled={loading} className="w-full bg-yellow-500 text-slate-950 py-6 rounded-2xl font-black uppercase">{loading ? <Loader2 className="animate-spin mx-auto" /> : "Initiate Critical Audit"}</button>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in">
          <div className="bg-yellow-500 p-10 rounded-[3rem] mb-12 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
            <div className="text-center md:text-left"><h3 className="text-3xl font-black uppercase leading-none italic tracking-tight">Handshake Complete</h3><p className="font-bold">Protocol result dispatched to {formData.email}.</p></div>
            <button onClick={downloadPDF} className="bg-slate-950 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl"><Download size={20}/> Download PDF</button>
          </div>
          <div ref={reportRef} className="p-16 border border-slate-800 rounded-[4rem] bg-slate-900/40">
             <div className="flex justify-between items-center mb-16 border-b border-slate-800 pb-12">
               <div><h3 className="text-yellow-500 font-black uppercase tracking-[0.5em] text-[10px]">Smart Marketing // Strategic Analysis</h3><h4 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">{formData.bizName}</h4></div>
               <ShieldCheck className="text-yellow-500" size={64} />
             </div>
             <div className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">{result}</div>
          </div>
        </div>
      )}
    </div>
  );
}
