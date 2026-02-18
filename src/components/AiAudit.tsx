import React, { useState } from 'react';
import { Search, AlertTriangle, Loader2 } from 'lucide-react';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import emailjs from '@emailjs/browser';

export const AiAudit: React.FC = () => {
  const [form, setForm] = useState({ biz: '', loc: '', mail: '' });
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const call = await fetch(`https://us-central1-${import.meta.env.VITE_FIREBASE_PROJECT_ID}.cloudfunctions.net/performAudit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName: form.biz, location: form.loc })
      });

      // Better Error Handling
      if (!call.ok) {
        // This checks if the server itself is having issues (like billing)
        throw new Error(`Server Protocol Error: ${call.status}. Check backend logs & billing.`);
      }

      const json = await call.json();
      if (json.success) {
        setRes(json.data);
        await addDoc(collection(db, 'leads'), { ...form, score: json.data.score, timestamp: serverTimestamp() });
        await emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, 
          { to_email: form.mail, business_name: form.biz, audit_score: json.data.score, summary: json.data.summary }, 
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
      } else {
        // This handles errors sent from the backend (like bad API keys)
        throw new Error(`Handshake Refused: ${json.error}`);
      }
    } catch (err: any) { 
      // This will now show the specific error from the server
      alert(err.message); 
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl mt-10">
      {!res ? (
        <form onSubmit={run} className="space-y-4">
          <input className="w-full bg-black p-4 rounded border border-gray-800 text-white" placeholder="Business Name" onChange={e => setForm({...form, biz: e.target.value})} required />
          <input className="w-full bg-black p-4 rounded border border-gray-800 text-white" placeholder="Location" onChange={e => setForm({...form, loc: e.target.value})} required />
          <input className="w-full bg-black p-4 rounded border border-gray-800 text-white" placeholder="Email" type="email" onChange={e => setForm({...form, mail: e.target.value})} required />
          <button className="w-full bg-brand-yellow p-4 rounded font-black uppercase text-brand-dark flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <Search />} Initiate Scan
          </button>
        </form>
      ) : (
        <div className="text-left animate-fade-in">
          <h3 className="text-3xl font-black text-brand-yellow mb-4">Score: {res.score}/100</h3>
          <p className="text-gray-300 italic mb-6">"{res.summary}"</p>
          <ul className="space-y-2">
            {res.truths.map((t: string, i: number) => <li key={i} className="text-red-400 text-sm flex gap-2"><AlertTriangle size={16}/> {t}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};
