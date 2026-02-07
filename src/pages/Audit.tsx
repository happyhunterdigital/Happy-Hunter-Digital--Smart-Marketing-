import { useState, useRef } from 'react';
import { db, performAuditAnalysis } from '../firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Search, Loader2, ShieldCheck, Mail, Phone, User, Download, Calendar, ArrowRight, AlertTriangle, Building2, MapPin } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Audit() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const reportRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ bizName: "", location: "", fullName: "", email: "", whatsapp: "" });

  const runAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const aiResponse = await performAuditAnalysis(formData.bizName, formData.location);
      setResult(aiResponse);

      if (db) {
        await addDoc(collection(db, "audits"), {
          ...formData,
          analysis: aiResponse,
          timestamp: serverTimestamp()
        });
        await addDoc(collection(db, "mail"), {
          to: formData.email,
          message: {
            subject: `⚠️ URGENT: Entity Audit for ${formData.bizName}`,
            html: `<div style="font-family:sans-serif; background:#f4f4f4; padding:40px;"><h2>Digital Entity Verdict</h2><p>${aiResponse.replace(/\n/g, '<br/>')}</p><br/><a href="https://calendly.com/motsumitl/30min" style="background:#FACC15; color:#000; padding:15px 25px; text-decoration:none; font-weight:bold; border-radius:8px;">BOOK RECOVERY CALL</a></div>`
          }
        });
      }
      setStep(3);
    } catch (err) { setResult("Handshake failed."); setStep(3); }
    finally { setLoading(false); }
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
      if (line.includes('[SECTION]')) return <h4 key={i} className="text-yellow-500 font-black text-2xl uppercase mt-12 mb-6 border-b border-yellow-500/20 pb-2">{line.replace('[SECTION]', '')}</h4>;
      if (line.includes('[FIX]')) return <div key={i} className="bg-yellow-500/5 border-l-4 border-yellow-500 p-6 my-6 italic text-white font-bold">{line.replace('[FIX]', 'STRATEGIC REQUIREMENT: ')}</div>;
      const formatted = line.split(/(\[H\].*?|\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith('**')) return <strong key={j} className="text-white font-black uppercase">{part.replace(/\*\*/g, '')}</strong>;
        if (part.startsWith('[H]')) return <span key={j} className="text-yellow-500 font-bold">{part.replace('[H]', '')}</span>;
        return part;
      });
      return <p key={i} className="mb-4 text-slate-300 leading-relaxed">{formatted}</p>;
    });
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen">
      {step === 1 && (
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-12">Entity <span className="text-yellow-500">Scan</span></h2>
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
            <input required className="w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white outline-none focus:border-yellow-500" placeholder="Business Name" value={formData.bizName} onChange={e => setFormData({...formData, bizName: e.target.value})} />
            <input required className="w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white outline-none focus:border-yellow-500" placeholder="City / Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            <button type="submit" className="w-full bg-yellow-500 text-slate-950 py-5 rounded-2xl font-black text-lg">NEXT <ArrowRight className="inline ml-2"/></button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-xl mx-auto p-12 border border-slate-800 rounded-[3rem] bg-slate-900/40">
          <h3 className="text-2xl font-black uppercase text-yellow-500 mb-8 text-center">Secure Your Results</h3>
          <form onSubmit={runAudit} className="space-y-4">
            <input required className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-yellow-500" placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
            <input required type="email" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-yellow-500" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <input required className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-yellow-500" placeholder="WhatsApp" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
            <button disabled={loading} className="w-full bg-yellow-500 text-slate-950 py-5 rounded-xl font-black uppercase">{loading ? <Loader2 className="animate-spin mx-auto" /> : "Initiate Critical Audit"}</button>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="animate-in fade-in">
          <div className="bg-yellow-500 p-10 rounded-[3rem] mb-12 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-black uppercase leading-none">Your Verdict is Ready</h3>
              <p className="font-bold mt-2">Download your free PDF below and check your email at {formData.email}.</p>
            </div>
            <button onClick={downloadPDF} className="bg-slate-950 text-white px-10 py-4 rounded-2xl font-black uppercase flex items-center gap-2 tracking-widest text-xs">
              <Download size={20}/> Download PDF
            </button>
          </div>

          <div ref={reportRef} className="p-16 border border-slate-800 rounded-[4rem] bg-slate-900/40 relative shadow-2xl">
             <div className="flex justify-between items-center mb-16 border-b border-slate-800 pb-12">
               <div><h3 className="text-yellow-500 font-black uppercase tracking-[0.5em] text-xs">Smart Marketing // Protocol Analysis</h3><h4 className="text-5xl font-black text-white uppercase tracking-tighter">{formData.bizName}</h4></div>
               <ShieldCheck className="text-yellow-500" size={60} />
             </div>
             {renderText(result)}
             <div className="mt-32 p-16 bg-yellow-500 rounded-[3rem] text-slate-950 text-center">
               <h4 className="text-4xl font-black uppercase mb-4">Fix Your Entity Architecture</h4>
               <p className="font-bold mb-10 italic opacity-80">Mend these gaps before the 2026 filter solidifies. Secure your call with Thabo Leslie Motsumi now.</p>
               <a href="https://calendly.com/motsumitl/30min" className="bg-slate-950 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all inline-block">Schedule Strategy Call</a>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
