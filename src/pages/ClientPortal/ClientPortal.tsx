import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebaseConfig';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { Loader2, Lock } from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { PortalDashboard } from './PortalDashboard';

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
      if (u) fetchDashboardData(u.email || "");
      else setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchDashboardData = async (email: string) => {
    setDataLoading(true);
    try {
      const isAdminAccount = email === 'motsumitl@happyhunterdigital.com';
      setIsAdmin(isAdminAccount);
      
      const q = isAdminAccount 
        ? query(collection(db, 'leads'), orderBy('timestamp', 'desc'))
        : query(collection(db, 'leads'), where('email', '==', email));
        
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
        const validAudits = audits.filter(a => a.score !== undefined);
        const avg = validAudits.reduce((acc, curr) => acc + curr.score, 0) / validAudits.length || 0;
        setAdminStats({
          total: audits.length,
          average: Math.round(avg),
          verified: validAudits.filter(a => a.score >= 70).length,
          ghosts: validAudits.filter(a => a.score < 40).length
        });
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
    <PortalDashboard 
      user={user} 
      isAdmin={isAdmin} 
      dataLoading={dataLoading} 
      clientAudits={clientAudits} 
      adminStats={adminStats} 
      onLogout={() => signOut(auth)} 
    />
  );
};
