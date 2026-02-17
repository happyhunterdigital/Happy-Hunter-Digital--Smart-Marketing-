// src/pages/Audit.tsx
import { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  ShieldCheck, Loader2, Download, ArrowRight, 
  Building2, MapPin, User, Mail, Phone, Globe,
  AlertTriangle, CheckCircle, WifiOff 
} from 'lucide-react';
import { db, requireDb, getFirebaseStatus } from '../firebaseConfig';
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

interface GeminiResponse {
  text: string;
  error?: string;
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

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const callGemini = async (prompt: string): Promise<GeminiResponse> => {
  if (!GEMINI_API_KEY) {
    return { text: '', error: 'AI system not configured. Contact administrator.' };
  }
  
  if (!checkGeminiCircuit()) {
    return { text: '', error: 'AI service temporarily unavailable. Retry shortly.' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 4000 },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid AI response structure');
    }

    // Reset failure count on success
    geminiFailures = 0;
    
    return { text: data.candidates[0].content.parts[0].text };
  } catch (error: any) {
    geminiFailures++;
    if (geminiFailures >= 3) {
      geminiCircuitOpen = true;
      lastGeminiFailure = Date.now();
    }
    
    console.error('Gemini error:', error);
    return { 
      text: '', 
      error: error.name === 'AbortError' 
        ? 'AI engine timeout. High server load detected.' 
        : 'AI analysis failed. Fallback mode activated.' 
    };
  }
};

const generateAuditPrompt = (bizName: string, location: string): string => 
  `You are Hunter AI, lead strategist at Happy Hunter Digital. Perform a forensic Strategic Audit for "${bizName}" in ${location}.

AUDIT FRAMEWORK - 4 Pillars:

1. ENTITY ARCHITECTURE (Google Business Profile Health)
   - Verification status, data completeness, category alignment
   - Mirror Rule compliance

2. TRUST SIGNALS (Social Proof & Authority)  
   - Review velocity, sentiment analysis, competitive positioning

3. DISCOVERY MECHANICS (SEO & AEO Readiness)
   - Local pack visibility, "near me" optimization, AI search readiness

4. CONVERSION ARCHITECTURE (Lead Capture)
   - Website presence, contact friction, missed opportunities

OUTPUT RULES:
- No asterisks, no markdown
- Use [SECTION] headers
- Use [FIX] tags for critical items
- HIGH-IMPACT words in ALL CAPS
- End with: FINAL_SCORE: [0-100]

TONE: Military precision. Direct. Make owner feel PAIN of INVISIBILITY, then show PATH to DOMINANCE.`;

