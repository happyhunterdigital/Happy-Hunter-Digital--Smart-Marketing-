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
    } catch (error) {
      console.error("Database access error:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Date", "Business", "Location", "Full Name", "Email", "WhatsApp", "Survival Score", "Analysis Preview"];
    const rows = leads.map(lead => [
      lead.timestamp?.toDate().toLocaleString() || "N/A",
      lead.bizName || lead.businessName || "N/A",
      lead.location || "N/A",
      lead.fullName || "N/A",
      lead.email || "N/A",
      lead.whatsapp || "N/A",
      lead.score || "N/A",
      (lead.analysis || "").substring(0, 100).replace(/,/g, ";") + "..."
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `HappyHunter_Leads_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGoogleLogin = async () => {
    setIsAuthorizing(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Auth Failed:", err);
    } finally {
      setIsAuthorizing(false);
    }
  };

  const handleLogout = () => signOut(auth);

  if (user && user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
        <div className="max-w-md w-full p-12 border border-red-500/20 rounded-[3rem] bg-red-500/5 text-center">
          <AlertOctagon size={48} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-xl font-black uppercase text-white mb-2">Unauthorized Identity</h2>
          <button onClick={handleLogout} className="text-yellow-500 font-black uppercase text-[10px] tracking-widest hover:underline">
            Switch Account
          </button>
        </div>
      </div>
    );
  }

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
            {isAuthorizing ? <Loader2 className="animate-spin" size={18} /> : <><Globe size={18} /> Authorize with Google</>}
          </button>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-yellow-500/5 rounded-full blur-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8 animate-fade-in">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-yellow-500">
            <Shield size={32} />
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Ops <span className="text-yellow-500">Center</span></h2>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Protocol Intelligence Dashboard</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
          >
            <Download size={14} className="text-yellow-500" /> Export CSV
          </button>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center">
            <p className="text-2xl font-black text-white leading-none">{leads.length}</p>
            <p className="text-slate-600 text-[8px] font-black uppercase tracking-widest mt-1">Total Intelligence</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-red-500 transition-all hover:scale-105"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="flex flex-col items-center py-20 space-y-4 font-black uppercase text-[10px] tracking-widest">
            <Loader2 className="animate-spin text-yellow-500" size={40} />
            <p className="text-slate-500 tracking-[0.4em]">establishing signal...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-black uppercase tracking-widest">
            No audit data found
          </div>
        ) : leads.map((lead) => (
          <div key={lead.id} className="p-10 border border-slate-800 rounded-[3.5rem] bg-slate-900/20 hover:border-yellow-500/20 transition-all group animate-fade-in relative overflow-hidden">
            <div className="flex flex-col lg:flex-row justify-between gap-8">
              <div className="space-y-4 flex-grow">
                <div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                    {lead.bizName || lead.businessName || "Unknown"}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
                    <MapPin size={14} className="text-yellow-500" /> {lead.location || "Unknown"}
                  </div>
                </div>
                <div className="flex flex-wrap gap-6 pt-2 text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-300 flex items-center gap-2">
                    <Users size={14} className="text-slate-600" /> {lead.fullName || "N/A"}
                  </span>
                  <a 
                    href={`mailto:${lead.email}`} 
                    className="text-blue-400 border-b border-blue-400/20 pb-0.5 hover:text-blue-300"
                  >
                    {lead.email || "No email"}
                  </a>
                  <a 
                    href={`https://wa.me/${(lead.whatsapp || "").replace(/\s/g, '')}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 border-b border-green-500/20 pb-0.5 hover:text-green-400"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
              <div className="text-left lg:text-right shrink-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 italic">Extracted Score</p>
                <p className="text-5xl font-black text-yellow-500 leading-none">
                  {lead.score || "??"}<span className="text-xs text-slate-800">/100</span>
                </p>
                <p className="text-slate-700 text-[8px] font-black uppercase tracking-widest mt-4">
                  <Clock size={10} className="inline mr-1" />
                  {lead.timestamp?.toDate().toLocaleString() || "Unknown date"}
                </p>
              </div>
            </div>
            <div className="mt-8 p-8 bg-slate-950/50 rounded-[2.5rem] border border-slate-800 relative">
              <div className="flex items-center gap-2 mb-4 text-slate-600 font-black uppercase text-[8px] tracking-[0.3em]">
                <FileText size={12} className="text-yellow-500" /> Strategic Analysis Protocol
              </div>
              <div className="text-slate-400 text-xs leading-relaxed whitespace-pre-wrap font-medium line-clamp-4">
                {lead.analysis || "No analysis available"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
