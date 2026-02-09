import { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { Shield, Clock, FileText, Phone, Mail, MapPin, Users, Loader2, LogOut, Globe, AlertOctagon } from 'lucide-react';

export default function Admin() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  // 1. DEFINE THE ADMIN IDENTITY
  const ADMIN_EMAIL = "happyhunterdigital@gmail.com";

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
    if (!db) return;
    try {
      const q = query(collection(db, "leads"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeads(list);
    } catch (error) {
      console.error("Access Denied");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsAuthorizing(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Auth Failed");
    } finally {
      setIsAuthorizing(false);
    }
  };

  const handleLogout = () => signOut(auth);

  // 2. ACCESS DENIED STATE (IF LOGGED IN WITH WRONG EMAIL)
  if (user && user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
        <div className="max-w-md w-full p-12 border border-red-500/20 rounded-[3rem] bg-red-500/5 text-center">
          <AlertOctagon size={48} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-xl font-black uppercase text-white mb-2">Unauthorized Identity</h2>
          <p className="text-slate-500 text-sm mb-8 italic">Your credentials do not match the Principal Strategist protocol.</p>
          <button onClick={handleLogout} className="text-yellow-500 font-black uppercase text-[10px] tracking-widest hover:underline">
            Switch to Admin Account
          </button>
        </div>
      </div>
    );
  }

  // 3. LOGIN UI (IF NOT LOGGED IN)
  if (!user && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
        <div className="max-w-md w-full p-12 border border-slate-800 rounded-[3rem] bg-slate-900/30 backdrop-blur-xl shadow-2xl text-center relative overflow-hidden">
          <div className="flex justify-center mb-8 relative z-10">
            <div className="p-4 bg-yellow-500 rounded-2xl text-slate-950 shadow-[0_0_30px_rgba(250,204,21,0.2)] animate-pulse">
              <Shield size={32} />
            </div>
          </div>
          <span className="brand-name text-4xl text-white mb-2 block relative z-10">happyhunterdigital</span>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12 relative z-10">Restricted Admin Access</p>
          
          <button 
            onClick={handleGoogleLogin}
            disabled={isAuthorizing}
            className="w-full bg-white text-slate-950 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-yellow-500 transition-all shadow-xl group relative z-10"
          >
            {isAuthorizing ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <Globe size={18} className="group-hover:rotate-12 transition-transform" /> 
                Authorize via Google
              </>
            )}
          </button>

          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-yellow-500/5 rounded-full blur-3xl"></div>
        </div>
      </div>
    );
  }

  // 4. SECURE OPS CENTER (IF ADMIN LOGGED IN)
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8 animate-fade-in">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-yellow-500">
            <Shield size={32} />
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Ops <span className="text-yellow-500">Center</span></h2>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Confidential Entity Intelligence // Authenticated</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center">
            <p className="text-2xl font-black text-white leading-none">{leads.length}</p>
            <p className="text-slate-600 text-[8px] font-black uppercase
