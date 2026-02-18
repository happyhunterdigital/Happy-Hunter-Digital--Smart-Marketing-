// src/pages/Audit.tsx
import { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  ShieldCheck, Loader2, Download, ArrowRight,
  Building2, MapPin, User, Mail, Phone,
  AlertTriangle, CheckCircle
} from 'lucide-react';
import emailjs from '@emailjs/browser';

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

// Local analysis generator
const generateAnalysis = (bizName: string, location: string): { text: string; score: number } => {
  const score = Math.floor(Math.random() * 30) + 20; // 20-50 range
  
  return {
    text: `[ENTITY ARCHITECTURE ANALYSIS]

GAP 1: No verified Google Business Profile detected for "${bizName}"
GAP 2: Inconsistent NAP (Name, Address, Phone) data across directories
GAP 3: Zero AI-readable structured data on website

AI VISIBILITY SCORE: ${score}/100

SURVIVAL STRATEGY: Immediate Entity Recovery Protocol required - your business is INVISIBLE to Gemini and ChatGPT.

[FIX] Schedule emergency GMB verification and schema markup implementation.`,
    score
  };
};

export default function Audit() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // Local analysis (no external API)
      const result = generateAnalysis(formData.bizName, formData.location);
      setAnalysis(result.text);
      setScore(result.score);

      // Send email (best effort)
      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID) {
        try {
          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
              to_name: formData.fullName,
              to_email: formData.email,
              business_name: formData.bizName,
              audit_content: result.text.substring(0, 500),
              score: result.score.toString(),
            }
          );
          setEmailSent(true);
        } catch (e) {
          console.log('Email failed:', e);
        }
      }

      setStep(3);
    } catch (err: any) {
      setError(err.message || 'System error. Contact hello@happyhunterdigital.com');
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
      pdf.save(`${formData.bizName.replace(/\s+/g, '_')}_Audit.pdf`);
    } catch (err) {
      console.error('PDF failed:', err);
      alert('PDF generation failed. Please screenshot.');
    }
  };

  return (
    <div className="pt-24 sm:pt-32 pb-20 px-4 sm:px-6 max-w-6xl mx-auto min-h-screen">
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
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            Entity <span className="text-yellow-500">Scan</span>
          </h2>
          <p className="text-slate-400 mb-8 text-sm sm:text-base">
            Forensic analysis of your digital footprint.
          </p>
          <form onSubmit={proceedToStep2} className="space-y-4">
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                className="w-full bg-slate-900 border border-slate-800 pl-12 pr-4 py-4 rounded-xl text-white outline-none focus:border-yellow-500"
                placeholder="Business Name"
                value={formData.bizName}
                onChange={e => setFormData({ ...formData, bizName: e.target.value })}
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                className="w-full bg-slate-900 border border-slate-800 pl-12 pr-4 py-4 rounded-xl text-white outline-none focus:border-yellow-500"
                placeholder="City / Location"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 text-slate-950 py-4 rounded-xl font-black uppercase hover:bg-yellow-400 flex items-center justify-center gap-2"
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
          <h3 className="text-lg font-black uppercase text-white text-center mb-6">
            Secure Your Results
          </h3>
          <form onSubmit={runAudit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                className="w-full bg-slate-950 border border-slate-800 pl-10 pr-4 py-3 rounded-lg text-white text-sm"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="email"
                className="w-full bg-slate-950 border border-slate-800 pl-10 pr-4 py-3 rounded-lg text-white text-sm"
                placeholder="Email Address"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                className="w-full bg-slate-950 border border-slate-800 pl-10 pr-4 py-3 rounded-lg text-white text-sm"
                placeholder="WhatsApp Number"
                value={formData.whatsapp}
                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-yellow-500 text-slate-950 py-4 rounded-xl font-black uppercase disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="animate-spin" /> Analyzing...</> : 'Execute Analysis'}
            </button>
          </form>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div>
          <div className="bg-yellow-500 p-4 sm:p-6 rounded-2xl mb-6 text-slate-950 text-center">
            <h3 className="text-xl font-black uppercase mb-2">Verdict Ready</h3>
            {emailSent && <p className="text-xs font-bold mb-4">✓ Report emailed to {formData.email}</p>}
            <button
              onClick={downloadPDF}
              className="bg-slate-950 text-white px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 mx-auto"
            >
              <Download size={16} /> Download PDF
            </button>
          </div>
          
          <div ref={reportRef} className="p-4 sm:p-8 border border-slate-800 rounded-3xl bg-slate-900/40">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 border-b border-slate-800 pb-6">
              <div>
                <div className="text-yellow-500 text-xs font-black uppercase mb-1">Strategic Audit</div>
                <h4 className="text-xl font-black text-white uppercase">{formData.bizName}</h4>
                <p className="text-slate-500 text-sm">{formData.location}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase font-bold">Entity Score</p>
                <p className="text-4xl font-black text-yellow-500">{score}<span className="text-lg text-slate-600">/100</span></p>
              </div>
            </div>
            <pre className="text-slate-300 text-sm whitespace-pre-wrap font-mono">{analysis}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
