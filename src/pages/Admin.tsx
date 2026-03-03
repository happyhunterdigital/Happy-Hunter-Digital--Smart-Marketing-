import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Terminal, Search, X, Crosshair, Calendar, Mail, Globe, Activity, Database, ShieldAlert, Lock, ArrowRight } from 'lucide-react';

export const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // The Frontend Security Gate (Passcode: HUNTER2026)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'HUNTER2026') {
      setIsAuthenticated(true);
      fetchLeads();
    } else {
      alert("ACCESS DENIED: Invalid Command Override.");
      setPasscode('');
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'leads'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const leadsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firebase Timestamp to a readable string safely
        date: doc.data().timestamp?.toDate().toLocaleString() || 'Unknown Date'
      }));
      setLeads(leadsData);
    } catch (error) {
      console.error("Error fetching intelligence data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => 
    (lead.businessName || lead.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 selection:bg-yellow-500 selection:text-black">
        <form onSubmit={handleLogin} className="max-w-md w-full bg-black border border-gray-800 p-10 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
          <ShieldAlert className="text-yellow-500 mb-6 mx-auto" size={48} />
          <h2 className="text-2xl font-black text-white text-center uppercase tracking-widest mb-2">HQ Command Center</h2>
          <p className="text-gray-500 text-xs text-center uppercase tracking-widest mb-8">Restricted Intelligence Hub</p>
          
          <div className="relative mb-6">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="password" 
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter Master Passcode" 
              className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-12 py-4 rounded-xl focus:border-yellow-500 outline-none tracking-widest font-mono"
            />
          </div>
          <button type="submit" className="w-full bg-yellow-500 text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-white transition-colors flex justify-center items-center gap-2">
            Initiate Override <ArrowRight size={18} />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter flex items-center gap-3">
            <Terminal className="text-yellow-500" size={32} /> HQ Command
          </h1>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Live Intelligence & Lead Telemetry</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search entities or emails..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-gray-800 text-white pl-12 pr-4 py-3 rounded-xl focus:border-yellow-500 outline-none text-sm"
          />
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="max-w-7xl mx-auto bg-black border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a0a0a] border-b border-gray-800 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                <th className="p-5">Timestamp</th>
                <th className="p-5">Target Entity / Name</th>
                <th className="p-5">Contact Vector</th>
                <th className="p-5">Origin Source</th>
                <th className="p-5">Score / Service</th>
                <th className="p-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-500 font-mono animate-pulse">
                    Extracting data from Firebase core...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-500 font-mono">
                    No active targets found in the database.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-900/50 transition-colors cursor-pointer group" onClick={() => setSelectedLead(lead)}>
                    <td className="p-5 text-gray-400 text-xs font-mono">{lead.date}</td>
                    <td className="p-5 font-bold text-white group-hover:text-yellow-500 transition-colors">
                      {lead.businessName || lead.name || 'Unknown Entity'}
                    </td>
                    <td className="p-5 text-gray-300">{lead.email}</td>
                    <td className="p-5">
                      <span className="bg-gray-800 text-gray-300 text-[9px] px-2 py-1 rounded uppercase tracking-wider font-bold">
                        {lead.source || 'Smart Audit Scan'}
                      </span>
                    </td>
                    <td className="p-5 font-black">
                      {lead.score !== undefined ? (
                        <span className={lead.score >= 70 ? 'text-green-500' : lead.score >= 40 ? 'text-yellow-500' : 'text-red-500'}>
                          {lead.score}/100
                        </span>
                      ) : (
                        <span className="text-yellow-500 text-xs truncate max-w-[150px] inline-block">{lead.service}</span>
                      )}
                    </td>
                    <td className="p-5 text-right">
                      <button className="text-gray-500 hover:text-white transition-colors">
                        <Crosshair size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL (Pops up when clicking a lead) */}
      {selectedLead && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black">
              <div className="flex items-center gap-3">
                <Database className="text-yellow-500" size={20} />
                <h3 className="font-black uppercase tracking-widest text-lg">Target Dossier</h3>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-gray-500 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2"><Globe size={12}/> Entity Name</p>
                  <p className="font-bold text-xl text-white">{selectedLead.businessName || selectedLead.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2"><Mail size={12}/> Contact Vector</p>
                  <p className="font-bold text-lg text-yellow-500">{selectedLead.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 bg-black border border-gray-800 p-5 rounded-xl">
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2"><Calendar size={12}/> Timestamp</p>
                  <p className="text-sm font-mono text-gray-300">{selectedLead.date}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2"><Activity size={12}/> Origin Source</p>
                  <p className="text-sm text-gray-300">{selectedLead.source || 'Smart Marketing Audit'}</p>
                </div>
              </div>

              {/* Conditional Display: Audit vs Service Request */}
              {selectedLead.score !== undefined && (
                <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl text-center">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Digital Survival Score</p>
                  <span className={`text-6xl font-black ${selectedLead.score >= 70 ? 'text-green-500' : selectedLead.score >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {selectedLead.score}
                  </span>
                  <span className="text-gray-500 text-xl font-bold">/100</span>
                </div>
              )}

              {selectedLead.service && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-xl">
                  <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-2">Requested Architecture</p>
                  <p className="font-bold text-lg text-white">{selectedLead.service}</p>
                  {selectedLead.website && (
                    <p className="mt-2 text-sm text-gray-400">Target URL: <a href={selectedLead.website.startsWith('http') ? selectedLead.website : `https://${selectedLead.website}`} target="_blank" rel="noreferrer" className="text-yellow-500 underline">{selectedLead.website}</a></p>
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-black border-t border-gray-800 flex gap-4">
              <a href={`mailto:${selectedLead.email}`} className="flex-1 bg-yellow-500 text-black text-center font-black uppercase tracking-widest py-3 rounded-xl hover:bg-white transition-colors text-xs">
                Draft Email Protocol
              </a>
              <button onClick={() => setSelectedLead(null)} className="flex-1 bg-[#0a0a0a] border border-gray-800 text-white font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-gray-900 transition-colors text-xs">
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
