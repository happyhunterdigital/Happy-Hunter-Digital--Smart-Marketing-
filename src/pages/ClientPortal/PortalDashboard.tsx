import React from 'react';
import { Loader2, Search, Activity, Database, BarChart3, ShieldCheck, Target } from 'lucide-react';

interface DashboardProps {
  user: any;
  isAdmin: boolean;
  dataLoading: boolean;
  clientAudits: any[];
  adminStats: any;
  onLogout: () => void;
}

export const PortalDashboard: React.FC<DashboardProps> = ({ user, isAdmin, dataLoading, clientAudits, adminStats, onLogout }) => {
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
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Handshake Active
          </p>
          <button onClick={onLogout} className="text-gray-500 hover:text-red-500 transition-colors text-[10px] font-bold uppercase tracking-widest bg-gray-900 px-4 py-2 rounded-lg leading-none">
            Secure Logout
          </button>
        </div>
      </div>

      {dataLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-yellow-500" size={40} /></div>
      ) : (
        <>
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
