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
            subject: `Entity Audit: ${formData.bizName}`,
            html: `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:40px;">
                    <div style="background:#facc15;padding:30px;margin:-40px -40px 30px;text-align:center;">
                      <h1 style="color:#020617;margin:0;font-size:28px;font-weight:900;text-transform:uppercase;letter-spacing:-1px;">Smart Marketing</h1>
                      <p style="color:#020617;margin:5px 0 0;font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Confidential Entity Audit</p>
                    </div>
                    <h2 style="color:#facc15;font-size:20px;margin-bottom:10px;">Prepared for ${formData.fullName}</h2>
                    <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin-bottom:20px;">
                      Strategic analysis for <strong style="color:#fff;">${formData.bizName}</strong> (${formData.location})
                    </p>
                    <div style="background:#1e293b;border-left:4px solid #facc15;padding:20px;margin:20px 0;font-size:13px;line-height:1.8;color:#cbd5e1;">
                      ${aiResponse.replace(/\n/g, '<br>')}
                    </div>
                    <div style="text-align:center;margin:30px 0;">
                      <a href="https://calendly.com/motsumitl/30min" 
                         style="display:inline-block;background:#facc15;color:#020617;padding:18px 36px;text-decoration:none;font-weight:800;border-radius:8px;text-transform:uppercase;font-size:13px;letter-spacing:1px;">
                        Schedule Strategy Session
                      </a>
                    </div>
                    <p style="color:#64748b;font-size:11px;text-align:center;margin-top:30px;border-top:1px solid #1e293b;padding-top:20px;">
                      This document is confidential and prepared exclusively for ${formData.fullName}.<br>
                      Smart Marketing | happyhunterdigital.com
                    </p>
                   </div>`
          }
        });
      }
      
      setStep(3);
    } catch (err) {
      setResult("SYSTEM_ERROR: Audit generation failed.");
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
    pdf.save(`SmartMarketing-Audit-${formData.bizName.replace(/\s+/g, '-')}.pdf`);
  };

  const renderFormattedText = (text: string) => {
    if (!text) return null;
    
    return text.split('\n').map((line, i) => {
      // Section headers - elite typography
      if (line.includes('[SECTION]')) {
        return (
          <div key={i} className="mt-16 mb-6 first:mt-0">
            <h4 className="text-yellow-500 font-black text-xl uppercase tracking-tight border-b-2 border-yellow-500/30 pb-3">
              {line.replace('[SECTION]', '').trim()}
            </h4>
          </div>
        );
      }
      
      // Subheaders - refined
      if (line.startsWith('[H]')) {
        return (
          <h5 key={i} className="text-slate-200 font-bold text-lg mt-8 mb-3 tracking-wide">
            {line.replace('[H]', '').trim()}
          </h5>
        );
      }
      
      // Metrics - highlighted with yellow
      if (line.includes('[METRIC]')) {
        const cleanLine = line.replace('[METRIC]', '').trim();
        // Split on first colon to separate label from value
        const colonIndex = cleanLine.indexOf(':');
        if (colonIndex > -1) {
          const label = cleanLine.substring(0, colonIndex + 1);
          const value = cleanLine.substring(colonIndex + 1);
          return (
            <div key={i} className="flex items-baseline gap-2 mb-2 text-sm">
              <span className="text-slate-400 font-medium">{label}</span>
              <span className="text-yellow-500 font-black">{value}</span>
            </div>
          );
        }
        return <div key={i} className="text-yellow-500 font-black text-sm mb-2">{cleanLine}</div>;
      }
      
      // Fix/Action boxes - elevated styling
      if (line.includes('[FIX]')) {
        const content = line.replace('[FIX]', '').trim();
        return (
          <div key={i} className="bg-yellow-500/10 border-l-4 border-yellow-500 p-5 my-6 rounded-r-xl">
            <div className="text-yellow-500 font-black uppercase text-xs tracking-widest mb-2">
              Strategic Requirement
            </div>
            <p className="text-slate-200 font-semibold text-sm leading-relaxed">{content}</p>
          </div>
        );
      }
      
      // Regular text - clean, no asterisks
      return (
        <p key={i} className="mb-4 text-slate-400 leading-relaxed text-sm">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {step > 1 && (
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4">
              {[1, 2, 3].map((s, idx) => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${step >= s ? 'bg-yellow-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                    {s}
                  </div>
                  {idx < 2 && (
                    <div className="w-12 h-1 bg-slate-800 mx-2">
                      <div className={`h-full bg-yellow-500 transition-all duration-500 ${step > s ? 'w-full' : 'w-0'}`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="max-w-2xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10">
              <span className="text-yellow-500 font-bold uppercase tracking-[0.3em] text-xs">Smart Marketing Intelligence</span>
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mt-4 mb-6">
                Entity <span className="text-yellow-500">Scan</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-lg mx-auto">
                Confidential strategic analysis revealing why AI systems cannot find your business.
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); if(formData.bizName && formData.location) setStep(2); }} className="space-y-5">
              <div className="relative group">
                <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-yellow-500 transition-colors" size={22} />
                <input 
                  required
                  className="w-full bg-slate-900 border-2 border-slate-800 p-6 pl-14 rounded-2xl outline-none focus:border-yellow-500 transition-all text-lg text-white placeholder:text-slate-600" 
                  placeholder="Business Name"
                  value={formData.bizName} 
                  onChange={(e) => setFormData({...formData, bizName: e.target.value})}
                />
              </div>
              
              <div className="relative group">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-yellow-500 transition-colors" size={22} />
                <input 
                  required
                  className="w-full bg-slate-900 border-2 border-slate-800 p-6 pl-14 rounded-2xl outline-none focus:border-yellow-500 transition-all text-lg text-white placeholder:text-slate-600" 
                  placeholder="City / Location"
                  value={formData.location} 
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-yellow-500 text-slate-950 p-6 rounded-2xl font-black uppercase tracking-widest text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-yellow-500/20 flex items-center justify-center gap-3"
              >
                Begin Analysis
                <ArrowRight size={20} />
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-500">
            <div className="p-10 md:p-12 border-2 border-slate-800 rounded-[2.5rem] bg-slate-900/50 backdrop-blur-sm shadow-2xl">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="text-yellow-500" size={32} />
                </div>
                <h3 className="text-3xl font-black uppercase text-white mb-2">Secure Your Report</h3>
                <p className="text-slate-400">Receive the confidential strategic analysis.</p>
              </div>

              <form onSubmit={runAudit} className="space-y-5">
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-yellow-500 transition-colors" size={20} />
                  <input 
                    required 
                    className="w-full bg-slate-950 border-2 border-slate-800 p-5 pl-14 rounded-2xl text-white outline-none focus:border-yellow-500 transition-all placeholder:text-slate-600" 
                    placeholder="Full Name"
                    value={formData.fullName} 
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>

                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-yellow-500 transition-colors" size={20} />
                  <input 
                    required 
                    type="email"
                    className="w-full bg-slate-950 border-2 border-slate-800 p-5 pl-14 rounded-2xl text-white outline-none focus:border-yellow-500 transition-all placeholder:text-slate-600" 
                    placeholder="Business Email"
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="relative group">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-yellow-500 transition-colors" size={20} />
                  <input 
                    required 
                    type="tel"
                    className="w-full bg-slate-950 border-2 border-slate-800 p-5 pl-14 rounded-2xl text-white outline-none focus:border-yellow-500 transition-all placeholder:text-slate-600" 
                    placeholder="WhatsApp Number"
                    value={formData.whatsapp} 
                    onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                  />
                </div>

                <button 
                  disabled={loading} 
                  className="w-full bg-yellow-500 text-slate-950 py-6 rounded-2xl font-black uppercase tracking-widest text-lg shadow-xl shadow-yellow-500/10 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 mt-6"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Initiate Audit
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>

                <p className="text-center text-slate-600 text-xs mt-4">
                  Confidential analysis delivered via email and secure PDF.
                </p>
              </form>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in duration-1000">
            <div className="bg-yellow-500 p-8 rounded-[2rem] mb-12 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-yellow-500/20">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-3xl font-black uppercase leading-none">Analysis Complete</h3>
                <p className="font-bold text-sm opacity-80">Delivered to {formData.email}</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={downloadPDF} 
                  className="bg-slate-950 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-3 hover:bg-slate-800 transition-all"
                >
                  <Download size={20}/> Download PDF
                </button>
                <a 
                  href="https://calendly.com/motsumitl/30min"
                  className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-3 hover:bg-slate-200 transition-all"
                >
                  Schedule Call
                </a>
              </div>
            </div>

            <div ref={reportRef} className="p-12 md:p-20 border-2 border-slate-800 rounded-[3rem] bg-slate-900/30 relative shadow-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 pb-12 border-b-2 border-slate-800 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-yellow-500 font-black uppercase tracking-[0.3em] text-xs">
                    <ShieldCheck size={16} />
                    Confidential Strategic Analysis
                  </div>
                  <h4 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">
                    {formData.bizName}
                  </h4>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                    <MapPin size={14} /> {formData.location}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-6xl font-black text-yellow-500">2025</div>
                  <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">Entity Assessment</div>
                </div>
              </div>

              <div className="max-w-4xl mx-auto">
                {renderFormattedText(result)}
              </div>

              <div className="mt-24 p-16 bg-yellow-500 rounded-[2.5rem] text-slate-950 text-center relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="text-4xl md:text-5xl font-black uppercase mb-6 leading-tight">
                    Recover Your Visibility
                  </h4>
                  <p className="font-bold text-lg mb-12 max-w-2xl mx-auto opacity-90">
                    South African consumers are finding your competitors. Reclaim your market position.
                  </p>
                  <a 
                    href="https://calendly.com/motsumitl/30min" 
                    className="inline-block bg-slate-950 text-white px-12 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-white hover:text-slate-950 transition-all shadow-2xl"
                  >
                    Schedule Strategy Session
                  </a>
                </div>
                
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute top-10 left-10 w-32 h-32 border-4 border-slate-950 rounded-full" />
                  <div className="absolute bottom-10 right-10 w-48 h-48 border-4 border-slate-950 rounded-full" />
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-800 flex justify-between items-center text-slate-600 text-sm">
                <div className="font-bold uppercase tracking-widest">Smart Marketing</div>
                <div className="font-medium">Confidential • Prepared for {formData.fullName}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
