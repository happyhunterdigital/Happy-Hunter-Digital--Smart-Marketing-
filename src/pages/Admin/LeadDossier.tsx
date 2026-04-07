import React from 'react';
import { X, Globe, Mail, Calendar, Activity, Database } from 'lucide-react';

interface LeadDossierProps {
  selectedLead: any;
  setSelectedLead: (lead: any | null) => void;
}

export const LeadDossier: React.FC<LeadDossierProps> = ({ selectedLead, setSelectedLead }) => {
  if (!selectedLead) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black">
          <div className="flex items-center gap-3">
            <Database className="text-yellow-500" size={20} />
            <h3 className="font-black uppercase tracking-widest text-lg">Target Dossier</h3>
          </div>
          <button onClick={() => setSelectedLead(null)} className="text-gray-500 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>
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
  );
};
