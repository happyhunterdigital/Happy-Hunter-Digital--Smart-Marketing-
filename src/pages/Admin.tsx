import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Shield, Clock, FileText, Phone, Mail, MapPin, Users, Loader2 } from 'lucide-react';

export default function Admin() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      if (!db) return;
      try {
        // Mapped to the 'audits' collection used in your Audit.tsx
        const q = query(collection(db, "audits"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLeads(list);
      } catch (error) {
        console.error("Database access error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, []);

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen font-sans">
      {/* Header: Ops Center Branding */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-yellow-500">
            <Shield size={32} />
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Ops <span className="text-yellow-500">Center</span></h2>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Confidential Entity Intelligence</p>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl min-w-[150px] text-center">
          <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Intelligence Gathered</p>
          <p className="text-2xl font-black text-white">{leads.length} <span className="text-xs text-slate-600 uppercase">Leads</span></p>
        </div>
      </div>

      {/* Leads Pipeline */}
      <div className="grid gap-6">
        {loading ? (
          <div className="flex flex-col items-center py-20 space-y-4">
            <Loader2 className="animate-spin text-yellow-500" size={40} />
            <p className="text-slate-500 uppercase font-black text-[10px] tracking-widest text-center">Synchronizing with Knowledge Graph...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-20 border-2 border-dashed border-slate-900 rounded-[3rem] text-slate-700 text-center uppercase font-black tracking-widest">
            No Entity Scans Recorded
          </div>
        ) : (
          leads.map((lead) => (
            <div key={lead.id} className="p-8 border border-slate-800 rounded-[2.5rem] bg-slate-900/20 hover:border-yellow-500/20 transition-all group">
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                
                {/* Lead Profile */}
                <div className="space-y-4 flex-grow">
                  <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">{lead.businessName}</h3>
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
                      <MapPin size={14} className="text-yellow-500" />
                      {lead.location}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-6 pt-2">
                    <div className="flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-wider">
                      <Users size={14} className="text-slate-600" /> {lead.fullName}
                    </div>
                    <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-blue-400 text-xs font-black hover:text-blue-300 transition-colors uppercase tracking-widest border-b border-blue-400/20 pb-0.5">
                      <Mail size={14} /> {lead.email}
                    </a>
                    <a href={`https://wa.me/${lead.whatsapp}`} target="_blank" className="flex items-center gap-2 text-green-500 text-xs font-black hover:text-green-400 transition-colors uppercase tracking-widest border-b border-green-500/20 pb-0.5">
                      <Phone size={14} /> WhatsApp
                    </a>
                  </div>
                </div>

                {/* Audit Signature */}
                <div className="text-left lg:text-right space-y-2 shrink-0 border-l lg:border-l-0 lg:border-r border-slate-800 pl-6 lg:pl-0 lg:pr-6">
                   <div className="bg-yellow-500 text-slate-950 px-4 py-1.5 rounded-full inline-block font-black text-[9px] uppercase tracking-widest shadow-xl shadow-yellow-500/10">
                     Protocol Scanned
                   </div>
                   <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest block">
                     <Clock size={10} className="inline mr-1" /> {lead.timestamp?.toDate().toLocaleString()}
                   </p>
                </div>
              </div>

              {/* Strategic Preview */}
              <div className="mt-8 p-8 bg-slate-950/50 rounded-[2rem] border border-slate-800 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4 text-slate-500 font-black uppercase text-[9px] tracking-[0.3em]">
                  <FileText size={14} className="text-yellow-500" /> Confidential Audit Analysis
                </div>
                <div className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap font-medium italic line-clamp-6">
                  {lead.analysis}
                </div>
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none"></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
