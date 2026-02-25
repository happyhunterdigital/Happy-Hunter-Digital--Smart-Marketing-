import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ShieldCheck, Clock, Lock, Loader2, LogOut } from 'lucide-react';

export const ClientPortal = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // MOCK DATA: In a production scenario, this pulls dynamically from Firestore based on the user's UID
  const entityData = {
    name: "Profuse Beauty",
    trustScore: 78,
    status: "Handshake Active",
    nodes: [
      { date: "12 Feb", task: "GMB Video Verification", status: "VERIFIED", type: "Trust" },
      { date: "08 Feb", task: "AEO Content Cluster: Sensitive Skin", status: "INDEXED", type: "AEO" },
      { date: "01 Feb", task: "Schema.org Markup Integration", status: "STABLE", type: "Tech" },
      { date: "28 Jan", task: "Entity Audit Protocol", status: "COMPLETED", type: "Audit" }
    ]
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError("");
    try { 
      await signInWithEmailAndPassword(auth, email, password); 
    } catch (e: any) { 
      setLoginError("Invalid Security Clearance."); 
    }
    setLoading(false);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <Loader2 className="animate-spin text-yellow-500" size={48} />
      </div>
    );
  }

  // LOGIN GATE
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] px-6 animate-fade-in pt-20">
        <div className="max-w-md w-full p-10 md:p-12 border border-gray-800 rounded-[3rem] bg-[#0a0a0a] text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
          <Lock className="text-yellow-500 mx-auto mb-6" size={40} />
          <h2 className="text-3xl font-black uppercase text-white mb-2 tracking-tighter">Entity Portal</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-10">Restricted Client Access</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" 
              placeholder="Client Email ID" 
              className="w-full bg-black border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-yellow-500 transition-colors" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
            />
            <input 
              type="password" 
              placeholder="Protocol Key (Password)" 
              className="w-full bg-black border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-yellow-500 transition-colors" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
            />
            {loginError && <p className="text-red-500 text-xs font-bold">{loginError}</p>}
            <button type="submit" className="w-full bg-yellow-500 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-colors mt-4">
              Enter Command Center
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ACTIVE DASHBOARD
  return (
    <div className="pt-40 pb-20 px-6 max-w-6xl mx-auto min-h-screen font-sans animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 border-b border-gray-800 pb-8">
        <div>
          <span className="text-yellow-500 font-black uppercase tracking-[0.4em] text-[10px] mb-2 block">Client Command Node</span>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none">{entityData.name}</h2>
        </div>
        <div className="flex flex-col md:items-end gap-4">
          <div className="text-left md:text-right">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Protocol Status</p>
            <p className="text-green-500 font-black uppercase text-lg md:text-xl tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> {entityData.status}
            </p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors text-[10px] font-bold uppercase tracking-widest bg-gray-900 px-4 py-2 rounded-lg">
            <LogOut size={14}/> Secure Logout
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* 1. TRUST METER */}
        <div className="lg:col-span-1 p-10 border border-gray-800 rounded-[3rem] bg-[#0a0a0a] text-center flex flex-col justify-center relative shadow-xl">
          <h3 className="text-white font-black uppercase text-xs tracking-widest mb-8">Entity Trust Factor</h3>
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
            {/* Background Circle */}
            <svg className="w-full h-full rotate-[-90deg]">
              <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-900" />
              {/* Foreground Progress Circle (Calculation: 2 * Math.PI * 88 = ~552) */}
              <circle 
                cx="96" cy="96" r="88" 
                stroke="currentColor" strokeWidth="12" fill="transparent" 
                strokeDasharray={552} 
                strokeDashoffset={552 - (552 * entityData.trustScore) / 100} 
                className="text-yellow-500 transition-all duration-1000 ease-out" 
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
               <span className="text-6xl font-black text-white leading-none tracking-tighter">{entityData.trustScore}</span>
               <span className="text-[10px] font-bold text-gray-500 tracking-widest">/ 100</span>
            </div>
          </div>
          <p className="mt-8 text-gray-400 text-sm leading-relaxed">Algorithmic confidence level within the Google Knowledge Graph.</p>
        </div>

        {/* 2. ENTITY TIMELINE */}
        <div className="lg:col-span-2 p-10 border border-gray-800 rounded-[3rem] bg-[#0a0a0a] shadow-xl">
           <h3 className="text-yellow-500 font-black uppercase text-xs tracking-widest mb-10 flex items-center gap-3 border-b border-gray-800 pb-4">
             <Clock size={16} /> Node Verification Timeline
           </h3>
           <div className="space-y-8 relative">
              {/* Vertical Line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-800" />
              
              {entityData.nodes.map((node, i) => (
                <div key={i} className="relative pl-10 group">
                  <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-black border-2 border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)] z-10" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/50 pb-6 group-last:border-0 group-last:pb-0">
                    <div>
                      <h4 className="text-white font-black uppercase text-sm md:text-base tracking-tight">{node.task}</h4>
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mt-2">
                        <span className="bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded">{node.type} Protocol</span> • {node.date}
                      </p>
                    </div>
                    <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 shrink-0 text-center">
                      <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">{node.status}</span>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>

      </div>

      {/* 3. REVENUE FORECASTING NODE */}
      <div className="mt-10 p-10 md:p-12 border border-gray-800 rounded-[3rem] bg-gradient-to-r from-[#0a0a0a] to-black grid md:grid-cols-2 gap-12 items-center shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-10 opacity-5"><ShieldCheck size={150} /></div>
         
         <div className="space-y-4 relative z-10">
            <h3 className="text-3xl font-black uppercase text-white tracking-tighter">Retainer <span className="text-yellow-500">Justification</span></h3>
            <p className="text-gray-400 text-base leading-relaxed font-medium">We aren't optimizing for vanity clicks; we are optimizing for 2026 survival. Every verified node explicitly decreases your customer acquisition cost.</p>
         </div>
         
         <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="p-6 bg-black rounded-2xl border border-gray-800 text-center">
               <p className="text-yellow-500 font-black text-3xl md:text-4xl leading-none mb-2">310%</p>
               <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Visibility Lift</p>
            </div>
            <div className="p-6 bg-black rounded-2xl border border-gray-800 text-center">
               <p className="text-yellow-500 font-black text-3xl md:text-4xl leading-none mb-2">R4,500</p>
               <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Daily Revenue Protection</p>
            </div>
         </div>
      </div>

    </div>
  );
};
