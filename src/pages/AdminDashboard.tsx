import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Lead } from '../types';

export const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, u => {
      setUser(u);
      if (u) fetchLeads();
    });
  }, []);

  const fetchLeads = async () => {
    if (!db) return;
    const q = query(collection(db, 'leads'), orderBy('timestamp', 'desc'));
    const snap = await getDocs(q);
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Lead));
    setLeads(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    try { await signInWithEmailAndPassword(auth, email, pass); } 
    catch { alert('Access Denied'); }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-xl w-96 text-white border border-slate-700">
          <h2 className="text-center text-xl font-bold mb-6">Mission Control</h2>
          <input className="w-full mb-4 bg-slate-900 border border-slate-600 p-3 rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="w-full mb-6 bg-slate-900 border border-slate-600 p-3 rounded" type="password" placeholder="Passcode" value={pass} onChange={e => setPass(e.target.value)} />
          <button className="w-full bg-yellow-500 text-black font-bold py-3 rounded">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 text-white">
      <h1 className="text-3xl mb-8">Audit Leads</h1>
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        {leads.map(lead => (
          <div key={lead.id} className="p-4 border-b border-slate-700 flex justify-between">
            <span className="font-bold">{lead.businessName}</span>
            <span className="text-yellow-500 font-mono">{lead.auditScore}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
