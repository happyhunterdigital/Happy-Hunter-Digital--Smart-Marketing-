import { useState, useRef } from 'react';
import { db, performAuditAnalysis } from '../firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Search, Loader2, ShieldCheck, Mail, Phone, User, Download, Calendar, ArrowRight, AlertTriangle, Building2, MapPin } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import emailjs from '@emailjs/browser';

export default function Audit() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const reportRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ 
    bizName: "", 
    location: "", 
    fullName: "", 
    email: "", 
    whatsapp: "" 
  });

  const runAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const aiResponse = await performAuditAnalysis(formData.bizName, formData.location);
      setResult(aiResponse);

      // 1. DATA COLLECTION: Store lead for your Command Center
      if (db) {
        await addDoc(collection(db, "leads"), { 
          ...formData,
          analysis: aiResponse, 
          timestamp: serverTimestamp() 
        });
      }
      
      // 2. THIRD-PARTY EMAIL (EmailJS)
      // We send the data to EmailJS to handle the inbox delivery
      await emailjs.send(
        'YOUR_SERVICE_ID', // You will get this from EmailJS
        'YOUR_TEMPLATE_ID', // You will get this from EmailJS
        {
          to_name: formData.fullName,
          to_email: formData.email,
          business_name: formData.bizName,
          audit_content: aiResponse
        },
        'YOUR_PUBLIC_KEY' // You will get this from EmailJS
      );

      setStep(3);
    } catch (err) {
      setStep(3); // Move forward even if email fails, so user sees results
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: '#020617' });
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`Audit-${formData.bizName}.pdf`);
  };

  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.includes('[SECTION]')) return <h4 key={i} className="text-yellow-500 font-black text-2xl uppercase mt-12 mb-6 border-b-2 border-yellow-500/20 pb-4">{line.replace('[SECTION]', '')}</h4>;
      if (line.includes('[FIX]')) return (
        <div key={i} className="bg-yellow-500/10 border-l-4 border-yellow-500 p-8 my-10 rounded-r-3xl">
          <p className="text-white font-bold text-lg">STRATEGIC FIX: {line.replace('[FIX]', '')}</p>
        </div>
      );
      const parts = line.split(/(\[H\].*?|\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith('**')) return <strong key={j} className="text-white font-black uppercase underline decoration-yellow-500/30">{part.replace(/\*\*/g, '')}</strong>;
        if (part.startsWith('[H]')) return <span key={j} className="text-yellow-500 font-bold">{part.replace('[H]', '')}</span>;
        return part;
      });
      return <p key={i} className="mb-6 text-slate-300 leading-relaxed text-base md:text-lg">{parts}</p>;
    });
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen">
      {step === 1 && (
        <div className="max-w-2xl mx-auto text-center animate-in fade-in zoom-in duration-500">
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-12">Entity <span className="text-yellow-500">Scan</span></h2>
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
            <div className="relative"><Building2 className="absolute left-6 top-6 text-slate-700" size={24}/><input required className="w-full bg-slate-900 border-2 border-slate-800 p-6 pl-16 rounded-3xl text-white outline-none focus:border-yellow-500 transition-all text-lg" placeholder="Business Name" value={formData.bizName} onChange={e => setFormData({...formData, bizName: e.target.value})} /></div>
            <div className="relative"><MapPin className="absolute left-6 top-6 text-slate-700" size={24}/><input required className="w-full bg-slate-900 border-2 border-slate-800 p-6 pl-16 rounded-3xl text-white outline-none focus:border-yellow-500 transition-all text-lg" placeholder="City / Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
            <button type="submit" className="w-full bg-yellow-500 text-slate-950 py-6 rounded-3xl font-black text-xl shadow-2xl">NEXT</button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-xl mx-auto p-12 border-2 border-slate-800 rounded-[3.5rem] bg-slate-900/40 shadow-2xl">
          <h3 className="text-3xl font-black uppercase text-yellow-500 mb-8 text-center">Secure Your Results</h3>
          <form onSubmit={runAudit} className="space-y-4">
            <input required className="w-full bg-slate-950 border-2 border-slate-800 p-5 pl-12 rounded-2xl text-white outline-none focus:border-yellow-500" placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
            <input required type="email" className="w-full bg-slate-950 border-2 border-slate-800 p-5 pl-12 rounded-2xl text-white outline-none focus:border-yellow-500" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <input required className="w-full bg-slate-950 border-2 border-slate-800 p-5 pl-12 rounded-2xl text-white outline-none focus:border-yellow-500" placeholder="WhatsApp" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
            <button disabled={loading} className="w-full bg-yellow-500 text-slate-950 py-6 rounded-2xl font-black uppercase shadow-xl hover:bg-white">{loading ? <Loader2 className="animate-spin mx-auto" /> : "Initiate Critical Audit"}</button>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="animate-in fade-in">
          <div className="bg-yellow-500 p-12 rounded-[3rem] mb-16 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
            <div className="space-y-2 text-center md:text-left max-w-xl">
              <h3 className="text-4xl font-black uppercase leading-none italic tracking-tight">Your Verdict is Ready</h3>
              <p className="font-bold text-lg leading-tight">Download your report below. A master digital copy has also been dispatched to your email at <span className="underline">{formData.email}</span>.</p>
            </div>
            <button onClick={downloadPDF} className="bg-slate-950 text-white px-10 py-5 rounded-2xl font-black uppercase flex items-center gap-3 shadow-2xl">
              <Download size={24}/> Download PDF
            </button>
          </div>

          <div ref={reportRef} className="p-12 md:p-20 border-2 border-slate-800 rounded-[4rem] bg-slate-900/40 relative shadow-2xl overflow-hidden">
             <div className="flex justify-between items-center mb-16 border-b-2 border-slate-800 pb-12">
               <div><h3 className="text-yellow-500 font-black uppercase tracking-[0.5em] text-xs">Smart Marketing // Strategic Analysis</h3><h4 className="text-5xl font-black text-white uppercase tracking-tighter">{formData.bizName}</h4></div>
               <ShieldCheck className="text-yellow-500" size={64} />
             </div>
             <div className="max-w-4xl">{renderText(result)}</div>
             <div className="mt-32 p-16 bg-yellow-500 rounded-[3rem] text-slate-950 text-center">
               <h4 className="text-5xl font-black uppercase mb-6 leading-none">Close the Gaps</h4>
               <a href="https://calendly.com/motsumitl/30min" className="bg-slate-950 text-white px-16 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-105 transition-all shadow-2xl inline-block">Schedule Call</a>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
