// src/pages/ClientPortal/PortalDashboard.tsx
import React from 'react';
import { Loader2, Zap, ArrowRight } from 'lucide-react';
import { AdminMatrix } from './AdminMatrix';
import { ClientMatrix } from './ClientMatrix';
import { Link } from 'react-router-dom';

interface DashboardProps {
  user: any;
  isAdmin: boolean;
  dataLoading: boolean;
  clientAudits: any[];
  adminStats: any;
  onLogout: () => void;
}

export const PortalDashboard: React.FC<DashboardProps> = ({ user, isAdmin, dataLoading, clientAudits, adminStats, onLogout }) => {
  // Intent-based calculation for clients
  const latestAudit = clientAudits.length > 0 ? clientAudits[0] : null;
  const score = latestAudit?.score || 0;
  
  let nextPhase = { title: "Phase 1: Entity Architecture", desc: "You need a foundational Digital Passport.", link: "/services" };
  if (score >= 70) {
    nextPhase = { title: "Phase 3: Agentic Revenue", desc: "Your entity is secure. Ready to automate lead capture?", link: "/services" };
  } else if (score >= 40) {
    nextPhase = { title: "Phase 2: Governance", desc: "Your entity exists but lacks authority. Implement AEO Retainers.", link: "/services" };
  }

  return (
    <div className="pt-40 pb-20 px-6 max-w-6xl mx-auto min-h-screen font-sans animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8 border-b border-gray-800 pb-8">
        <div>
          <span className="text-yellow-500 font-black uppercase tracking-[0.4em] text-[10px] mb-2 block">
            {isAdmin ? "HQ Command Matrix" : "Client Command Node"}
          </span>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none">
            {isAdmin ? "Admin Overview" : "Your Entities"}
          </h2>
          <p className="text-gray-500 text-sm mt-3 font-mono">Node Identity: <strong className="text-white">{user.email}</strong></p>
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

      {!isAdmin && !dataLoading && clientAudits.length > 0 && (
        <div className="mb-12 bg-black border border-yellow-500/30 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-neural-glow">
          <div>
            <p className="text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2"><Zap size={14}/> Intent-Based Roadmap Prediction</p>
            <h3 className="text-2xl font-black text-white mb-2">{nextPhase.title}</h3>
            <p className="text-gray-400 text-sm">{nextPhase.desc}</p>
          </div>
          <Link to={nextPhase.link} className="shrink-0 bg-yellow-500 text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-white transition-all">
            Deploy Architecture <ArrowRight size={14}/>
          </Link>
        </div>
      )}

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
