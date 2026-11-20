import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, where, serverTimestamp, Timestamp, limit,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

/* ── Types ─────────────────────────────────────────────────────── */

export interface Company {
  id?: string;
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdBy: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Contact {
  id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  title?: string;
  companyId?: string;
  companyName?: string;
  notes?: string;
  tags?: string[];
  createdBy: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color?: string;
}

export interface Pipeline {
  id?: string;
  name: string;
  stages: PipelineStage[];
  isDefault?: boolean;
  createdBy: string;
  createdAt?: any;
}

export interface Deal {
  id?: string;
  title: string;
  value: number;
  currency: string;
  stageId: string;
  pipelineId: string;
  companyId?: string;
  companyName?: string;
  contactId?: string;
  contactName?: string;
  ownerId?: string;
  expectedCloseDate?: any;
  notes?: string;
  status: 'open' | 'won' | 'lost';
  createdBy: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Activity {
  id?: string;
  type: 'note' | 'call' | 'email' | 'meeting' | 'task';
  content: string;
  relatedTo?: { type: 'contact' | 'company' | 'deal'; id: string; name: string };
  createdBy: string;
  createdAt?: any;
}

/* ── Companies ─────────────────────────────────────────────────── */

export async function listCompanies(): Promise<Company[]> {
  const q = query(collection(db, 'companies'), orderBy('name'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Company));
}

export async function getCompany(id: string): Promise<Company | null> {
  const snap = await getDoc(doc(db, 'companies', id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Company) : null;
}

export async function createCompany(data: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'companies'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateCompany(id: string, data: Partial<Company>): Promise<void> {
  await updateDoc(doc(db, 'companies', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteCompany(id: string): Promise<void> {
  await deleteDoc(doc(db, 'companies', id));
}

/* ── Contacts ──────────────────────────────────────────────────── */

export async function listContacts(): Promise<Contact[]> {
  const q = query(collection(db, 'contacts'), orderBy('lastName'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Contact));
}

export async function getContact(id: string): Promise<Contact | null> {
  const snap = await getDoc(doc(db, 'contacts', id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Contact) : null;
}

export async function createContact(data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'contacts'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateContact(id: string, data: Partial<Contact>): Promise<void> {
  await updateDoc(doc(db, 'contacts', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteContact(id: string): Promise<void> {
  await deleteDoc(doc(db, 'contacts', id));
}

/* ── Pipelines ─────────────────────────────────────────────────── */

const DEFAULT_STAGES: PipelineStage[] = [
  { id: 'lead', name: 'Lead', order: 0, color: '#eab308' },
  { id: 'qualified', name: 'Qualified', order: 1, color: '#3b82f6' },
  { id: 'proposal', name: 'Proposal', order: 2, color: '#a855f7' },
  { id: 'negotiation', name: 'Negotiation', order: 3, color: '#f97316' },
  { id: 'won', name: 'Won', order: 4, color: '#22c55e' },
  { id: 'lost', name: 'Lost', order: 5, color: '#ef4444' },
];

export async function listPipelines(): Promise<Pipeline[]> {
  const snap = await getDocs(collection(db, 'pipelines'));
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Pipeline));
  if (list.length === 0) {
    // Seed a default pipeline
    const ref = await addDoc(collection(db, 'pipelines'), {
      name: 'Sales Pipeline',
      stages: DEFAULT_STAGES,
      isDefault: true,
      createdBy: 'system',
      createdAt: serverTimestamp(),
    });
    return [{ id: ref.id, name: 'Sales Pipeline', stages: DEFAULT_STAGES, isDefault: true, createdBy: 'system' }];
  }
  return list;
}

export async function createPipeline(data: Omit<Pipeline, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'pipelines'), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

/* ── Deals ─────────────────────────────────────────────────────── */

export async function listDeals(pipelineId?: string): Promise<Deal[]> {
  let q = query(collection(db, 'deals'), orderBy('createdAt', 'desc'));
  if (pipelineId) q = query(collection(db, 'deals'), where('pipelineId', '==', pipelineId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Deal));
}

export async function getDeal(id: string): Promise<Deal | null> {
  const snap = await getDoc(doc(db, 'deals', id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Deal) : null;
}

export async function createDeal(data: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'deals'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateDeal(id: string, data: Partial<Deal>): Promise<void> {
  await updateDoc(doc(db, 'deals', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDeal(id: string): Promise<void> {
  await deleteDoc(doc(db, 'deals', id));
}

/* ── Activities ────────────────────────────────────────────────── */

export async function listActivities(relatedTo?: { type: string; id: string }): Promise<Activity[]> {
  let q = query(collection(db, 'activities'), orderBy('createdAt', 'desc'), limit(50));
  if (relatedTo) {
    q = query(collection(db, 'activities'), where('relatedTo.id', '==', relatedTo.id), orderBy('createdAt', 'desc'), limit(50));
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Activity));
}

export async function createActivity(data: Omit<Activity, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'activities'), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

/* ── Lead → Deal conversion ────────────────────────────────────── */

export async function convertLeadToDeal(lead: any, pipelineId: string, stageId: string, userId: string): Promise<string> {
  // Create company from lead business name
  const companyId = await createCompany({
    name: lead.businessName || lead.name || 'Unknown Company',
    notes: `Converted from lead. Source: ${lead.source || 'web'}`,
    createdBy: userId,
  });
  // Create contact
  const contactId = await createContact({
    firstName: (lead.name || '').split(' ')[0] || 'Unknown',
    lastName: (lead.name || '').split(' ').slice(1).join(' ') || '',
    email: lead.email || '',
    companyId,
    companyName: lead.businessName || lead.name || '',
    notes: `Converted from lead. Score: ${lead.score ?? 'N/A'}`,
    createdBy: userId,
  });
  // Create deal
  const dealId = await createDeal({
    title: `${lead.businessName || lead.name || 'Lead'} - New Deal`,
    value: 0,
    currency: 'ZAR',
    stageId,
    pipelineId,
    companyId,
    companyName: lead.businessName || lead.name || '',
    contactId,
    contactName: lead.name || '',
    status: 'open',
    createdBy: userId,
  });
  // Log activity
  await createActivity({
    type: 'note',
    content: `Lead converted to deal. Original lead score: ${lead.score ?? 'N/A'}`,
    relatedTo: { type: 'deal', id: dealId, name: `${lead.businessName || lead.name} - New Deal` },
    createdBy: userId,
  });
  return dealId;
}