export default function Audit() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Initializing...');
  const [error, setError] = useState<string | null>(null);
  const [firebaseStatus] = useState(getFirebaseStatus);
  
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
    if (formData.bizName.trim().length < 2) return 'Business name required';
    if (formData.location.trim().length < 2) return 'Location required';
    return null;
  };

  const validateStep2 = () => {
    if (formData.fullName.trim().length < 2) return 'Full name required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Valid email required';
    if (formData.whatsapp.replace(/\D/g, '').length < 10) return 'Valid WhatsApp required';
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
      // Stage 1: AI Analysis
      setLoadingText('Querying Smart Marketing Graph...');
      const prompt = generateAuditPrompt(formData.bizName, formData.location);
      const aiResponse = await callGemini(prompt);

      if (aiResponse.error) {
        // Use fallback analysis if AI fails
        setAnalysis(generateFallbackAnalysis(formData.bizName, formData.location));
        setScore(45);
      } else {
        const text = aiResponse.text;
        const scoreMatch = text.match(/FINAL_SCORE:\s*(\d+)/i);
        setScore(scoreMatch ? parseInt(scoreMatch[1], 10) : 50);
        setAnalysis(text.replace(/FINAL_SCORE:\s*\d+/i, '').trim());
      }

      // Stage 2: Save to Firebase (best effort)
      setLoadingText('Securing intelligence...');
      if (db) {
        try {
          await addDoc(collection(db, 'audits'), {
            ...formData,
            analysis: analysis || aiResponse.text || 'Fallback analysis',
            score: score || 45,
            timestamp: serverTimestamp(),
            source: window.location.href,
          });
        } catch (e) {
          console.log('Firebase save failed (non-critical):', e);
        }
      }

      // Stage 3: Send email (best effort)
      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID) {
        try {
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            to_name: formData.fullName,
            to_email: formData.email,
            business_name: formData.bizName,
            audit_content: (analysis || aiResponse.text || '').substring(0, 500),
            score: (score || 45).toString(),
          });
          setEmailSent(true);
        } catch (e) {
          console.log('Email failed (non-critical):', e);
        }
      }

      setStep(3);
    } catch (err: any) {
      setError(err.message || 'System malfunction. Contact support.');
    } finally {
      setLoading(false);
    }
  };

  // Fallback when AI is down
  const generateFallbackAnalysis = (biz: string, loc: string): string => 
    `[SECTION] ENTITY ARCHITECTURE
Your business "${biz}" in ${loc} requires immediate digital verification. Without a optimized Google Business Profile, you are INVISIBLE to local search algorithms.

[SECTION] TRUST SIGNALS  
No review velocity detected. Competitors are capturing market trust while you remain silent.

[SECTION] DISCOVERY MECHANICS
ZERO AI search readiness detected. ChatGPT, Gemini, and Perplexity cannot recommend your services.

[SECTION] CONVERSION ARCHITECTURE
Lead capture mechanisms: ABSENT. Every day without optimization costs approximately 3-7 high-intent inquiries.

[FIX] IMMEDIATE ACTION REQUIRED: Schedule Entity Recovery Protocol with Happy Hunter Digital.`;

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
      console.error('PDF failed:', err);
      alert('PDF generation failed. Please screenshot the report.');
    }
  };

  const renderAnalysis = (text: string) => {
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      
      if (trimmed.startsWith('[SECTION]')) {
        return (
          <h4 key={i} className="text-yellow-500 font-black text-lg uppercase mt-6 mb-3 border-b border-yellow-500/20 pb-2">
            {trimmed.replace('[SECTION]', '').trim()}
          </h4>
        );
      }
      
      if (trimmed.startsWith('[FIX]')) {
        return (
          <div key={i} className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 my-4 text-white text-sm font-bold">
            <AlertTriangle className="inline mr-2 text-yellow-500" size={14} />
            {trimmed.replace('[FIX]', '').trim()}
          </div>
        );
      }
      
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
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen">
      {/* Firebase Status Warning */}
      {!firebaseStatus.initialized && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center gap-3 text-yellow-500">
          <WifiOff size={20} />
          <span className="text-sm font-bold">Offline Mode: Audit will generate but data won't persist. Contact support.</span>
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
                {step > s ? <CheckCircle size={14} /> : s}
              </div>
              {s !== 3 && <div className={`w-8 h-1 ${step > s ? 'bg-yellow-500' : 'bg-slate-800'}`} />}
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
        <div className="max-w-xl mx-auto text-center animate-in">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            Entity <span className="text-yellow-500">Scan</span>
          </h2>
          <p className="text-slate-400 mb-8">Forensic analysis of your digital footprint.</p>
          
          <form onSubmit={proceedToStep2} className="space-y-4">
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                className="w-full bg-slate-900 border border-slate-800 pl-12 pr-4 py-4 rounded-xl text-white outline-none focus:border-yellow-500"
                placeholder="Business Name"
                value={formData.bizName}
                onChange={e => setFormData({...formData, bizName: e.target.value})}
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                className="w-full bg-slate-900 border border-slate-800 pl-12 pr-4 py-4 rounded-xl text-white outline-none focus:border-yellow-500"
                placeholder="City / Location"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <button type="submit" className="w-full bg-yellow-500 text-slate-950 py-4 rounded-xl font-black uppercase hover:bg-yellow-400 flex items-center justify-center gap-2">
              Proceed <ArrowRight size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="max-w-md mx-auto p-8 border border-slate-800 rounded-3xl bg-slate-900/40">
          <ShieldCheck className="mx-auto text-yellow-500 mb-4" size={40} />
          <h3 className="text-xl font-black uppercase text-white text-center mb-6">Secure Results</h3>
          
          <form onSubmit={runAudit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                className="w-full bg-slate-950 border border-slate-800 pl-10 pr-4 py-3 rounded-lg text-white text-sm outline-none focus:border-yellow-500"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="email"
                className="w-full bg-slate-950 border border-slate-800 pl-10 pr-4 py-3 rounded-lg text-white text-sm outline-none focus:border-yellow-500"
                placeholder="Email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                className="w-full bg-slate-950 border border-slate-800 pl-10 pr-4 py-3 rounded-lg text-white text-sm outline-none focus:border-yellow-500"
                placeholder="WhatsApp"
                value={formData.whatsapp}
                onChange={e => setFormData({...formData, whatsapp: e.target.value})}
              />
            </div>
            <button disabled={loading} className="w-full bg-yellow-500 text-slate-950 py-4 rounded-xl font-black uppercase disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="animate-spin" /> {loadingText}</> : 'Execute Analysis'}
            </button>
          </form>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="animate-in">
          <div className="bg-yellow-500 p-6 rounded-2xl mb-6 text-slate-950 text-center">
            <h3 className="text-2xl font-black uppercase mb-2">Verdict Ready</h3>
            {emailSent && <p className="text-sm font-bold mb-4 opacity-80">✓ Report emailed to {formData.email}</p>}
            <button onClick={downloadPDF} className="bg-slate-950 text-white px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 mx-auto hover:scale-105 transition-transform">
              <Download size={16} /> Download PDF
            </button>
          </div>

          <div ref={reportRef} className="p-8 border border-slate-800 rounded-3xl bg-slate-900/40">
            <div className="flex justify-between items-start mb-8 border-b border-slate-800 pb-6">
              <div>
                <div className="text-yellow-500 text-xs font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Globe size={12} /> Strategic Audit
                </div>
                <h4 className="text-2xl font-black text-white uppercase">{formData.bizName}</h4>
                <p className="text-slate-500 text-sm">{formData.location}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase font-bold">Score</p>
                <p className="text-5xl font-black text-yellow-500">{score}<span className="text-lg text-slate-600">/100</span></p>
              </div>
            </div>
            
            <div className="max-w-3xl">{renderAnalysis(analysis)}</div>
            
            <div className="mt-12 p-8 bg-yellow-500 rounded-2xl text-slate-950 text-center">
              <h4 className="text-2xl font-black uppercase mb-4">Mend Your Architecture</h4>
              <a href="https://calendly.com/motsumitl/30min" className="inline-block bg-slate-950 text-white px-8 py-3 rounded-xl font-black text-sm uppercase hover:bg-white hover:text-slate-950 transition-colors">
                Schedule Recovery Call
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
