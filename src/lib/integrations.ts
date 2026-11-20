import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, setDoc,
  query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

/* ── Types ─────────────────────────────────────────────────────── */

export type IntegrationProvider =
  | 'google-calendar'
  | 'gmail'
  | 'xero'
  | 'quickbooks'
  | 'stripe';

export type IntegrationStatus = 'connected' | 'disconnected';

export interface Integration {
  id?: string;
  provider: IntegrationProvider;
  status: IntegrationStatus;
  config: Record<string, any>;
  connectedAt?: any;
  lastSyncAt?: any;
  createdBy: string;
}

export const INTEGRATION_PROVIDERS: { provider: IntegrationProvider; name: string; description: string; category: string }[] = [
  { provider: 'google-calendar', name: 'Google Calendar', description: 'Two-way calendar sync for projects and milestones.', category: 'Productivity' },
  { provider: 'gmail', name: 'Gmail / Email', description: 'Inbound lead email ingestion and outbound campaign sync.', category: 'Communication' },
  { provider: 'xero', name: 'Xero', description: 'Invoice and quote sync with Xero accounting.', category: 'Accounting' },
  { provider: 'quickbooks', name: 'QuickBooks', description: 'Invoice and payment sync with QuickBooks.', category: 'Accounting' },
  { provider: 'stripe', name: 'Stripe', description: 'Payment intake and subscription billing sync.', category: 'Payments' },
];

/* ── CRUD ──────────────────────────────────────────────────────── */

export async function listIntegrations(): Promise<Integration[]> {
  const snap = await getDocs(query(collection(db, 'integrations'), orderBy('createdAt', 'desc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Integration));
}

export async function getIntegration(provider: IntegrationProvider): Promise<Integration | null> {
  const snap = await getDoc(doc(db, 'integrations', provider));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Integration) : null;
}

export async function upsertIntegration(
  data: Omit<Integration, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): Promise<string> {
  const payload = { ...data };
  if (data.status === 'connected') {
    payload.connectedAt = serverTimestamp();
    payload.lastSyncAt = data.lastSyncAt || serverTimestamp();
  }
  if (data.id) {
    await updateDoc(doc(db, 'integrations', data.id), { ...payload, updatedAt: serverTimestamp() } as any);
    return data.id;
  }
  await setDoc(doc(db, 'integrations', data.provider), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return data.provider;
}

export async function deleteIntegration(id: string): Promise<void> {
  await deleteDoc(doc(db, 'integrations', id));
}
