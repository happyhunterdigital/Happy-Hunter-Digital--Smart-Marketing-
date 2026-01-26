import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Shield, Lock, Mail } from 'lucide-react';
import { Lead } from '../types';

const AdminDashboard: React.FC = () => {
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
    catch (err) { alert('Access Denied'); }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-xl w-96 text-white border border-slate-700">
          <div className="flex justify-center mb-6"><Shield size={48} className="text-yellow-500"/></div>
          <h2 className="text-center text-xl font-bold mb-6">Mission Control</h2>
          <input className="w-full mb-4 bg-slate-900 border border-slate-600 p-3 rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="w-full mb-6 bg-slate-900 border border-slate-600 p-3 rounded" type="password" placeholder="Passcode" value={pass} onChange={e => setPass(e.target.value)} />
          <button type="submit" className="w-full bg-yellow-500 text-black font-bold py-3 rounded hover:bg-yellow-400">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 text-white">
      <h1 className="text-3xl mb-8 font-bold">Audit Leads</h1>
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-slate-400 uppercase text-xs">
            <tr><th className="p-4">Business</th><th className="p-4">Location</th><th className="p-4">Score</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {leads.map(lead => (
              <tr key={lead.id} className="hover:bg-slate-700/50">
                <td className="p-4 font-bold">{lead.businessName}</td>
                <td className="p-4 text-slate-400">{lead.location}</td>
                <td className="p-4 text-yellow-500 font-mono">{lead.auditScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
