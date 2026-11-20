import React, { useState, useEffect, useCallback } from 'react';
import { Building2, Plus, Trash2, Users, Crown, X } from 'lucide-react';
import {
  listOrgs, createOrg, deleteOrg,
  listMembers, addMember, updateMemberRole, removeMember,
  type Org, type OrgMember, type OrgRole,
} from '../../lib/orgs';

const ROLE_COLORS: Record<OrgRole, string> = {
  owner: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30',
  admin: 'bg-red-500/10 text-red-500 border border-red-500/30',
  manager: 'bg-green-500/10 text-green-500 border border-green-500/30',
  member: 'bg-gray-700 text-gray-400 border border-gray-700/30',
};

const Badge: React.FC<{ status: string }> = ({ status }) => (
  <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${status === 'active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-gray-700 text-gray-500 border border-gray-700/30'}`}>{status}</span>
);

/* ── Main MultiTenant Component ─────────────────────────────────── */

export const MultiTenant: React.FC = () => {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOrgForm, setShowOrgForm] = useState(false);
  const [orgForm, setOrgForm] = useState<{ name: string; slug: string; industry: string }>({ name: '', slug: '', industry: '' });

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const orgsData = await listOrgs();
      setOrgs(orgsData);
      if (orgsData.length > 0) setSelectedOrgId((cur) => cur || orgsData[0].id || null);
    } catch (e) { console.error('MultiTenant refresh error:', e); }
    finally { setLoading(false); }
  }, []);

  const refreshMembers = useCallback(async (orgId: string) => {
    try {
      const m = await listMembers(orgId);
      setMembers(m);
    } catch (e) { console.error('Members refresh error:', e); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => { if (selectedOrgId) refreshMembers(selectedOrgId); }, [selectedOrgId, refreshMembers]);

  const selectedOrg = orgs.find((o) => o.id === selectedOrgId) || null;

  const handleCreateOrg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = (fd.get('name') as string) || '';
    const slug = ((fd.get('slug') as string) || '').toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (!name) return;
    const id = await createOrg({ name, slug: slug || name.toLowerCase().replace(/[^a-z0-9-]/g, '-'), industry: (fd.get('industry') as string) || undefined, createdBy: 'admin' });
    setShowOrgForm(false);
    setOrgForm({ name: '', slug: '', industry: '' });
    const org = await (await listOrgs()).find((o) => o.name === name);
    if (org?.id) setSelectedOrgId(org.id);
    await refresh();
  };

  const handleAddMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = (fd.get('email') as string) || '';
    const role = (fd.get('role') as string) as OrgRole;
    if (!email || !selectedOrgId) return;
    await addMember(selectedOrgId, { orgId: selectedOrgId, email, role, addedBy: 'admin' });
    await refreshMembers(selectedOrgId);
  };

  const handleRemoveMember = async (email: string) => {
    if (confirm(`Remove ${email} from ${selectedOrg?.name}?`)) {
      if (selectedOrgId) await removeMember(selectedOrgId, email);
      await refreshMembers(selectedOrgId!);
    }
  };

  const handleRoleChange = async (member: OrgMember, role: OrgRole) => {
    if (selectedOrgId) {
      await updateMemberRole(selectedOrgId, member.email, role);
      await refreshMembers(selectedOrgId);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500 font-mono animate-pulse">Loading Multi-Tenant...</div>;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Organizations ({orgs.length})</h3>
        <button onClick={() => setShowOrgForm(true)} className="bg-yellow-500 text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-colors">
          <Plus size={12} className="inline mr-1" /> New Organization
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Org list */}
        <div className="bg-black border border-gray-800 rounded-2xl p-4 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={16} className="text-yellow-500" />
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">All Orgs</h4>
          </div>
          <div className="space-y-2">
            {orgs.length === 0 && <p className="text-gray-500 text-xs font-mono text-center py-4">No organizations yet.</p>}
            {orgs.map((o) => (
              <button
                key={o.id}
                onClick={() => setSelectedOrgId(o.id!)}
                className={`w-full text-left p-3 rounded-xl border transition-colors ${selectedOrgId === o.id ? 'bg-yellow-500/10 border-yellow-500/50' : 'bg-[#0a0a0a] border-gray-800 hover:border-gray-700'}`}
              >
                <p className="text-sm font-bold text-white">{o.name}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{o.industry || 'General'}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Members */}
        <div className="lg:col-span-3">
          <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Users size={14} /> Members of {selectedOrg?.name || '—'}
              </h3>
              <Badge status={selectedOrg?.slug ? 'active' : 'inactive'} />
            </div>
            <div className="p-4 border-b border-gray-800">
              <form onSubmit={handleAddMember} className="flex gap-2 flex-wrap">
                <input name="email" type="email" required placeholder="teammate@happyhunterdigital.com" className="flex-1 min-w-[240px] bg-black border border-gray-800 text-white px-4 py-2 rounded-xl focus:border-yellow-500 outline-none text-sm" />
                <select name="role" defaultValue="member" className="bg-black border border-gray-800 text-white px-4 py-2 rounded-xl focus:border-yellow-500 outline-none text-sm">
                  <option value="member">Member</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                </select>
                <button type="submit" className="bg-yellow-500 text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-colors">Add Member</button>
              </form>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0a0a0a] text-gray-500 text-[10px] font-black uppercase tracking-widest">
                <tr><th className="p-4">Member</th><th className="p-4">Role</th><th className="p-4">Added</th><th className="p-4 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {members.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-gray-600 font-mono text-xs">No members yet.</td></tr>
                ) : members.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-900/50">
                    <td className="p-4 font-bold text-white">{m.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[9px] font-black uppercase inline-flex items-center gap-1 ${ROLE_COLORS[m.role] || ROLE_COLORS.member}`}>
                        {m.role === 'owner' && <Crown size={10} />} {m.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-xs font-mono">{m.addedAt ? new Date((m.addedAt as any).seconds ? (m.addedAt as any).seconds * 1000 : m.addedAt).toLocaleDateString() : '—'}</td>
                    <td className="p-4 text-right">
                      <select
                        value={m.role}
                        onChange={(e) => handleRoleChange(m, e.target.value as OrgRole)}
                        className="bg-black border border-gray-800 text-white px-3 py-1 rounded-lg text-xs mb-2"
                      >
                        <option value="member">Member</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                        <option value="owner">Owner</option>
                      </select>
                      <button onClick={() => handleRemoveMember(m.email)} className="text-gray-500 hover:text-red-500"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showOrgForm && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowOrgForm(false)}>
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase tracking-tighter text-white">New Organization</h2>
              <button onClick={() => setShowOrgForm(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateOrg}>
              <div className="mb-4">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Organization Name *</label>
                <input name="name" required defaultValue={orgForm.name} onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })} className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:border-yellow-500 outline-none text-sm" />
              </div>
              <div className="mb-4">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Industry</label>
                <input name="industry" defaultValue={orgForm.industry} onChange={(e) => setOrgForm({ ...orgForm, industry: e.target.value })} className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:border-yellow-500 outline-none text-sm" />
              </div>
              <div className="mb-4">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Slug</label>
                <input name="slug" defaultValue={orgForm.slug} onChange={(e) => setOrgForm({ ...orgForm, slug: e.target.value })} className="w-full bg-black border border-gray-800 text-white px-4 py-3 rounded-xl focus:border-yellow-500 outline-none text-sm" />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowOrgForm(false)} className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-[#1a1a1a] border border-gray-700 text-gray-300 hover:text-white hover:border-yellow-500">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-yellow-500 text-black hover:bg-white">Create Org</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiTenant;
