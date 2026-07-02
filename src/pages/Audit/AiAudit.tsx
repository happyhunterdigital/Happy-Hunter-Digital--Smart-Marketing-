import React, { useState } from 'react';
import { AuditForm } from './AuditForm';
import { AuditResults } from './AuditResults';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebaseConfig';

interface AuditData {
  success: boolean;
  score: number;
  summary: string;
  truths: string[];
  telemetry: {
    mapsStatus: string;
    website: string;
    schema: boolean;
    schemasDetected: string[];
    mapsName?: string;
    rating?: number;
    reviewCount?: number;
  };
}

export const AiAudit: React.FC = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ biz: '', loc: '', name: '', mail: '', wa: '' });
  const [phoneError, setPhoneError] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditData | null>(null);
  const [error, setError] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm({ ...form, wa: val });
    
    const phoneRegex = /^[+]?[\d\s-]{10,}$/;
    if (val && !phoneRegex.test(val.replace(/\s/g, ''))) {
      setPhoneError('Invalid phone format. Use +27601016673 format.');
    } else {
      setPhoneError('');
    }
  };

  const runForensicScan = async () => {
    if (phoneError || !form.wa) return;
    
    setLoading(true);
    setError('');
    setScanProgress(0);
    setStep(3);

    const progressInterval = setInterval(() => {
      setScanProgress(prev => Math.min(prev + 18, 90));
    }, 800);

    try {
      const performAudit = httpsCallable(functions, 'performAudit');
      
      const response = await performAudit({
        businessName: form.biz,
        location: form.loc,
        clientEmail: form.mail,
        whatsapp: form.wa
      });

      clearInterval(progressInterval);
      setScanProgress(100);
      setResult(response.data as AuditData);
      setStep(4);
    } catch (err: any) {
      clearInterval(progressInterval);
      console.error('Audit failed:', err);
      
      const msg = err?.message || '';
      if (msg.includes('resource-exhausted') || msg.includes('Too many requests')) {
        setError('Rate limit exceeded. Please try again in an hour.');
      } else if (msg.includes('invalid-argument')) {
        setError('Please check your inputs and try again.');
      } else if (msg.includes('failed-precondition')) {
        setError('System configuration error. Please contact support.');
      } else {
        setError('Neural Handshake Interrupted. Please try again shortly.');
      }
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {step < 4 && (
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
              Digital Entity <span className="text-yellow-500">Audit</span>
            </h1>
            <p className="text-gray-400 font-mono text-sm">
              Verify your existence in the AI-driven search ecosystem.
            </p>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm font-mono">
            ⚠️ {error}
          </div>
        )}

        <AuditForm
          step={step}
          form={form}
          setForm={setForm}
          setStep={setStep}
          phoneError={phoneError}
          handlePhoneChange={handlePhoneChange}
          runForensicScan={runForensicScan}
          scanProgress={scanProgress}
          loading={loading}
        />

        {step === 4 && result && (
          <AuditResults 
            result={result} 
            onReset={() => {
              setStep(1);
              setResult(null);
              setForm({ biz: '', loc: '', name: '', mail: '', wa: '' });
              setError('');
            }}
          />
        )}
      </div>
    </div>
  );
};
