import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { GoogleAuthProvider, signInWithRedirect, onAuthStateChanged } from 'firebase/auth';
import { Users, FileText, Lock, Layout, Database, TerminalSquare } from 'lucide-react';
import { KanbanBoard } from './KanbanBoard';
import { KnowledgeVault } from './KnowledgeVault';
import { EntityInjector } from './EntityInjector';

export const Workspace: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Entity Matrix');
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const qInvites = query(collection(db, 'workspaces'), where('invites', 'array-contains', u.email));
          const inviteSnapshot = await getDocs(qInvites);
          for (const wsDoc of inviteSnapshot.docs) {
            const wsData = wsDoc.data();
            if (!wsData.members.includes(u.uid)) {
              await updateDoc(doc(db, 'workspaces', wsDoc.id), {
                members: [...wsData.members, u.uid],
                invites: wsData.invites.filter((email: string) => email !== u.email)
              });
            }
          }
        } catch (e) { console.error("Invite Sync Error", e); }

        const qWS = query(collection(db, 'workspaces'), where('members', 'array-contains', u.uid));
        const unsubscribeWS = onSnapshot(qWS, (snapshot) => {
          const wsList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setWorkspaces(wsList);
          if (wsList.length > 0 && !activeWorkspace) setActiveWorkspace(wsList[0]);
          setLoading(false);
        });
        return () => unsubscribeWS();
      } else {
        setLoading(false);
        return () => {};
      }
    });
    return () => unsubscribeAuth();
  }, [activeWorkspace]);

  useEffect(() => {
    if (user && activeWorkspace) {
      const qTasks = query(collection(db, 'workspace_tasks'), where('workspaceId', '==', activeWorkspace.id));
      const unsubscribeTasks = onSnapshot(qTasks, (snapshot) => {
        setTasks(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      });
      return () => unsubscribeTasks();
    }
    return () => {};
  }, [user, activeWorkspace]);

  const createWorkspace = async () => {
    if (!newWorkspaceName || !user) return;
    await addDoc(collection(db, 'workspaces'), {
      name: newWorkspaceName,
      ownerId: user.uid,
      members: [user.uid],
      invites: [],
      brandVoice: 'Define your brand voice here...',
      techSpec: 'Define your technical specifications here...',
      roadmap: 'Define your strategic roadmap here...',
      createdAt: serverTimestamp()
    });
    setNewWorkspaceName('');
    setIsCreatingWorkspace(false);
  };

  const inviteMember = async () => {
    if (!inviteEmail || !activeWorkspace) return;
    await updateDoc(doc(db, 'workspaces', activeWorkspace.id), {
      invites: [...(activeWorkspace.invites || []), inviteEmail]
    });
    setInviteEmail('');
    alert(`Invite sent to ${inviteEmail}. They will see this workspace once they login.`);
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-yellow-500 font-black uppercase tracking-widest">Synchronizing Entity...</div>;

  if (!user) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
      <Lock size={64} className="text-yellow-500 mb-6" />
      <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Unified Command Access</h1>
      <button onClick={() => signInWithRedirect(auth, new GoogleAuthProvider())} className="bg-yellow-500 text-black px-10 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-white mt-10">Authorize via Google</button>
    </div>
  );

  if (workspaces.length === 0 && !isCreatingWorkspace) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
      <Database size={64} className="text-gray-700 mb-6" />
      <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">No Workspace Found</h1>
      <button onClick={() => setIsCreatingWorkspace(true)} className="bg-yellow-500 text-black px-10 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-white mt-10">Initialize Entity</button>
    </div>
  );

  const isWSAdmin = activeWorkspace?.roles?.[user?.uid] === 'admin' || activeWorkspace?.ownerId === user?.uid;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row pt-20">
      <aside className="w-full lg:w-72 bg-black border-r border-gray-900 p-6 flex flex-col gap-8">
        <div>
          <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Select Workspace</h2>
          <select value={activeWorkspace?.id} onChange={(e) => setActiveWorkspace(workspaces.find(w => w.id === e.target.value))} className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-yellow-500 font-bold outline-none">
            {workspaces.map(ws => <option key={ws.id} value={ws.id}>{ws.name}</option>)}
          </select>
          <button onClick={() => setIsCreatingWorkspace(true)} className="mt-4 text-[10px] text-gray-400 hover:text-white uppercase font-black">+ Create New</button>
        </div>
        <nav className="flex flex-col gap-2">
          {['Entity Matrix', 'Knowledge Base', 'Team Sovereignty', ...(isWSAdmin ? ['Entity Injector'] : [])].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest ${activeTab === tab ? 'bg-yellow-500 text-black' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              {tab === 'Entity Matrix' && <Layout size={18}/>}
              {tab === 'Knowledge Base' && <FileText size={18}/>}
              {tab === 'Team Sovereignty' && <Users size={18}/>}
              {tab === 'Entity Injector' && <TerminalSquare size={18}/>}
              {tab}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        {isCreatingWorkspace ? (
          <div className="max-w-md mx-auto py-20 text-center animate-fade-in">
            <h2 className="text-3xl font-black uppercase mb-6">Initialize New Entity</h2>
            <input type="text" placeholder="Workspace Name" value={newWorkspaceName} onChange={(e) => setNewWorkspaceName(e.target.value)} className="w-full bg-black border border-gray-800 p-5 rounded-2xl mb-4 outline-none focus:border-yellow-500" />
            <div className="flex gap-4">
              <button onClick={createWorkspace} className="flex-1 bg-yellow-500 text-black p-4 rounded-xl font-black uppercase text-xs">Create</button>
              <button onClick={() => setIsCreatingWorkspace(false)} className="flex-1 bg-gray-900 text-white p-4 rounded-xl font-black uppercase text-xs">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <header className="mb-12 border-b border-gray-900 pb-8">
              <h1 className="text-5xl font-black uppercase tracking-tighter">{activeWorkspace?.name}</h1>
              <p className="text-gray-500 mt-2 font-bold uppercase text-xs tracking-widest">{activeTab}</p>
            </header>

            {activeTab === 'Entity Matrix' && <KanbanBoard activeWorkspace={activeWorkspace} tasks={tasks} user={user} />}
            {activeTab === 'Knowledge Base' && <KnowledgeVault activeWorkspace={activeWorkspace} />}
            {activeTab === 'Entity Injector' && isWSAdmin && <EntityInjector activeWorkspace={activeWorkspace} />}
            
            {activeTab === 'Team Sovereignty' && (
              <div className="max-w-2xl">
                {isWSAdmin && (
                  <section className="bg-black/40 border border-gray-900 rounded-3xl p-8 mb-12">
                    <h3 className="text-xl font-black uppercase mb-6">Invite Entity Member</h3>
                    <div className="flex gap-4">
                      <input type="email" placeholder="email@example.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="flex-1 bg-black border border-gray-800 p-4 rounded-xl outline-none focus:border-yellow-500 font-bold" />
                      <button onClick={inviteMember} className="bg-yellow-500 text-black px-8 py-4 rounded-xl font-black uppercase text-xs">Send Invite</button>
                    </div>
                  </section>
                )}
                <section>
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Verified Members</h3>
                  <div className="flex flex-col gap-4">
                    {activeWorkspace?.members.map((m: string) => (
                      <div key={m} className="bg-gray-900/50 border border-gray-800 p-5 rounded-2xl flex items-center justify-between">
                        <span className="font-bold text-sm text-gray-300">{m}</span>
                        <span className="text-[9px] font-black uppercase text-green-500 bg-green-500/10 px-3 py-1 rounded-full">Verified</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
