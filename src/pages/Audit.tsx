// src/pages/Audit.tsx
import { useState, useRef } from 'react';
import { db, performAuditAnalysis } from '../firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, ShieldCheck, Mail, Phone, User, Download, ArrowRight, Building2, MapPin } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

      if (db && !aiResponse.includes("ERROR")) {
        await addDoc(collection(db, "audits"), { 
          businessName: formData.bizName,
          location: formData.location,
          fullName: formData.fullName,
          email: formData.email,
          whatsapp: formData.whatsapp,
          analysis: aiResponse, 
          timestamp: serverTimestamp() 
        });
        
        await addDoc(collection(db, "mail"), {
          to: formData.email,
          message: {
            subject: `🔍 Entity Audit: ${formData.bizName}`,
            html: `<div style="font-family:sans-serif;background:#0f172a;color:#e2e8f0;padding:40px;">
                    <div style="background:#facc15;padding:20px;margin:-40px -40px 30px;text-align:center;">
                      <h1 style="color:#020617;margin:0;font-size:24px;font-weight:900;">SMART MARKETING</h1>
                      <p style="color:#020617;margin:5px 0 0;font-weight:700;">ENTITY AUDIT REPORT</p>
                    </div>
                    <h2 style="color:#facc15;">Hi ${formData.fullName},</h2>
                    <p style="color:#94a3b8;">Your audit for <strong style="color:#fff;">${formData.bizName}</strong> is ready.</p>
                    <div style="background:#1e293b;border-left:4px solid #facc15;padding:20px;margin:20px 0;">
                      ${aiResponse.replace(/\n/g, '<br>')}
                    </div>
                    <div style="text-align:center;margin:30px 0;">
                      <a href="https://calendly.com/motsumitl/30min" 
                         style="background:#facc15;color:#020617;padding:15px 30px;text-decoration:none;font-weight:800;border-radius:8px;">
                        BOOK RECOVERY CALL
                      </a>
                    </div>
                   </div>`
          }
        });
      }
      
      setStep(3);
    } catch (err) {
      setResult("SYSTEM_ERROR: Audit generation failed. Please try again.");
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { 
      scale: 2, 
      backgroundColor: '#020617' 
    });
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Audit-${formData.bizName}.pdf`);
  };

  const renderFormattedText = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      if (line.includes('[SECTION]')) {
        return <h4 key={i} className="text-yellow-500 font-black text-2xl uppercase mt-12 mb-4 border-b border-yellow-500/20 pb-2">{line.replace('[SECTION]', '')}</h4>;
      }
      if (line.includes('[FIX]')) {
        return <div key={i} className="bg-yellow-500/10 border-l-4 border-yellow-500 p-6 my-6 text-white font-bold">{line.replace('[FIX]', 'ACTION REQUIRED: ')}</div>;
      }
      const parts = line.split(/(\[H\].*?|\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith('**')) return <strong key={j} className="text-white font-black bg-yellow-500/20 px-1 rounded">{part.replace(/\*\*/g, '')}</strong>;
        if (part.startsWith('[H]')) return <span key={j} className="text-yellow-500 font-bold">{part.replace('[H]', '')}</span>;
        return part;
      });
      return <p key={i} className="mb-4 text-slate-300 leading-relaxed">{parts}</p>;
    });
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen">
      {step === 1 && (
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-12">
            Entity <span className="text-yellow-500">Scan</span>
          </h2>
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
            <div className="relative">
              <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={22} />
              <input required className="w-full bg-slate-900 border border-slate-800 p-6 pl-14 rounded-2xl text-white outline-none focus:border-yellow-500" placeholder="Business Name" value={formData.bizName} onChange={e => setFormData({...formData, bizName: e.target.value})} />
            </div>
            <div className="relative">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={22} />
              <input required className="w-full bg-slate-900 border border-slate-800 p-6 pl-14 rounded-2xl text-white outline-none focus:border-yellow-500" placeholder="City / Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
            <button type="submit" className="w-full bg-yellow-500 text-slate-950 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2">
              NEXT <ArrowRight size={20} />
            </button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-xl mx-auto p-12 border border-slate-800 rounded-[3rem] bg-slate-900/40">
          <h3 className="text-2xl font-black uppercase text-yellow-500 mb-8 text-center">Secure Your Strategy</h3>
          <form onSubmit={runAudit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
              <input required className="w-full bg-slate-950 border border-slate-800 p-5 pl-12 rounded-2xl text-white outline-none focus:border-yellow-500" placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
            </div>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
              <input required type="email" className="w-full bg-slate-950 border border-slate-800 p-5 pl-12 rounded-2xl text-white outline-none focus:border-yellow-500" placeholder="Business Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="relative">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
              <input required className="w-full bg-slate-950 border border-slate-800 p-5 pl-12 rounded-2xl text-white outline-none focus:border-yellow-500" placeholder="WhatsApp" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
            </div>
            <button disabled={loading} className="w-full bg-yellow-500 text-slate-950 py-6 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : "Initiate Critical Audit"}
            </button>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="animate-in fade-in">
          <div className="bg-yellow-500 p-10 rounded-[3rem] mb-16 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-10">
            <div>
              <h3 className="text-3xl font-black uppercase">Your Audit is Ready</h3>
              <p className="font-bold text-lg italic opacity-80">Download below. Copy sent to {formData.email}.</p>
            </div>
            <button onClick={downloadPDF} className="bg-slate-950 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3">
              <Download size={24}/> Download PDF
            </button>
          </div>

          <div ref={reportRef} className="p-16 border border-slate-800 rounded-[4rem] bg-slate-900/40">
            <div className="flex justify-between items-center mb-16 border-b border-slate-800 pb-12">
              <div>
                <h3 className="text-yellow-500 font-black uppercase tracking-[0.5em] text-xs">Smart Marketing // Protocol Analysis</h3>
                <h4 className="text-5xl font-black text-white uppercase tracking-tighter">{formData.bizName}</h4>
              </div>
              <ShieldCheck className="text-yellow-500" size={64} />
            </div>
            {renderFormattedText(result)}
            <div className="mt-32 p-16 bg-yellow-500 rounded-[3rem] text-slate-950 text-center">
              <h4 className="text-5xl font-black uppercase mb-6">Close the Gaps</h4>
              <p className="font-bold text-xl mb-12 max-w-xl mx-auto italic">Secure your recovery call with Thabo today.</p>
              <a href="https://calendly.com/motsumitl/30min" className="bg-slate-950 text-white px-16 py-6 rounded-2xl font-black uppercase tracking-widest text-sm inline-block hover:scale-105 transition-transform">
                Schedule Call
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
