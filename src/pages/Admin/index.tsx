import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { signInWithRedirect, GoogleAuthProvider, onAuthStateChanged, signOut, getRedirectResult } from 'firebase/auth';
import { Terminal, Search, ShieldCheck, LogOut, MessageCircle, Globe, Layers } from 'lucide-react';
import { WhatsAppView } from './WhatsAppView';
import { WebView } from './WebView';
import { WorkspaceView } from './WorkspaceView';
import { LeadDossier } from './LeadDossier';

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
    getRedirectResult(auth).then((result) => {
      if (result) setUser(result.user);
    }).catch(err => console.error("Admin Redirect Error:", err));

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
            <button onClick={() => setActiveView('whatsapp')} className={`flex items-center gap-2 px-6 py-2 text-sm font-bold uppercase tracking-widest rounded-lg transition-colors ${activeView === 'whatsapp' ? 'bg-yellow-500 text-black' : 'text-gray-500 hover:text-white'}`}>
              <MessageCircle size={16} /> WhatsApp AI
            </button>
            <button onClick={() => setActiveView('web')} className={`flex items-center gap-2 px-6 py-2 text-sm font-bold uppercase tracking-widest rounded-lg transition-colors ${activeView === 'web' ? 'bg-yellow-500 text-black' : 'text-gray-500 hover:text-white'}`}>
              <Globe size={16} /> Web Leads
            </button>
            <button onClick={() => setActiveView('workspace')} className={`flex items-center gap-2 px-6 py-2 text-sm font-bold uppercase tracking-widest rounded-lg transition-colors ${activeView === 'workspace' ? 'bg-yellow-500 text-black' : 'text-gray-500 hover:text-white'}`}>
              <Layers size={16} /> Project Health
            </button>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input type="text" placeholder="Search data..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-black border border-gray-800 text-white pl-12 pr-4 py-3 rounded-xl focus:border-yellow-500 outline-none text-sm" />
          </div>
          <button onClick={() => signOut(auth)} className="flex items-center justify-center gap-2 bg-[#0a0a0a] border border-gray-800 text-gray-400 hover:text-red-500 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {activeView === 'whatsapp' && <WhatsAppView metrics={metrics} loading={loading} filteredProspects={filteredProspects} />}
      {activeView === 'web' && <WebView loading={loading} filteredLeads={filteredLeads} setSelectedLead={setSelectedLead} />}
      {activeView === 'workspace' && <WorkspaceView workspaceTasks={workspaceTasks} />}
      {selectedLead && activeView === 'web' && <LeadDossier selectedLead={selectedLead} setSelectedLead={setSelectedLead} />}
    </div>
  );
};
