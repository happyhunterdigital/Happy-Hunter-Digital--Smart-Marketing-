import { useState, useRef } from 'react';
import { db, performAuditAnalysis } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Loader2, 
  Download, 
  Building2, 
  MapPin, 
  Globe,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface FormData {
  bizName: string;
  location: string;
  fullName: string;
  email: string;
  whatsapp: string;
}

export default function Audit() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing...");
  const [result, setResult] = useState<string>("");
  const [score, setScore] = useState<string>("??");
  const [error, setError] = useState<string | null>(null);
  
  const reportRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState<FormData>({ 
    bizName: "", 
    location: "", 
    fullName: "", 
    email: "", 
    whatsapp: "" 
  });

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStep(2);
  };

  const runAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLoadingText("Connecting to Google Maps...");
    
    try {
      console.log("[Audit] Starting audit process...");
      
      const aiResponse = await performAuditAnalysis(
        formData.bizName, 
        formData.location
      );
      
      console.log("[Audit] AI Response received, length:", aiResponse.length);
      
      // Extract score
      const scoreMatch = aiResponse.match(/FINAL_SCORE:\s*(\d+)/);
      const extractedScore = scoreMatch ? scoreMatch[1] : "??";
      
      setScore(extractedScore);
      setResult(aiResponse.replace(/FINAL_SCORE:\s*\d+/, '').trim());

      // Save to Firebase if we have a valid score
      if (db && extractedScore !== "??") {
        try {
          await addDoc(collection(db, "leads"), { 
            ...formData, 
            analysis: aiResponse, 
            timestamp: serverTimestamp(), 
            score: extractedScore 
          });
          console.log("[Audit] Saved to Firebase");
        } catch (fbErr) {
          console.error("[Audit] Firebase save failed:", fbErr);
          // Don't fail the audit if Firebase save fails
        }
      }
      
      setStep(3);
      
    } catch (err: any) {
      console.error("[Audit] Error:", err);
      setError(err.message || "Audit failed. Please try again.");
      setResult(`SYSTEM ERROR: ${err.message}`);
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    
    try {
      const canvas = await html2canvas(reportRef.current, { 
        scale: 2, 
        backgroundColor: '#020617',
        logging: false
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Strategic-Audit-${formData.bizName.replace(/\s+/g, '-')}.pdf`);
      
    } catch (err) {
      console.error("[Audit] PDF generation failed:", err);
      alert("PDF generation failed. Please try again.");
    }
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderAnalysisText = (text: string) => {
    if (!text) return <p className="text-slate-400">No analysis available.</p>;

    return text.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) return null;
      
      if (trimmedLine.includes('[SECTION]')) {
        return (
          <h4 
            key={index} 
            className="text-yellow-500 font-black text-xl md:text-2xl uppercase mt-10 mb-4 border-b-2 border-yellow-500/20 pb-2"
          >
            {trimmedLine.replace('[SECTION]', '').trim()}
          </h4>
        );
      }
      
      if (trimmedLine.includes('[FIX]')) {
        return (
          <div 
            key={index} 
            className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 my-6 text-white font-bold shadow-lg"
          >
            <span className="text-yellow-500 uppercase text-sm tracking-wider">Action Required:</span>
            <p className="mt-1">{trimmedLine.replace('[FIX]', '').trim()}</p>
          </div>
        );
      }
      
      if (trimmedLine.includes('[H]')) {
        return (
          <p key={index} className="mb-3 text-white font-bold">
            {trimmedLine.split(/(\[H\].*?\[\/H\])/).map((part, i) => {
              if (part.startsWith('[H]') && part.endsWith('[/H]')) {
                return <span key={i} className="text-yellow-500">{part.slice(3, -4)}</span>;
              }
              if (part.startsWith('[H]')) {
                return <span key={i} className="text-yellow-500">{part.replace('[H]', '')}</span>;
              }
              return <span key={i}>{part}</span>;
            })}
          </p>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="mb-4 text-slate-300 leading-relaxed text-base md:text-lg">
          {trimmedLine}
        </p>
      );
    }).filter(Boolean);
  };

  // Step 1: Business Info
  if (step === 1) {
    return (
      <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl lg:text-9xl font-black uppercase tracking-tighter mb-8">
            Entity <span className="text-yellow-500">Scan</span>
          </h2>
          <p className="text-slate-400 mb-12 text-lg">
            Real-time Google Maps intelligence + AI-powered forensic analysis
          </p>
          
          <form onSubmit={handleStep1Submit} className="space-y-4">
            <div className="relative">
              <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={24}/>
              <input 
                required 
                type="text"
                className="w-full bg-slate-900 border-2 border-slate-800 p-6 pl-16 rounded-3xl text-white outline-none focus:border-yellow-500 transition-all text-lg placeholder:text-slate-600" 
                placeholder="Business Name (e.g., Skubalisto)" 
                value={formData.bizName} 
                onChange={e => updateFormData('bizName', e.target.value)} 
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={24}/>
              <input 
                required 
                type="text"
                className="w-full bg-slate-900 border-2 border-slate-800 p-6 pl-16 rounded-3xl text-white outline-none focus:border-yellow-500 transition-all text-lg placeholder:text-slate-600" 
                placeholder="City (e.g., Cape Town)" 
                value={formData.location} 
                onChange={e => updateFormData('location', e.target.value)} 
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-yellow-500 text-slate-950 py-6 rounded-3xl font-black text-xl uppercase hover:scale-[0.98] active:scale-[0.96] transition-transform shadow-lg shadow-yellow-500/20"
            >
              Initiate Forensic Search
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Step 2: Contact Info
  if (step === 2) {
    return (
      <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen">
        <div className="max-w-xl mx-auto p-8 md:p-12 border-2 border-slate-800 rounded-[3rem] bg-slate-900/40 shadow-2xl">
          <h3 className="text-2xl md:text-3xl font-black uppercase text-yellow-500 mb-2 text-center">
            Secure Your Results
          </h3>
          <p className="text-slate-400 text-center mb-8 text-sm">
            Enter your details to receive the full forensic report
          </p>
          
          <form onSubmit={runAudit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Full Name
              </label>
              <input 
                required 
                type="text"
                className="w-full bg-slate-950 border-2 border-slate-800 p-5 rounded-2xl text-white outline-none focus:border-yellow-500 transition-all" 
                placeholder="John Doe" 
                value={formData.fullName} 
                onChange={e => updateFormData('fullName', e.target.value)} 
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Business Email
              </label>
              <input 
                required 
                type="email" 
                className="w-full bg-slate-950 border-2 border-slate-800 p-5 rounded-2xl text-white outline-none focus:border-yellow-500 transition-all" 
                placeholder="john@company.com" 
                value={formData.email} 
                onChange={e => updateFormData('email', e.target.value)} 
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                WhatsApp Number
              </label>
              <input 
                required 
                type="tel"
                className="w-full bg-slate-950 border-2 border-slate-800 p-5 rounded-2xl text-white outline-none focus:border-yellow-500 transition-all" 
                placeholder="+27 82 123 4567" 
                value={formData.whatsapp} 
                onChange={e => updateFormData('whatsapp', e.target.value)} 
              />
            </div>
            
            <button 
              disabled={loading} 
              className="w-full bg-yellow-500 text-slate-950 py-6 rounded-2xl font-black uppercase text-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-yellow-500/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <Loader2 className="animate-spin" size={24}/> 
                  {loadingText}
                </span>
              ) : "Generate Forensic Audit"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Step 3: Results
  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen">
      {/* Success Banner */}
      <div className="bg-yellow-500 p-8 md:p-10 rounded-[3rem] mb-12 text-slate-950 text-center shadow-2xl">
        <div className="flex items-center justify-center gap-3 mb-4">
          <CheckCircle size={32} className="text-slate-950"/>
          <h3 className="text-2xl md:text-4xl font-black uppercase italic">
            Forensic Verdict Ready
          </h3>
        </div>
        <p className="font-bold text-lg mb-6">
          Report sent to <span className="underline decoration-slate-950/30">{formData.email}</span>
        </p>
        <button 
          onClick={downloadPDF} 
          className="bg-slate-950 text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform flex items-center gap-3 mx-auto shadow-xl"
        >
          <Download size={20}/> 
          Download PDF Report
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-8 p-6 bg-red-500/10 border-2 border-red-500/30 rounded-2xl flex items-center gap-4">
          <AlertCircle className="text-red-500 flex-shrink-0" size={24}/>
          <div>
            <p className="text-red-500 font-bold uppercase text-sm tracking-wider">System Error</p>
            <p className="text-slate-300">{error}</p>
          </div>
        </div>
      )}

      {/* Report Content */}
      <div 
        ref={reportRef} 
        className="p-8 md:p-16 lg:p-20 border-2 border-slate-800 rounded-[4rem] bg-slate-900/40 shadow-2xl"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b-2 border-slate-800 pb-8 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-yellow-500">
              <Globe size={16}/>
              <span className="font-black uppercase tracking-[0.3em] text-[10px]">
                Forensic Protocol Analysis
              </span>
            </div>
            <h4 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
              {formData.bizName}
            </h4>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
              {formData.location}
            </p>
          </div>
          
          <div className="text-left md:text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
              Survival Score
            </p>
            <p className="text-5xl md:text-7xl font-black text-yellow-500 leading-none">
              {score}<span className="text-xl md:text-2xl text-slate-600">/100</span>
            </p>
          </div>
        </div>

        {/* Analysis Content */}
        <div className="max-w-4xl">
          {renderAnalysisText(result)}
        </div>

        {/* CTA Footer */}
        <div className="mt-16 md:mt-24 p-12 md:p-16 bg-yellow-500 rounded-[3rem] text-slate-950 text-center">
          <h4 className="text-3xl md:text-5xl font-black uppercase mb-4 leading-tight">
            Mend Your Architecture
          </h4>
          <p className="font-bold text-lg md:text-xl mb-8 italic opacity-90 max-w-2xl mx-auto">
            Book your recovery strategy session with Thabo Leslie Motsumi
          </p>
          <a 
            href="https://calendly.com/motsumitl/30min" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-slate-950 text-white px-12 md:px-16 py-5 md:py-6 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white hover:text-slate-950 transition-all shadow-2xl"
          >
            Schedule Strategy Call
          </a>
        </div>
      </div>
    </div>
  );
}
