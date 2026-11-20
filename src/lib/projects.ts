import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, where, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

/* ── Types ─────────────────────────────────────────────────────── */

export interface Project {
  id?: string;
  name: string;
  client?: string;           // company / contact name
  description?: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'critical';
  ownerId?: string;
  startDate?: any;
  dueDate?: any;
  budget?: number;
  currency: string;
  createdBy: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Task {
  id?: string;
  title: string;
  description?: string;
  projectId?: string;
  milestoneId?: string;
  assigneeId?: string;
  assigneeName?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  dueDate?: any;
  estimatedHours?: number;
  actualHours?: number;
  createdBy: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Milestone {
  id?: string;
  name: string;
  projectId: string;
  dueDate?: any;
  status: 'upcoming' | 'in-progress' | 'completed' | 'missed';
  createdBy: string;
  createdAt?: any;
}

/* ── Projects ──────────────────────────────────────────────────── */

export async function listProjects(): Promise<Project[]> {
  const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
}

export async function getProject(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, 'projects', id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Project) : null;
}

export async function createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'projects'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<void> {
  await updateDoc(doc(db, 'projects', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, 'projects', id));
}

/* ── Tasks ─────────────────────────────────────────────────────── */

export async function listTasks(projectId?: string): Promise<Task[]> {
  let q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
  if (projectId) q = query(collection(db, 'tasks'), where('projectId', '==', projectId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task));
}

export async function createTask(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'tasks'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateTask(id: string, data: Partial<Task>): Promise<void> {
  await updateDoc(doc(db, 'tasks', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteTask(id: string): Promise<void> {
  await deleteDoc(doc(db, 'tasks', id));
}

/* ── Milestones ────────────────────────────────────────────────── */

export async function listMilestones(projectId?: string): Promise<Milestone[]> {
  let q = query(collection(db, 'milestones'), orderBy('dueDate', 'asc'));
  if (projectId) q = query(collection(db, 'milestones'), where('projectId', '==', projectId), orderBy('dueDate', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Milestone));
}

export async function createMilestone(data: Omit<Milestone, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'milestones'), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateMilestone(id: string, data: Partial<Milestone>): Promise<void> {
  await updateDoc(doc(db, 'milestones', id), data);
}

/* ── Stats ─────────────────────────────────────────────────────── */

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

export async function getProjectStats(): Promise<ProjectStats> {
  const [projects, tasks] = await Promise.all([listProjects(), listTasks()]);
  const now = Date.now();
  return {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === 'active').length,
    completedProjects: projects.filter((p) => p.status === 'completed').length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === 'done').length,
    overdueTasks: tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate.seconds ? t.dueDate.seconds * 1000 : t.dueDate).getTime() < now && t.status !== 'done'
    ).length,
  };
}