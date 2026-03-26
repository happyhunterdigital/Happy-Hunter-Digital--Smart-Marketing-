import React from 'react';
import { Loader2 } from 'lucide-react';
import { AdminMatrix } from './AdminMatrix';
import { ClientMatrix } from './ClientMatrix';

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
      ) : isAdmin ? (
        <AdminMatrix clientAudits={clientAudits} adminStats={adminStats} />
      ) : (
        <ClientMatrix clientAudits={clientAudits} />
      )}
    </div>
  );
};
