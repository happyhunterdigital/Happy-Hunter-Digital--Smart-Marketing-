import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, orderBy, deleteDoc, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
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

  const columns = ['Not Started', 'In Progress', 'Complete'];

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Step 0: Auto-Accept Invites (Resilient)
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
          console.warn("Auto-Accept Skip: Permission or Index pending.", err);
        }

        // Step 1: Discover Workspaces where user is a member
        const qWS = query(
          collection(db, 'workspaces'), 
          where('members', 'array-contains', u.uid)
          // orderBy removed to avoid composite index requirement
        );
        
        const unsubscribeWS = onSnapshot(qWS, (snapshot) => {
          const wsList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setWorkspaces(wsList);
          
          if (wsList.length > 0 && !activeWorkspace) {
            setActiveWorkspace(wsList[0]);
          }
          setLoading(false);
        }, (error) => {
          console.error("Workspace Sync Error:", error);
          setLoading(false);
        });
        return () => unsubscribeWS();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Step 2: Stream Tasks for Active Workspace
  useEffect(() => {
    if (user && activeWorkspace) {
      const qTasks = query(
        collection(db, 'workspace_tasks'), 
        where('workspaceId', '==', activeWorkspace.id)
        // orderBy removed to avoid composite index requirement
      );
      
      const unsubscribeTasks = onSnapshot(qTasks, (snapshot) => {
        const filteredTasks = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setTasks(filteredTasks);
      }, (error) => {
        console.error("Task Sync Error:", error);
      });
      return () => unsubscribeTasks();
    }
  }, [user, activeWorkspace]);

  const progressPercentage = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(t => t.status === 'Complete').length;
    return Math.round((completedTasks / tasks.length) * 100);
  }, [tasks]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const taskDoc = doc(db, 'workspace_tasks', taskId);
    await updateDoc(taskDoc, { status: targetStatus });
  };

  const addTask = async () => {
    if (!activeWorkspace) return;
    const title = prompt("Enter mission objective:");
    if (!title) return;
    
    const deadline = prompt("Expected Completion Date (e.g., Oct 24):", "Soon");
    const assigneeName = prompt("Assign to (Name):", user?.displayName || 'Agent');

    await addDoc(collection(db, 'workspace_tasks'), {
      workspaceId: activeWorkspace.id,
      title,
      status: 'Not Started',
      assignee: assigneeName,
      avatar: assigneeName.charAt(0).toUpperCase(),
      deadline: deadline || 'N/A',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      order: tasks.length,
      createdAt: serverTimestamp()
    });
  };

  const createWorkspace = async () => {
    if (!newWorkspaceName || !user) return;
    try {
      const docRef = await addDoc(collection(db, 'workspaces'), {
        name: newWorkspaceName,
        ownerId: user.uid,
        ownerEmail: user.email,
        createdAt: serverTimestamp(),
        members: [user.uid],
        roles: { [user.uid]: 'admin' }
      });
      setIsCreatingWorkspace(false);
      setNewWorkspaceName('');
    } catch (error) {
      console.error("Workspace Creation Failed:", error);
      alert("Permission Check Failed: You need to update your Firestore Rules.");
    }
  };

  const inviteMember = async () => {
    if (!inviteEmail || !activeWorkspace) return;
    try {
      const wsRef = doc(db, 'workspaces', activeWorkspace.id);
      const updatedInvites = [...(activeWorkspace.invites || []), inviteEmail];
      
      // 1. Update Workspace Record
      await updateDoc(wsRef, { invites: updatedInvites });

      // 2. Trigger Email via Firestore Extension
      await addDoc(collection(db, 'mail'), {
        to: inviteEmail,
        message: {
          subject: `You've been invited to ${activeWorkspace.name} on Happy Hunter SPACE`,
          html: `
            <div style="font-family: sans-serif; background: #050505; color: white; padding: 40px; border-radius: 20px;">
              <h1 style="color: #eab308; text-transform: uppercase;">Mission Invitation</h1>
              <p>You have been authorized to join the <b>${activeWorkspace.name}</b> environment.</p>
              <p>Log in to access your task matrix and project telemetry.</p>
              <a href="https://happyhunterdigital.com/workspace" style="background: #eab308; color: black; padding: 15px 30px; border-radius: 10px; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 20px;">ACCESS WORKSPACE</a>
            </div>
          `
        }
      });

      setInviteEmail('');
      alert(`Invitation and Trigger Email sent to ${inviteEmail}.`);
    } catch (error) {
      console.error("Invite Fail:", error);
      alert("Encryption/Permission Error. Check Firestore Rules.");
    }
  };

  const updateMemberRole = async (userId: string, newRole: 'admin' | 'member') => {
    if (!activeWorkspace) return;
    const wsRef = doc(db, 'workspaces', activeWorkspace.id);
    const updatedRoles = { ...(activeWorkspace.roles || {}), [userId]: newRole };
    await updateDoc(wsRef, { roles: updatedRoles });
  };

  const isWSAdmin = activeWorkspace?.roles?.[user?.uid] === 'admin' || activeWorkspace?.ownerId === user?.uid;

  const deleteTask = async (id: string) => {
    if (window.confirm("Nuclear Option? This will erase the task node.")) {
      await deleteDoc(doc(db, 'workspace_tasks', id));
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Auth Fail:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-yellow-500">
          <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
          <span className="font-black uppercase tracking-[0.3em] text-[10px]">Syncing HQ Workspace...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center animate-fade-in pt-32">
        <div className="w-20 h-20 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(234,179,8,0.1)]">
          <Lock size={32} className="text-yellow-500" />
        </div>
        <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">Unified Command</h1>
        <p className="text-gray-500 mb-12 font-medium max-w-md mx-auto leading-relaxed uppercase tracking-widest text-[10px]"> Restricted access. Authenticate your digital footprint to gain entry to the workspace.</p>
        <button 
          onClick={handleLogin} 
          className="bg-yellow-500 text-black px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-[0_0_40px_rgba(234,179,8,0.3)] hover:scale-105 active:scale-95"
        >
          Authenticate via Google
        </button>
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center animate-fade-in pt-32">
        <div className="w-20 h-20 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(234,179,8,0.1)]">
          <Plus size={32} className="text-yellow-500" />
        </div>
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">No Active Multi-Tenant Workspace</h2>
        <p className="text-gray-500 mb-12 font-medium max-w-md mx-auto leading-relaxed uppercase tracking-widest text-[10px]">Initialize a new secure digital environment to begin your architectural workflow.</p>
        
        {isCreatingWorkspace ? (
          <div className="flex flex-col gap-4 w-full max-w-sm mx-auto animate-fade-in">
            <input 
              type="text" 
              placeholder="Workspace Name (e.g., Client Alpha)"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              className="bg-black border border-gray-800 text-white p-5 rounded-2xl focus:border-yellow-500 outline-none text-center font-bold uppercase tracking-widest text-xs"
            />
            <div className="flex gap-4">
              <button onClick={createWorkspace} className="flex-1 bg-yellow-500 text-black p-5 rounded-2xl font-black uppercase tracking-widest text-xs">Authorize Creation</button>
              <button onClick={() => setIsCreatingWorkspace(false)} className="px-6 bg-gray-900 text-gray-500 p-5 rounded-2xl font-black uppercase tracking-widest text-xs">Abort</button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsCreatingWorkspace(true)} 
            className="bg-yellow-500 text-black px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-[0_0_40px_rgba(234,179,8,0.3)]"
          >
            Create New Workspace
          </button>
        )}

        <div className="mt-20 p-8 border border-red-500/20 bg-red-500/5 rounded-3xl max-w-2xl mx-auto">
          <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">CRITICAL: FIRESTORE PERMISSIONS</p>
          <p className="text-gray-400 text-[10px] leading-relaxed uppercase tracking-widest font-bold">
            Ifcreation fails, you must set your Firestore Rules to: <br/>
            <code className="text-white mt-4 block p-4 bg-black rounded-xl">
              match /workspaces/&#123;ws&#125; &#123; allow read, write: if request.auth != null; &#125;
            </code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex bg-[#050505] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-20 lg:w-72 bg-black border-r border-gray-900 flex flex-col pt-32 pb-8 px-4">
        <div className="hidden lg:block mb-8 px-4">
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
          <button 
            onClick={() => setWorkspaces([])} 
            className="text-[8px] text-gray-500 mt-2 hover:text-white uppercase font-bold tracking-widest"
          >
            + New Environment
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { name: 'Task Board', icon: Layout },
            { name: 'Team', icon: Users },
            { name: 'Whiteboards', icon: FileText },
            { name: 'Documents', icon: FileText },
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
              <span className="hidden lg:block font-black uppercase tracking-widest text-[10px]">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-gray-900 pt-8 px-4 flex items-center gap-4">
          <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-yellow-500/30" />
          <div className="hidden lg:block overflow-hidden">
            <p className="text-[10px] font-black uppercase truncate">{user.displayName}</p>
            <p className="text-[8px] text-gray-600 uppercase tracking-widest truncate">{user.email}</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 h-screen flex flex-col pt-32 p-6 md:p-12 overflow-hidden bg-[#070707]">
        
        {/* HEADER & PROJECT TELEMETRY */}
        <header className="mb-12 flex flex-col gap-8 shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">{activeWorkspace?.name || 'Loading Node...'}</h2>
              <p className="text-[10px] text-gray-500 mt-2 font-bold tracking-widest uppercase">System Initialization: {activeWorkspace?.createdAt?.toDate().toLocaleDateString() || 'Pending...'} // Target: Launch Ready</p>
            </div>
            {isWSAdmin && (
              <button 
                onClick={addTask}
                className="bg-yellow-500 text-black px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white transition-all shadow-xl hover:scale-105 active:scale-95"
              >
                + Deploy Task
              </button>
            )}
          </div>

          {/* PROGRESS BAR ENGINE */}
          <div className="bg-black/40 border border-gray-900 rounded-3xl p-8 relative overflow-hidden backdrop-blur-xl">
            <div className="flex justify-between items-end mb-4">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-yellow-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Project Telemetry Sync</span>
              </div>
              <span className="text-3xl font-black text-yellow-500">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden border border-white/5">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(234,179,8,0.5)]" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </header>

        {/* KANBAN BOARD MATRIX */}
        <div className="flex gap-8 flex-1 overflow-x-auto pb-4 custom-scrollbar items-start">
          {columns.map(col => (
            <div 
              key={col} 
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col)}
              className="w-96 flex-shrink-0 bg-black/40 border border-gray-900 rounded-3xl p-6 flex flex-col max-h-full transition-all hover:border-gray-800"
            >
              
              {/* COLUMN HEADER */}
              <div className="flex justify-between items-center mb-8 border-b border-gray-900 pb-6 shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${col === 'Complete' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : col === 'In Progress' ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'bg-gray-700'}`}></div>
                  <h3 className="font-black text-gray-400 uppercase tracking-widest text-[11px]">{col}</h3>
                </div>
                <span className="text-[9px] font-black text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full uppercase tracking-widest">
                  {tasks.filter(t => t.status === col).length} Nodes
                </span>
              </div>
              
              {/* TASK CARDS */}
              <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar pb-6">
                {tasks.filter(t => t.status === col).map(task => (
                  <div 
                    key={task.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="bg-black border border-gray-800 p-6 rounded-2xl hover:border-yellow-500/40 transition-all cursor-grab active:cursor-grabbing group shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-gray-800 group-hover:bg-yellow-500 transition-colors"></div>
                    
                    <div className="flex justify-between items-start gap-4 mb-6">
                      <p className="text-sm font-bold text-gray-200 leading-relaxed group-hover:text-white transition-colors">{task.title}</p>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-600 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-[10px] font-black text-yellow-500">
                          {task.avatar}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-black text-white/90 tracking-wider">
                            {task.assignee}
                          </span>
                          <span className="text-[8px] uppercase font-bold text-gray-600 tracking-tighter">Assignee</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${new Date(task.deadline) < new Date() ? 'text-red-500' : 'text-yellow-500/80'}`}>
                          <Clock size={10} />
                          {task.deadline}
                        </div>
                        <span className="text-[8px] uppercase font-bold text-gray-600 tracking-tighter mt-1 text-right">Deadline</span>
                      </div>
                    </div>
                  </div>
                ))}

                {tasks.filter(t => t.status === col).length === 0 && (
                  <div className="border border-dashed border-gray-900 rounded-3xl p-10 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700">Zone Empty</p>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </main>

      {/* GLOBAL OVERLAYS */}
      {activeTab === 'Team' && (
        <div className="absolute top-32 left-20 lg:left-72 right-0 bottom-0 bg-[#070707] flex flex-col p-12 overflow-y-auto animate-fade-in z-[110]">
          <div className="max-w-4xl w-full mx-auto">
            <header className="mb-12">
              <h3 className="text-4xl font-black uppercase tracking-tighter">Team Sovereignty</h3>
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-2 font-bold leading-relaxed"> Manage environment access and delegate binary powers to authorized entities.</p>
            </header>

            {isWSAdmin && (
              <section className="bg-black/40 border border-gray-900 rounded-3xl p-8 mb-12 backdrop-blur-xl">
                <h4 className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Invite Member Node</h4>
                <div className="flex gap-4">
                  <input 
                    type="email" 
                    placeholder="Enter entity email..."
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="flex-1 bg-gray-900 border border-gray-800 text-white p-4 rounded-2xl focus:border-yellow-500 outline-none text-xs font-bold"
                  />
                  <button onClick={inviteMember} className="bg-yellow-500 text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]">Invite Entity</button>
                </div>
              </section>
            )}

            <section className="space-y-6">
              <h4 className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Active Member Matrix</h4>
              {/* Note: In a complete system, you'd fetch user profiles for these IDs */}
              {activeWorkspace?.members?.map((memberId: string) => (
                <div key={memberId} className="bg-black/20 border border-gray-900 rounded-2xl p-6 flex justify-between items-center group hover:border-gray-800 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 font-black">
                      {memberId === user.uid ? 'YOU' : 'ID'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase tracking-tight">{memberId === user.uid ? user.displayName : 'Remote Agent'}</p>
                      <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{memberId === user.uid ? user.email : memberId}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      activeWorkspace?.roles?.[memberId] === 'admin' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-gray-900 text-gray-600 border-gray-800'
                    }`}>
                      {activeWorkspace?.roles?.[memberId] || 'member'}
                    </span>
                    
                    {isWSAdmin && memberId !== user.uid && (
                      <select 
                        onChange={(e) => updateMemberRole(memberId, e.target.value as 'admin' | 'member')}
                        className="bg-gray-900 border border-gray-800 text-gray-400 text-[9px] font-black uppercase px-3 py-1.5 rounded-lg outline-none cursor-pointer hover:text-white"
                      >
                        <option value="">Change Power</option>
                        <option value="admin">Promote to Admin</option>
                        <option value="member">Limit to Member</option>
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      )}

      {activeTab !== 'Task Board' && activeTab !== 'Team' && (
        <div className="absolute top-32 left-20 lg:left-72 right-0 bottom-0 bg-[#050505] flex flex-col items-center justify-center p-12 text-center z-[110]">
          <FileText size={64} className="text-yellow-500/20 mb-8" />
          <h3 className="text-3xl font-black uppercase tracking-tighter text-yellow-500">Module Under Construction</h3>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-4 max-w-xs font-bold leading-relaxed"> The {activeTab} function is being engineered. Switching back to the Task Board matrix.</p>
          <button onClick={() => setActiveTab('Task Board')} className="mt-10 px-8 py-4 border border-yellow-500/20 text-yellow-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-yellow-500 hover:text-black transition-all">Go Back</button>
        </div>
      )}

    </div>
  );
};

export default Workspace;
