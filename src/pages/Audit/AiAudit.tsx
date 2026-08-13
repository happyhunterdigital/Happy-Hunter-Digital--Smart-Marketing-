import React, { useState } from 'react';
import { AuditForm } from './AuditForm';
import { AuditResults } from './AuditResults';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebaseConfig';
import { PageMeta } from '../../components/PageMeta';

interface AuditData {
  success: boolean;
  score: number;
  summary: string;
  truths: string[];
  telemetry: {
    mapsStatus: string;
    mapsName?: string;
    rating?: number;
    reviewCount?: number;
    gbpOnly: boolean;
    gbpUrl: string;
    website: string;
    schema: boolean;
    schemasDetected: string[];
    title?: string;
    description?: string;
    viewport?: string;
  };
}

export const AiAudit: React.FC = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', designation: '', biz: '', mail: '', web: '', loc: '', wa: '', countryCode: '+27' });
  const [phoneError, setPhoneError] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditData | null>(null);
  const [error, setError] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 15);
    setForm({ ...form, wa: val });
    if (val) {
      const fullNumber = form.countryCode + val.replace(/^0+/, '');
      const phoneRegex = /^\+[1-9]\d{8,14}$/;
      setPhoneError(!phoneRegex.test(fullNumber) ? 'Invalid phone format.' : '');
    } else {
      setPhoneError('');
    }
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, countryCode: e.target.value });
    if (form.wa) {
      const fullNumber = e.target.value + form.wa.replace(/^0+/, '');
      const phoneRegex = /^\+[1-9]\d{8,14}$/;
      setPhoneError(!phoneRegex.test(fullNumber) ? 'Invalid phone format.' : '');
    }
  };

  const runHealthCheck = async () => {
    if (phoneError || !form.wa) return;

    const currentCount = parseInt(localStorage.getItem('hhd_audit_count') || '0', 10);
    if (currentCount >= 3) {
      setError('You have already used your 3 free checks. Contact us if you need another.');
      return;
    }

    setLoading(true);
    setError('');
    setScanProgress(0);
    setStep(2);

    const progressInterval = setInterval(() => {
      setScanProgress(prev => Math.min(prev + 18, 90));
    }, 800);

    try {
      const performAudit = httpsCallable(functions, 'performAudit');
      const response = await performAudit({
        businessName: form.biz,
        city: form.loc,
        websiteUrl: form.web || "",
        clientEmail: form.mail,
        whatsapp: form.countryCode + form.wa.replace(/^0+/, ''),
        requesterName: form.name,
        requesterDesignation: form.designation
      });
      clearInterval(progressInterval);
      setScanProgress(100);

      localStorage.setItem('hhd_audit_count', String(currentCount + 1));

      setResult(response.data as AuditData);
      setStep(3);
    } catch (err: any) {
      clearInterval(progressInterval);
      const msg = err?.message || '';
      if (msg.includes('resource-exhausted') || msg.includes('exhausted')) {
        setError('You have already used your 3 free checks. Contact us if you need another.');
        localStorage.setItem('hhd_audit_count', '3');
      }
      else if (msg.includes('not-found') || msg.includes('Business not found')) setError('We couldn\'t find that business. Please double-check the name and city.');
      else if (msg.includes('invalid-argument')) {
        if (msg.toLowerCase().includes('url') || msg.toLowerCase().includes('domain')) {
          setError('Please enter a valid website URL like www.yourbusiness.com');
        } else {
          setError('Please check your inputs and try again.');
        }
      }
      else if (msg.includes('failed-precondition')) setError('Something went wrong on our end. Please try again.');
      else setError('Something went wrong. Please try again.');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <PageMeta
        title="Free Online Health Check | Happy Hunter Digital"
        description="See exactly why customers can't find your business online. A free check of your website, Google listing, and search visibility — no jargon, no hard sell."
        path="/audit"
      />
      <div className="max-w-6xl mx-auto">
        {step !== 3 && (
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
              Free Online Business <span className="text-yellow-500">Health Check</span>
            </h1>
            <p className="text-gray-400 font-mono text-sm">Check if customers can find you on Google, ChatGPT, and WhatsApp. No jargon, no obligation.</p>
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
          phoneError={phoneError}
          handlePhoneChange={handlePhoneChange}
          handleCountryCodeChange={handleCountryCodeChange}
          runHealthCheck={runHealthCheck}
          scanProgress={scanProgress}
          loading={loading}
        />

        {step === 3 && result && (
          <AuditResults 
            result={result}
            onReset={() => {
              setResult(null);
              setStep(1);
              setForm({ name: '', designation: '', biz: '', mail: '', web: '', loc: '', wa: '', countryCode: '+27' });
              setError('');
            }}
          />
        )}
      </div>
    </div>
  );
};
