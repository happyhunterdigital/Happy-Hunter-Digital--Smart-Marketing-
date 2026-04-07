import React from 'react';

interface WebViewProps {
  loading: boolean;
  filteredLeads: any[];
  setSelectedLead: (lead: any) => void;
}

export const WebView: React.FC<WebViewProps> = ({ loading, filteredLeads, setSelectedLead }) => (
  <div className="max-w-7xl mx-auto bg-black border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative animate-fade-in">
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
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);
