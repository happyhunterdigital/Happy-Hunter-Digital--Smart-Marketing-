import React, { useState, useEffect, useCallback } from 'react';
import {
  collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import {
  Users, Building2, DollarSign, Kanban, Plus, X, Search, Trash2, Edit3, GripVertical,
  Mail, Phone, Globe, StickyNote, ArrowRight, CheckCircle2, XCircle, Clock,
} from 'lucide-react';
import {
  listCompanies, createCompany, updateCompany, deleteCompany,
  listContacts, createContact, updateContact, deleteContact,
  listPipelines, createPipeline,
  listDeals, createDeal, updateDeal, deleteDeal,
  listActivities, createActivity,
  convertLeadToDeal,
  type Company, type Contact, type Pipeline, type Deal, type Activity, type PipelineStage,
} from '../../lib/crm';

/* ── Helpers ───────────────────────────────────────────────────── */

const fmtMoney = (v: number, c: string = 'ZAR') =>
  new Intl.NumberFormat('en-ZA', { style: 'currency', currency: c, maximumFractionDigits: 0 }).format(v);

const uid = () => (auth.currentUser?.uid || 'anon');
const email = () => (auth.currentUser?.email || '');

/* ── Modal wrapper ─────────────────────────────────────────────── */

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black uppercase tracking-tighter text-white">{title}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={20} /></button>
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
  const styles = {
    primary: 'bg-yellow-500 text-black hover:bg-white',
    ghost: 'bg-[#1a1a1a] border border-gray-700 text-gray-300 hover:text-white hover:border-yellow-500',
    danger: 'bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20',
  };
  return (
    <button type={type} onClick={onClick} className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${styles[variant]}`}>
      {children}
    </button>
  );
};

/* ── Company Form ──────────────────────────────────────────────── */

const CompanyForm: React.FC<{ initial?: Company; onSave: (d: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => void; onCancel: () => void }> = ({ initial, onSave, onCancel }) => {
  const [name, setName] = useState(initial?.name || '');
  const [industry, setIndustry] = useState(initial?.industry || '');
  const [website, setWebsite] = useState(initial?.website || '');
  const [phone, setPhone] = useState(initial?.phone || '');
  const [address, setAddress] = useState(initial?.address || '');
  const [notes, setNotes] = useState(initial?.notes || '');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, industry, website, phone, address, notes, createdBy: uid() });
  };

  return (
    <form onSubmit={submit}>
      <Input label="Company Name *" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input label="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
      <Input label="Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
      <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <Input label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
      <Textarea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <div className="flex gap-3 justify-end">
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn type="submit">Save Company</Btn>
      </div>
    </form>
  );
};

/* ── Contact Form ──────────────────────────────────────────────── */

const ContactForm: React.FC<{ initial?: Contact; companies: Company[]; onSave: (d: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void; onCancel: () => void }> = ({ initial, companies, onSave, onCancel }) => {
  const [firstName, setFirstName] = useState(initial?.firstName || '');
  const [lastName, setLastName] = useState(initial?.lastName || '');
  const [email, setEmail] = useState(initial?.email || '');
  const [phone, setPhone] = useState(initial?.phone || '');
  const [title, setTitle] = useState(initial?.title || '');
  const [companyId, setCompanyId] = useState(initial?.companyId || '');
  const [notes, setNotes] = useState(initial?.notes || '');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const comp = companies.find((c) => c.id === companyId);
    onSave({ firstName, lastName, email, phone, title, companyId: companyId || undefined, companyName: comp?.name, notes, createdBy: uid() });
  };

  return (
    <form onSubmit={submit}>
      <div className="grid grid-cols-2 gap-4">
        <Input label="First Name *" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <Input label="Last Name *" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
      </div>
      <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
      <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <Input label="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Select label="Company" value={companyId} onChange={(e) => setCompanyId(e.target.value)} options={[{ value: '', label: '— None —' }, ...companies.map((c) => ({ value: c.id!, label: c.name }))]} />
      <Textarea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <div className="flex gap-3 justify-end">
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn type="submit">Save Contact</Btn>
      </div>
    </form>
  );
};

/* ── Deal Form ─────────────────────────────────────────────────── */

const DealForm: React.FC<{ initial?: Deal; companies: Company[]; contacts: Contact[]; pipeline: Pipeline; onSave: (d: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => void; onCancel: () => void }> = ({ initial, companies, contacts, pipeline, onSave, onCancel }) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [value, setValue] = useState(initial?.value?.toString() || '0');
  const [currency, setCurrency] = useState(initial?.currency || 'ZAR');
  const [stageId, setStageId] = useState(initial?.stageId || pipeline.stages[0]?.id || '');
  const [companyId, setCompanyId] = useState(initial?.companyId || '');
  const [contactId, setContactId] = useState(initial?.contactId || '');
  const [expectedClose, setExpectedClose] = useState(initial?.expectedCloseDate ? new Date(initial.expectedCloseDate.seconds * 1000).toISOString().split('T')[0] : '');
  const [notes, setNotes] = useState(initial?.notes || '');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const comp = companies.find((c) => c.id === companyId);
    const cont = contacts.find((c) => c.id === contactId);
    onSave({
      title, value: parseFloat(value) || 0, currency, stageId, pipelineId: pipeline.id!,
      companyId: companyId || undefined, companyName: comp?.name,
      contactId: contactId || undefined, contactName: cont ? `${cont.firstName} ${cont.lastName}` : undefined,
      expectedCloseDate: expectedClose ? new Date(expectedClose) : undefined,
      notes, status: 'open', createdBy: uid(),
    });
  };

  return (
    <form onSubmit={submit}>
      <Input label="Deal Title *" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Value" value={value} onChange={(e) => setValue(e.target.value)} type="number" />
        <Select label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} options={[{ value: 'ZAR', label: 'ZAR' }, { value: 'USD', label: 'USD' }, { value: 'EUR', label: 'EUR' }]} />
      </div>
      <Select label="Stage" value={stageId} onChange={(e) => setStageId(e.target.value)} options={pipeline.stages.map((s) => ({ value: s.id, label: s.name }))} />
      <Select label="Company" value={companyId} onChange={(e) => setCompanyId(e.target.value)} options={[{ value: '', label: '— None —' }, ...companies.map((c) => ({ value: c.id!, label: c.name }))]} />
      <Select label="Contact" value={contactId} onChange={(e) => setContactId(e.target.value)} options={[{ value: '', label: '— None —' }, ...contacts.map((c) => ({ value: c.id!, label: `${c.firstName} ${c.lastName}` }))]} />
      <Input label="Expected Close Date" value={expectedClose} onChange={(e) => setExpectedClose(e.target.value)} type="date" />
      <Textarea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <div className="flex gap-3 justify-end">
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn type="submit">Save Deal</Btn>
      </div>
    </form>
  );
};

/* ── Pipeline Kanban ───────────────────────────────────────────── */

const PipelineBoard: React.FC<{ pipeline: Pipeline; deals: Deal[]; companies: Company[]; contacts: Contact[]; onDealMove: (dealId: string, newStageId: string) => void; onDealClick: (deal: Deal) => void; onAddDeal: () => void }> = ({ pipeline, deals, onDealMove, onDealClick, onAddDeal }) => {
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    setDraggedDeal(dealId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (draggedDeal) {
      onDealMove(draggedDeal, stageId);
      setDraggedDeal(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const stages = [...pipeline.stages].sort((a, b) => a.order - b.order);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map((stage) => {
        const stageDeals = deals.filter((d) => d.stageId === stage.id && d.status === 'open');
        const total = stageDeals.reduce((s, d) => s + (d.value || 0), 0);
        return (
          <div
            key={stage.id}
            onDrop={(e) => handleDrop(e, stage.id)}
            onDragOver={handleDragOver}
            className="flex-shrink-0 w-72 bg-[#0a0a0a] border border-gray-800 rounded-2xl p-3"
          >
            <div className="flex justify-between items-center mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color || '#666' }} />
                <span className="text-xs font-black uppercase tracking-widest text-gray-300">{stage.name}</span>
                <span className="text-[10px] text-gray-600 font-mono">({stageDeals.length})</span>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">{fmtMoney(total)}</span>
            </div>
            <div className="space-y-2 min-h-[120px]">
              {stageDeals.map((deal) => (
                <div
                  key={deal.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, deal.id!)}
                  onClick={() => onDealClick(deal)}
                  className="bg-black border border-gray-800 rounded-xl p-3 cursor-grab active:cursor-grabbing hover:border-yellow-500/50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-white group-hover:text-yellow-500 transition-colors leading-tight">{deal.title}</p>
                    <GripVertical size={12} className="text-gray-700 mt-0.5 shrink-0" />
                  </div>
                  {deal.companyName && <p className="text-[10px] text-gray-500 mt-1">{deal.companyName}</p>}
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-black text-green-500">{fmtMoney(deal.value, deal.currency)}</span>
                    {deal.expectedCloseDate && (
                      <span className="text-[9px] text-gray-600 font-mono">
                        {new Date(deal.expectedCloseDate.seconds ? deal.expectedCloseDate.seconds * 1000 : deal.expectedCloseDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {stage.id === stages[0]?.id && (
              <button onClick={onAddDeal} className="w-full mt-2 py-2 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-yellow-500 border border-dashed border-gray-800 rounded-xl transition-colors flex items-center justify-center gap-1">
                <Plus size={12} /> Add Deal
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ── Main CRM Component ────────────────────────────────────────── */

export const CRM: React.FC = () => {
  const [tab, setTab] = useState<'pipeline' | 'contacts' | 'companies' | 'activities'>('pipeline');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activePipeline, setActivePipeline] = useState<Pipeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal state
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [showDealForm, setShowDealForm] = useState(false);
  const [editDeal, setEditDeal] = useState<Deal | null>(null);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [cos, cons, pipes, dls, acts] = await Promise.all([
        listCompanies(), listContacts(), listPipelines(), listDeals(), listActivities(),
      ]);
      setCompanies(cos);
      setContacts(cons);
      setPipelines(pipes);
      setDeals(dls);
      setActivities(acts);
      if (!activePipeline && pipes.length > 0) setActivePipeline(pipes[0]);
    } catch (e) {
      console.error('CRM refresh error:', e);
    } finally {
      setLoading(false);
    }
  }, [activePipeline]);

  useEffect(() => { refresh(); }, []);

  const handleDealMove = async (dealId: string, newStageId: string) => {
    const deal = deals.find((d) => d.id === dealId);
    if (!deal || deal.stageId === newStageId) return;
    const stage = activePipeline?.stages.find((s) => s.id === newStageId);
    await updateDeal(dealId, { stageId: newStageId });
    await createActivity({
      type: 'note',
      content: `Deal moved to "${stage?.name || newStageId}"`,
      relatedTo: { type: 'deal', id: dealId, name: deal.title },
      createdBy: uid(),
    });
    setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, stageId: newStageId } : d)));
  };

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal);
  };

  const filteredContacts = contacts.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.email || ''} ${c.companyName || ''}`.toLowerCase().includes(search.toLowerCase())
  );
  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="p-10 text-center text-gray-500 font-mono animate-pulse">Loading CRM data...</div>;
  }

  return (
    <div className="animate-fade-in">
      {/* Sub-tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {([
          { key: 'pipeline', label: 'Pipeline', icon: <Kanban size={14} /> },
          { key: 'contacts', label: 'Contacts', icon: <Users size={14} /> },
          { key: 'companies', label: 'Companies', icon: <Building2 size={14} /> },
          { key: 'activities', label: 'Activity', icon: <Clock size={14} /> },
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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="bg-black border border-gray-800 text-white pl-9 pr-3 py-2 rounded-lg text-xs focus:border-yellow-500 outline-none w-48"
          />
        </div>
      </div>

      {/* Pipeline tab */}
      {tab === 'pipeline' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <select
                value={activePipeline?.id || ''}
                onChange={(e) => setActivePipeline(pipelines.find((p) => p.id === e.target.value) || null)}
                className="bg-black border border-gray-800 text-white px-3 py-2 rounded-lg text-xs"
              >
                {pipelines.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <span className="text-xs text-gray-500">
                {deals.filter((d) => d.status === 'open').length} open deals · {fmtMoney(deals.filter((d) => d.status === 'open').reduce((s, d) => s + d.value, 0))}
              </span>
            </div>
            <Btn onClick={() => setShowDealForm(true)}><Plus size={12} className="inline mr-1" /> New Deal</Btn>
          </div>
          {activePipeline && (
            <PipelineBoard
              pipeline={activePipeline}
              deals={deals.filter((d) => d.pipelineId === activePipeline.id)}
              companies={companies}
              contacts={contacts}
              onDealMove={handleDealMove}
              onDealClick={handleDealClick}
              onAddDeal={() => setShowDealForm(true)}
            />
          )}
        </div>
      )}

      {/* Contacts tab */}
      {tab === 'contacts' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Contacts ({filteredContacts.length})</h3>
            <Btn onClick={() => { setEditContact(null); setShowContactForm(true); }}><Plus size={12} className="inline mr-1" /> New Contact</Btn>
          </div>
          <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0a0a0a] text-gray-500 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Company</th>
                  <th className="p-4">Title</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredContacts.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-gray-600 font-mono text-xs">No contacts yet.</td></tr>
                ) : filteredContacts.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-900/50">
                    <td className="p-4 font-bold text-white">{c.firstName} {c.lastName}</td>
                    <td className="p-4 text-gray-300">{c.email || '—'}</td>
                    <td className="p-4 text-gray-300">{c.phone || '—'}</td>
                    <td className="p-4 text-gray-400">{c.companyName || '—'}</td>
                    <td className="p-4 text-gray-400">{c.title || '—'}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => { setEditContact(c); setShowContactForm(true); }} className="text-gray-500 hover:text-yellow-500 mr-2"><Edit3 size={14} /></button>
                      <button onClick={async () => { if (confirm('Delete contact?')) { await deleteContact(c.id!); refresh(); } }} className="text-gray-500 hover:text-red-500"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Companies tab */}
      {tab === 'companies' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Companies ({filteredCompanies.length})</h3>
            <Btn onClick={() => { setEditCompany(null); setShowCompanyForm(true); }}><Plus size={12} className="inline mr-1" /> New Company</Btn>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompanies.length === 0 ? (
              <p className="text-gray-600 font-mono text-xs col-span-full p-8 text-center">No companies yet.</p>
            ) : filteredCompanies.map((c) => (
              <div key={c.id} className="bg-black border border-gray-800 rounded-2xl p-5 hover:border-yellow-500/30 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500 font-black text-lg">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white">{c.name}</p>
                      {c.industry && <p className="text-[10px] text-gray-500 uppercase tracking-widest">{c.industry}</p>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditCompany(c); setShowCompanyForm(true); }} className="text-gray-500 hover:text-yellow-500 p-1"><Edit3 size={12} /></button>
                    <button onClick={async () => { if (confirm('Delete company?')) { await deleteCompany(c.id!); refresh(); } }} className="text-gray-500 hover:text-red-500 p-1"><Trash2 size={12} /></button>
                  </div>
                </div>
                {c.website && <p className="text-xs text-gray-400 flex items-center gap-1"><Globe size={10} /> {c.website}</p>}
                {c.phone && <p className="text-xs text-gray-400 flex items-center gap-1"><Phone size={10} /> {c.phone}</p>}
                {c.notes && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{c.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activities tab */}
      {tab === 'activities' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Recent Activity ({activities.length})</h3>
            <Btn onClick={() => setShowActivityForm(true)}><Plus size={12} className="inline mr-1" /> Log Activity</Btn>
          </div>
          <div className="space-y-3">
            {activities.length === 0 ? (
              <p className="text-gray-600 font-mono text-xs p-8 text-center">No activity logged yet.</p>
            ) : activities.map((a) => (
              <div key={a.id} className="bg-black border border-gray-800 rounded-xl p-4 flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0">
                  {a.type === 'call' ? <Phone size={14} /> : a.type === 'email' ? <Mail size={14} /> : a.type === 'meeting' ? <Users size={14} /> : <StickyNote size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500">{a.type}</span>
                    {a.relatedTo && <span className="text-[10px] text-gray-500">→ {a.relatedTo.name}</span>}
                    <span className="text-[9px] text-gray-600 font-mono ml-auto">{a.createdAt?.toDate?.()?.toLocaleString() || 'just now'}</span>
                  </div>
                  <p className="text-sm text-gray-300">{a.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deal detail modal */}
      {selectedDeal && (
        <Modal title={selectedDeal.title} onClose={() => setSelectedDeal(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500 text-[10px] uppercase tracking-widest font-black">Value</span><p className="text-green-500 font-black text-lg">{fmtMoney(selectedDeal.value, selectedDeal.currency)}</p></div>
              <div><span className="text-gray-500 text-[10px] uppercase tracking-widest font-black">Stage</span><p className="text-white font-bold">{activePipeline?.stages.find((s) => s.id === selectedDeal.stageId)?.name || selectedDeal.stageId}</p></div>
              <div><span className="text-gray-500 text-[10px] uppercase tracking-widest font-black">Company</span><p className="text-white">{selectedDeal.companyName || '—'}</p></div>
              <div><span className="text-gray-500 text-[10px] uppercase tracking-widest font-black">Contact</span><p className="text-white">{selectedDeal.contactName || '—'}</p></div>
            </div>
            {selectedDeal.notes && <p className="text-sm text-gray-400 bg-[#1a1a1a] p-3 rounded-xl">{selectedDeal.notes}</p>}
            <div className="flex gap-2 flex-wrap">
              <Btn variant="ghost" onClick={() => { setEditDeal(selectedDeal); setSelectedDeal(null); setShowDealForm(true); }}><Edit3 size={12} className="inline mr-1" /> Edit</Btn>
              <Btn variant="ghost" onClick={async () => { await updateDeal(selectedDeal.id!, { status: 'won' }); setSelectedDeal(null); refresh(); }}><CheckCircle2 size={12} className="inline mr-1" /> Mark Won</Btn>
              <Btn variant="danger" onClick={async () => { await updateDeal(selectedDeal.id!, { status: 'lost' }); setSelectedDeal(null); refresh(); }}><XCircle size={12} className="inline mr-1" /> Mark Lost</Btn>
              <Btn variant="danger" onClick={async () => { if (confirm('Delete deal?')) { await deleteDeal(selectedDeal.id!); setSelectedDeal(null); refresh(); } }}><Trash2 size={12} className="inline mr-1" /> Delete</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Modals */}
      {showCompanyForm && (
        <Modal title={editCompany ? 'Edit Company' : 'New Company'} onClose={() => { setShowCompanyForm(false); setEditCompany(null); }}>
          <CompanyForm
            initial={editCompany || undefined}
            onSave={async (d) => {
              if (editCompany?.id) await updateCompany(editCompany.id, d); else await createCompany(d);
              setShowCompanyForm(false); setEditCompany(null); refresh();
            }}
            onCancel={() => { setShowCompanyForm(false); setEditCompany(null); }}
          />
        </Modal>
      )}

      {showContactForm && (
        <Modal title={editContact ? 'Edit Contact' : 'New Contact'} onClose={() => { setShowContactForm(false); setEditContact(null); }}>
          <ContactForm
            initial={editContact || undefined}
            companies={companies}
            onSave={async (d) => {
              if (editContact?.id) await updateContact(editContact.id, d); else await createContact(d);
              setShowContactForm(false); setEditContact(null); refresh();
            }}
            onCancel={() => { setShowContactForm(false); setEditContact(null); }}
          />
        </Modal>
      )}

      {showDealForm && activePipeline && (
        <Modal title={editDeal ? 'Edit Deal' : 'New Deal'} onClose={() => { setShowDealForm(false); setEditDeal(null); }}>
          <DealForm
            initial={editDeal || undefined}
            companies={companies}
            contacts={contacts}
            pipeline={activePipeline}
            onSave={async (d) => {
              if (editDeal?.id) await updateDeal(editDeal.id, d); else await createDeal(d);
              setShowDealForm(false); setEditDeal(null); refresh();
            }}
            onCancel={() => { setShowDealForm(false); setEditDeal(null); }}
          />
        </Modal>
      )}

      {showActivityForm && (
        <Modal title="Log Activity" onClose={() => setShowActivityForm(false)}>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            await createActivity({
              type: (fd.get('type') as Activity['type']) || 'note',
              content: (fd.get('content') as string) || '',
              createdBy: uid(),
            });
            setShowActivityForm(false);
            refresh();
          }}>
            <Select label="Type" name="type" defaultValue="note" options={[
              { value: 'note', label: 'Note' }, { value: 'call', label: 'Call' },
              { value: 'email', label: 'Email' }, { value: 'meeting', label: 'Meeting' }, { value: 'task', label: 'Task' },
            ]} />
            <Textarea label="Content" name="content" required />
            <div className="flex gap-3 justify-end">
              <Btn variant="ghost" onClick={() => setShowActivityForm(false)}>Cancel</Btn>
              <Btn type="submit">Log</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CRM;