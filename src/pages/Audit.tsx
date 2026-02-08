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

      if (db) {
        // 1. DATA COLLECTION: Store for Admin Command Center
        await addDoc(collection(db, "leads"), { 
          businessName: formData.bizName,
          location: formData.location,
          fullName: formData.fullName,
          email: formData.email,
          whatsapp: formData.whatsapp,
          analysis: aiResponse, 
          status: "new",
          timestamp: serverTimestamp() 
        });
        
        // 2. EMAIL AUTOMATION: Trigger Firebase Email Extension
        await addDoc(collection(db, "mail"), {
          to: formData.email,
          message: {
            subject: `🚨 Survival Report: Digital Entity Audit for ${formData.bizName}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; color: #020617;">
                <div style="background: #FACC15; padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
                  <h1 style="margin:0; font-size: 28px; font-weight: 900; text-transform: uppercase;">SMART MARKETING</h1>
                  <p style="margin:5px 0 0; font-weight: 700; font-size: 14px; letter-spacing: 2px;">PROTOCOL VERDICT</p>
                </div>
                <div style="padding: 40px; border: 1px solid #e2e8f0; border-radius: 0 0 16px 16px;">
                  <h2 style="font-size: 20px;">Hi ${formData.fullName},</h2>
                  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Your strategic entity audit for <strong>${formData.bizName}</strong> is complete. Your business is currently being filtered out by smart algorithms.</p>
                  <div style="background: #f8fafc; border-left: 4px solid #FACC15; padding: 25px; margin: 30px 0; font-style: italic; line-height: 1.8;">
                    ${aiResponse.replace(/\n/g, '<br/>')}
                  </div>
                  <div style="text-align: center; margin-top: 40px;">
                    <a href="https://calendly.com/motsumitl/30min" style="background: #FACC15; color: #020617; padding: 18px 35px; text-decoration: none; border-radius: 12px; font-weight: 900; display: inline-block; font-size: 14px; text-transform: uppercase;">BOOK RECOVERY CALL</a>
                  </div>
                </div>
                <p style="text-align: center; font-size: 10px; color: #94a3b8; margin-top: 20px;">© 2025 Smart Marketing. Digital Entity Management Protocol Active.</p>
              </div>
            `
          }
        });
      }
      
      setStep(3);
    } catch (err) {
      setResult("SYSTEM_ERROR: Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: '#020617' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`SmartMarketing-Audit-${formData.bizName}.pdf`);
  };

  const renderFormattedText = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      if (line.includes('[SECTION]')) {
        return <h4 key={i} className="text-yellow-500 font-black text-2xl uppercase mt-12 mb-6 border-b-2 border-yellow-500/20 pb-4">{line.replace('[SECTION]', '')}</h4>;
      }
      if (line.includes('[FIX]')) {
        return (
          <div key={i} className="bg-yellow-500/10 border-l-4 border-yellow-500 p-8 my-10 rounded-r-3xl">
             <div className="flex items-center gap-2 mb-2 text-yellow-500 font-black uppercase text-xs tracking-widest">
               <AlertTriangle size={14} /> Strategic Requirement
             </div>
             <p className="text-white font-bold text-lg leading-relaxed">{line.replace('[FIX]', '')}</p>
          </div>
        );
      }
      const parts = line.split(/(\[H\].*?|\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith('**')) return <strong key={j} className="text-white font-black uppercase tracking-tight underline decoration-yellow-500/30">{part.replace(/\*\*/g, '')}</strong>;
        if (part.startsWith('[H]')) return <span key={j} className="text-yellow-500 font-bold bg-yellow-500/10 px-1 rounded">{part.replace('[H]', '')}</span>;
        return part;
      });
      return <p key={i} className="mb-6 text-slate-300 leading-relaxed text-base md:text-lg">{parts}</p>;
    });
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen font-sans">
      {step === 1 && (
        <div className="max-w-2xl mx-auto text-center animate-in fade-in zoom-in duration-500">
          <span className="text-yellow-500 font-black uppercase tracking-[0.4em] text-[10px]">Smart Marketing Engine</span>
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mt-4 mb-12">Entity <span className="text-yellow-500">Scan</span></h2>
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
            <div className="relative"><Building2 className="absolute left-6 top-6 text-slate-700" size={24}/><input required className="w-full bg-slate-900 border-2 border-slate-800 p-6 pl-16 rounded-3xl text-white outline-none focus:border-yellow-500 transition-all text-lg" placeholder="Business Name" value={formData.bizName} onChange={e => setFormData({...formData, bizName: e.target.value})} /></div>
            <div className="relative"><MapPin className="absolute left-6 top-6 text-slate-700" size={24}/><input required className="w-full bg-slate-900 border-2 border-slate-800 p-6 pl-16 rounded-3xl text-white outline-none focus:border-yellow-500 transition-all text-lg" placeholder="City / Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
            <button type="submit" className="w-full bg-yellow-500 text-slate-950 py-6 rounded-3xl font-black text-xl hover:scale-95 transition-transform flex items-center justify-center gap-3">BEGIN ANALYSIS <ArrowRight size={20}/></button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-xl mx-auto p-12 border-2 border-slate-800 rounded-[3.5rem] bg-slate-900/40 shadow-2xl animate-in slide-in-from-bottom-10">
          <div className="text-center mb-12">
            <ShieldCheck className="mx-auto text-yellow-500 mb-4" size={50} />
            <h3 className="text-3xl font-black uppercase text-white mb-2">Secure Your Results</h3>
            <p className="text-slate-500 text-sm">Enter your contact protocols to unlock the 2026 survival report.</p>
          </div>
          <form onSubmit={runAudit} className="space-y-4">
            <div className="relative"><User className="absolute left-5 top-5 text-slate-700" size={20}/><input required className="w-full bg-slate-950 border-2 border-slate-800 p-5 pl-14 rounded-2xl text-white outline-none focus:border-yellow-500" placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} /></div>
            <div className="relative"><Mail className="absolute left-5 top-5 text-slate-700" size={20}/><input required type="email" className="w-full bg-slate-950 border-2 border-slate-800 p-5 pl-14 rounded-2xl text-white outline-none focus:border-yellow-500" placeholder="Business Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
            <div className="relative"><Phone className="absolute left-5 top-5 text-slate-700" size={20}/><input required className="w-full bg-slate-950 border-2 border-slate-800 p-5 pl-14 rounded-2xl text-white outline-none focus:border-yellow-500" placeholder="WhatsApp Number" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} /></div>
            <button disabled={loading} className="w-full bg-yellow-500 text-slate-950 py-6 rounded-2xl font-black uppercase tracking-widest text-lg shadow-xl shadow-yellow-500/10 hover:bg-white">{loading ? <Loader2 className="animate-spin mx-auto" /> : "Initiate Handshake"}</button>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="animate-in fade-in duration-1000">
          {/* Instruction Block for Entrepreneurs */}
          <div className="bg-yellow-500 p-10 rounded-[3rem] mb-16 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-3xl font-black uppercase leading-none">Your Survival Report is Ready</h3>
              <p className="font-bold text-lg italic opacity-90">Download your free PDF below. A master digital copy has also been dispatched to <span className="underline">{formData.email}</span>.</p>
            </div>
            <button onClick={downloadPDF} className="bg-slate-950 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all text-xs">
              <Download size={24}/> Download PDF
            </button>
          </div>

          <div ref={reportRef} className="p-12 md:p-20 border-2 border-slate-800 rounded-[4rem] bg-slate-900/40 relative shadow-2xl overflow-hidden">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 border-b-2 border-slate-800 pb-12 gap-8">
               <div className="space-y-2">
                 <h3 className="text-yellow-500 font-black uppercase tracking-[0.5em] text-xs">Smart Marketing // Strategic Analysis</h3>
                 <h4 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">{formData.bizName}</h4>
                 <p className="text-slate-500 font-black uppercase tracking-widest flex items-center gap-2 text-xs"><MapPin size={14}/> {formData.location}</p>
               </div>
               <ShieldCheck className="text-yellow-500 hidden md:block" size={80} />
             </div>

             <div className="max-w-4xl">
               {renderFormattedText(result)}
             </div>

             <div className="mt-32 p-16 bg-yellow-500 rounded-[3rem] text-slate-950 text-center relative overflow-hidden">
               <div className="relative z-10">
                 <h4 className="text-5xl font-black uppercase mb-6 leading-tight">Close the Gaps</h4>
                 <p className="font-bold text-xl mb-12 italic opacity-90 max-w-xl mx-auto underline decoration-black/20">Mend your entity architecture before the 2026 filter solidifies. Secure your recovery call today.</p>
                 <a href="https://calendly.com/motsumitl/30min" className="bg-slate-950 text-white px-16 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-105 transition-all shadow-2xl">Schedule Recovery Call</a>
               </div>
               <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute top-10 left-10 w-32 h-32 border-8 border-slate-950 rounded-full" />
                  <div className="absolute bottom-10 right-10 w-48 h-48 border-8 border-slate-950 rounded-full" />
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
