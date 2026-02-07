import { useState, useRef } from 'react';
import { db, callHunterAI } from '../firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Search, Loader2, ShieldCheck, Mail, Phone, User, Download, Calendar, ArrowRight } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Audit() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const reportRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    bizName: "",
    fullName: "",
    email: "",
    whatsapp: ""
  });

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const runAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // THE PAIN-POINT PROMPT
    const prompt = `
      PERFORM A CRITICAL DIGITAL AUDIT FOR: "${formData.bizName}".
      FOCUS: Local SEO, AEO (Answer Engine Optimization), and LLM/AI Visibility.
      
      STRUCTURE YOUR RESPONSE AS FOLLOWS:
      1. THE GHOST EFFECT (Pain points regarding Local Search & Maps).
      2. THE AUTHORITY GAP (Pain points regarding AI/LLM recommendations).
      3. THE CONVERSION LEAK (Pain points regarding website and automation).
      4. 2026 SURVIVAL SCORE (0-100).
      
      FORMATTING RULES:
      - Use clear, spaced-out paragraphs.
      - Use **BOLD CAPITAL LETTERS** for critical failures.
      - Use [HIGHLIGHT] for high-priority actions.
      - Be direct and provocative. Focus ONLY on what they are lacking.
    `;

    try {
      const aiResponse = await callHunterAI(prompt);
      setResult(aiResponse);

      // SAVE LEAD & TRIGGER EMAIL (Using Firebase 'mail' collection logic)
      if (db) {
        await addDoc(collection(db, "mail"), {
          to: formData.email,
          message: {
            subject: `⚠️ URGENT: Entity Audit Report for ${formData.bizName}`,
            html: `
              <div style="font-family: sans-serif; color: #333;">
                <h2>Digital Entity Audit Result</h2>
                <p>Hi ${formData.fullName},</p>
                <p>Your audit for <strong>${formData.bizName}</strong> is complete.</p>
                <div style="background: #f8f8f8; padding: 20px; border-left: 4px solid #FACC15;">
                  ${aiResponse.replace(/\n/g, '<br/>')}
                </div>
                <p><strong>Next Step:</strong> Your business is currently being filtered out by smart algorithms.</p>
                <a href="https://calendly.com/motsumitl/30min" style="background: #FACC15; color: #000; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin-top: 20px;">BOOK YOUR RECOVERY CALL</a>
              </div>
            `
          },
          leadData: {
            ...formData,
            timestamp: serverTimestamp()
          }
        });
      }
      setStep(3);
    } catch (err) {
      setResult("SYSTEM OVERLOAD: AI handshake failed. Book directly: https://calendly.com/motsumitl/30min");
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Happy-Hunter-Audit-${formData.bizName}.pdf`);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen">
      
      {/* STEP 1: BUSINESS NAME */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto text-center animate-in fade-in zoom-in duration-500">
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-12">Entity <span className="text-yellow-500">Scan</span></h2>
          <form onSubmit={handleNextStep} className="space-y-6">
            <div className="relative group">
              <input 
                required
                className="w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl outline-none focus:border-yellow-500 transition-all text-lg text-white" 
                placeholder="Business Name & City..." 
                value={formData.bizName} 
                onChange={(e) => setFormData({...formData, bizName: e.target.value})} 
              />
              <button type="submit" className="absolute right-3 top-3 bottom-3 bg-yellow-500 text-slate-950 px-8 rounded-xl font-black flex items-center gap-2 hover:bg-yellow-400">
                NEXT <ArrowRight size={20}/>
              </button>
            </div>
            <p className="text-slate-500 text-xs uppercase font-bold tracking-widest italic">Phase 1: Knowledge Graph Query</p>
          </form>
        </div>
      )}

      {/* STEP 2: CONTACT GATE */}
      {step === 2 && (
        <div className="max-w-xl mx-auto p-10 border border-slate-800 rounded-[3rem] bg-slate-900/40 animate-in slide-in-from-bottom-10 duration-500">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-black uppercase mb-2 text-yellow-500">Secure Your Results</h3>
            <p className="text-slate-400 text-sm">Where should we send your survival strategy?</p>
          </div>
          <form onSubmit={runAudit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-4 text-slate-600" size={18} />
              <input required className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-xl text-white outline-none focus:border-yellow-500" placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-slate-600" size={18} />
              <input required type="email" className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-xl text-white outline-none focus:border-yellow-500" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-4 text-slate-600" size={18} />
              <input required className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-xl text-white outline-none focus:border-yellow-500" placeholder="WhatsApp Number" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
            </div>
            <button disabled={loading} className="w-full bg-yellow-500 text-slate-950 py-5 rounded-xl font-black hover:bg-yellow-400 disabled:opacity-50 flex items-center justify-center gap-3 mt-4">
              {loading ? <Loader2 className="animate-spin" /> : "GENERATE FULL AUDIT"}
            </button>
          </form>
        </div>
      )}

      {/* STEP 3: RESULTS + PDF + CTA */}
      {step === 3 && (
        <div className="animate-in fade-in duration-1000">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
            <div className="text-left">
               <h2 className="text-4xl font-black uppercase text-white">The <span className="text-yellow-500">Verdict</span></h2>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Target: {formData.bizName}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={downloadPDF} className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-700 transition-all text-xs uppercase">
                <Download size={16} /> PDF Report
              </button>
              <a href="https://calendly.com/motsumitl/30min" target="_blank" className="bg-yellow-500 text-slate-950 px-6 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-yellow-400 transition-all text-xs uppercase">
                <Calendar size={16} /> Book Recovery Call
              </a>
            </div>
          </div>

          <div ref={reportRef} className="p-10 border border-slate-800 rounded-[2.5rem] bg-slate-900/40 text-left relative overflow-hidden">
            <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-800/50">
              <ShieldCheck className="text-yellow-500" size={24} />
              <h3 className="text-yellow-500 font-black uppercase tracking-[0.3em] text-xs">Strategic Vulnerability Assessment</h3>
            </div>
            
            {/* AI CONTENT AREA */}
            <div className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-medium space-y-6">
              {result.split('\n').map((para, i) => (
                <p key={i} className={para.startsWith('**') ? 'text-white font-black text-xl mt-8' : ''}>
                  {para.includes('[HIGHLIGHT]') ? (
                    <span className="bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded border border-yellow-500/20">{para.replace('[HIGHLIGHT]', '')}</span>
                  ) : para}
                </p>
              ))}
            </div>

            <div className="mt-20 pt-10 border-t border-slate-800 flex flex-col items-center">
                <p className="text-slate-500 text-xs uppercase font-black tracking-[0.4em] mb-8">End of Transmission</p>
                <div className="p-8 bg-yellow-500 rounded-3xl text-slate-950 w-full text-center">
                  <h4 className="text-3xl font-black uppercase mb-4">Fix Your Entity Architecture</h4>
                  <p className="font-bold mb-8 italic">Your 2026 survival depends on mending these gaps immediately.</p>
                  <a href="https://calendly.com/motsumitl/30min" className="bg-slate-950 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest inline-block hover:scale-105 transition-transform">Schedule Strategy Call</a>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
