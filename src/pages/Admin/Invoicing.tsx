import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, Plus, Edit3, Trash2, CheckCircle2, XCircle, FileText, Clock } from 'lucide-react';
import {
  listQuotes, createQuote, updateQuote, deleteQuote,
  listInvoices, createInvoice, updateInvoice, deleteInvoice, markInvoicePaid,
  listPayments, createPayment, getInvoiceStats, calcTotals, fmtInvoiceNumber,
  type InvoiceItem, type Quote, type Invoice, type Payment,
} from '../../lib/invoicing';
import jsPDF from 'jspdf';

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

const fmtMoney = (v: number, c = 'ZAR') => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: c, maximumFractionDigits: 0 }).format(v);

/* ── Invoice Item Row ──────────────────────────────────────────── */

const ItemRow: React.FC<{ item: InvoiceItem; index: number; onChangeDesc: (i: number, v: string) => void; onChangeQty: (i: number, v: number) => void; onChangePrice: (i: number, v: number) => void; onRemove: (i: number) => void }> = ({ item, index, onChangeDesc, onChangeQty, onChangePrice, onRemove }) => {
  return (
    <div className="grid grid-cols-12 gap-2 items-end mb-3 p-3 bg-[#0a0a0a] border border-gray-800 rounded-xl">
      <div className="col-span-5">
        <Input label="Description" value={item.description} onChange={(e) => onChangeDesc(index, e.target.value)} />
      </div>
      <div className="col-span-2">
        <Input label="Qty" value={item.quantity.toString()} onChange={(e) => onChangeQty(index, parseFloat(e.target.value) || 0)} type="number" />
      </div>
      <div className="col-span-3">
        <Input label="Unit Price" value={item.unitPrice.toString()} onChange={(e) => onChangePrice(index, parseFloat(e.target.value) || 0)} type="number" />
      </div>
      <div className="col-span-2">
        <p className="text-right font-mono text-sm font-black">{fmtMoney(item.amount)}</p>
      </div>
      <div className="col-span-1">
        <button onClick={() => onRemove(index)} className="text-red-500 hover:text-white"><Trash2 size={16} /></button>
      </div>
    </div>
  );
};

/* ── Main Invoicing Component ──────────────────────────────────── */

