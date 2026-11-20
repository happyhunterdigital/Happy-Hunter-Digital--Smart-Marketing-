import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Edit3, Trash2, CheckCircle2, XCircle, Clock, Calendar, Layers,
  List, Kanban, Target, Flag, ArrowUp, ArrowDown,
} from 'lucide-react';
import {
  listProjects, createProject, updateProject, deleteProject,
  listTasks, createTask, updateTask, deleteTask,
  listMilestones, createMilestone, updateMilestone,
  getProjectStats,
  type Project, type Task, type Milestone,
} from '../../lib/projects';

/* ── Shared UI ─────────────────────────────────────────────────── */

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black uppercase tracking-tighter text-white">{title}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-white"><XCircle size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{label}</label>
    <input {...props} className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:border-yellow-500 outline-none text-sm" />
  </div>
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: { value: string; label: string }[] }> = ({ label, options, ...props }) => (
  <div className="mb-4">
    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{label}</label>
    <select {...props} className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:border-yellow-500 outline-none text-sm">
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{label}</label>
    <textarea {...props} className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:border-yellow-500 outline-none text-sm min-h-[80px]" />
  </div>
);

const Btn: React.FC<{ children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'ghost' | 'danger'; type?: 'button' | 'submit' }> = ({ children, onClick, variant = 'primary', type = 'button' }) => {
  const s = { primary: 'bg-yellow-500 text-black hover:bg-white', ghost: 'bg-[#1a1a1a] border border-gray-700 text-gray-300 hover:text-white hover:border-yellow-500', danger: 'bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20' };
  return <button type={type} onClick={onClick} className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${s[variant]}`}>{children}</button>;
};

const stat = (label: string, value: number | string, color = 'text-white') => (
  <div className="bg-black border border-gray-800 p-5 rounded-2xl">
    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{label}</p>
    <p className={`text-3xl font-black ${color}`}>{value}</p>
  </div>
);

/* ── Project Form ──────────────────────────────────────────────── */

const ProjectForm: React.FC<{ initial?: Project; onSave: (d: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void; onCancel: () => void }> = ({ initial, onSave, onCancel }) => {
  const [name, setName] = useState(initial?.name || '');
  const [client, setClient] = useState(initial?.client || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [status, setStatus] = useState(initial?.status || 'planning');
  const [priority, setPriority] = useState(initial?.priority || 'medium');
  const [dueDate, setDueDate] = useState(initial?.dueDate ? new Date(initial.dueDate.seconds ? initial.dueDate.seconds * 1000 : initial.dueDate).toISOString().split('T')[0] : '');
  const [budget, setBudget] = useState(initial?.budget?.toString() || '0');
  const [currency, setCurrency] = useState(initial?.currency || 'ZAR');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, client, description, status, priority, dueDate: dueDate ? new Date(dueDate) : undefined, budget: parseFloat(budget) || 0, currency, createdBy: 'admin' });
  };

  return (
    <form onSubmit={submit}>
      <Input label="Project Name *" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input label="Client" value={client} onChange={(e) => setClient(e.target.value)} />
      <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <div className="grid grid-cols-2 gap-4">
        <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value as any)} options={[
          { value: 'planning', label: 'Planning' }, { value: 'active', label: 'Active' },
          { value: 'on-hold', label: 'On Hold' }, { value: 'completed', label: 'Completed' }, { value: 'archived', label: 'Archived' },
        ]} />
        <Select label="Priority" value={priority} onChange={(e) => setPriority(e.target.value as any)} options={[
          { value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'critical', label: 'Critical' },
        ]} />
      </div>
      <Input label="Due Date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} type="date" />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Budget" value={budget} onChange={(e) => setBudget(e.target.value)} type="number" />
        <Select label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} options={[{ value: 'ZAR', label: 'ZAR' }, { value: 'USD', label: 'USD' }]} />
      </div>
      <div className="flex gap-3 justify-end">
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn type="submit">Save Project</Btn>
      </div>
    </form>
  );
};

/* ── Task Form ─────────────────────────────────────────────────── */

const TaskForm: React.FC<{ initial?: Task; projects: Project[]; onSave: (d: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void; onCancel: () => void }> = ({ initial, projects, onSave, onCancel }) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [projectId, setProjectId] = useState(initial?.projectId || '');
  const [status, setStatus] = useState(initial?.status || 'todo');
  const [priority, setPriority] = useState(initial?.priority || 'medium');
  const [assignee, setAssignee] = useState(initial?.assigneeName || '');
  const [dueDate, setDueDate] = useState(initial?.dueDate ? new Date(initial.dueDate.seconds ? initial.dueDate.seconds * 1000 : initial.dueDate).toISOString().split('T')[0] : '');
  const [estHours, setEstHours] = useState(initial?.estimatedHours?.toString() || '');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, description, projectId: projectId || undefined, status, priority, assigneeName: assignee || undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined, estimatedHours: parseFloat(estHours) || undefined, createdBy: 'admin' });
  };

  return (
    <form onSubmit={submit}>
      <Input label="Task Title *" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Select label="Project" value={projectId} onChange={(e) => setProjectId(e.target.value)} options={[{ value: '', label: '— None —' }, ...projects.map((p) => ({ value: p.id!, label: p.name }))]} />
      <div className="grid grid-cols-3 gap-4">
        <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value as any)} options={[
          { value: 'todo', label: 'To Do' }, { value: 'in-progress', label: 'In Progress' }, { value: 'review', label: 'Review' }, { value: 'done', label: 'Done' }, { value: 'blocked', label: 'Blocked' },
        ]} />
        <Select label="Priority" value={priority} onChange={(e) => setPriority(e.target.value as any)} options={[
          { value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' },
        ]} />
        <Input label="Est. Hours" value={estHours} onChange={(e) => setEstHours(e.target.value)} type="number" />
      </div>
      <Input label="Assignee" value={assignee} onChange={(e) => setAssignee(e.target.value)} />
      <Input label="Due Date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} type="date" />
      <div className="flex gap-3 justify-end">
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn type="submit">Save Task</Btn>
      </div>
    </form>
  );
};

/* ── Main Projects Component ───────────────────────────────────── */

export const Projects: React.FC = () => {
  const [tab, setTab] = useState<'overview' | 'projects' | 'tasks' | 'milestones'>('overview');
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [ps, ts, ms, st] = await Promise.all([listProjects(), listTasks(), listMilestones(), getProjectStats()]);
      setProjects(ps);
      setTasks(ts);
      setMilestones(ms);
      setStats(st);
    } catch (e) { console.error('Projects refresh error:', e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, []);

  const handleProjectDelete = async (id: string) => {
    if (confirm('Delete project?')) { await deleteProject(id); refresh(); }
  };
  const handleTaskDelete = async (id: string) => {
    if (confirm('Delete task?')) { await deleteTask(id); refresh(); }
  };

  if (loading) return <div className="p-10 text-center text-gray-500 font-mono animate-pulse">Loading Projects...</div>;

  const overdue = milestones.filter((m) => m.status !== 'completed' && m.dueDate && new Date(m.dueDate.seconds ? m.dueDate.seconds * 1000 : m.dueDate) < new Date()).length;

  return (
    <div className="animate-fade-in">
      {/* Stats header */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {stat('Total Projects', stats?.totalProjects ?? projects.length)}
        {stat('Active', stats?.activeProjects ?? projects.filter(p => p.status === 'active').length, 'text-yellow-500')}
        {stat('Completed', stats?.completedProjects ?? projects.filter(p => p.status === 'completed').length, 'text-green-500')}
        {stat('Total Tasks', stats?.totalTasks ?? tasks.length)}
        {stat('Done Tasks', stats?.completedTasks ?? tasks.filter(t => t.status === 'done').length, 'text-green-500')}
        {stat('Overdue', stats?.overdueTasks ?? overdue, 'text-red-500')}
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {([
          { key: 'overview', label: 'Overview', icon: <List size={14} /> },
          { key: 'projects', label: 'Projects', icon: <Layers size={14} /> },
          { key: 'tasks', label: 'Tasks', icon: <Kanban size={14} /> },
          { key: 'milestones', label: 'Milestones', icon: <Flag size={14} /> },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-colors ${
              tab === t.key ? 'bg-yellow-500 text-black' : 'bg-[#1a1a1a] border border-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
        <div className="flex-1" />
        <Btn onClick={() => { if (tab === 'projects') setShowProjectForm(true); if (tab === 'tasks') setShowTaskForm(true); if (tab === 'milestones') setShowMilestoneForm(true); }}>
          <Plus size={12} className="inline mr-1" /> New
        </Btn>
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Projects by Status</h3>
            <div className="space-y-3">
              {(['planning', 'active', 'on-hold', 'completed', 'archived'] as const).map((s) => {
                const c = projects.filter((p) => p.status === s).length;
                return (
                  <div key={s} className="flex justify-between items-center p-3 bg-[#0a0a0a] rounded-xl">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">{s}</span>
                    <span className="text-lg font-black text-white">{c}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-black border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Recent Milestones</h3>
            <div className="space-y-3">
              {milestones.slice(0, 6).map((m) => (
                <div key={m.id} className="flex justify-between items-center p-3 bg-[#0a0a0a] rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-white">{m.name}</p>
                    <p className="text-[10px] text-gray-500">{m.status}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">{m.dueDate ? new Date(m.dueDate.seconds ? m.dueDate.seconds * 1000 : m.dueDate).toLocaleDateString() : '—'}</span>
                </div>
              ))}
              {milestones.length === 0 && <p className="text-gray-500 text-xs font-mono text-center py-4">No milestones yet.</p>}
            </div>
          </div>
        </div>
      )}

      {/* Projects list */}
      {tab === 'projects' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Projects ({projects.length})</h3>
            <Btn onClick={() => { setEditProject(null); setShowProjectForm(true); }}><Plus size={12} className="inline mr-1" /> New Project</Btn>
          </div>
          <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0a0a0a] text-gray-500 text-[10px] font-black uppercase tracking-widest">
                <tr><th className="p-4">Name</th><th className="p-4">Client</th><th className="p-4">Status</th><th className="p-4">Priority</th><th className="p-4">Due</th><th className="p-4 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {projects.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-gray-600 font-mono text-xs">No projects yet.</td></tr>
                ) : projects.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-900/50">
                    <td className="p-4 font-bold text-white">{p.name}</td>
                    <td className="p-4 text-gray-300">{p.client || '—'}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${p.status === 'active' ? 'bg-green-500/10 text-green-500' : p.status === 'completed' ? 'bg-gray-700 text-gray-300' : 'bg-yellow-500/10 text-yellow-500'}`}>{p.status}</span></td>
                    <td className="p-4 text-gray-300">{p.priority}</td>
                    <td className="p-4 text-gray-400">{p.dueDate ? new Date(p.dueDate.seconds ? p.dueDate.seconds * 1000 : p.dueDate).toLocaleDateString() : '—'}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => { setEditProject(p); setShowProjectForm(true); }} className="text-gray-500 hover:text-yellow-500 mr-2"><Edit3 size={14} /></button>
                      <button onClick={() => handleProjectDelete(p.id!)} className="text-gray-500 hover:text-red-500"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tasks board */}
      {tab === 'tasks' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Tasks ({tasks.length})</h3>
            <Btn onClick={() => { setEditTask(null); setShowTaskForm(true); }}><Plus size={12} className="inline mr-1" /> New Task</Btn>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {(['todo', 'in-progress', 'review', 'done', 'blocked'] as const).map((status) => {
              const colTasks = tasks.filter((t) => t.status === status);
              return (
                <div key={status} className="flex-shrink-0 bg-[#0a0a0a] border border-gray-800 rounded-2xl p-3 flex flex-col h-[500px]">
                  <div className="flex justify-between items-center mb-3 px-1">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-300">{status}</span>
                    <span className="text-[10px] text-gray-500 font-mono">({colTasks.length})</span>
                  </div>
                  <div className="space-y-2 min-h-0 flex-1 overflow-y-auto">
                    {colTasks.map((t) => (
                      <div key={t.id} onClick={() => { setEditTask(t); setShowTaskForm(true); }}
                           className="bg-black border border-gray-800 rounded-xl p-3 cursor-pointer hover:border-yellow-500/50 transition-colors group">
                        <p className="text-sm font-bold text-white truncate">{t.title}</p>
                        {t.assigneeName && <p className="text-[10px] text-gray-500 mt-1">{t.assigneeName}</p>}
                        <div className="flex justify-between items-center mt-2">
                          <span className={`text-[9px] font-black uppercase ${t.priority === 'high' ? 'text-red-500' : t.priority === 'medium' ? 'text-yellow-500' : 'text-gray-500'}`}>{t.priority}</span>
                          <span className="text-[9px] text-gray-600 font-mono">{t.dueDate ? new Date(t.dueDate.seconds ? t.dueDate.seconds * 1000 : t.dueDate).toLocaleDateString() : '—'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Milestones */}
      {tab === 'milestones' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Milestones ({milestones.length})</h3>
            <Btn onClick={() => setShowMilestoneForm(true)}><Plus size={12} className="inline mr-1" /> New Milestone</Btn>
          </div>
          <div className="space-y-3">
            {milestones.length === 0 ? (
              <p className="text-gray-500 text-xs font-mono text-center py-8">No milestones yet.</p>
            ) : milestones.map((m) => (
              <div key={m.id} className="bg-black border border-gray-800 rounded-xl p-4 flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white">{m.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{m.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-white">{m.dueDate ? new Date(m.dueDate.seconds ? m.dueDate.seconds * 1000 : m.dueDate).toLocaleDateString() : '—'}</p>
                  <button onClick={async () => { await updateMilestone(m.id!, { status: m.status === 'completed' ? 'upcoming' : 'completed' }); refresh(); }}
                          className={`text-xs font-black ${m.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                    {m.status === 'completed' ? 'Reopen' : 'Mark Complete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showProjectForm && (
        <Modal title={editProject ? 'Edit Project' : 'New Project'} onClose={() => { setShowProjectForm(false); setEditProject(null); }}>
          <ProjectForm initial={editProject || undefined}
            onSave={async (d) => { if (editProject?.id) await updateProject(editProject.id, d); else await createProject(d); setShowProjectForm(false); setEditProject(null); refresh(); }}
            onCancel={() => { setShowProjectForm(false); setEditProject(null); }} />
        </Modal>
      )}
      {showTaskForm && (
        <Modal title={editTask ? 'Edit Task' : 'New Task'} onClose={() => { setShowTaskForm(false); setEditTask(null); }}>
          <TaskForm initial={editTask || undefined} projects={projects}
            onSave={async (d) => { if (editTask?.id) await updateTask(editTask.id, d); else await createTask(d); setShowTaskForm(false); setEditTask(null); refresh(); }}
            onCancel={() => { setShowTaskForm(false); setEditTask(null); }} />
        </Modal>
      )}
      {showMilestoneForm && (
        <Modal title="New Milestone" onClose={() => setShowMilestoneForm(false)}>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            await createMilestone({ name: fd.get('name') as string, projectId: (fd.get('projectId') as string) || '', dueDate: new Date(fd.get('dueDate') as string), status: 'upcoming', createdBy: 'admin' });
            setShowMilestoneForm(false);
            refresh();
          }}>
            <Input label="Milestone Name *" name="name" required />
            <Select label="Project" name="projectId" defaultValue="" options={[{ value: '', label: '— None —' }, ...projects.map((p) => ({ value: p.id!, label: p.name }))]} />
            <Input label="Due Date *" name="dueDate" type="date" required />
            <div className="flex gap-3 justify-end">
              <Btn variant="ghost" onClick={() => setShowMilestoneForm(false)}>Cancel</Btn>
              <Btn type="submit">Create</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Projects;