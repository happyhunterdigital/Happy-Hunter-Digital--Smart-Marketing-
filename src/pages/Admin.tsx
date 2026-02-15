import { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { Shield, Clock, FileText, Phone, Mail, MapPin, Users, Loader2, LogOut, Globe, AlertOctagon, Download } from 'lucide-react';

export default function Admin() {
  const [leads, setLeads] = useState<any[]>([]);
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
    if (!db) return;
    try {
      const q = query(collection(db, "audits"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeads(list);
    } catch (error) { console.error("Access Denied"); }
    finally { setLoading(false); }
  };

  const handleGoogleLogin = async () => {
    setIsAuthorizing(true);
    const provider = new GoogleAuthProvider();
    try { await signInWithPopup(auth, provider); }
    catch (err) { console.error("Auth Failure"); }
    finally { setIsAuthorizing(false); }
  };

  const handleLogout = () => signOut(auth);

  if (!user && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
        <div className="max-w-md w-full p-12 border border-slate-800 rounded-[3rem] bg-slate-900/30 backdrop-blur-xl shadow-2xl text-center">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-yellow-500 rounded-2xl text-slate-950 shadow-xl"><Shield size={32} /></div>
          </div>
          <span className="brand-name text-4xl text-white mb-2 block lowercase">happyhunterdigital</span>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12">Restricted Access Portal</p>
          <button onClick={handleGoogleLogin} disabled={isAuthorizing} className="w-full bg-white text-slate-950 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-yellow-500 transition-all shadow-xl">
            {isAuthorizing ? <Loader2 className="animate-spin" size={18} /> : <><Globe size={18} /> Authorize via Google</>}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8 animate-fade-in">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-yellow-500"><Shield size={32} /><h2 className="text-4xl font-black uppercase tracking-tighter text-white">Ops <span className="text-yellow-500">Center</span></h2></div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Signal Secure // Authenticated</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center min-w-[100px]"><p className="text-2xl font-black text-white leading-none">{leads.length}</p><p className="text-slate-600 text-[8px] font-black uppercase mt-1">Leads Gathered</p></div>
          <button onClick={handleLogout} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-red-500 transition-all"><LogOut size={20} /></button>
        </div>
      </div>
      <div className="grid gap-6">
        {loading ? (
          <div className="flex flex-col items-center py-20 font-black uppercase text-[10px] tracking-widest animate-pulse"><Loader2 className="animate-spin text-yellow-500 mb-4" size={40} /><p>Establishing Handshake...</p></div>
        ) : leads.map((lead) => (
          <div key={lead.id} className="p-10 border border-slate-800 rounded-[3rem] bg-slate-900/20 hover:border-yellow-500/20 transition-all">
            <div className="flex flex-col lg:flex-row justify-between gap-8">
              <div className="space-y-4 flex-grow">
                <div><h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">{lead.businessName}</h3><div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest"><MapPin size={14} className="text-yellow-500" /> {lead.location}</div></div>
                <div className="flex flex-wrap gap-6 pt-2 text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-300 flex items-center gap-2"><Users size={14} className="text-slate-600" /> {lead.fullName}</span>
                  <a href={`mailto:${lead.email}`} className="text-blue-400 border-b border-blue-400/20 pb-0.5">{lead.email}</a>
                  <a href={`https://wa.me/${lead.whatsapp}`} target="_blank" className="text-green-500 border-b border-green-500/20 pb-0.5">WhatsApp</a>
                </div>
              </div>
              <div className="text-left lg:text-right shrink-0">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Score</p><p className="text-6xl font-black text-yellow-500 leading-none">{lead.score || "??"}<span className="text-lg text-slate-700">/100</span></p>
                 <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest mt-4 italic"><Clock size={10} className="inline mr-1" /> {lead.timestamp?.toDate().toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-8 p-8 bg-slate-950/50 rounded-[2.5rem] border border-slate-800 relative">
              <div className="flex items-center gap-2 mb-4 text-slate-600 font-black uppercase text-[8px] tracking-[0.3em]"><FileText size={12} className="text-yellow-500" /> Strategic Analysis Preview</div>
              <div className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap font-medium italic line-clamp-4">{lead.analysis}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
