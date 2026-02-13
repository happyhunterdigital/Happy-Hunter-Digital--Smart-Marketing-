import { useState, useRef } from 'react';
import { db, performAuditAnalysis } from '../firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Search, Loader2, ShieldCheck, Mail, Phone, User, Download, Calendar, ArrowRight, Building2, MapPin, MessageCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Audit() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing...");
  const [result, setResult] = useState("");
  const [score, setScore] = useState("0");
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
    setLoadingText("Querying Google Knowledge Graph...");
    
    try {
      const aiResponse = await performAuditAnalysis(formData.bizName, formData.location);
      
      const scoreMatch = aiResponse.match(/FINAL_SCORE:\s*(\d+)/);
      const extractedScore = scoreMatch ? scoreMatch[1] : "??";
      
      setScore(extractedScore);
      setResult(aiResponse.replace(/FINAL_SCORE:\s*\d+/, '').trim());

      if (db) {
        await addDoc(collection(db, "audits"), { 
          ...formData, 
          analysis: aiResponse, 
          timestamp: serverTimestamp(), 
          score: extractedScore 
        });
      }
      
      setStep(3);
    } catch (err) {
      console.error("Audit error:", err);
      setResult("SYSTEM_ERROR: The Smart Marketing Graph is recalibrating. Please try again.");
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
    
    try {
      const canvas = await html2canvas(reportRef.current, { 
        scale: 2, 
        backgroundColor: '#020617',
        useCORS: true,
        allowTaint: true
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Verdict-${formData.bizName.replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF generation failed. Please try again.");
    }
  };

  const renderText = (text: string) => {
    if (!text) return null;
    
    return text.split('\n').map((line, i) => {
      if (line.includes('[SECTION]')) {
        return (
          <h4 key={i} className="text-yellow-500 font-black text-2xl uppercase mt-12 mb-6 border-b-2 border-yellow-500/20 pb-4">
            {line.replace('[SECTION]', '').trim()}
          </h4>
        );
      }
      
      if (line.includes('[FIX]')) {
        return (
          <div key={i} className="bg-yellow-500/10 border-l-4 border-yellow-500 p-8 my-10 rounded-r-3xl text-white font-bold tracking-tight uppercase shadow-xl">
            STRATEGIC REQUIREMENT: {line.replace('[FIX]', '').trim()}
          </div>
        );
      }
      
      const parts = line.split(/(\[H\].*?|\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="text-white font-black uppercase underline decoration-yellow-500/30">{part.replace(/\*\*/g, '')}</strong>;
        }
        if (part.startsWith('[H]')) {
          return <span key={j} className="text-yellow-500 font-bold">{part.replace('[H]', '')}</span>;
        }
        return part;
      });
      
      return <p key={i} className="mb-6 text-slate-300 leading-relaxed text-base md:text-lg font-medium">{parts}</p>;
    });
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen">
      {step === 1 && (
        <div className="max-w-2xl mx-auto text-center animate-in fade-in duration-500">
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-12">
            Entity <span className="text-yellow-500">Scan</span>
          </h2>
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
            <div className="relative">
              <Building2 className="absolute left-6 top-6 text-slate-700" size={24} />
              <input 
                required 
                className="w-full bg-slate-900 border-2 border-slate-800 p-6 pl-16 rounded-3xl text-white outline-none focus:border-yellow-500 transition-all text-lg" 
                placeholder="Business Name" 
                value={formData.bizName} 
                onChange={e => setFormData({...formData, bizName: e.target.value})} 
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-6 top-6 text-slate-700" size={24} />
              <input 
                required 
                className="w-full bg-slate-900 border-2 border-slate-800 p-6 pl-16 rounded-3xl text-white outline-none focus:border-yellow-500 transition-all text-lg" 
                placeholder="City" 
                value={formData.location} 
                onChange={e => setFormData({...formData, location: e.target.value})} 
              />
            </div>
            <button type="submit" className="w-full bg-yellow-500 text-slate-950 py-6 rounded-3xl font-black text-xl uppercase shadow-2xl hover:scale-[0.98] transition-transform">
              Next
            </button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-xl mx-auto p-12 border-2 border-slate-800 rounded-[3.5rem] bg-slate-900/40 shadow-2xl animate-in slide-in-from-bottom-5">
          <div className="flex justify-center mb-6">
            <ShieldCheck className="text-yellow-500" size={48} />
          </div>
          <h3 className="text-2xl font-black uppercase text-yellow-500 mb-8 text-center">Secure Your Results</h3>
          <form onSubmit={runAudit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-5 top-5 text-slate-700" size={20} />
              <input 
                required 
                className="w-full bg-slate-950 border-2 border-slate-800 p-5 pl-14 rounded-2xl text-white outline-none focus:border-yellow-500" 
                placeholder="Full Name" 
                value={formData.fullName} 
                onChange={e => setFormData({...formData, fullName: e.target.value})} 
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-5 top-5 text-slate-700" size={20} />
              <input 
                required 
                type="email"
                className="w-full bg-slate-950 border-2 border-slate-800 p-5 pl-14 rounded-2xl text-white outline-none focus:border-yellow-500" 
                placeholder="Business Email" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-5 top-5 text-slate-700" size={20} />
              <input 
                required 
                className="w-full bg-slate-950 border-2 border-slate-800 p-5 pl-14 rounded-2xl text-white outline-none focus:border-yellow-500" 
                placeholder="WhatsApp Number" 
                value={formData.whatsapp} 
                onChange={e => setFormData({...formData, whatsapp: e.target.value})} 
              />
            </div>
            <button 
              disabled={loading} 
              className="w-full bg-yellow-500 text-slate-950 py-6 rounded-2xl font-black uppercase shadow-xl hover:bg-white transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {loadingText}
                </>
              ) : (
                "Initiate Critical Audit"
              )}
            </button>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="animate-in fade-in duration-1000">
          <div className="bg-yellow-500 p-10 rounded-[3rem] mb-16 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-3 text-center md:text-left max-w-xl">
              <h3 className="text-4xl font-black uppercase tracking-tight italic">Verdict: Established</h3>
              <p className="font-bold text-lg leading-tight">
                Report sent to {formData.email}. Download your PDF or discuss your score on WhatsApp.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 relative z-10">
              <button 
                onClick={downloadPDF} 
                className="bg-slate-950 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs hover:scale-105 transition-transform flex items-center gap-2 shadow-2xl"
              >
                <Download size={20} /> Download PDF
              </button>
              <a 
                href={getWhatsAppLink()} 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs hover:scale-105 transition-transform flex items-center gap-2 shadow-2xl"
              >
                <MessageCircle size={20} fill="currentColor" /> WhatsApp Thabo
              </a>
            </div>
          </div>

          <div ref={reportRef} className="p-12 md:p-20 border-2 border-slate-800 rounded-[4rem] bg-slate-900/40 relative shadow-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 border-b-2 border-slate-800 pb-12 gap-8">
              <div className="space-y-1">
                <h3 className="text-yellow-500 font-black uppercase tracking-[0.5em] text-[10px]">Smart Marketing // Strategic Analysis</h3>
                <h4 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">{formData.bizName}</h4>
                <p className="text-slate-500 font-black uppercase tracking-widest flex items-center gap-2 text-xs italic">
                  <MapPin size={14} /> {formData.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Survival Score</p>
                <p className="text-6xl font-black text-yellow-500 leading-none">{score}<span className="text-lg text-slate-700">/100</span></p>
              </div>
            </div>
            
            <div className="max-w-4xl">{renderText(result)}</div>
            
            <div className="mt-32 p-16 bg-yellow-500 rounded-[3rem] text-slate-950 text-center relative overflow-hidden shadow-2xl">
              <h4 className="text-5xl font-black uppercase mb-6 leading-tight">Close the Gaps</h4>
              <p className="font-bold text-xl mb-12 italic opacity-90 max-w-xl mx-auto underline decoration-black/20">
                Mend your entity architecture before the 2026 filter solidifies. Secure your call with Thabo today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a 
                  href="https://calendly.com/motsumitl/30min" 
                  className="bg-slate-950 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-105 transition-all shadow-2xl"
                >
                  Schedule Call
                </a>
                <a 
                  href={getWhatsAppLink()} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-105 transition-all shadow-2xl"
                >
                  Message Thabo
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
