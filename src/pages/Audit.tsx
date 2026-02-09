import { useState, useRef } from 'react';
import { db, performAuditAnalysis } from '../firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Search, Loader2, ShieldCheck, Mail, Phone, User, Download, Calendar, ArrowRight, MessageCircle, Building2, MapPin } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Audit() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [score, setScore] = useState("0");
  const reportRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ bizName: "", location: "", fullName: "", email: "", whatsapp: "" });

  const runAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const aiResponse = await performAuditAnalysis(formData.bizName, formData.location);
      
      // 1. EXTRACT SCORE FOR RETARGETING
      const scoreMatch = aiResponse.match(/FINAL_SCORE:\s*(\d+)/);
      const extractedScore = scoreMatch ? scoreMatch[1] : "N/A";
      setScore(extractedScore);
      
      // 2. CLEAN OUTPUT (Hide the internal marker from the user)
      setResult(aiResponse.replace(/FINAL_SCORE:\s*\d+/, ''));

      if (db) {
        // 3. DATA COLLECTION: Store lead
        await addDoc(collection(db, "leads"), { 
          ...formData, 
          analysis: aiResponse, 
          timestamp: serverTimestamp(), 
          score: extractedScore 
        });
        
        // 4. AUTOMATION: Trigger Firebase Email
        await addDoc(collection(db, "mail"), {
          to: formData.email,
          message: {
            subject: `🚨 Survival Report: ${formData.bizName}`,
            html: `
              <div style="font-family: sans-serif; padding: 40px; background: #0f172a; color: #fff;">
                <h1 style="color: #FACC15;">SMART MARKETING</h1>
                <p>Hi ${formData.fullName}, your audit for ${formData.bizName} is ready.</p>
                <p><strong>Entity Survival Score: ${extractedScore}/100</strong></p>
                <div style="background: #1e293b; padding: 20px; border-left: 4px solid #FACC15; margin: 20px 0;">
                  ${aiResponse.replace(/\n/g, '<br/>')}
                </div>
                <a href="https://calendly.com/motsumitl/30min" style="background: #FACC15; color: #000; padding: 15px; text-decoration: none; border-radius: 8px; font-weight: bold;">BOOK RECOVERY CALL</a>
              </div>
            `
          }
        });
      }
      setStep(3);
    } catch (err) {
      setResult("SYSTEM_ERROR: Connection interrupted.");
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppLink = () => {
    const text = `Hi Thabo, my Entity Survival Score for ${formData.bizName} was ${score}/100. I need to mend my architecture.`;
    return `https://wa.me/27601016673?text=${encodeURIComponent(text)}`;
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
      if (line.includes('[FIX]')) return <div key={i} className="bg-yellow-500/10 border-l-4 border-yellow-500 p-8 my-10 rounded-r-3xl text-white font-bold tracking-tight uppercase">STRATEGIC REQUIREMENT: {line.replace('[FIX]', '')}</div>;
      const parts = line.split(/(\[H\].*?|\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith('**')) return <strong key={j} className="text-white font-black uppercase underline decoration-yellow-500/30">{part.replace(/\*\*/g, '')}</strong>;
        if (part.startsWith('[H]')) return <span key={j} className="text-yellow-500 font-bold">{part.replace('[H]', '')}</span>;
        return part;
      });
      return <p key={i} className="mb-6 text-slate-300 leading-relaxed text-base md:text-lg font-medium">{parts}</p>;
    });
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen">
      {/* STEP 1: BIZ DATA */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto text-center animate-in fade-in duration-500">
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-12">Entity <span className="text-yellow-500">Scan</span></h2>
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
            <div className="relative"><Building2 className="absolute left-6 top-6 text-slate-700" size={24}/><input required className="w-full bg-slate-900 border-2 border-slate-800 p-6 pl-16 rounded-3xl text-white outline-none focus:border-yellow-500" placeholder="Business Name" value={formData.bizName} onChange={e => setFormData({...formData, bizName: e.target.value})} /></div>
            <div className="relative"><MapPin className="absolute left-6 top-6 text-slate-700" size={24}/><input required className="w-full bg-slate-900 border-2 border-slate-800 p-6 pl-16 rounded-3xl text-white outline-none focus:border-yellow-500" placeholder="City" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
            <button type="submit" className="w-full bg-yellow-500 text-slate-950 py-6 rounded-3xl font-black text-xl uppercase shadow-2xl">Next</button>
          </form>
        </div>
      )}

      {/* STEP 2: CONTACT GATE */}
      {step === 2 && (
        <div className="max-w-xl mx-auto p-12 border-2 border-slate-800 rounded-[3.5rem] bg-slate-900/40 shadow-2xl animate-in slide-in-from-bottom-5">
          <h3 className="text-2xl font-black uppercase text-yellow-500 mb-8 text-center">Secure Your Results</h3>
          <form onSubmit={runAudit} className="space-y-4">
            <input required className="w-full bg-slate-950 border-2 border-slate-800 p-5 rounded-2xl text-white outline-none focus:border-yellow-500" placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
            <input required type="email" className="w-full bg-slate-950 border-2 border-slate-800 p-5 rounded-2xl text-white outline-none focus:border-yellow-500" placeholder="Business Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <input required className="w-full bg-slate-950 border-2 border-slate-800 p-5 rounded-2xl text-white outline-none focus:border-yellow-500" placeholder="WhatsApp Number" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
            <button disabled={loading} className="w-full bg-yellow-500 text-slate-950 py-6 rounded-2xl font-black uppercase shadow-xl hover:bg-white">{loading ? <Loader2 className="animate-spin mx-auto" /> : "Initiate Critical Audit"}</button>
          </form>
        </div>
      )}

      {/* STEP 3: VERDICT & RETARGETING */}
      {step === 3 && (
        <div className="animate-in fade-in duration-1000">
          <div className="bg-yellow-500 p-10 rounded-[3rem] mb-16 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-3 text-center md:text-left max-w-xl">
              <h3 className="text-4xl font-black uppercase tracking-tight italic">Verdict: Established</h3>
              <p className="font-bold text-lg leading-tight">Report sent to {formData.email}. Download your PDF or discuss your score on WhatsApp.</p>
            </div>
            <div className="flex flex-wrap gap-4 relative z-10">
              <button onClick={downloadPDF} className="bg-slate-950 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs hover:scale-105 transition-transform flex items-center gap-2 shadow-2xl">
                <Download size={20}/> Download PDF
              </button>
              <a href={getWhatsAppLink()} target="_blank" className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs hover:scale-105 transition-transform flex items-center gap-2 shadow-2xl">
                <MessageCircle size={20} fill="currentColor"/> WhatsApp Thabo
              </a>
            </div>
          </div>

          <div ref={reportRef} className="p-12 md:p-20 border-2 border-slate-800 rounded-[4rem] bg-slate-900/40 relative shadow-2xl overflow-hidden">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 border-b-2 border-slate-800 pb-12 gap-8">
               <div className="space-y-1">
                 <h3 className="text-yellow-500 font-black uppercase tracking-[0.5em] text-[10px]">Smart Marketing // Strategic Analysis</h3>
                 <h4 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">{formData.bizName}</h4>
                 <p className="text-slate-500 font-black uppercase tracking-widest flex items-center gap-2 text-xs italic"><MapPin size={14}/> {formData.location}</p>
               </div>
               <div className="text-right">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Survival Score</p>
                 <p className="text-6xl font-black text-yellow-500 leading-none">{score}<span className="text-lg text-slate-700">/100</span></p>
               </div>
             </div>
             <div className="max-w-4xl">{renderFormattedText(result)}</div>
             <div className="mt-32 p-16 bg-yellow-500 rounded-[3rem] text-slate-950 text-center relative overflow-hidden shadow-2xl">
               <h4 className="text-5xl font-black uppercase mb-6 leading-tight">Close the Gaps</h4>
               <p className="font-bold text-xl mb-12 italic opacity-90 max-w-xl mx-auto underline decoration-black/20">Mend your entity architecture before the 2026 filter solidifies. Secure your call with Thabo today.</p>
               <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <a href="https://calendly.com/motsumitl/30min" className="bg-slate-950 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-105 transition-all shadow-2xl">Schedule Call</a>
                 <a href={getWhatsAppLink()} target="_blank" className="bg-green-600 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-105 transition-all shadow-2xl">Message Thabo</a>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
