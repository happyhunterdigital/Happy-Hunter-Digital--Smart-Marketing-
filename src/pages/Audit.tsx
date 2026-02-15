import { useState, useRef, useEffect } from 'react';
import { db, performAuditAnalysis } from '../firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, ShieldCheck, Download, Calendar, ArrowRight, Building2, MapPin, Globe, MessageCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import emailjs from '@emailjs/browser';

export default function Audit() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [formData, setFormData] = useState({ bizName: "", location: "", fullName: "", email: "", whatsapp: "" });

  useEffect(() => { emailjs.init("YZ8FDMJ7-_7FL5vhT"); }, []);

  const runAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = await performAuditAnalysis(formData.bizName, formData.location);
    if (data) {
      setScore(data.score);
      setResult(data.analysis);
      if (db) {
        await addDoc(collection(db, "leads"), { ...formData, score: data.score, timestamp: serverTimestamp() });
        await emailjs.send('service_ac75cu8', 'template_9i2cl2c', { to_email: formData.email, business_name: formData.bizName, score: data.score });
      }
      setStep(3);
    }
    setLoading(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(2, 6, 23); // Slate 950
    doc.rect(0, 0, 210, 297, 'F');
    doc.setTextColor(250, 204, 21); // Yellow 500
    doc.setFontSize(24);
    doc.text("STRATEGIC VERDICT", 20, 40);
    doc.setTextColor(255, 255, 255);
    doc.text(formData.bizName.toUpperCase(), 20, 60);
    doc.text(`SCORE: ${score}/100`, 150, 40);
    
    let y = 90;
    result.forEach(item => {
      doc.setTextColor(250, 204, 21);
      doc.setFontSize(14);
      doc.text(item.heading.toUpperCase(), 20, y);
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(item.content, 170);
      doc.text(lines, 20, y + 10);
      y += (lines.length * 5) + 30;
    });
    doc.save(`Audit-${formData.bizName}.pdf`);
  };

  const highlightText = (text: string) => {
    const parts = text.split(/([A-Z]{4,})/g);
    return parts.map((p, i) => /^[A-Z]{4,}$/.test(p) ? <span key={i} className="text-yellow-500 font-black">{p}</span> : p);
  };

  return (
    <div className="pt-40 pb-20 px-6 max-w-6xl mx-auto min-h-screen">
      {step === 1 && (
        <div className="max-w-2xl mx-auto text-center animate-fade-in">
          <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-12 text-white">Entity <span className="text-yellow-500">Scan</span></h2>
          <form onSubmit={() => setStep(2)} className="space-y-4">
            <input required className="w-full bg-slate-900 border-2 border-slate-800 p-6 rounded-3xl text-white outline-none focus:border-yellow-500" placeholder="Business Name" value={formData.bizName} onChange={e => setFormData({...formData, bizName: e.target.value})} />
            <input required className="w-full bg-slate-900 border-2 border-slate-800 p-6 rounded-3xl text-white outline-none focus:border-yellow-500" placeholder="City" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            <button type="submit" className="w-full bg-yellow-500 text-slate-950 py-6 rounded-3xl font-black text-xl uppercase">Assess Business</button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-xl mx-auto p-12 border-2 border-slate-800 rounded-[3.5rem] bg-slate-900/40 shadow-2xl animate-fade-in">
          <h3 className="text-3xl font-black uppercase text-yellow-500 mb-8 text-center">Secure Results</h3>
          <form onSubmit={runAudit} className="space-y-4">
            <input required className="w-full bg-slate-950 border-2 border-slate-800 p-5 rounded-2xl text-white outline-none" placeholder="Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
            <input required type="email" className="w-full bg-slate-950 border-2 border-slate-800 p-5 rounded-2xl text-white outline-none" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <input required className="w-full bg-slate-950 border-2 border-slate-800 p-5 rounded-2xl text-white outline-none" placeholder="WhatsApp" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
            <button disabled={loading} className="w-full bg-yellow-500 text-slate-950 py-6 rounded-2xl font-black uppercase shadow-xl">{loading ? <Loader2 className="animate-spin mx-auto" /> : "Initiate Smart Analysis"}</button>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in">
          <div className="bg-yellow-500 p-10 rounded-[3.5rem] mb-12 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
            <h3 className="text-3xl font-black uppercase leading-none italic">Verdict Ready</h3>
            <div className="flex gap-4">
              <button onClick={downloadPDF} className="bg-slate-950 text-white px-10 py-4 rounded-2xl font-black uppercase flex items-center gap-2 tracking-widest text-xs shadow-2xl"><Download size={20}/> Download PDF</button>
              <a href={`https://wa.me/27601016673?text=My Score: ${score}/100`} target="_blank" className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 text-xs shadow-2xl hover:scale-105 transition-all"><MessageCircle size={20}/> WhatsApp Thabo</a>
            </div>
          </div>
          <div className="p-16 border-2 border-slate-800 rounded-[4rem] bg-slate-900/40 shadow-2xl">
             <div className="flex justify-between items-center mb-16 border-b-2 border-slate-800 pb-12">
               <h4 className="text-5xl font-black text-white uppercase tracking-tighter">{formData.bizName}</h4>
               <p className="text-6xl font-black text-yellow-500">{score}<span className="text-lg text-slate-700">/100</span></p>
             </div>
             {result.map((item, i) => (
               <div key={i} className="mb-12">
                 <h4 className="text-yellow-500 font-black text-xl uppercase mb-2 underline decoration-yellow-500/20 underline-offset-8">{item.heading}</h4>
                 <p className="text-slate-300 mb-6 leading-relaxed text-lg">{highlightText(item.content)}</p>
                 <div className="p-6 bg-slate-800 border-l-4 border-yellow-500 text-white font-bold italic shadow-xl">REQUIREMENT: {item.requirement}</div>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}
