import React from 'react';
import { collection, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Trash2 } from 'lucide-react';

interface KanbanProps {
  activeWorkspace: any;
  tasks: any[];
  user: any;
}

export const KanbanBoard: React.FC<KanbanProps> = ({ activeWorkspace, tasks, user }) => {
  const columns = ['Backlog', 'To Do', 'In Progress', 'Verified'];

  const addTask = async (status = 'To Do') => {
    const title = prompt("Task Objective:");
    const type = prompt("Type (Dev / Content / Strategy):", "Dev");
    if (!title || !activeWorkspace) return;
    await addDoc(collection(db, 'workspace_tasks'), {
      workspaceId: activeWorkspace.id,
      title,
      status,
      type: type || 'Dev',
      assignee: user.displayName || user.email,
      createdAt: serverTimestamp()
    });
  };

  const moveTask = async (taskId: string, newStatus: string) => {
    await updateDoc(doc(db, 'workspace_tasks', taskId), { status: newStatus });
  };

  return (
    <div>
      <div className="flex justify-end mb-8">
        <button onClick={() => addTask('Backlog')} className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all">+ Deploy Objective</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
        {columns.map(col => (
          <div key={col} className="bg-black/40 border border-gray-900 rounded-3xl p-6 min-h-[500px]">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 flex justify-between">
              {col} <span>{tasks.filter(t => t.status === col).length}</span>
            </h3>
            <div className="flex flex-col gap-4">
              {tasks.filter(t => t.status === col).map(task => (
                <div key={task.id} className="bg-gray-900/50 border border-gray-800 p-5 rounded-2xl group hover:border-yellow-500/30 transition-all">
                  <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full mb-3 inline-block ${task.type === 'Dev' ? 'bg-indigo-500/10 text-indigo-400' : task.type === 'Content' ? 'bg-pink-500/10 text-pink-400' : 'bg-green-500/10 text-green-400'}`}>{task.type}</span>
                  <h4 className="font-bold text-sm mb-4 leading-tight">{task.title}</h4>
                  <p className="text-xs text-gray-500 mb-4">{task.assignee}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                    <select value={task.status} onChange={(e) => moveTask(task.id, e.target.value)} className="bg-transparent text-[9px] font-black uppercase text-gray-500 outline-none cursor-pointer hover:text-white">
                      {columns.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button onClick={async () => await deleteDoc(doc(db, 'workspace_tasks', task.id))} className="text-gray-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14}/></button>
                  </div>
                </div>
              ))}
              <button onClick={() => addTask(col)} className="text-[9px] font-black text-gray-600 hover:text-white uppercase tracking-widest py-2 border border-dashed border-gray-800 rounded-xl transition-all">+ New</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
