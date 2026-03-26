import React from 'react';
import { Search, Activity } from 'lucide-react';

interface ClientMatrixProps {
  clientAudits: any[];
}

export const ClientMatrix: React.FC<ClientMatrixProps> = ({ clientAudits }) => {
  return (
    <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
      <div className="p-6 border-b border-gray-800 flex items-center gap-3">
        <Search className="text-yellow-500" size={20} />
        <h3 className="font-black uppercase tracking-widest text-lg text-white">Your Digital Architectures</h3>
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
  );
};
