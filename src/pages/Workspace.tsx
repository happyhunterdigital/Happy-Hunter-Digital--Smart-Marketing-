import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, orderBy, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { CheckCircle2, Clock, Plus, Layout, Users, FileText, MessageSquare, Lock, Trash2, Calendar } from 'lucide-react';

export const Workspace: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Task Board');

  const columns = ['To Do', 'In Progress', 'Done'];

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        const q = query(collection(db, 'workspace_tasks'), orderBy('order', 'asc'));
        const unsubscribeTasks = onSnapshot(q, (snapshot) => {
          setTasks(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
          setLoading(false);
        });
        return () => unsubscribeTasks();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const progressPercentage = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(t => t.status === 'Done').length;
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
    const title = prompt("Enter the mission objective:");
    if (!title) return;
    
    await addDoc(collection(db, 'workspace_tasks'), {
      title,
      status: 'To Do',
      assignee: user?.displayName || 'Agent',
      avatar: user?.displayName?.charAt(0) || 'A',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      order: tasks.length,
      createdAt: serverTimestamp()
    });
  };

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

  return (
    <div className="fixed inset-0 z-[100] flex bg-[#050505] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-20 lg:w-72 bg-black border-r border-gray-900 flex flex-col pt-32 pb-8 px-4">
        <div className="hidden lg:block mb-12 px-4">
          <h1 className="text-xl font-black uppercase tracking-tighter text-yellow-500">HQ Workspace</h1>
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">Status: Online</p>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { name: 'Task Board', icon: Layout },
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
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Phase 1: Entity Architecture</h2>
              <p className="text-[10px] text-gray-500 mt-2 font-bold tracking-widest uppercase">System Initialization: March 1, 2026 // Target: Launch Ready</p>
            </div>
            <button 
              onClick={addTask}
              className="bg-yellow-500 text-black px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              + Deploy Task
            </button>
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
                  <div className={`w-2 h-2 rounded-full ${col === 'Done' ? 'bg-green-500' : col === 'In Progress' ? 'bg-yellow-500' : 'bg-gray-700'}`}></div>
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
                        <span className="text-[10px] uppercase font-black text-gray-500 tracking-wider">
                          {task.assignee}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[9px] font-black text-gray-700 uppercase tracking-widest">
                        <Calendar size={10} />
                        {task.date}
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
      {activeTab !== 'Task Board' && (
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
