import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Plus, Edit3, Trash2, CheckCircle2, DollarSign, Play, StopCircle, Timer, XCircle } from 'lucide-react';
import { listTimeEntries, createTimeEntry, updateTimeEntry, deleteTimeEntry, startTimer, stopTimer, getActiveTimer, getTimeStats, type TimeEntry } from '../../lib/time';

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

/* ── Timer Widget ──────────────────────────────────────────────── */

const TimerWidget: React.FC<{ running: boolean; startTimer: () => void; stopTimer: () => Promise<void>; elapsed: string }> = ({ running, startTimer, stopTimer, elapsed }) => (
  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-3xl p-8 text-center">
    <div className="text-5xl font-mono font-black text-yellow-500 mb-2">{elapsed}</div>
    <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">{running ? 'TIMER RUNNING' : 'TIMER STOPPED'}</div>
    <Btn onClick={running ? stopTimer : startTimer} variant={running ? 'danger' : 'primary'}>
      {running ? <StopCircle size={16} className="inline mr-2" /> : <Play size={16} className="inline mr-2" />}{running ? 'Stop Timer' : 'Start Timer'}
    </Btn>
  </div>
);

export const TimeTracking: React.FC = () => {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [timer, setTimer] = useState<{ running: boolean; startedAt: number; description: string; project: string } | null>(null);
  const [elapsed, setElapsed] = useState('00:00:00');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [entryFormData, setEntryFormData] = useState<{ description: string; project: string; minutes: number; billable: boolean; rate: number; date: string }>({
    description: '', project: '', minutes: 0, billable: true, rate: 0, date: new Date().toISOString().split('T')[0],
  });

  const fmt = (m: number) => {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    const s = Math.floor((m * 60) % 60);
    return `${String(h).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [es, st, active] = await Promise.all([listTimeEntries(), getTimeStats(), getActiveTimer('admin')]);
      setEntries(es);
      setStats(st);
      if (active && active.running) {
        const started = active.startedAt?.seconds ? active.startedAt.seconds * 1000 : Date.now();
        setTimer({ running: true, startedAt: started, description: active.description || '', project: active.projectId || '' });
        setElapsed(fmt(Math.round((Date.now() - started) / 60000)));
      } else {
        setTimer(null);
        setElapsed('00:00:00');
      }
    } catch (e) { console.error('Time refresh error:', e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    refresh();
    const iv = setInterval(() => {
      if (timer?.running) {
        const m = Math.round((Date.now() - timer.startedAt) / 60000);
        setElapsed(fmt(m));
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [refresh, timer]);

  const handleStart = async () => {
    await startTimer({ userId: 'admin', userName: 'Admin', description: entryFormData.description, projectId: entryFormData.project || undefined });
    await refresh();
  };

  const handleStop = async () => {
    const active = await getActiveTimer('admin');
    if (active?.id) {
      await stopTimer(active.id, {
        userId: 'admin', userName: 'Admin', description: active.description || '',
        projectId: active.projectId || undefined, projectName: '', durationMinutes: Math.round((Date.now() - (active.startedAt?.seconds ? active.startedAt.seconds * 1000 : Date.now())) / 60000),
        billable: true, date: new Date(),
      });
    }
    await refresh();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete time entry?')) { await deleteTimeEntry(id); refresh(); }
  };

  const toggleBillable = (id: string, cur: boolean) => updateTimeEntry(id, { billable: !cur }).then(refresh);

  if (loading) return <div className="p-10 text-center text-gray-500 font-mono animate-pulse">Loading Time Tracking...</div>;

  const totalHr = ((stats?.totalMinutes || 0) / 60).toFixed(1);
  const billableHr = ((stats?.billableMinutes || 0) / 60).toFixed(1);

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stat('Total Hours', totalHr)}
        {stat('Billable Hours', billableHr, 'text-yellow-500')}
        {stat('Billable Value', `ZAR ${(stats?.billableAmount || 0).toFixed(0)}`, 'text-green-500')}
        {stat('Entries', stats?.entriesCount || entries.length)}
      </div>

      {/* Timer widget */}
      <div className="mb-6">
        <TimerWidget
          running={!!timer?.running}
          elapsed={elapsed}
          startTimer={handleStart}
          stopTimer={handleStop}
        />
      </div>

      {/* Manual entry form */}
      <div className="bg-black border border-gray-800 rounded-2xl p-6 mb-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Manual Time Entry</h3>
        <form onSubmit={async (e) => {
          e.preventDefault();
          await createTimeEntry({
            userId: 'admin', userName: 'Admin', description: entryFormData.description,
            projectId: entryFormData.project || undefined, projectName: '',
            durationMinutes: entryFormData.minutes, billable: entryFormData.billable,
            hourlyRate: entryFormData.rate, date: new Date(entryFormData.date),
            createdBy: 'admin',
          });
          setShowForm(false);
          refresh();
        }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Description *" value={entryFormData.description} onChange={(e) => setEntryFormData({ ...entryFormData, description: e.target.value })} required />
            <Input label="Project" value={entryFormData.project} onChange={(e) => setEntryFormData({ ...entryFormData, project: e.target.value })} />
            <Input label="Minutes" value={entryFormData.minutes.toString()} onChange={(e) => setEntryFormData({ ...entryFormData, minutes: parseInt(e.target.value) || 0 })} type="number" />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <Input label="Date" value={entryFormData.date} onChange={(e) => setEntryFormData({ ...entryFormData, date: e.target.value })} type="date" />
            <Input label="Hourly Rate (ZAR)" value={entryFormData.rate.toString()} onChange={(e) => setEntryFormData({ ...entryFormData, rate: parseFloat(e.target.value) || 0 })} type="number" />
            <Select label="Billable" value={entryFormData.billable ? 'true' : 'false'} onChange={(e) => setEntryFormData({ ...entryFormData, billable: e.target.value === 'true' })} options={[{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }]} />
          </div>
          <div className="flex gap-3 justify-end mt-4">
            <Btn variant="ghost" onClick={() => setShowForm(false)}>Cancel</Btn>
            <Btn type="submit">Log Time</Btn>
          </div>
        </form>
      </div>

      {/* Entries list */}
      <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Time Entries ({entries.length})</h3>
          <Btn onClick={() => setShowForm(!showForm)} variant="ghost">{showForm ? 'Hide Form' : 'Add Entry'}</Btn>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-[#0a0a0a] text-gray-500 text-[10px] font-black uppercase tracking-widest">
            <tr><th className="p-4">Date</th><th className="p-4">Description</th><th className="p-4">Project</th><th className="p-4">Minutes</th><th className="p-4">Billable</th><th className="p-4 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {entries.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-600 font-mono text-xs">No time entries yet.</td></tr>
            ) : entries.slice(0, 50).map((e) => (
              <tr key={e.id} className="hover:bg-gray-900/50">
                <td className="p-4 text-gray-400 text-xs font-mono">{e.date?.toDate ? e.date.toDate().toLocaleDateString() : new Date(e.date).toLocaleDateString()}</td>
                <td className="p-4 font-bold text-white">{e.description}</td>
                <td className="p-4 text-gray-300">{e.projectName || e.projectId || '—'}</td>
                <td className="p-4 text-gray-300">{e.durationMinutes} min</td>
                <td className="p-4">
                  <button onClick={() => toggleBillable(e.id!, e.billable)} className={`px-2 py-1 rounded text-[9px] font-black uppercase ${e.billable ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-gray-700 text-gray-500 border border-gray-700/30'}`}>
                    {e.billable ? 'Yes' : 'No'}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(e.id!)} className="text-gray-500 hover:text-red-500"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimeTracking;