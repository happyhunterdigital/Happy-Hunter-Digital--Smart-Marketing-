import { useState, useRef } from 'react';
import { db, callHunterAI } from '../firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Search, Loader2, ShieldCheck, Mail, Phone, User, Download, Calendar, ArrowRight, AlertTriangle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Audit() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const reportRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ bizName: "", fullName: "", email: "", whatsapp: "" });

  const runAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const aiResponse = await callHunterAI(`Perform a Critical Pain-Point Audit for: "${formData.bizName}". Include Local SEO, Social Media, Digital Footprint, and Online Visibility.`);
    setResult(aiResponse);

    if (db) {
      await addDoc(collection(db, "mail"), {
        to: formData.email,
        message: {
          subject: `Vulnerability Report: ${formData.bizName}`,
          html: `<h3>Audit for ${formData.bizName}</h3><p>${aiResponse.replace(/\n/g, '<br/>')}</p><br/><a href="https://calendly.com/motsumitl/30min">Book Recovery Call</a>`
        },
        lead: { ...formData, timestamp: serverTimestamp() }
      });
    }
    setLoading(false);
    setStep(3);
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
      if (line.includes('[SECTION]')) return <h4 key={i} className="text-yellow-500 font-black text-xl uppercase mt-10 mb-4 border-b border-yellow-500/20 pb-2">{line.replace('[SECTION]', '')}</h4>;
      const formatted = line.split(/(\[H\].*?\[\/H\]|\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith('**')) return <strong key={j} className="text-white uppercase">{part.replace(/\*\*/g, '')}</strong>;
        if (part.startsWith('[H]')) return <span key={j} className="text-yellow-500 font-bold">{part.replace(/\[\/H\]|\[H\]/g, '')}</span>;
        return part;
      });
      return <p key={i} className="mb-4 text-slate-300 leading-relaxed text-sm">{formatted}</p>;
    });
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen">
      {step === 1 && (
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-12">Entity <span className="text-yellow-500">Scan</span></h2>
          <div className="relative"><input className="w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl outline-none focus:border-yellow-500 transition-all text-white" placeholder="Business Name & City..." value={formData.bizName} onChange={(e) => setFormData({...formData, bizName: e.target.value})} /><button onClick={() => setStep(2)} className="absolute right-3 top-3 bottom-3 bg-yellow-500 text-slate-950 px-8 rounded-xl font-black">NEXT</button></div>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-xl mx-auto p-12 border border-slate-800 rounded-[3rem] bg-slate-900/40">
          <h3 className="text-2xl font-black uppercase text-yellow-500 mb-8 text-center">Secure Your Strategy</h3>
          <form onSubmit={runAudit} className="space-y-4">
            <div className="relative"><User className="absolute left-4 top-4 text-slate-600" size={18} /><input required className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-xl text-white outline-none focus:border-yellow-500" placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} /></div>
            <div className="relative"><Mail className="absolute left-4 top-4 text-slate-600" size={18} /><input required type="email" className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-xl text-white outline-none focus:border-yellow-500" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
            <div className="relative"><Phone className="absolute left-4 top-4 text-slate-600" size={18} /><input required className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-xl text-white outline-none focus:border-yellow-500" placeholder="WhatsApp" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} /></div>
            <button disabled={loading} className="w-full bg-yellow-500 text-slate-950 py-5 rounded-xl font-black uppercase tracking-widest mt-4">{loading ? <Loader2 className="animate-spin mx-auto" /> : "Initiate Critical Audit"}</button>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="animate-in fade-in">
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-8 rounded-3xl mb-12 text-center space-y-4">
            <Download className="mx-auto text-yellow-500" size={32} />
            <h3 className="text-xl font-black uppercase text-white">Your Survival Report is Ready</h3>
            <p className="text-slate-400 text-sm italic">Download the PDF below and check your inbox at <span className="text-yellow-500 font-bold">{formData.email}</span> for the full digital record.</p>
            <button onClick={downloadPDF} className="bg-yellow-500 text-slate-950 px-8 py-3 rounded-xl font-black uppercase text-xs hover:bg-white transition-all">Download Report (PDF)</button>
          </div>

          <div ref={reportRef} className="p-12 border border-slate-800 rounded-[3rem] bg-slate-900/40 relative overflow-hidden">
            <div className="flex justify-between items-start mb-16 border-b border-slate-800 pb-10">
              <div><h3 className="text-yellow-500 font-black uppercase tracking-[0.4em] text-[10px] mb-2">Smart Marketing // Protocol Analysis</h3><h4 className="text-4xl font-black text-white uppercase tracking-tighter">{formData.bizName}</h4></div>
              <ShieldCheck className="text-yellow-500" size={40} />
            </div>
            {renderText(result)}
            <div className="mt-20 p-12 bg-yellow-500 rounded-[2.5rem] text-slate-950 text-center">
              <h4 className="text-3xl font-black uppercase mb-4">Mend Your Architecture</h4>
              <p className="font-bold mb-8 italic">Your entity is being filtered. Secure your recovery call today.</p>
              <a href="https://calendly.com/motsumitl/30min" className="bg-slate-950 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest inline-block text-sm">Schedule Call</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
