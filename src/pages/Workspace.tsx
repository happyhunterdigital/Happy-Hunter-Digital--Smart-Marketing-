import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, orderBy, deleteDoc, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { getAuth, GoogleAuthProvider, signInWithRedirect, onAuthStateChanged, signOut, getRedirectResult } from 'firebase/auth';
import { CheckCircle2, Clock, Plus, Layout, Users, FileText, MessageSquare, Lock, Trash2, Calendar, Zap } from 'lucide-react';

export const Workspace: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Task Board');
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [mobileColumn, setMobileColumn] = useState('Not Started');

  const PRIORITY_COLORS: any = {
    'Critical': 'text-red-500 bg-red-500/10 border-red-500/20',
    'High': 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    'Medium': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    'Low': 'text-green-500 bg-green-500/10 border-green-500/20'
  };

  const columns = ['Not Started', 'In Progress', 'Complete'];

  useEffect(() => {
    getRedirectResult(auth).then((result) => {
      if (result) {
        setUser(result.user);
      }
    }).catch((error) => {
      console.error("Redirect Error:", error);
    });

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
                invites: (wsData.invites || []).filter((email: string) => email !== u.email),
                [`roles.${u.uid}`]: 'member'
              });
            }
          }
        } catch (err) {
          console.warn("Auto-Accept Skip", err);
        }

        const qWS = query(collection(db, 'workspaces'), where('members', 'array-contains', u.uid));
        const unsubscribeWS = onSnapshot(qWS, (snapshot) => {
          const wsList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setWorkspaces(wsList);
          if (wsList.length > 0 && !activeWorkspace) {
            setActiveWorkspace(wsList[0]);
          }
          setLoading(false);
        });
        return () => unsubscribeWS();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user && activeWorkspace) {
      const qTasks = query(collection(db, 'workspace_tasks'), where('workspaceId', '==', activeWorkspace.id));
      const unsubscribeTasks = onSnapshot(qTasks, (snapshot) => {
        setTasks(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      });
      return () => unsubscribeTasks();
    }
  }, [user, activeWorkspace]);

  const progressPercentage = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(t => t.status === 'Complete').length;
    return Math.round((completedTasks / tasks.length) * 100);
  }, [tasks]);

  const addTask = async () => {
    if (!activeWorkspace) return;
    const title = prompt("Strategic Objective Title:");
    if (!title) return;
    const deadline = prompt("Deadline (e.g., 2026-04-15):", "2026-04-15");
    const priority = prompt("Priority (Critical, High, Medium, Low):", "Medium") || "Medium";
    const type = prompt("Type (Planning, Dev, Design, Audit):", "Dev") || "Dev";

    await addDoc(collection(db, 'workspace_tasks'), {
      workspaceId: activeWorkspace.id,
      title,
      status: 'Not Started',
      priority,
      type,
      assignee: user?.displayName || 'Agent',
      avatar: (user?.displayName || 'A').charAt(0).toUpperCase(),
      deadline: deadline || 'N/A',
      createdAt: serverTimestamp(),
      comments: []
    });
  };

  const advanceTask = async (taskId: string, currentStatus: string) => {
    const nextStatusMap: { [key: string]: string } = {
      'Not Started': 'In Progress',
      'In Progress': 'Complete',
      'Complete': 'Not Started'
    };
    await updateDoc(doc(db, 'workspace_tasks', taskId), {
      status: nextStatusMap[currentStatus] || 'Not Started'
    });
  };

  const addComment = async (taskId: string) => {
    const comment = prompt("Enter SITREP:");
    if (!comment) return;
    const task = tasks.find(t => t.id === taskId);
    const newComments = [...(task?.comments || []), {
      text: comment,
      user: user?.displayName || 'Agent',
      timestamp: new Date().toLocaleTimeString()
    }];
    await updateDoc(doc(db, 'workspace_tasks', taskId), { comments: newComments });
  };

  const createWorkspace = async () => {
    if (!newWorkspaceName || !user) return;
    await addDoc(collection(db, 'workspaces'), {
      name: newWorkspaceName,
      ownerId: user.uid,
      members: [user.uid],
      roles: { [user.uid]: 'admin' },
      createdAt: serverTimestamp()
    });
    setNewWorkspaceName('');
    setIsCreatingWorkspace(false);
  };

  const inviteMember = async () => {
    if (!inviteEmail || !activeWorkspace) return;
    const wsRef = doc(db, 'workspaces', activeWorkspace.id);
    await updateDoc(wsRef, { invites: [...(activeWorkspace.invites || []), inviteEmail] });
    setInviteEmail('');
    alert("Entity Invited.");
  };

  const isWSAdmin = activeWorkspace?.roles?.[user?.uid] === 'admin' || activeWorkspace?.ownerId === user?.uid;

  const deleteTask = async (taskId: string) => {
    if (!isWSAdmin || !window.confirm("Nuclear Option?")) return;
    await deleteDoc(doc(db, 'workspace_tasks', taskId));
  };

  const handleLogin = async () => {
    await signInWithRedirect(auth, new GoogleAuthProvider());
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-yellow-500 font-black uppercase tracking-widest">Initialising HQ...</div>;

  if (!user) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center pt-32">
      <div className="w-20 h-20 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center mb-10"><Lock size={32} className="text-yellow-500" /></div>
      <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">Unified Command</h1>
      <button onClick={handleLogin} className="bg-yellow-500 text-black px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs mt-12 hover:bg-white transition-all">Authenticate via Google</button>
    </div>
  );

  if (workspaces.length === 0) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center pt-32">
      <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">No Active Workspace</h2>
      {isCreatingWorkspace ? (
        <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
          <input type="text" placeholder="Workspace Name" value={newWorkspaceName} onChange={(e) => setNewWorkspaceName(e.target.value)} className="bg-black border border-gray-800 text-white p-5 rounded-2xl outline-none text-center font-bold" />
          <button onClick={createWorkspace} className="bg-yellow-500 text-black p-5 rounded-2xl font-black uppercase tracking-widest text-xs">Authorize Creation</button>
        </div>
      ) : (
        <button onClick={() => setIsCreatingWorkspace(true)} className="bg-yellow-500 text-black px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs">Create New Workspace</button>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex bg-[#050505] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-72 bg-black border-r border-gray-900 flex-col pt-32 pb-8 px-4">
        <div className="mb-8 px-4">
          <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mb-1">Active Tenant</p>
          <select 
            value={activeWorkspace?.id} 
            onChange={(e) => setActiveWorkspace(workspaces.find(w => w.id === e.target.value))}
            className="w-full bg-gray-900 border border-gray-800 text-yellow-500 text-[10px] font-black uppercase tracking-widest p-3 rounded-xl outline-none"
          >
            {workspaces.map(ws => (
              <option key={ws.id} value={ws.id}>{ws.name}</option>
            ))}
          </select>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { name: 'Task Board', icon: Layout },
            { name: 'Entity Matrix', icon: FileText },
            { name: 'Team', icon: Users },
            { name: 'Team Chat', icon: MessageSquare }
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                activeTab === item.name 
                ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' 
                : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={20} />
              <span className="font-black uppercase tracking-widest text-[10px]">{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* MOBILE NAV */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-2xl border-t border-gray-900 z-[200] px-6 py-3 flex justify-around items-center pb-safe">
        {[
          { name: 'Task Board', icon: Layout },
          { name: 'Entity Matrix', icon: FileText },
          { name: 'Team', icon: Users },
          { name: 'Team Chat', icon: MessageSquare }
        ].map((item) => (
          <button key={item.name} onClick={() => setActiveTab(item.name)} className={`flex flex-col items-center gap-1 p-2 ${activeTab === item.name ? 'text-yellow-500' : 'text-gray-600'}`}>
            <item.icon size={18} />
            <span className="text-[7px] font-black uppercase tracking-widest">{item.name.replace('Task Board', 'Tasks').replace('Entity Matrix', 'Matrix')}</span>
          </button>
        ))}
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 h-screen flex flex-col pt-24 lg:pt-32 p-4 md:p-12 overflow-hidden bg-[#070707] pb-20 lg:pb-0">
        
        <header className="mb-8 lg:mb-12 flex flex-col gap-6 shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter leading-none">{activeWorkspace?.name || 'Loading...'}</h2>
              <p className="text-[8px] lg:text-[10px] text-gray-500 mt-2 font-bold tracking-widest uppercase">System Initialization: {activeWorkspace?.createdAt?.toDate().toLocaleDateString() || '...'}</p>
            </div>
            {isWSAdmin && <button onClick={addTask} className="bg-yellow-500 text-black px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black uppercase tracking-[0.2em] text-[8px] lg:text-[10px] hover:bg-white transition-all">+ Deploy</button>}
          </div>

          <div className="bg-black/40 border border-gray-900 rounded-3xl p-6 lg:p-8 relative overflow-hidden backdrop-blur-xl">
            <div className="flex justify-between items-end mb-4">
              <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Telemetry Sync</span>
              <span className="text-xl lg:text-3xl font-black text-yellow-500">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden border border-white/5">
              <div className="bg-yellow-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
        </header>

        {/* TASK BOARD (KANBAN) */}
        {activeTab === 'Task Board' && (
          <>
            <div className="lg:hidden flex gap-2 mb-6 p-1 bg-black border border-gray-900 rounded-xl">
              {columns.map(col => (
                <button key={col} onClick={() => setMobileColumn(col)} className={`flex-1 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${mobileColumn === col ? 'bg-yellow-500 text-black' : 'text-gray-500'}`}>{col}</button>
              ))}
            </div>
            <div className="flex gap-4 lg:gap-8 flex-1 overflow-x-auto lg:overflow-x-visible pb-4 custom-scrollbar items-start">
              {columns.map(col => (
                <div key={col} className={`${mobileColumn === col ? 'flex' : 'hidden lg:flex'} w-full lg:w-96 flex-shrink-0 bg-black/40 border border-gray-900 rounded-3xl p-6 flex flex-col max-h-full transition-all`}>
                  <div className="flex justify-between items-center mb-8 border-b border-gray-900 pb-6 shrink-0">
                    <h3 className="font-black text-gray-400 uppercase tracking-widest text-[11px]">{col}</h3>
                    <span className="text-[9px] font-black text-yellow-500 bg-yellow-500/10 px-4 py-1.5 rounded-full">{tasks.filter(t => t.status === col).length}</span>
                  </div>
                  <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar pb-6">
                    {tasks.filter(t => t.status === col).map(task => (
                      <div key={task.id} className="p-6 bg-black/60 border border-gray-900 rounded-2xl group hover:border-yellow-500/30 transition-all backdrop-blur-sm">
                        <div className="flex flex-col gap-1 mb-4">
                          <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase border w-fit ${PRIORITY_COLORS[task.priority || 'Medium']}`}>{task.priority || 'Medium'}</span>
                          <h4 className="text-[14px] font-bold text-white uppercase group-hover:text-yellow-500 transition-colors">{task.title}</h4>
                        </div>

                        {task.comments && task.comments.length > 0 && (
                          <div className="mb-4 space-y-1 max-h-20 overflow-y-auto custom-scrollbar">
                            {task.comments.map((c: any, i: number) => (
                              <div key={i} className="text-[9px] bg-white/5 p-2 rounded-lg border border-white/5"><span className="text-yellow-500 font-black uppercase mr-2">{c.user}:</span><span className="text-gray-300">{c.text}</span></div>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-4 border-t border-gray-900">
                          <button onClick={() => addComment(task.id)} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white"><MessageSquare size={12} /></button>
                          {task.status !== 'Complete' && <button onClick={() => advanceTask(task.id, task.status)} className="px-3 py-1.5 bg-yellow-500 text-black rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-yellow-400 transition-all flex items-center gap-2"><Zap size={10} />Advance</button>}
                          {isWSAdmin && <button onClick={() => deleteTask(task.id)} className="text-gray-700 hover:text-red-500"><Trash2 size={12} /></button>}
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-lg bg-gray-900 flex items-center justify-center text-[10px] font-black text-yellow-500 border border-gray-800">{task.avatar}</div>
                             <span className="text-[9px] uppercase font-black text-gray-400">{task.assignee}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[9px] font-black uppercase text-yellow-500/80"><Clock size={10} />{task.deadline}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ENTITY MATRIX (DASHBOARD) */}
        {activeTab === 'Entity Matrix' && (
          <div className="flex-1 flex flex-col gap-6 lg:gap-10 animate-fade-in pb-12 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 bg-black/40 border border-gray-900 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-xl">
                <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8 self-start">Task Distribution</h3>
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#111" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#EAB308" strokeWidth="3" strokeDasharray={`${progressPercentage} 100`} className="transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-black text-white leading-none">{progressPercentage}%</span>
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-1">Completion</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Critical Alert', value: tasks.filter(t => t.priority === 'Critical').length, color: 'text-red-500', bg: 'bg-red-500/5' },
                  { label: 'System Health', value: 'OPTIMAL', color: 'text-green-500', bg: 'bg-green-500/5' },
                  { label: 'Active Targets', value: tasks.length, color: 'text-yellow-500', bg: 'bg-yellow-500/5' }
                ].map((stat, i) => (
                  <div key={i} className={`${stat.bg} border border-gray-900 rounded-3xl p-8 flex flex-col justify-center relative shadow-2xl`}>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">{stat.label}</p>
                    <p className={`text-5xl font-black tracking-tighter ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/60 border border-gray-900 rounded-3xl overflow-hidden backdrop-blur-3xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/60 border-b border-gray-900 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                      <th className="p-6">Objective</th>
                      <th className="p-6">Progress Matrix</th>
                      <th className="p-6">Type</th>
                      <th className="p-6">Priority</th>
                      <th className="p-6">Entity Owner</th>
                      <th className="p-6 text-right">Deadline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-900">
                    {tasks.map(task => (
                      <tr key={task.id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-6">
                          <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-yellow-500 transition-colors">{task.title}</p>
                        </td>
                        <td className="p-6 min-w-[200px]">
                          <div className="flex items-center gap-4">
                            <div className="flex-1 h-1.5 bg-gray-900 rounded-full overflow-hidden border border-white/5">
                              <div className={`h-full rounded-full transition-all duration-1000 ${task.status === 'Complete' ? 'bg-green-500 w-full' : task.status === 'In Progress' ? 'bg-yellow-500 w-1/2' : 'bg-gray-700 w-0'}`} />
                            </div>
                            <span className="text-[10px] font-black text-gray-500">{task.status === 'Complete' ? '100%' : task.status === 'In Progress' ? '50%' : '0%'}</span>
                          </div>
                        </td>
                        <td className="p-6"><span className="text-[10px] font-black text-gray-400 uppercase italic opacity-70">{task.type || 'Dev'}</span></td>
                        <td className="p-6">
                           <span className={`px-2 py-1 rounded text-[8px] font-black uppercase border ${PRIORITY_COLORS[task.priority || 'Medium']}`}>{task.priority || 'Medium'}</span>
                        </td>
                        <td className="p-6">
                           <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-[10px] font-black text-yellow-500">{task.avatar}</div>
                              <span className="text-[10px] font-bold text-gray-300 uppercase">{task.assignee}</span>
                           </div>
                        </td>
                        <td className="p-6 text-right"><span className="text-[10px] font-mono text-gray-500">{task.deadline}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TEAM */}
        {activeTab === 'Team' && (
          <div className="absolute inset-0 bg-[#070707] flex flex-col p-12 overflow-y-auto z-[110]">
            <header className="mb-12"><h3 className="text-4xl font-black uppercase tracking-tighter">Team Sovereignty</h3></header>
            <section className="bg-black/40 border border-gray-900 rounded-3xl p-8 mb-12 backdrop-blur-xl">
               <h4 className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Invite Member Node</h4>
               <div className="flex gap-4">
                 <input type="email" placeholder="Entity email..." value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="flex-1 bg-gray-900 border border-gray-800 text-white p-4 rounded-2xl outline-none text-xs font-bold" />
                 <button onClick={inviteMember} className="bg-yellow-500 text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]">Invite</button>
               </div>
            </section>
            <section className="space-y-6">
              {activeWorkspace?.members?.map((memberId: string) => (
                <div key={memberId} className="bg-black/20 border border-gray-900 rounded-2xl p-6 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 font-black">ID</div>
                    <p className="text-sm font-bold text-white uppercase">{memberId}</p>
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}

        {/* UNDER CONSTRUCTION */}
        {activeTab !== 'Task Board' && activeTab !== 'Entity Matrix' && activeTab !== 'Team' && (
          <div className="absolute inset-0 bg-[#050505] flex flex-col items-center justify-center p-12 text-center z-[110]">
            <FileText size={64} className="text-yellow-500/20 mb-8" />
            <h3 className="text-3xl font-black uppercase tracking-tighter text-yellow-500">Module Under Construction</h3>
            <button onClick={() => setActiveTab('Task Board')} className="mt-10 px-8 py-4 border border-yellow-500/20 text-yellow-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-yellow-500">Go Back</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Workspace;
