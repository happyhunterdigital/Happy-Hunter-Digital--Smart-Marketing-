import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Shield, Clock, FileText, ChevronRight, Phone, Mail } from 'lucide-react';

export default function Admin() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      if (!db) return;
      const q = query(collection(db, "leads"), orderBy("timestamp", "desc"));
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
        ) : leads.map((lead) => (
          <div key={lead.id} className="p-8 border border-slate-800 rounded-3xl bg-slate-900/20 hover:border-yellow-500/20 transition-all">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase">{lead.businessName}</h3>
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">{lead.location}</p>
                </div>
                <div className="flex gap-4">
                  <a href={`https://wa.me/${lead.whatsapp}`} className="flex items-center gap-2 text-xs font-bold text-green-500 hover:underline"><Phone size={14}/> WhatsApp</a>
                  <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-xs font-bold text-blue-500 hover:underline"><Mail size={14}/> Email</a>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black uppercase text-slate-700 flex items-center justify-end gap-1"><Clock size={12}/> {lead.timestamp?.toDate().toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-8 p-6 bg-slate-950/50 rounded-2xl border border-slate-800">
               <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest block mb-4 flex items-center gap-2"><FileText size={12}/> Audit Analysis Preview</span>
               <p className="text-slate-400 text-xs leading-relaxed italic line-clamp-4">{lead.analysis}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