export const Invoicing: React.FC = () => {
  const [tab, setTab] = useState<'quotes' | 'invoices' | 'payments'>('invoices');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Forms
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [quoteItems, setQuoteItems] = useState<InvoiceItem[]>([{ id: '1', description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([{ id: '1', description: '', quantity: 1, unitPrice: 0, amount: 0 }]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [qs, ins, ps, st] = await Promise.all([listQuotes(), listInvoices(), listPayments(), getInvoiceStats()]);
      setQuotes(qs);
      setInvoices(ins);
      setPayments(ps);
      setStats(st);
    } catch (e) { console.error('Invoicing refresh error:', e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, []);

  const recalcItems = (items: InvoiceItem[]) => items.map((i) => ({ ...i, amount: i.quantity * i.unitPrice }));

  const addItem = (setItems: React.Dispatch<React.SetStateAction<InvoiceItem[]>>, items: InvoiceItem[]) => {
    const next = [...items, { id: String(Date.now()), description: '', quantity: 1, unitPrice: 0, amount: 0 }];
    setItems(recalcItems(next));
  };

  const removeItem = (setItems: React.Dispatch<React.SetStateAction<InvoiceItem[]>>, items: InvoiceItem[], index: number) => {
    const next = items.filter((_, i) => i !== index);
    setItems(next.length ? recalcItems(next) : [{ id: String(Date.now()), description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
  };

  const updateItemField = (setItems: React.Dispatch<React.SetStateAction<InvoiceItem[]>>, items: InvoiceItem[], index: number, field: keyof InvoiceItem, value: any) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    setItems(recalcItems(next));
  };

  if (loading) return <div className="p-10 text-center text-gray-500 font-mono animate-pulse">Loading Invoicing...</div>;

  const paid = invoices.filter((i) => i.status === 'paid').length;
  const outstanding = invoices.filter((i) => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.total, 0);

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stat('Quotes', stats?.totalQuotes ?? quotes.length)}
        {stat('Sent Quotes', stats?.sentQuotes ?? quotes.filter(q => q.status === 'sent').length, 'text-yellow-500')}
        {stat('Invoices', stats?.totalInvoices ?? invoices.length)}
        {stat('Outstanding', fmtMoney(outstanding), 'text-red-500')}
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {([
          { key: 'quotes', label: 'Quotes', icon: <FileText size={14} /> },
          { key: 'invoices', label: 'Invoices', icon: <DollarSign size={14} /> },
          { key: 'payments', label: 'Payments', icon: <Clock size={14} /> },
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
        <Btn onClick={() => { if (tab === 'quotes') setShowQuoteForm(true); else setShowInvoiceForm(true); }}><Plus size={12} className="inline mr-1" /> New</Btn>
      </div>

      {/* Quotes tab */}
      {tab === 'quotes' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Quotes ({quotes.length})</h3>
            <Btn onClick={() => { setQuoteItems([{ id: '1', description: '', quantity: 1, unitPrice: 0, amount: 0 }]); setShowQuoteForm(true); }}><Plus size={12} className="inline mr-1" /> New Quote</Btn>
          </div>
          <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0a0a0a] text-gray-500 text-[10px] font-black uppercase tracking-widest">
                <tr><th className="p-4">Quote #</th><th className="p-4">Client</th><th className="p-4">Total</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {quotes.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-600 font-mono text-xs">No quotes yet.</td></tr>
                ) : quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-gray-900/50">
                    <td className="p-4 font-bold text-white">{q.quoteNumber}</td>
                    <td className="p-4 text-gray-300">{q.clientName || '—'}</td>
                    <td className="p-4 text-gray-300">{fmtMoney(q.total, q.currency)}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${q.status === 'accepted' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>{q.status}</span></td>
                    <td className="p-4 text-right">
                      <button onClick={() => { /* convert to invoice */ }} className="text-gray-500 hover:text-white"><CheckCircle2 size={14} /></button>
                      <button onClick={() => { if (confirm('Delete quote?') && q.id) { deleteQuote(q.id).then(refresh); } }} className="text-gray-500 hover:text-red-500"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoices tab */}
      {tab === 'invoices' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Invoices ({invoices.length})</h3>
            <Btn onClick={() => { setInvoiceItems([{ id: '1', description: '', quantity: 1, unitPrice: 0, amount: 0 }]); setShowInvoiceForm(true); }}><Plus size={12} className="inline mr-1" /> New Invoice</Btn>
          </div>
          <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0a0a0a] text-gray-500 text-[10px] font-black uppercase tracking-widest">
                <tr><th className="p-4">Invoice #</th><th className="p-4">Client</th><th className="p-4">Total</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {invoices.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-600 font-mono text-xs">No invoices yet.</td></tr>
                ) : invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-900/50">
                    <td className="p-4 font-bold text-white">{inv.invoiceNumber}</td>
                    <td className="p-4 text-gray-300">{inv.clientName || '—'}</td>
                    <td className="p-4 text-gray-300">{fmtMoney(inv.total, inv.currency)}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${inv.status === 'paid' ? 'bg-green-500/10 text-green-500' : inv.status === 'overdue' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>{inv.status}</span></td>
                    <td className="p-4 text-right">
                      {inv.status !== 'paid' && (
                        <button onClick={() => { if (confirm('Mark as paid?')) { markInvoicePaid(inv.id!, { invoiceId: inv.id!, amount: inv.total, currency: inv.currency, method: 'bank', date: new Date(), createdBy: 'admin' }).then(refresh); } }} className="text-green-500 hover:text-white"><CheckCircle2 size={14} /></button>
                      )}
                      <button onClick={() => { if (confirm('Delete invoice?')) { deleteInvoice(inv.id!).then(refresh); } }} className="text-gray-500 hover:text-red-500"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payments tab */}
      {tab === 'payments' && (
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Payments ({payments.length})</h3>
          <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0a0a0a] text-gray-500 text-[10px] font-black uppercase tracking-widest">
                <tr><th className="p-4">Invoice</th><th className="p-4">Amount</th><th className="p-4">Method</th><th className="p-4">Date</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {payments.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-gray-600 font-mono text-xs">No payments yet.</td></tr>
                ) : payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-900/50">
                    <td className="p-4 font-bold text-white">{p.invoiceId}</td>
                    <td className="p-4 text-gray-300">{fmtMoney(p.amount, p.currency)}</td>
                    <td className="p-4 text-gray-300">{p.method}</td>
                    <td className="p-4 text-gray-400 text-xs font-mono">{p.date?.toDate ? p.date.toDate().toLocaleDateString() : new Date(p.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quote Form Modal */}
      {showQuoteForm && (
        <Modal title="New Quote" onClose={() => { setShowQuoteForm(false); setQuoteItems([{ id: '1', description: '', quantity: 1, unitPrice: 0, amount: 0 }]); }}>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const items = recalcItems(quoteItems.filter((i) => i.description));
            const { subtotal, taxAmount, total } = calcTotals(items, parseFloat((fd.get('taxRate') as string) || '0') || 0);
            await createQuote({
              quoteNumber: fmtInvoiceNumber('QTE'),
              clientName: (fd.get('clientName') as string) || '',
              items, subtotal, taxRate: parseFloat((fd.get('taxRate') as string) || '0') || 0, taxAmount, total,
              currency: (fd.get('currency') as string) || 'ZAR', status: 'draft',
              validUntil: fd.get('validUntil') ? new Date(((fd.get('validUntil') as string) || '')) : undefined,
              notes: ((fd.get('notes') as string) || ''), createdBy: 'admin',
            });
            setShowQuoteForm(false);
            setQuoteItems([{ id: '1', description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
            refresh();
          }}>
            <Input label="Client Name *" name="clientName" required />
            <div className="grid grid-cols-3 gap-4">
              <Input label="Tax Rate (%)" name="taxRate" defaultValue="0" type="number" />
              <Select label=" Currency" name="currency" defaultValue="ZAR" options={[{ value: 'ZAR', label: 'ZAR' }, { value: 'USD', label: 'USD' }]} />
              <Input label="Valid Until" name="validUntil" type="date" />
            </div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Line Items</h4>
            {quoteItems.map((item, i) => (
              <ItemRow key={item.id} item={item} index={i}
                onChangeDesc={(idx, v) => updateItemField(setQuoteItems, quoteItems, idx, 'description', v)}
                onChangeQty={(idx, v) => updateItemField(setQuoteItems, quoteItems, idx, 'quantity', v)}
                onChangePrice={(idx, v) => updateItemField(setQuoteItems, quoteItems, idx, 'unitPrice', v)}
                onRemove={(idx) => removeItem(setQuoteItems, quoteItems, idx)} />
            ))}
            <Btn type="button" onClick={() => addItem(setQuoteItems, quoteItems)} variant="ghost">+ Add Item</Btn>
            <Textarea label="Notes" name="notes" />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <p className="text-right text-lg font-black">Subtotal: <span className="text-yellow-500">{'ZAR ' + calcTotals(recalcItems(quoteItems.filter(i=>i.description)), 0).subtotal.toFixed(0)}</span></p>
              <p className="text-right text-lg font-black">Total: <span className="text-yellow-500">{'ZAR ' + calcTotals(recalcItems(quoteItems.filter(i=>i.description)), 0).total.toFixed(0)}</span></p>
            </div>
            <div className="flex gap-3 justify-end mt-4">
              <Btn variant="ghost" onClick={() => { setShowQuoteForm(false); setQuoteItems([{ id: '1', description: '', quantity: 1, unitPrice: 0, amount: 0 }]); }}>Cancel</Btn>
              <Btn type="submit">Create Quote</Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* Invoice Form Modal */}
      {showInvoiceForm && (
        <Modal title="New Invoice" onClose={() => { setShowInvoiceForm(false); setInvoiceItems([{ id: '1', description: '', quantity: 1, unitPrice: 0, amount: 0 }]); }}>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const items = recalcItems(invoiceItems.filter((i) => i.description));
            const { subtotal, taxAmount, total } = calcTotals(items, parseFloat((fd.get('taxRate') as string) || '0') || 0);
            await createInvoice({
              invoiceNumber: fmtInvoiceNumber('INV'),
              clientName: (fd.get('clientName') as string) || '',
              items, subtotal, taxRate: parseFloat((fd.get('taxRate') as string) || '0') || 0, taxAmount, total,
              currency: (fd.get('currency') as string) || 'ZAR', status: 'draft',
              issueDate: new Date(), dueDate: fd.get('dueDate') ? new Date(((fd.get('dueDate') as string) || '')) : undefined,
              notes: ((fd.get('notes') as string) || ''), createdBy: 'admin',
            });
            setShowInvoiceForm(false);
            setInvoiceItems([{ id: '1', description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
            refresh();
          }}>
            <Input label="Client Name *" name="clientName" required />
            <div className="grid grid-cols-3 gap-4">
              <Input label="Tax Rate (%)" name="taxRate" defaultValue="0" type="number" />
              <Select label="Currency" name="currency" defaultValue="ZAR" options={[{ value: 'ZAR', label: 'ZAR' }, { value: 'USD', label: 'USD' }]} />
              <Input label="Due Date" name="dueDate" type="date" />
            </div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Line Items</h4>
            {invoiceItems.map((item, i) => (
              <ItemRow key={item.id} item={item} index={i}
                onChangeDesc={(idx, v) => updateItemField(setInvoiceItems, invoiceItems, idx, 'description', v)}
                onChangeQty={(idx, v) => updateItemField(setInvoiceItems, invoiceItems, idx, 'quantity', v)}
                onChangePrice={(idx, v) => updateItemField(setInvoiceItems, invoiceItems, idx, 'unitPrice', v)}
                onRemove={(idx) => removeItem(setInvoiceItems, invoiceItems, idx)} />
            ))}
            <Btn type="button" onClick={() => addItem(setInvoiceItems, invoiceItems)} variant="ghost">+ Add Item</Btn>
            <Textarea label="Notes" name="notes" />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <p className="text-right text-lg font-black">Subtotal: <span className="text-yellow-500">{'ZAR ' + calcTotals(recalcItems(invoiceItems.filter(i=>i.description)), 0).subtotal.toFixed(0)}</span></p>
              <p className="text-right text-lg font-black">Total: <span className="text-yellow-500">{'ZAR ' + calcTotals(recalcItems(invoiceItems.filter(i=>i.description)), 0).total.toFixed(0)}</span></p>
            </div>
            <div className="flex gap-3 justify-end mt-4">
              <Btn variant="ghost" onClick={() => { setShowInvoiceForm(false); setInvoiceItems([{ id: '1', description: '', quantity: 1, unitPrice: 0, amount: 0 }]); }}>Cancel</Btn>
              <Btn type="submit">Create Invoice</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Invoicing;