import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, where, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

/* ── Types ─────────────────────────────────────────────────────── */

export interface Quote {
  id?: string;
  quoteNumber: string;
  clientId?: string;
  clientName?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil?: any;
  notes?: string;
  createdBy: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Invoice {
  id?: string;
  invoiceNumber: string;
  quoteId?: string;
  clientId?: string;
  clientName?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate?: any;
  dueDate?: any;
  paidDate?: any;
  notes?: string;
  createdBy: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Payment {
  id?: string;
  invoiceId: string;
  amount: number;
  currency: string;
  method: 'bank' | 'card' | 'cash' | 'other';
  date: any;
  reference?: string;
  createdBy: string;
  createdAt?: any;
}

/* ── Quotes ────────────────────────────────────────────────────── */

export async function listQuotes(): Promise<Quote[]> {
  const q = query(collection(db, 'quotes'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Quote));
}

export async function createQuote(data: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'quotes'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateQuote(id: string, data: Partial<Quote>): Promise<void> {
  await updateDoc(doc(db, 'quotes', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteQuote(id: string): Promise<void> {
  await deleteDoc(doc(db, 'quotes', id));
}

/* ── Invoices ──────────────────────────────────────────────────── */

export async function listInvoices(): Promise<Invoice[]> {
  const q = query(collection(db, 'invoices'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Invoice));
}

export async function createInvoice(data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'invoices'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateInvoice(id: string, data: Partial<Invoice>): Promise<void> {
  await updateDoc(doc(db, 'invoices', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteInvoice(id: string): Promise<void> {
  await deleteDoc(doc(db, 'invoices', id));
}

export async function markInvoicePaid(id: string, payment: Omit<Payment, 'id' | 'createdAt'>): Promise<void> {
  await updateDoc(doc(db, 'invoices', id), { status: 'paid', paidDate: serverTimestamp(), updatedAt: serverTimestamp() });
  await addDoc(collection(db, 'payments'), {
    ...payment,
    createdAt: serverTimestamp(),
  });
}

/* ── Payments ──────────────────────────────────────────────────── */

export async function listPayments(invoiceId?: string): Promise<Payment[]> {
  let q = query(collection(db, 'payments'), orderBy('date', 'desc'));
  if (invoiceId) q = query(collection(db, 'payments'), where('invoiceId', '==', invoiceId), orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Payment));
}

export async function createPayment(data: Omit<Payment, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'payments'), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

/* ── Stats ─────────────────────────────────────────────────────── */

export interface InvoiceStats {
  totalQuotes: number;
  sentQuotes: number;
  totalInvoices: number;
  paidInvoices: number;
  outstanding: number;
  collected: number;
}

export async function getInvoiceStats(): Promise<InvoiceStats> {
  const [quotes, invoices] = await Promise.all([listQuotes(), listInvoices()]);
  const paid = invoices.filter((i) => i.status === 'paid');
  const outstanding = invoices.filter((i) => i.status === 'sent' || i.status === 'overdue');
  return {
    totalQuotes: quotes.length,
    sentQuotes: quotes.filter((q) => q.status === 'sent').length,
    totalInvoices: invoices.length,
    paidInvoices: paid.length,
    outstanding: outstanding.reduce((s, i) => s + i.total, 0),
    collected: paid.reduce((s, i) => s + i.total, 0),
  };
}

/* ── Helpers ───────────────────────────────────────────────────── */

export function calcTotals(items: InvoiceItem[], taxRate = 0) {
  const subtotal = items.reduce((s, i) => s + i.amount, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;
  return { subtotal, taxAmount, total };
}

export function fmtInvoiceNumber(prefix = 'INV'): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const seq = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${y}${m}-${seq}`;
}