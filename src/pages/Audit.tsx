import { useState, useRef, useEffect } from 'react';
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

  // Initialize EmailJS with your Public Key from screenshot
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
        // 1. DATA COLLECTION: Store for your Admin Command Center
        await addDoc(collection(db, "leads"), { 
          ...formData,
          analysis: aiResponse, 
          status: "fresh",
          timestamp: serverTimestamp() 
        });
      }
      
      // 2. THIRD-PARTY EMAIL (EmailJS)
      // Replace 'YOUR_TEMPLATE_ID' with the ID from your EmailJS 'Email Templates' tab
      await emailjs.send(
        'service_ac75cu8', 
        'YOUR_TEMPLATE_ID', 
        {
          to_name: formData.fullName,
          to_email: formData.email,
          business_name: formData.bizName,
          audit_content: aiResponse,
          calendly_link: "https://calendly.com/motsumitl/30min"
        }
      );

      setStep(3);
    } catch (err) {
      setStep(3); // Show results even if email fails
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: '#020617' });
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`Verdict-${formData.bizName}.pdf`);
  };

  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.includes('[SECTION]')) return <h4 key={i} className="text-yellow-500 font-black text-2xl uppercase mt-12 mb-6 border-b-2 border-yellow-500/20 pb-4">{line.replace('[SECTION]', '')}</h4>;
      if (line.includes('[FIX]')) return (
        <div key={i} className="bg-yellow-500/10 border-l-4 border-yellow-500 p-8 my-10 rounded-r-3xl">
          <p className="text-white font-bold text-lg">STRATEGIC REQUIREMENT: {line.replace('[FIX]', '')}</p>
        </div>
      );
      const parts = line.split(/(\[H\].*?|\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith('**')) return <strong key={j} className="text-white font-black uppercase underline decoration-yellow-500/30">{part.replace(/\*\*/g, '')}</strong>;
        if (part.startsWith('[H]')) return <span key={j} className="text-yellow-500 font-bold">{part.replace('[H]', '')}</span>;
        return part;
      });
      return <p key={i} className="mb-6 text-slate-300 leading-relaxed text-base font-medium">{parts}</p>;
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
            <button type="submit" className="w-full bg-yellow-500 text-slate-950 py-6 rounded-3xl font-black text-xl hover:scale-95 transition-transform flex items-center justify-center gap-3">NEXT <ArrowRight size={24}/></button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-xl mx-auto p-12 border-2 border-slate-800 rounded-[3.5rem] bg-slate-900/40 shadow-2xl animate-in slide-in-from-bottom-10">
          <div className="text-center mb-12">
            <ShieldCheck className="mx-auto text-yellow-500 mb-4" size={50} />
            <h3 className="text-3xl font-black uppercase text-white mb-2">Secure Your Results</h3>
            <p className="text-slate-500 text-sm italic">Submit your credentials to generate the unsparing survival report.</p>
          </div>
          <form onSubmit={runAudit} className="space-y-4">
            <div className="relative group"><User className="absolute left-5 top-5 text-slate-700" size={20}/><input required className="w-full bg-slate-950 border-2 border-slate-800 p-5 pl-14 rounded-2xl text-white outline-none focus:border-yellow-500" placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} /></div>
            <div className="relative group"><Mail className="absolute left-5 top-5 text-slate-700" size={20}/><input required type="email" className="w-full bg-slate-950 border-2 border-slate-800 p-5 pl-14 rounded-2xl text-white outline-none focus:border-yellow-500" placeholder="Business Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
            <div className="relative group"><Phone className="absolute left-5 top-5 text-slate-700" size={20}/><input required className="w-full bg-slate-950 border-2 border-slate-800 p-5 pl-14 rounded-2xl text-white outline-none focus:border-yellow-500" placeholder="WhatsApp Number" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} /></div>
            <button disabled={loading} className="w-full bg-yellow-500 text-slate-950 py-6 rounded-2xl font-black uppercase tracking-widest text-lg shadow-xl shadow-yellow-500/10 hover:bg-white">{loading ? <Loader2 className="animate-spin mx-auto" /> : "Initiate Critical Audit"}</button>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="animate-in fade-in duration-1000">
          <div className="bg-yellow-500 p-12 rounded-[3rem] mb-16 text-slate-950 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 w-full">
              <div className="space-y-3 text-center md:text-left max-w-xl">
                <h3 className="text-4xl font-black uppercase leading-none italic tracking-tight">Your Verdict is Ready</h3>
                <p className="font-bold text-lg leading-tight">I have dispatched your survival report to <span className="underline decoration-slate-900/50">{formData.email}</span>. Download the master PDF below for your records.</p>
              </div>
              <button onClick={downloadPDF} className="bg-slate-950 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-2xl">
                <Download size={24}/> Download PDF
              </button>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck size={120} /></div>
          </div>

          <div ref={reportRef} className="p-12 md:p-20 border-2 border-slate-800 rounded-[4rem] bg-slate-900/40 relative shadow-2xl overflow-hidden">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 border-b-2 border-slate-800 pb-12 gap-8">
               <div className="space-y-2">
                 <h3 className="text-yellow-500 font-black uppercase tracking-[0.5em] text-[10px]">Smart Marketing // Strategic Analysis</h3>
                 <h4 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">{formData.bizName}</h4>
                 <p className="text-slate-500 font-black uppercase tracking-widest flex items-center gap-2 text-xs italic"><MapPin size={14}/> {formData.location}</p>
               </div>
               <ShieldCheck className="text-yellow-500 hidden md:block" size={80} />
             </div>

             <div className="max-w-4xl">
               {renderFormattedText(result)}
             </div>

             <div className="mt-32 p-16 bg-yellow-500 rounded-[3rem] text-slate-950 text-center relative overflow-hidden">
               <div className="relative z-10">
                 <h4 className="text-5xl font-black uppercase mb-6 leading-none">Close the Gaps</h4>
                 <p className="font-bold text-xl mb-12 italic opacity-90 max-w-xl mx-auto underline decoration-black/20">Secure your recovery call with Thabo today to mend your architecture before the 2026 filter solidifies.</p>
                 <a href="https://calendly.com/motsumitl/30min" className="bg-slate-950 text-white px-16 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-105 transition-all shadow-2xl inline-block">Schedule Recovery Call</a>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
