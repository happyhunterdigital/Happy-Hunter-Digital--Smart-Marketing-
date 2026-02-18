import React, { useState } from 'react';
import { Search, AlertTriangle, Loader2 } from 'lucide-react';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import emailjs from '@emailjs/browser';

export const AiAudit: React.FC = () => {
  const [bizName, setBizName] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const AUDIT_ENDPOINT = `https://us-central1-${import.meta.env.VITE_FIREBASE_PROJECT_ID}.cloudfunctions.net/performAudit`;

  const runAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizName || !location || !email) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(AUDIT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName: bizName, location })
      });

      if (!response.ok) throw new Error('Secure Handshake Failed');
      
      const json = await response.json();
      if (!json.success) throw new Error(json.error);

      setResult(json.data);

      await addDoc(collection(db, 'leads'), {
        business: bizName,
        location,
        email,
        score: json.data.score,
        timestamp: serverTimestamp()
      });

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          to_email: email,
          business_name: bizName,
          audit_score: json.data.score,
          summary: json.data.summary
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

    } catch (err: any) {
      console.error(err);
      setError('Connection refused. Target not found in public registry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-brand-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">
            Digital Entity <span className="text-brand-yellow">Scan</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Forensic analysis of your digital footprint. Detect the "Ghost Effect" before your competitors do.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          {!result ? (
            <form onSubmit={runAudit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-yellow uppercase tracking-widest mb-2">Target Entity</label>
                <input 
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 text-white p-4 rounded-lg focus:border-brand-yellow outline-none transition-colors"
                  placeholder="Business Name..." 
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Coordinates</label>
                  <input 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 text-white p-4 rounded-lg focus:border-brand-yellow outline-none"
                    placeholder="City/Area..." 
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Report Delivery</label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 text-white p-4 rounded-lg focus:border-brand-yellow outline-none"
                    placeholder="Email Address..." 
                    required
                  />
                </div>
              </div>

              <button 
                disabled={loading}
                className="w-full bg-brand-yellow text-brand-dark font-black uppercase py-4 rounded-lg hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
                {loading ? 'Running Protocol...' : 'Initiate Scan'}
              </button>
              
              {error && <p className="text-red-500 text-sm text-center mt-2 font-mono">{error}</p>}
            </form>
          ) : (
            <div className="animate-fade-in text-left">
              <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                <h3 className="text-2xl font-bold text-white">Audit Result</h3>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs uppercase">Score</span>
                  <span className="text-4xl font-black text-brand-yellow">{result.score}/100</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <p className="text-gray-300 italic">"{result.summary}"</p>
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                  <h4 className="text-red-500 font-bold uppercase text-xs mb-2 flex items-center gap-2">
                    <AlertTriangle size={14}/> Critical Findings
                  </h4>
                  <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                    {result.truths.map((truth: string, i: number) => (
                      <li key={i}>{truth}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <button 
                onClick={() => window.location.href = "mailto:hello@happyhunterdigital.com"}
                className="w-full border border-brand-yellow text-brand-yellow font-bold py-3 rounded-lg hover:bg-brand-yellow hover:text-brand-dark transition-colors uppercase text-sm tracking-widest"
              >
                Schedule Fix Implementation
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
