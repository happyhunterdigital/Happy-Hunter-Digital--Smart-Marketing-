import React from 'react';
import { BarChart3, Smartphone } from 'lucide-react';

interface WhatsAppViewProps {
  metrics: { total: number; service: number; price: number };
  loading: boolean;
  filteredProspects: any[];
}

export const WhatsAppView: React.FC<WhatsAppViewProps> = ({ metrics, loading, filteredProspects }) => (
  <div className="max-w-7xl mx-auto animate-fade-in">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-black border border-gray-800 p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
        <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">Total AI Interactions</h3>
        <p className="text-4xl font-black text-white">{metrics.total}</p>
      </div>
      <div className="bg-black border border-gray-800 p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
        <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1 flex items-center gap-2"><BarChart3 size={14}/> High Intent (Services)</h3>
        <p className="text-4xl font-black text-green-500">{metrics.service}</p>
      </div>
      <div className="bg-black border border-gray-800 p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
        <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">Pricing Shoppers</h3>
        <p className="text-4xl font-black text-blue-500">{metrics.price}</p>
      </div>
    </div>

    <div className="bg-black border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0a0a0a] border-b border-gray-800 text-gray-500 text-[10px] font-black uppercase tracking-widest">
              <th className="p-5">Timestamp</th>
              <th className="p-5">Phone Number</th>
              <th className="p-5">Interest Profile</th>
              <th className="p-5">Latest Inquiry</th>
              <th className="p-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 text-sm">
            {loading ? (
              <tr><td colSpan={5} className="p-10 text-center text-gray-500 font-mono animate-pulse">Syncing AI Database...</td></tr>
            ) : filteredProspects.length === 0 ? (
              <tr><td colSpan={5} className="p-10 text-center text-gray-500 font-mono">No AI interactions recorded yet.</td></tr>
            ) : (
              filteredProspects.map((prospect) => (
                <tr key={prospect.id} className="hover:bg-gray-900/50 transition-colors group">
                  <td className="p-5 text-gray-400 text-xs font-mono">{prospect.date}</td>
                  <td className="p-5 font-bold text-yellow-500 flex items-center gap-2 mt-1">
                    <Smartphone size={14} className="text-gray-500"/> {prospect.phone}
                  </td>
                  <td className="p-5">
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                      prospect.interest === 'service' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                    }`}>
                      {prospect.interest}
                    </span>
                  </td>
                  <td className="p-5 text-gray-300 italic max-w-xs truncate" title={prospect.last_inquiry}>
                    "{prospect.last_inquiry}"
                  </td>
                  <td className="p-5 text-right">
                    <a
                      href={`https://wa.me/${prospect.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#1a1a1a] border border-gray-700 hover:border-yellow-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:text-yellow-500 transition-all inline-block"
                    >
                      Hijack Chat
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
