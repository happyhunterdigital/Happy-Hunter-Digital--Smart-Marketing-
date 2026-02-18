// src/pages/Audit.tsx
import { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  ShieldCheck, Loader2, Download, ArrowRight,
  Building2, MapPin, User, Mail, Phone, Globe,
  AlertTriangle, CheckCircle, WifiOff
} from 'lucide-react';
import { db, getFirebaseStatus, callFunction } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import emailjs from '@emailjs/browser';

// Types
interface AuditFormData {
  bizName: string;
  location: string;
  fullName: string;
  email: string;
  whatsapp: string;
}

// Initialize EmailJS
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

// Circuit breaker for Gemini
let geminiFailures = 0;
let geminiCircuitOpen = false;
let lastGeminiFailure = 0;
const GEMINI_CIRCUIT_TIMEOUT = 60000;

const checkGeminiCircuit = (): boolean => {
  if (!geminiCircuitOpen) return true;
  if (Date.now() - lastGeminiFailure > GEMINI_CIRCUIT_TIMEOUT) {
    geminiCircuitOpen = false;
    geminiFailures = 0;
    return true;
  }
  return false;
};

// Use Firebase Function instead of direct API call
const runAuditAnalysis = async (bizName: string, location: string): Promise<{ text: string; score: number; error?: string }> => {
  if (!checkGeminiCircuit()) {
    return { text: '', score: 35, error: 'AI service temporarily unavailable. Retry shortly.' };
  }

  try {
    const result = await callFunction<{
      analysis: Array<{ heading: string; content: string; type: string }>;
      score: number;
      rawResponse: string;
      mapsData: any;
    }>('performForensicAudit', { bizName, location });

    // Convert structured analysis back to text format
    const analysisText = result.analysis
      .map(item => `[${item.heading.toUpperCase()}]\n${item.content}`)
      .join('\n\n');

    return { text: analysisText, score: result.score };
  } catch (error: any) {
    geminiFailures++;
    if (geminiFailures >= 3) {
      geminiCircuitOpen = true;
      lastGeminiFailure = Date.now();
    }
    console.error('Audit function error:', error);
    return {
      text: generateFallbackAnalysis(bizName, location),
      score: 35,
      error: error.message
    };
  }
};

// Fallback analysis when AI fails
const generateFallbackAnalysis = (biz: string, loc: string): string =>
  `[SECTION] ENTITY ARCHITECTURE
Your business "${biz}" in ${loc} requires immediate digital verification. Without an optimized Google Business Profile, you are INVISIBLE to local search algorithms.

[SECTION] TRUST SIGNALS
No review velocity detected. Competitors are capturing market trust while you remain digitally silent.

[SECTION] DISCOVERY MECHANICS
ZERO AI search readiness detected. ChatGPT, Gemini, and Perplexity cannot recommend your business.

[SECTION] CONVERSION ARCHITECTURE
Lead capture mechanisms: ABSENT. Every day without optimization costs approximately 3-7 high-intent leads.

[FIX] IMMEDIATE ACTION REQUIRED: Schedule Entity Recovery Protocol with Happy Hunter Digital.
FINAL_SCORE: 35`;

