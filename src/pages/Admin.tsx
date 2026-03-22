import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { signInWithRedirect, GoogleAuthProvider, onAuthStateChanged, signOut, getRedirectResult } from 'firebase/auth';
import { Terminal, Search, X, Crosshair, Calendar, Mail, Globe, Activity, Database, ShieldAlert, Lock, ArrowRight, MessageCircle, BarChart3, Smartphone, ShieldCheck, LogOut, Layers } from 'lucide-react';

export const Admin: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [activeView, setActiveView] = useState<'whatsapp' | 'web' | 'workspace'>('whatsapp');
  const [leads, setLeads] = useState<any[]>([]);
  const [prospects, setProspects] = useState<any[]>([]);
  const [workspaceTasks, setWorkspaceTasks] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [metrics, setMetrics] = useState({ total: 0, service: 0, price: 0 });

  const ADMIN_EMAILS = [
    'motsumitl@happyhunterdigital.com',
    'happyhunterdigital@gmail.com',
    'motsumitl@gmail.com',
    'Motsumitl@gmail.com'
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser && ADMIN_EMAILS.includes(currentUser.email || '')) {
        fetchAllData();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      // Switched from Popup to Redirect to bypass mobile browser restrictions
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Authentication Failed:", error);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const qLeads = query(collection(db, 'leads'), orderBy('timestamp', 'desc'));
      const leadsSnapshot = await getDocs(qLeads);
      const leadsData = leadsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().timestamp?.toDate().toLocaleString() || 'Unknown Date'
      }));
      setLeads(leadsData);

      const qProspects = query(collection(db, 'prospects'), orderBy('timestamp', 'desc'), limit(100));
      const prospectsSnapshot = await getDocs(qProspects);
      
      let sCount = 0;
      let pCount = 0;
      const prospectsData = prospectsSnapshot.docs.map(doc => {
        const data = doc.data();
        if (data.interest === 'service') sCount++;
        if (data.interest === 'price') pCount++;
        
        return {
          id: doc.id,
          phone: data.phone || 'Unknown',
          interest: data.interest || 'Unknown',
          last_inquiry: data.last_inquiry || 'No message',
          status: data.status || 'new_lead',
          date: data.timestamp?.toDate().toLocaleString() || 'Unknown Date'
        };
      });
      
      setProspects(prospectsData);
      setMetrics({ total: prospectsData.length, service: sCount, price: pCount });

      const qTasks = query(collection(db, 'workspace_tasks'), orderBy('createdAt', 'desc'));
      const tasksSnapshot = await getDocs(qTasks);
      const tasksData = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWorkspaceTasks(tasksData);
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

  const filteredProspects = prospects.filter(prospect => 
    (prospect.phone || '').includes(searchTerm) ||
    (prospect.last_inquiry || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-yellow-500 font-black uppercase tracking-widest text-sm animate-pulse">Securing Connection...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <ShieldCheck size={64} className="text-yellow-500 mb-6" />
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">HQ Command Center</h1>
        <p className="text-gray-400 mb-10 font-medium">Restricted Access. Entity Managers Only.</p>
        <button onClick={handleLogin} className="bg-yellow-500 text-black px-10 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-white transition-all shadow-[0_0_40px_rgba(234,179,8,0.2)]">
          Authenticate via Google
        </button>
      </div>
    );
  }

  if (!ADMIN_EMAILS.includes(user.email || '')) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-black text-red-500 uppercase tracking-tighter mb-4">Access Denied</h1>
        <p className="text-gray-400 mb-8 font-medium">The digital passport associated with <strong className="text-white">{user.email}</strong> is not authorized for HQ access.</p>
        <button onClick={() => signOut(auth)} className="text-yellow-500 text-xs font-bold uppercase tracking-widest border border-yellow-500/50 px-6 py-3 rounded-lg hover:bg-yellow-500/10 transition-colors">
          Disconnect Session
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 font-sans selection:bg-yellow-500 selection:text-black animate-fade-in">
      
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter flex items-center gap-3">
            <Terminal className="text-yellow-500" size={32} /> HQ Command
          </h1>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold flex items-center gap-2">
            Live Telemetry <span className="text-yellow-500 hidden md:inline">•</span> <span className="text-gray-400">{user.email}</span>
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="flex bg-gray-900 border border-gray-800 rounded-xl overflow-hidden p-1">
            <button
              onClick={() => setActiveView('whatsapp')}
              className={`flex items-center gap-2 px-6 py-2 text-sm font-bold uppercase tracking-widest rounded-lg transition-colors ${activeView === 'whatsapp' ? 'bg-yellow-500 text-black' : 'text-gray-500 hover:text-white'}`}
            >
              <MessageCircle size={16} /> WhatsApp AI
            </button>
            <button
              onClick={() => setActiveView('web')}
              className={`flex items-center gap-2 px-6 py-2 text-sm font-bold uppercase tracking-widest rounded-lg transition-colors ${activeView === 'web' ? 'bg-yellow-500 text-black' : 'text-gray-500 hover:text-white'}`}
            >
              <Globe size={16} /> Web Leads
            </button>
            <button
              onClick={() => setActiveView('workspace')}
              className={`flex items-center gap-2 px-6 py-2 text-sm font-bold uppercase tracking-widest rounded-lg transition-colors ${activeView === 'workspace' ? 'bg-yellow-500 text-black' : 'text-gray-500 hover:text-white'}`}
            >
              <Layers size={16} /> Project Health
            </button>
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search data..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black border border-gray-800 text-white pl-12 pr-4 py-3 rounded-xl focus:border-yellow-500 outline-none text-sm"
            />
          </div>

          <button onClick={() => signOut(auth)} className="flex items-center justify-center gap-2 bg-[#0a0a0a] border border-gray-800 text-gray-400 hover:text-red-500 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {activeView === 'whatsapp' && (
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
      )}

      {activeView === 'web' && (
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
      )}

      {activeView === 'workspace' && (
        <div className="max-w-7xl mx-auto animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-black border border-gray-800 p-6 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
              <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">Total System Nodes</h3>
              <p className="text-4xl font-black text-white">{workspaceTasks.length}</p>
            </div>
            <div className="bg-black border border-gray-800 p-6 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">To Do</h3>
              <p className="text-4xl font-black text-blue-500">{workspaceTasks.filter(t => t.status === 'To Do').length}</p>
            </div>
            <div className="bg-black border border-gray-800 p-6 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
              <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">Active (WIP)</h3>
              <p className="text-4xl font-black text-orange-500">{workspaceTasks.filter(t => t.status === 'In Progress').length}</p>
            </div>
            <div className="bg-black border border-gray-800 p-6 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
              <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">Verified (Done)</h3>
              <p className="text-4xl font-black text-green-500">{workspaceTasks.filter(t => t.status === 'Done').length}</p>
            </div>
          </div>

          <div className="bg-black border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0a0a0a] border-b border-gray-800 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                    <th className="p-5">Task Objective</th>
                    <th className="p-5">Strategic Status</th>
                    <th className="p-5">Resource Assigned</th>
                    <th className="p-5">Timeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-sm">
                  {workspaceTasks.length === 0 ? (
                    <tr><td colSpan={4} className="p-10 text-center text-gray-500 font-mono">Mission control is currently idle. No active tasks.</td></tr>
                  ) : (
                    workspaceTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-gray-900/50 transition-colors">
                        <td className="p-5 font-bold text-white uppercase tracking-tight">{task.title}</td>
                        <td className="p-5">
                          <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                            task.status === 'Done' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                            task.status === 'In Progress' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                            'bg-blue-500/10 text-blue-500 border-blue-500/20'
                          }`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="p-5 text-gray-400 font-bold uppercase text-xs">{task.assignee}</td>
                        <td className="p-5 text-gray-500 text-xs font-mono lowercase">{task.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedLead && activeView === 'web' && (
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
      )}
    </div>
  );
};
