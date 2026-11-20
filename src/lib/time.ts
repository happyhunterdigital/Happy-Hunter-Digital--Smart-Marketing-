import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, where, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

/* ── Types ─────────────────────────────────────────────────────── */

export interface TimeEntry {
  id?: string;
  userId?: string;
  userName?: string;
  projectId?: string;
  projectName?: string;
  taskId?: string;
  taskTitle?: string;
  description?: string;
  startTime?: any;
  endTime?: any;
  durationMinutes: number;   // stored minutes
  billable: boolean;
  hourlyRate?: number;
  date: any;                 // Timestamp of work date
  createdBy: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface TimerState {
  id?: string;
  entryId?: string;
  running: boolean;
  startedAt?: any;
  projectId?: string;
  taskId?: string;
  description?: string;
}

/* ── Time Entries ──────────────────────────────────────────────── */

export async function listTimeEntries(userId?: string): Promise<TimeEntry[]> {
  let q = query(collection(db, 'time_entries'), orderBy('date', 'desc'));
  if (userId) q = query(collection(db, 'time_entries'), where('userId', '==', userId), orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as TimeEntry));
}

export async function createTimeEntry(data: Omit<TimeEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'time_entries'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateTimeEntry(id: string, data: Partial<TimeEntry>): Promise<void> {
  await updateDoc(doc(db, 'time_entries', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteTimeEntry(id: string): Promise<void> {
  await deleteDoc(doc(db, 'time_entries', id));
}

/* ── Timers ────────────────────────────────────────────────────── */

export async function getActiveTimer(userId: string): Promise<TimerState | null> {
  const q = query(
    collection(db, 'timers'),
    where('userId', '==', userId),
    where('running', '==', true)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as TimerState;
}

export async function startTimer(data: { userId: string; userName: string; projectId?: string; taskId?: string; description?: string }): Promise<string> {
  // Stop any existing active timer first
  const active = await getActiveTimer(data.userId);
  if (active?.id) {
    await stopTimer(active.id);
  }
  const ref = await addDoc(collection(db, 'timers'), {
    ...data,
    running: true,
    startedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function stopTimer(timerId: string, entryData?: Partial<TimeEntry>): Promise<string | null> {
  const timerSnap = await getDoc(doc(db, 'timers', timerId));
  if (!timerSnap.exists()) return null;
  const timer = timerSnap.data() as TimerState & { userId: string; startedAt: any; description?: string; projectId?: string; taskId?: string };
  const started = timer.startedAt?.seconds ? timer.startedAt.seconds * 1000 : Date.now();
  const durationMinutes = Math.max(1, Math.round((Date.now() - started) / 60000));

  await updateDoc(doc(db, 'timers', timerId), { running: false, stoppedAt: serverTimestamp(), durationMinutes });

  let entryId: string | null = null;
  if (entryData) {
    const ref = await addDoc(collection(db, 'time_entries'), {
      ...entryData,
      durationMinutes,
      billable: true,
      date: timer.startedAt || serverTimestamp(),
      createdBy: timer.userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    entryId = ref.id;
    await updateDoc(doc(db, 'timers', timerId), { entryId });
  }
  return entryId;
}

/* ── Stats ─────────────────────────────────────────────────────── */

export interface TimeStats {
  totalMinutes: number;
  billableMinutes: number;
  billableAmount: number;
  entriesCount: number;
}

export async function getTimeStats(userId?: string, daysBack = 30): Promise<TimeStats> {
  const entries = await listTimeEntries(userId);
  const cutoff = Date.now() - daysBack * 86400000;
  const recent = entries.filter((e) => {
    const d = e.date?.seconds ? e.date.seconds * 1000 : new Date(e.date).getTime();
    return d >= cutoff;
  });
  const totalMinutes = recent.reduce((s, e) => s + (e.durationMinutes || 0), 0);
  const billable = recent.filter((e) => e.billable);
  const billableMinutes = billable.reduce((s, e) => s + (e.durationMinutes || 0), 0);
  const billableAmount = billable.reduce((s, e) => s + (e.durationMinutes || 0) * (e.hourlyRate || 0) / 60, 0);
  return { totalMinutes, billableMinutes, billableAmount, entriesCount: recent.length };
}