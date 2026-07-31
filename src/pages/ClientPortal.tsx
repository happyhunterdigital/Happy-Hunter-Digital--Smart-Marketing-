import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { ShieldCheck, Clock, Lock, Loader2, LogOut, Search, Activity, Target, BarChart3, Database } from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { isAdminEmail } from '../utils/admin';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export const ClientPortal = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [clientAudits, setClientAudits] = useState<any[]>([]);
  const [adminStats, setAdminStats] = useState({ total: 0, average: 0, verified: 0, ghosts: 0 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        fetchDashboardData(u.email || "");
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchDashboardData = async (email: string) => {
    setDataLoading(true);
    try {
      const isAdminAccount = isAdminEmail(email);
      setIsAdmin(isAdminAccount);

      let q;
      if (isAdminAccount) {
        q = query(collection(db, 'leads'), orderBy('timestamp', 'desc'));
      } else {
        q = query(collection(db, 'leads'), where('email', '==', email));
      }

      const querySnapshot = await getDocs(q);
      
      let audits = querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));

      if (!isAdminAccount) {
        audits.sort((a, b) => {
          const timeA = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0;
          const timeB = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0;
          return timeB - timeA;
        });
      }

      setClientAudits(audits);

      if (isAdminAccount && audits.length > 0) {
        const total = audits.length;
        const validAudits = audits.filter(a => a.score !== undefined);
        const avg = validAudits.reduce((acc, curr) => acc + curr.score, 0) / validAudits.length || 0;
        const verified = validAudits.filter(a => a.score >= 70).length;
        const ghosts = validAudits.filter(a => a.score < 40).length;
        
        setAdminStats({ total, average: Math.round(avg), verified, ghosts });
      }

    } catch (err) {
      console.error("Error fetching portal data:", err);
    } finally {
      setLoading(false);
      setDataLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setLoginError("");
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
      await signInWithPopup(auth, provider);
    } catch (e: any) {
      console.error("Login Error:", e);
      setLoginError("Access Denied: " + (e.message.includes('api-key-not-valid') ? "Invalid API Key" : "Connection Interrupted"));
      setLoading(false);
    } 
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#050505]"><Loader2 className="animate-spin text-yellow-500" size={48} /></div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] px-6 pt-20">
        <div className="max-w-md w-full p-10 border border-gray-800 rounded-[3rem] bg-[#0a0a0a] text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
          <Lock className="text-yellow-500 mx-auto mb-6" size={40} />
          <h2 className="text-3xl font-black uppercase text-white mb-2 tracking-tighter leading-none">Entity Portal</h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-10">Restricted Client Access</p>
          <div className="space-y-4">
            {loginError && <p className="text-red-500 text-xs font-bold mb-4">{loginError}</p>}
            <button onClick={handleGoogleLogin} className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors">
              <GoogleIcon /> Authenticate via Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-20 px-6 max-w-6xl mx-auto min-h-screen font-sans animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 border-b border-gray-800 pb-8">
        <div>
          <span className="text-yellow-500 font-black uppercase tracking-[0.4em] text-[10px] mb-2 block">
            {isAdmin ? "HQ Command Matrix" : "Client Command Node"}
          </span>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none">
            {isAdmin ? "Admin Overview" : "Your Entities"}
          </h2>
          <p className="text-gray-500 text-sm mt-3">Node Identity: <strong className="text-white">{user.email}</strong></p>
        </div>
        <div className="flex flex-col md:items-end gap-4">
          <p className="text-green-500 font-black uppercase text-lg tracking-widest flex items-center gap-2 leading-none">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Handshake Active
          </p>
          <button onClick={() => signOut(auth)} className="text-gray-500 hover:text-red-500 transition-colors text-[10px] font-bold uppercase tracking-widest bg-gray-900 px-4 py-2 rounded-lg leading-none">
            Secure Logout
          </button>
        </div>
      </div>

      {dataLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-yellow-500" size={40} /></div>
      ) : (
        <>
          {/* ADMIN MATRIX VIEW */}
          {isAdmin && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-6">
                <Database className="text-yellow-500 mb-4" size={24} />
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Total Scans</p>
                <p className="text-3xl font-black text-white">{adminStats.total}</p>
              </div>
              <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-6">
                <BarChart3 className="text-yellow-500 mb-4" size={24} />
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Network Avg Score</p>
                <p className="text-3xl font-black text-white">{adminStats.average}</p>
              </div>
              <div className="bg-[#0a0a0a] border border-green-500/30 rounded-3xl p-6 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                <ShieldCheck className="text-green-500 mb-4" size={24} />
                <p className="text-green-500/70 text-[10px] font-bold uppercase tracking-widest">Verified Entities</p>
                <p className="text-3xl font-black text-green-500">{adminStats.verified}</p>
              </div>
              <div className="bg-[#0a0a0a] border border-red-500/30 rounded-3xl p-6 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                <Target className="text-red-500 mb-4" size={24} />
                <p className="text-red-500/70 text-[10px] font-bold uppercase tracking-widest">Ghost Entities</p>
                <p className="text-3xl font-black text-red-500">{adminStats.ghosts}</p>
              </div>
            </div>
          )}

          {/* SHARED TABLE/LIST VIEW */}
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
            <div className="p-6 border-b border-gray-800 flex items-center gap-3">
              <Search className="text-yellow-500" size={20} />
              <h3 className="font-black uppercase tracking-widest text-lg text-white">
                {isAdmin ? "Global Intelligence Logs" : "Your Digital Architectures"}
              </h3>
            </div>
            
            {clientAudits.length === 0 ? (
              <div className="p-16 text-center text-gray-500">
                <Activity className="mx-auto mb-4 opacity-50" size={32} />
                <p className="font-bold uppercase tracking-widest text-sm">No architectures scanned yet.</p>
                <p className="text-xs mt-2">Initialize a smart audit to populate your dashboard.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-900 border-b border-gray-800 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                      <th className="p-5">Entity Name</th>
                      {isAdmin && <th className="p-5">Contact</th>}
                      <th className="p-5">Survival Score</th>
                      <th className="p-5">Status</th>
                      <th className="p-5 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-sm">
                    {clientAudits.map((audit) => {
                      const score = audit.score || 0;
                      let statusText = "Requires Optimization";
                      let statusColor = "text-yellow-500";
                      
                      if (score >= 70) {
                        statusText = "Verified";
                        statusColor = "text-green-500";
                      } else if (score < 40) {
                        statusText = "Critical Ghost";
                        statusColor = "text-red-500";
                      }

                      return (
                        <tr key={audit.id} className="hover:bg-gray-900/50 transition-colors">
                          <td className="p-5 font-bold text-white">{audit.businessName || audit.name || "Unknown"}</td>
                          {isAdmin && <td className="p-5 text-gray-400 text-xs">{audit.email}</td>}
                          <td className="p-5">
                            {audit.score !== undefined ? (
                              <span className={`font-black ${statusColor}`}>{score}/100</span>
                            ) : (
                              <span className="text-gray-500 italic">Service Req</span>
                            )}
                          </td>
                          <td className="p-5">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-black border border-gray-800 ${statusColor}`}>
                              {audit.service ? 'Pending Review' : statusText}
                            </span>
                          </td>
                          <td className="p-5 text-right text-gray-500 text-xs font-mono">
                            {audit.timestamp?.toDate ? audit.timestamp.toDate().toLocaleDateString() : 'Recent'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
