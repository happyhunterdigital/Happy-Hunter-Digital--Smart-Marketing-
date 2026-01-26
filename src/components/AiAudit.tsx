import React, { useState } from 'react';
import { performAudit } from '../services/geminiService';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { AuditResult } from '../types';
import { Search, Loader2 } from 'lucide-react';

export const AiAudit: React.FC = () => {
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const auditData = await performAudit(businessName, location);
      setResult(auditData);
      if (db) {
        await addDoc(collection(db, 'leads'), {
          businessName,
          location,
          auditScore: auditData.score,
          timestamp: new Date()
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-slate-800 p-8 rounded-2xl border border-slate-700 mt-8 text-white">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full bg-slate-900 border border-slate-700 rounded p-3" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Business Name" required />
          <input className="w-full bg-slate-900 border border-slate-700 rounded p-3" value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" required />
          <button disabled={loading} className="w-full bg-yellow-500 text-black font-bold py-4 rounded flex justify-center items-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />} {loading ? 'Scanning...' : 'Scan Now'}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <div className="text-4xl font-black mb-2 text-yellow-500">{result.score}/100</div>
          <p className="mb-4">{result.summary}</p>
          <button onClick={() => setResult(null)} className="underline text-sm">New Scan</button>
        </div>
      )}
    </div>
  );
};
