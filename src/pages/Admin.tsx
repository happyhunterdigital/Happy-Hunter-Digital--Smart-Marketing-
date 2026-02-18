import { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { 
  GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut 
} from 'firebase/auth';
import { 
  Shield, Clock, FileText, Phone, Mail, MapPin, 
  Users, Loader2, LogOut, Globe, AlertOctagon 
} from 'lucide-react';

interface Lead {
  id: string;
  bizName?: string;
  businessName?: string;
  location?: string;
  fullName?: string;
  email?: string;
  whatsapp?: string;
  score?: number;
  analysis?: string;
  timestamp?: any;
}

export default function Admin() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  
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
    if (!db) {
      setLoading(false);
      return;
    }
    
    try {
      const q = query(
        collection(db, "audits"), 
        orderBy("timestamp", "desc"),
        limit(50)
      );
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Lead[];
      setLeads(list);
    } catch (error) {
      console.error("Access Refused:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsAuthorizing(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Auth Failure:", err.message);
      alert("Handshake Refused: " + err.message);
    } finally {
      setIsAuthorizing(false);
    }
  };

  const handleLogout = () => signOut(auth);

  // Unauthorized state
  if (user && user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6 text-center">
        <div className="max-w-md w-full p-8 lg:p-12 border border-red-500/20 rounded-[2rem] lg:rounded-[3rem] bg-red-500/5">
          <AlertOctagon size={48} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-lg lg:text-xl font-black uppercase text-white mb-2">
            Unauthorized
          </h2>
          <p className="text-slate-500 text-sm mb-4">
            This operations center is restricted to authorized personnel only.
          </p>
          <button 
            onClick={handleLogout} 
            className="text-yellow-500 font-black uppercase text-[10px] hover:underline"
          >
            Reset Protocol
          </button>
        </div>
      </div>
    );
  }

  // Login state
  if (!user && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
        <div className="max-w-md w-full p-8 lg:p-12 border border-slate-800 rounded-[2rem] lg:rounded-[3rem] bg-slate-900/30 text-center shadow-2xl backdrop-blur-md">
          <div className="flex justify-center mb-6 lg:mb-8">
            <div className="p-4 bg-yellow-500 rounded-2xl text-slate-950">
              <Shield size={32} />
            </div>
          </div>
          <span className="brand-name text-3xl lg:text-4xl text-white block lowercase mb-2">
            happyhunterdigital
          </span>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-8 lg:mb-12">
            Restricted Admin Access
          </p>
          
          <button
            onClick={handleGoogleLogin}
            disabled={isAuthorizing}
            className="w-full bg-white text-slate-950 py-4 lg:py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-yellow-500 transition-all"
          >
            {isAuthorizing ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <><Globe size={18} /> Authorize with Google</>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 lg:mb-16 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-yellow-500">
            <Shield size={32} />
            <h2 className="text-2xl lg:text-4xl font-black uppercase tracking-tighter text-white">
              Ops <span className="text-yellow-500">Center</span>
            </h2>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
            Signal Secure • {leads.length} Entities Scanned
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 border border-slate-800 p-3 lg:p-4 rounded-2xl text-center min-w-[80px] lg:min-w-[100px]">
            <p className="text-xl lg:text-2xl font-black text-white leading-none">
              {leads.length}
            </p>
            <p className="text-slate-600 text-[8px] font-black uppercase mt-1">Leads</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-3 lg:p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-red-500 transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:gap-6 text-left">
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="animate-spin text-yellow-500 mb-4" size={40} />
            <p className="text-slate-500 font-black uppercase text-[10px]">synchronizing...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20 text-slate-600">
            <p className="font-black uppercase tracking-widest">No audit data available</p>
          </div>
        ) : (
          leads.map((lead) => (
            <div 
              key={lead.id} 
              className="p-6 lg:p-10 border border-slate-800 rounded-[2rem] lg:rounded-[3rem] bg-slate-900/20 hover:border-yellow-500/20 transition-all"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-8">
                <div className="space-y-4 flex-grow">
                  <div>
                    <h3 className="text-xl lg:text-2xl xl:text-3xl font-black text-white uppercase tracking-tighter mb-2">
                      {lead.bizName || lead.businessName || 'Unknown Entity'}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
                      <MapPin size={14} className="text-yellow-500" />
                      {lead.location || 'Unknown Location'}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 lg:gap-6 pt-2 text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-300 flex items-center gap-2">
                      <Users size={14} className="text-slate-600" />
                      {lead.fullName || 'Anonymous'}
                    </span>
                    {lead.email && (
                      <a 
                        href={`mailto:${lead.email}`} 
                        className="text-blue-400 border-b border-blue-400/20 pb-0.5 hover:text-blue-300"
                      >
                        {lead.email}
                      </a>
                    )}
                    {lead.whatsapp && (
                      <a 
                        href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-500 border-b border-green-500/20 pb-0.5 hover:text-green-400"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>

                <div className="text-left lg:text-right shrink-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                    Entity Score
                  </p>
                  <p className="text-4xl lg:text-5xl xl:text-6xl font-black text-yellow-500 leading-none">
                    {lead.score ?? "??"}
                    <span className="text-base lg:text-lg text-slate-700">/100</span>
                  </p>
                  {lead.timestamp && (
                    <p className="text-slate-700 text-[8px] font-black uppercase tracking-widest mt-4 italic">
                      <Clock size={10} className="inline mr-1" />
                      {lead.timestamp.toDate?.().toLocaleString() || 'Unknown'}
                    </p>
                  )}
                </div>
              </div>

              {lead.analysis && (
                <div className="mt-6 lg:mt-8 p-4 lg:p-8 bg-slate-950/50 rounded-[1.5rem] lg:rounded-[2.5rem] border border-slate-800">
                  <div className="flex items-center gap-2 mb-4 text-slate-600 font-black uppercase text-[8px] tracking-[0.3em]">
                    <FileText size={12} className="text-yellow-500" />
                    Analysis Report
                  </div>
                  <div className="text-slate-400 text-xs lg:text-sm leading-relaxed whitespace-pre-wrap font-medium italic line-clamp-6">
                    {lead.analysis}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