export default function Audit() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Initializing...');
  const [error, setError] = useState<string | null>(null);
  const firebaseStatus = getFirebaseStatus();

  const [formData, setFormData] = useState<AuditFormData>({
    bizName: '',
    location: '',
    fullName: '',
    email: '',
    whatsapp: '',
  });

  const [analysis, setAnalysis] = useState('');
  const [score, setScore] = useState<number>(0);
  const [emailSent, setEmailSent] = useState(false);

  const validateStep1 = () => {
    if (formData.bizName.trim().length < 2) return 'Business name required (min 2 characters)';
    if (formData.location.trim().length < 2) return 'Location required (min 2 characters)';
    return null;
  };

  const validateStep2 = () => {
    if (formData.fullName.trim().length < 2) return 'Full name required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Valid email required';
    const phoneDigits = formData.whatsapp.replace(/\D/g, '');
    if (phoneDigits.length < 10) return 'Valid WhatsApp number required (min 10 digits)';
    return null;
  };

  const proceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateStep1();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep(2);
  };

  const runAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateStep2();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Stage 1: AI Analysis via Firebase Function
      setLoadingText('Querying Smart Marketing Graph...');
      const result = await runAuditAnalysis(formData.bizName, formData.location);
      
      let finalAnalysis: string;
      let finalScore: number;

      if (result.error && !result.text) {
        finalAnalysis = generateFallbackAnalysis(formData.bizName, formData.location);
        finalScore = 35;
      } else {
        finalAnalysis = result.text;
        finalScore = result.score;
      }

      setAnalysis(finalAnalysis);
      setScore(finalScore);

      // Stage 2: Save to Firebase (best effort - don't block on failure)
      setLoadingText('Securing intelligence...');
      if (db) {
        try {
          await addDoc(collection(db, 'audits'), {
            ...formData,
            analysis: finalAnalysis,
            score: finalScore,
            timestamp: serverTimestamp(),
            source: window.location.href,
            userAgent: navigator.userAgent,
          });
        } catch (e) {
          console.log('Firebase save failed (non-critical):', e);
        }
      }

      // Stage 3: Send email (best effort)
      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID) {
        try {
          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
              to_name: formData.fullName,
              to_email: formData.email,
              business_name: formData.bizName,
              audit_content: finalAnalysis.substring(0, 500),
              score: finalScore.toString(),
            }
          );
          setEmailSent(true);
        } catch (e) {
          console.log('Email failed (non-critical):', e);
        }
      }

      setStep(3);
    } catch (err: any) {
      setError(err.message || 'System malfunction. Contact hello@happyhunterdigital.com');
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
        logging: false,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${formData.bizName.replace(/\s+/g, '_')}_Strategic_Audit.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed. Please screenshot the report.');
    }
  };

  const renderAnalysis = (text: string) => {
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith('[SECTION]')) {
        return (
          <h4 key={i} className="text-yellow-500 font-black text-base sm:text-lg uppercase mt-6 mb-3 border-b border-yellow-500/20 pb-2">
            {trimmed.replace('[SECTION]', '').trim()}
          </h4>
        );
      }
      if (trimmed.startsWith('[FIX]')) {
        return (
          <div key={i} className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 my-4 text-white text-sm font-bold rounded-r-lg">
            <AlertTriangle className="inline mr-2 text-yellow-500" size={16} />
            {trimmed.replace('[FIX]', '').trim()}
          </div>
        );
      }

      // Highlight ALL CAPS words
      const parts = trimmed.split(/(\b[A-Z]{3,}\b)/g);
      return (
        <p key={i} className="mb-3 text-slate-300 text-sm leading-relaxed">
          {parts.map((part, j) =>
            /^[A-Z]{3,}$/.test(part) ? (
              <span key={j} className="text-yellow-500 font-black">{part}</span>
            ) : part
          )}
        </p>
      );
    });
  };

  return (
    <div className="pt-24 sm:pt-32 pb-20 px-4 sm:px-6 max-w-6xl mx-auto min-h-screen">
      {/* Firebase Status Warning */}
      {!firebaseStatus.initialized && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center gap-3 text-yellow-500">
          <WifiOff size={20} />
          <span className="text-sm font-bold">
            Offline Mode: Audit will generate but data won't persist. Contact support if this persists.
          </span>
        </div>
      )}

      {/* Progress */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex items-center ${s !== 3 ? 'gap-2' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${
                step >= s ? 'bg-yellow-500 text-slate-950' : 'bg-slate-800 text-slate-500'
              }`}>
                {step > s ? <CheckCircle size={16} /> : s}
              </div>
              {s !== 3 && (
                <div className={`w-8 h-1 ${step > s ? 'bg-yellow-500' : 'bg-slate-800'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="max-w-xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-center text-sm">
          <AlertTriangle className="inline mr-2" size={16} />
          {error}
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <div className="max-w-xl mx-auto text-center animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            Entity <span className="text-yellow-500">Scan</span>
          </h2>
          <p className="text-slate-400 mb-8 text-sm sm:text-base">
            Forensic analysis of your digital footprint. No obligation.
          </p>
          <form onSubmit={proceedToStep2} className="space-y-4">
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                className="w-full bg-slate-900 border border-slate-800 pl-12 pr-4 py-4 rounded-xl text-white outline-none focus:border-yellow-500 transition-colors text-sm sm:text-base"
                placeholder="Business Name"
                value={formData.bizName}
                onChange={e => setFormData({ ...formData, bizName: e.target.value })}
                maxLength={100}
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                className="w-full bg-slate-900 border border-slate-800 pl-12 pr-4 py-4 rounded-xl text-white outline-none focus:border-yellow-500 transition-colors text-sm sm:text-base"
                placeholder="City / Location"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                maxLength={100}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 text-slate-950 py-4 rounded-xl font-black uppercase hover:bg-yellow-400 flex items-center justify-center gap-2 transition-colors"
            >
              Proceed <ArrowRight size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="max-w-md mx-auto p-6 sm:p-8 border border-slate-800 rounded-3xl bg-slate-900/40">
          <ShieldCheck className="mx-auto text-yellow-500 mb-4" size={40} />
          <h3 className="text-lg sm:text-xl font-black uppercase text-white text-center mb-6">
            Secure Your Results
          </h3>
          <form onSubmit={runAudit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                className="w-full bg-slate-950 border border-slate-800 pl-10 pr-4 py-3 rounded-lg text-white text-sm outline-none focus:border-yellow-500"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                maxLength={100}
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="email"
                className="w-full bg-slate-950 border border-slate-800 pl-10 pr-4 py-3 rounded-lg text-white text-sm outline-none focus:border-yellow-500"
                placeholder="Email Address"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                className="w-full bg-slate-950 border border-slate-800 pl-10 pr-4 py-3 rounded-lg text-white text-sm outline-none focus:border-yellow-500"
                placeholder="WhatsApp Number"
                value={formData.whatsapp}
                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-yellow-500 text-slate-950 py-4 rounded-xl font-black uppercase disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <><Loader2 className="animate-spin" /> {loadingText}</>
              ) : (
                'Execute Analysis'
              )}
            </button>
          </form>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="animate-fade-in">
          <div className="bg-yellow-500 p-4 sm:p-6 rounded-2xl mb-6 text-slate-950 text-center">
            <h3 className="text-xl sm:text-2xl font-black uppercase mb-2">Verdict Ready</h3>
            {emailSent && (
              <p className="text-xs sm:text-sm font-bold mb-4 opacity-80">
                ✓ Report emailed to {formData.email}
              </p>
            )}
            <button
              onClick={downloadPDF}
              className="bg-slate-950 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 mx-auto hover:scale-105 transition-transform"
            >
              <Download size={16} /> Download PDF
            </button>
          </div>
          
          <div ref={reportRef} className="p-4 sm:p-8 border border-slate-800 rounded-3xl bg-slate-900/40">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 sm:mb-8 border-b border-slate-800 pb-6 gap-4">
              <div>
                <div className="text-yellow-500 text-xs font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Globe size={12} /> Strategic Audit
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-white uppercase">{formData.bizName}</h4>
                <p className="text-slate-500 text-sm">{formData.location}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs text-slate-500 uppercase font-bold">Entity Score</p>
                <p className="text-4xl sm:text-5xl font-black text-yellow-500">
                  {score}<span className="text-lg text-slate-600">/100</span>
                </p>
              </div>
            </div>
            
            <div className="max-w-3xl">
              {renderAnalysis(analysis)}
            </div>
            
            <div className="mt-8 sm:mt-12 p-6 sm:p-8 bg-yellow-500 rounded-2xl text-slate-950 text-center">
              <h4 className="text-xl sm:text-2xl font-black uppercase mb-4">Mend Your Architecture</h4>
              <a
                href="https://calendly.com/motsumitl/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-slate-950 text-white px-6 sm:px-8 py-3 rounded-xl font-black text-xs sm:text-sm uppercase hover:bg-white hover:text-slate-950 transition-colors"
              >
                Schedule Recovery Call
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
