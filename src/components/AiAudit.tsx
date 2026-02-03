import React, { useState } from 'react';
import { db, callHunterAI } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const AiAudit = () => {
  const [formData, setFormData] = useState({ name: '', loc: '', web: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const runAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      // 1. Generate a REAL custom audit using Gemini
      const auditPrompt = `Analyze this business: ${formData.name} in ${formData.loc}. 
      Website: ${formData.web || 'No website'}. 
      Identify 3 critical digital visibility gaps for this specific niche in South Africa. 
      Keep the tone professional and urgent.`;
      
      const aiAnalysis = await callHunterAI(auditPrompt);

      // 2. Save to Firestore (The "Mail" collection for automated sending)
      if (db) {
        await addDoc(collection(db, "mail"), {
          to: formData.email,
          businessName: formData.name,
          location: formData.loc,
          timestamp: serverTimestamp(),
          status: "new",
          analysis: aiAnalysis,
          message: {
            subject: `⚠️ Critical Gaps Found: Audit for ${formData.name}`,
            text: aiAnalysis
          }
        });
      }

      setStatus('success');
      setFormData({ name: '', loc: '', web: '', email: '' });
    } catch (error) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl max-w-2xl mx-auto my-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
      <h2 className="text-3xl font-bold text-white mb-6 text-center">AI Business Audit</h2>
      
      <form onSubmit={runAudit} className="space-y-4">
        <input 
          className="w-full bg-gray-800 border border-gray-700 p-4 rounded-lg text-white"
          placeholder="Business Name"
          required
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
        />
        <input 
          className="w-full bg-gray-800 border border-gray-700 p-4 rounded-lg text-white"
          placeholder="Location (e.g. Pretoria)"
          required
          value={formData.loc}
          onChange={e => setFormData({...formData, loc: e.target.value})}
        />
        <input 
          className="w-full bg-gray-800 border border-gray-700 p-4 rounded-lg text-white"
          placeholder="Email Address"
          type="email"
          required
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
        />
        <button 
          disabled={loading}
          className="w-full bg-yellow-500 text-gray-900 py-4 rounded-lg font-bold hover:bg-yellow-400 transition-all"
        >
          {loading ? 'Analyzing with Gemini...' : '🚀 Start AI Scan'}
        </button>
        {status === 'success' && <p className="text-green-400 text-center font-bold">✅ Audit completed! Check your email.</p>}
      </form>
    </div>
  );
};
