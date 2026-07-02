import React, { useState } from 'react';
import { AuditForm } from './AuditForm';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebaseConfig';
import { Shield, Globe, Code2, AlertTriangle, CheckCircle, RotateCcw } from 'lucide-react';

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
    setPhoneError(val && !phoneRegex.test(val.replace(/\s/g, '')) ? 'Invalid phone format. Use +27601016673 format.' : '');
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
      const msg = err?.message || '';
      if (msg.includes('resource-exhausted')) setError('Rate limit exceeded. Please try again in an hour.');
      else if (msg.includes('invalid-argument')) setError('Please check your inputs and try again.');
      else if (msg.includes('failed-precondition')) setError('System configuration error. Please contact support.');
      else setError('Neural Handshake Interrupted. Please try again shortly.');
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setResult(null);
    setForm({ biz: '', loc: '', name: '', mail: '', wa: '' });
    setError('');
  };

  const isGood = result ? result.score >= 70 : false;
  const isGhost = result ? result.telemetry.mapsStatus.includes('GHOST') : false;
  const isHijacked = result ? result.telemetry.mapsStatus.includes('HIJACKED') : false;

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {step < 4 && (
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
              Digital Entity <span className="text-yellow-500">Audit</span>
            </h1>
            <p className="text-gray-400 font-mono text-sm">Verify your existence in the AI-driven search ecosystem.</p>
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
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="bg-black border border-gray-800 rounded-[2rem] overflow-hidden shadow-2xl">
              <div className={`p-8 md:p-12 text-center relative overflow-hidden ${isGhost ? 'bg-gray-900' : isHijacked ? 'bg-red-950/30' : 'bg-gray-900/50'}`}>
                <div className={`absolute top-0 left-0 w-full h-1 ${isGood ? 'bg-green-500' : isGhost ? 'bg-gray-600' : 'bg-yellow-500'}`}></div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest mb-6">
                  {isGood ? <CheckCircle size={14} className="text-green-500" /> : <AlertTriangle size={14} className="text-yellow-500" />}
                  Audit Complete — {result.telemetry.mapsStatus}
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-white mb-2">{result.score}<span className="text-2xl text-gray-600">/100</span></h2>
                <p className={`text-lg font-mono ${isGood ? 'text-green-400' : 'text-yellow-400'}`}>
                  {isGhost ? 'GHOST ENTITY DETECTED' : isHijacked ? 'TRAFFIC HIJACK RISK' : 'ENTITY VERIFIED'}
                </p>
              </div>

              <div className="p-8 md:p-12 border-b border-gray-900">
                <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-4">Intelligence Summary</h3>
                <p className="text-gray-300 leading-relaxed text-lg">{result.summary}</p>
              </div>

              <div className="p-8 md:p-12 border-b border-gray-900">
                <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-6">Audit Truths</h3>
                <div className="space-y-4">
                  {result.truths.map((truth, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${i === 0 ? 'bg-yellow-500/20 text-yellow-500' : i === 1 ? 'bg-blue-500/20 text-blue-500' : 'bg-purple-500/20 text-purple-500'}`}>
                        {i + 1}
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed pt-1">{truth}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-900/30 rounded-xl border border-gray-800">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield size={18} className={isGhost ? 'text-gray-600' : 'text-green-500'} />
                    <span className="text-xs font-mono text-gray-500 uppercase">Google Maps Status</span>
                  </div>
                  <p className="text-white font-mono text-sm">{result.telemetry.mapsStatus}</p>
                  {result.telemetry.mapsName && <p className="text-gray-500 text-xs mt-1">Found: {result.telemetry.mapsName}</p>}
                  {result.telemetry.rating ? <p className="text-gray-500 text-xs mt-1">Rating: {result.telemetry.rating} ({result.telemetry.reviewCount} reviews)</p> : null}
                </div>

                <div className="p-6 bg-gray-900/30 rounded-xl border border-gray-800">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe size={18} className={result.telemetry.website !== 'None Linked' ? 'text-blue-500' : 'text-gray-600'} />
                    <span className="text-xs font-mono text-gray-500 uppercase">Website</span>
                  </div>
                  <p className="text-white font-mono text-sm truncate">{result.telemetry.website}</p>
                </div>

                <div className="p-6 bg-gray-900/30 rounded-xl border border-gray-800 md:col-span-2">
                  <div className="flex items-center gap-3 mb-3">
                    <Code2 size={18} className={result.telemetry.schema ? 'text-purple-500' : 'text-gray-600'} />
                    <span className="text-xs font-mono text-gray-500 uppercase">Schema Markup</span>
                  </div>
                  <p className="text-white font-mono text-sm mb-2">
                    {result.telemetry.schema ? `${result.telemetry.schemasDetected.length} schema(s) detected` : 'No Schema Markup detected'}
                  </p>
                  {result.telemetry.schema && (
                    <div className="flex flex-wrap gap-2">
                      {result.telemetry.schemasDetected.map((s, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-500/10 border border-purple-500/30 rounded text-xs font-mono text-purple-400">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 md:p-12 border-t border-gray-900 text-center">
                <button onClick={handleReset} className="inline-flex items-center gap-3 px-8 py-4 bg-yellow-500 rounded-xl font-black uppercase text-black hover:bg-white transition-all">
                  <RotateCcw size={18} /> Run Another Audit
                </button>
                <p className="text-gray-600 text-xs font-mono mt-4">Report sent to your email. Check your inbox.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
