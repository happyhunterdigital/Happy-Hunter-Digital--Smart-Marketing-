import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { Shield, Users, LogOut, Loader2, Mail, MapPin, BarChart } from 'lucide-react';

// IMPORTANT: Change this to your actual Google email
const ADMIN_EMAIL = "happyhunterdigital@gmail.com"; 

export const Admin = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email === ADMIN_EMAIL) {
        fetchLeads();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchLeads = async () => {
    try {
      const q = query(collection(db, "leads"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeads(list);
    } catch (error) {
      console.error("Failed to fetch leads", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-yellow-500" size={48} /></div>;
  }

  // NOT LOGGED IN OR WRONG EMAIL
  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <Shield size={64} className="text-yellow-500 mb-6" />
        <h1 className="text-3xl font-black text-white uppercase tracking-widest mb-2">Restricted Area</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">This operations center is restricted to Happy Hunter Systems administrators only.</p>
        
        {user ? (
          <div className="text-center">
            <p className="text-red-400 mb-4 text-sm">Access Denied for: {user.email}</p>
            <button onClick={() => signOut(auth)} className="text-gray-400 hover:text-white underline">Sign Out</button>
          </div>
        ) : (
          <button onClick={login} className="bg-yellow-500 text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-colors">
            Authorize via Google
          </button>
        )}
      </div>
    );
  }

  // SUCCESSFUL LOGIN - SHOW DASHBOARD
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-900 border border-gray-800 p-6 rounded-3xl mb-10 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-xl"><Users className="text-yellow-500" /></div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Operations Center</h2>
              <p className="text-gray-500 text-sm">Total Intelligence Leads Captured: <span className="text-yellow-500 font-bold">{leads.length}</span></p>
            </div>
          </div>
          <button onClick={() => signOut(auth)} className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors text-sm font-bold uppercase">
            <LogOut size={16} /> Secure Logout
          </button>
        </div>

        {/* Leads Grid */}
        <div className="grid gap-6">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-black border border-gray-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-yellow-500/30 transition-colors">
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{lead.businessName || 'Unknown Business'}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1"><Mail size={14} className="text-yellow-500"/> {lead.email}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} className="text-yellow-500"/> {lead.location}</span>
                  <span className="flex items-center gap-1"><BarChart size={14} className="text-yellow-500"/> Score: {lead.score}/100</span>
                </div>
              </div>

              <div className="shrink-0 text-right w-full md:w-auto">
                <span className="text-xs text-gray-600 block mb-2">
                  {lead.timestamp ? new Date(lead.timestamp.toDate()).toLocaleString() : 'Date unknown'}
                </span>
                <a href={`mailto:${lead.email}`} className="bg-gray-900 text-white px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition-colors inline-block w-full md:w-auto text-center">
                  Follow Up
                </a>
              </div>

            </div>
          ))}
          {leads.length === 0 && (
            <div className="text-center py-20 text-gray-600 border border-gray-800 rounded-3xl border-dashed">
              No intelligence leads captured yet.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
