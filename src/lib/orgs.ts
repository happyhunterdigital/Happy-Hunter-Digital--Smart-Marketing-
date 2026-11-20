import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp, where,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

/* ── Types ─────────────────────────────────────────────────────── */

export type OrgRole = 'owner' | 'admin' | 'manager' | 'member';

export interface Org {
  id?: string;
  name: string;
  slug: string;
  industry?: string;
  createdAt?: any;
  createdBy: string;
}

export interface OrgMember {
  id?: string;
  orgId: string;
  email: string;
  role: OrgRole;
  addedAt?: any;
  addedBy: string;
}

/* ── Orgs ───────────────────────────────────────────────────────── */

export async function listOrgs(): Promise<Org[]> {
  const snap = await getDocs(query(collection(db, 'orgs'), orderBy('createdAt', 'desc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Org));
}

export async function getOrg(id: string): Promise<Org | null> {
  const snap = await getDoc(doc(db, 'orgs', id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Org) : null;
}

export async function createOrg(data: Omit<Org, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'orgs'), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateOrg(id: string, data: Partial<Org>): Promise<void> {
  await updateDoc(doc(db, 'orgs', id), { ...data, updatedAt: serverTimestamp() } as any);
}

export async function deleteOrg(id: string): Promise<void> {
  await deleteDoc(doc(db, 'orgs', id));
}

/* ── Members ────────────────────────────────────────────────────── */

export async function listMembers(orgId: string): Promise<OrgMember[]> {
  const snap = await getDocs(query(collection(db, 'org_members'), where('orgId', '==', orgId), orderBy('addedAt', 'desc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as OrgMember));
}

export async function addMember(orgId: string, data: Omit<OrgMember, 'id' | 'addedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'org_members'), { ...data, addedAt: serverTimestamp() });
  return ref.id;
}

export async function updateMemberRole(orgId: string, email: string, role: OrgRole): Promise<void> {
  const snap = await getDocs(query(collection(db, 'org_members'), where('orgId', '==', orgId), where('email', '==', email)));
  if (snap.empty) return;
  await updateDoc(doc(db, 'org_members', snap.docs[0].id), { role });
}

export async function removeMember(orgId: string, email: string): Promise<void> {
  const snap = await getDocs(query(collection(db, 'org_members'), where('orgId', '==', orgId), where('email', '==', email)));
  if (snap.empty) return;
  await deleteDoc(doc(db, 'org_members', snap.docs[0].id));
}
