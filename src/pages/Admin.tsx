import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Shield, Users, Clock, FileText, ChevronRight } from 'lucide-react';

export default function Admin() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      if (!db) return;
      const q = query(collection(db, "audits"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeads(list);
      setLoading(false);
    }
    fetchLeads();
  }, []);

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center gap-4 mb-12">
        <Shield className="text-yellow-500" size={32} />
        <h2 className="text-4xl font-black uppercase tracking-tighter">Command <span className="text-yellow-500">Center</span></h2>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="animate-pulse text-slate-500 uppercase font-black text-xs tracking-widest">Accessing Entity Database...</div>
        ) : leads.length === 0 ? (
          <div className="p-10 border border-slate-900 rounded-3xl text-slate-500 italic text-center">No scans recorded yet.</div>
        ) : (
          leads.map((lead) => (
            <div key={lead.id} className="p-8 border border-slate-800 rounded-3xl bg-slate-900/20 hover:bg-slate-900/40 transition-all group">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-white">{lead.businessName}</h3>
                    <span className="bg-yellow-500/10 text-yellow-500 text-[8px] font-black px-2 py-1 rounded-full border border-yellow-500/20 uppercase tracking-widest">Lead Captured</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-500 text-xs font-medium uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Users size={12}/> Entity Scan</span>
                    <span className="flex items-center gap-1"><Clock size={12}/> {lead.timestamp?.toDate().toLocaleDateString()}</span>
                  </div>
                </div>
                <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl flex items-center gap-2 text-xs font-bold transition-all border border-white/10">
                  View Full Report <ChevronRight size={14}/>
                </button>
              </div>
              <div className="mt-8 p-6 bg-slate-950/50 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 mb-3 text-slate-400">
                  <FileText size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">AI Analysis Preview</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed italic line-clamp-3">
                  {lead.analysis}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
