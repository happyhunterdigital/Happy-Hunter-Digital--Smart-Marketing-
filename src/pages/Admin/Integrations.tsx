import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Mail, Calendar, Landmark, CreditCard, Plus, CheckCircle2, XCircle, Plug } from 'lucide-react';
import {
  listIntegrations, upsertIntegration, deleteIntegration,
  INTEGRATION_PROVIDERS,
  type Integration, type IntegrationProvider,
} from '../../lib/integrations';

const ICONS: Record<IntegrationProvider, React.ReactNode> = {
  'google-calendar': <Calendar size={20} />,
  gmail: <Mail size={20} />,
  xero: <Landmark size={20} />,
  quickbooks: <CreditCard size={20} />,
  stripe: <CreditCard size={20} />,
};

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

const Badge: React.FC<{ status: string }> = ({ status }) => (
  <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${status === 'connected' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-gray-700 text-gray-500 border border-gray-700/30'}`}>{status}</span>
);

/* ── Main Integrations Component ────────────────────────────────── */

export const Integrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Integration | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listIntegrations();
      setIntegrations(list);
    } catch (e) { console.error('Integrations refresh error:', e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, []);

  const handleConnect = async (provider: IntegrationProvider) => {
    try {
      const existing = await listIntegrations();
      const cur = existing.find((i) => i.provider === provider);
      await upsertIntegration({ id: cur?.id, provider, status: 'connected', config: { ...(cur?.config || {}) }, createdBy: 'admin' });
      await refresh();
    } catch (e) { console.error('Integration connect error:', e); }
  };

  const handleDisconnect = async (provider: IntegrationProvider) => {
    try {
      const existing = await listIntegrations();
      const cur = existing.find((i) => i.provider === provider);
      await upsertIntegration({ id: cur?.id, provider, status: 'disconnected', config: {}, createdBy: 'admin' });
      await refresh();
    } catch (e) { console.error('Integration disconnect error:', e); }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete integration record?')) { await deleteIntegration(id); await refresh(); }
  };

  if (loading) return <div className="p-10 text-center text-gray-500 font-mono animate-pulse">Loading Integrations...</div>;

  const connectedCount = integrations.filter((i) => i.status === 'connected').length;

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-black border border-gray-800 p-5 rounded-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Connected</p>
          <p className="text-3xl font-black text-white">{connectedCount}</p>
        </div>
        <div className="bg-black border border-gray-800 p-5 rounded-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Available</p>
          <p className="text-3xl font-black text-yellow-500">{INTEGRATION_PROVIDERS.length}</p>
        </div>
        <div className="bg-black border border-gray-800 p-5 rounded-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Categories</p>
          <p className="text-3xl font-black text-white">{new Set(INTEGRATION_PROVIDERS.map((p) => p.category)).size}</p>
        </div>
        <div className="bg-black border border-gray-800 p-5 rounded-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Last Sync</p>
          <p className="text-sm font-black text-white mt-2">Pending</p>
        </div>
      </div>

      <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Connected Services</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {integrations.length === 0 && (
          <p className="text-gray-500 text-xs font-mono text-center py-8">No integrations configured yet.</p>
        )}
        {integrations.map((i) => {
          const meta = INTEGRATION_PROVIDERS.find((p) => p.provider === i.provider);
          return (
            <div key={i.id} className="bg-black border border-gray-800 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500">{ICONS[i.provider]}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-white uppercase tracking-wide text-sm">{meta?.name || i.provider}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{meta?.category || 'General'}</p>
                </div>
                <Badge status={i.status} />
              </div>
              <p className="text-xs text-gray-400 mb-4">{meta?.description}</p>
              <div className="text-[10px] text-gray-600 font-mono uppercase tracking-widest mb-4">
                Connected: {i.connectedAt ? new Date((i.connectedAt as any).seconds ? (i.connectedAt as any).seconds * 1000 : i.connectedAt).toLocaleDateString() : '—'}
              </div>
              <div className="flex gap-2">
                <Btn variant="ghost" onClick={() => setSelected(i)}><Plug size={12} className="inline mr-1" /> Details</Btn>
                {i.status === 'connected' ? (
                  <Btn variant="danger" onClick={() => handleDisconnect(i.provider)}>Disconnect</Btn>
                ) : (
                  <Btn onClick={() => handleConnect(i.provider)}>Connect</Btn>
                )}
                <Btn variant="ghost" onClick={() => handleDelete(i.id!)}><XCircle size={12} className="inline mr-1" /></Btn>
              </div>
            </div>
          );
        })}
      </div>

      <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Available Providers</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {INTEGRATION_PROVIDERS.filter((p) => !integrations.some((i) => i.provider === p.provider)).map((p) => (
          <div key={p.provider} className="bg-black border border-gray-800 border-dashed rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-gray-500">{ICONS[p.provider]}</div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-white uppercase tracking-wide text-sm">{p.name}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{p.category}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-4">{p.description}</p>
            <Btn onClick={() => handleConnect(p.provider)}><Plus size={12} className="inline mr-1" /> Connect</Btn>
          </div>
        ))}
      </div>

      {selected && (
        <Modal title={`${INTEGRATION_PROVIDERS.find((p) => p.provider === selected.provider)?.name || selected.provider} — Details`} onClose={() => setSelected(null)}>
          <div className="bg-black border border-gray-800 rounded-xl p-5 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Status</span>
              <Badge status={selected.status} />
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Connected At</span>
              <span className="text-sm font-mono text-gray-300">{selected.connectedAt ? new Date((selected.connectedAt as any).seconds ? (selected.connectedAt as any).seconds * 1000 : selected.connectedAt).toLocaleString() : '—'}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Last Sync</span>
              <span className="text-sm font-mono text-gray-300">{selected.lastSyncAt ? new Date((selected.lastSyncAt as any).seconds ? (selected.lastSyncAt as any).seconds * 1000 : selected.lastSyncAt).toLocaleString() : 'Never'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Config</span>
              <span className="text-sm font-mono text-gray-300 max-w-[200px] truncate">{JSON.stringify(selected.config || {})}</span>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Btn variant="ghost" onClick={() => setSelected(null)}>Close</Btn>
            {selected.status === 'connected' ? (
              <Btn variant="danger" onClick={async () => { await handleDisconnect(selected.provider); setSelected(null); }}>Disconnect</Btn>
            ) : (
              <Btn onClick={async () => { await handleConnect(selected.provider); setSelected(null); }}>Connect</Btn>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Integrations;
