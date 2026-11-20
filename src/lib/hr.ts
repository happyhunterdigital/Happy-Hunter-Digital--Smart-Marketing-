import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, where, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

/* ── Types ─────────────────────────────────────────────────────── */

export interface Employee {
  id?: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  hireDate?: any;
  salary?: number;
  currency: string;
  status: 'active' | 'on-leave' | 'terminated';
  address?: string;
  emergencyContact?: string;
  notes?: string;
  createdBy: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Attendance {
  id?: string;
  employeeId: string;
  employeeName?: string;
  date: any;                 // Timestamp date
  checkIn?: any;
  checkOut?: any;
  hoursWorked?: number;
  status: 'present' | 'absent' | 'late' | 'half-day';
  notes?: string;
  createdBy: string;
  createdAt?: any;
}

export interface LeaveRequest {
  id?: string;
  employeeId: string;
  employeeName?: string;
  type: 'annual' | 'sick' | 'personal' | 'unpaid';
  startDate: any;
  endDate: any;
  days: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: any;
  createdBy: string;
  createdAt?: any;
}

export interface PayrollRun {
  id?: string;
  periodStart: any;
  periodEnd: any;
  payDate: any;
  employees: PayrollItem[];
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  status: 'draft' | 'processed' | 'paid';
  createdBy: string;
  createdAt?: any;
}

export interface PayrollItem {
  employeeId: string;
  employeeName: string;
  gross: number;
  deductions: number;
  net: number;
}

export interface Expense {
  id?: string;
  employeeId?: string;
  employeeName?: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  date: any;
  receiptUrl?: string;
  status: 'pending' | 'approved' | 'reimbursed' | 'rejected';
  approvedBy?: string;
  createdBy: string;
  createdAt?: any;
}

/* ── Employees ─────────────────────────────────────────────────── */

export async function listEmployees(): Promise<Employee[]> {
  const q = query(collection(db, 'employees'), orderBy('lastName'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Employee));
}

export async function createEmployee(data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'employees'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateEmployee(id: string, data: Partial<Employee>): Promise<void> {
  await updateDoc(doc(db, 'employees', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteEmployee(id: string): Promise<void> {
  await deleteDoc(doc(db, 'employees', id));
}

/* ── Attendance ────────────────────────────────────────────────── */

export async function listAttendance(employeeId?: string): Promise<Attendance[]> {
  let q = query(collection(db, 'attendance'), orderBy('date', 'desc'));
  if (employeeId) q = query(collection(db, 'attendance'), where('employeeId', '==', employeeId), orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Attendance));
}

export async function clockIn(data: Omit<Attendance, 'id' | 'createdAt' | 'checkOut' | 'hoursWorked'>): Promise<string> {
  const ref = await addDoc(collection(db, 'attendance'), {
    ...data,
    status: 'present',
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function clockOut(id: string): Promise<void> {
  const snap = await getDoc(doc(db, 'attendance', id));
  if (!snap.exists()) return;
  const a = snap.data() as Attendance & { checkIn?: any };
  const started = a.checkIn?.seconds ? a.checkIn.seconds * 1000 : Date.now();
  const hours = Math.round((Date.now() - started) / 3600000 * 100) / 100;
  await updateDoc(doc(db, 'attendance', id), { checkOut: serverTimestamp(), hoursWorked: hours });
}

/* ── Leave ─────────────────────────────────────────────────────── */

export async function listLeaveRequests(): Promise<LeaveRequest[]> {
  const q = query(collection(db, 'leave_requests'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as LeaveRequest));
}

export async function createLeaveRequest(data: Omit<LeaveRequest, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'leave_requests'), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateLeaveStatus(id: string, status: 'approved' | 'rejected', approvedBy: string): Promise<void> {
  await updateDoc(doc(db, 'leave_requests', id), { status, approvedBy, approvedAt: serverTimestamp() });
}

/* ── Payroll ───────────────────────────────────────────────────── */

export async function listPayrollRuns(): Promise<PayrollRun[]> {
  const q = query(collection(db, 'payroll_runs'), orderBy('payDate', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PayrollRun));
}

export async function createPayrollRun(data: Omit<PayrollRun, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'payroll_runs'), {
    ...data,
    status: 'draft',
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/* ── Expenses ──────────────────────────────────────────────────── */

export async function listExpenses(): Promise<Expense[]> {
  const q = query(collection(db, 'expenses'), orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Expense));
}

export async function createExpense(data: Omit<Expense, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'expenses'), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateExpenseStatus(id: string, status: 'approved' | 'reimbursed' | 'rejected', approvedBy: string): Promise<void> {
  await updateDoc(doc(db, 'expenses', id), { status, approvedBy });
}

/* ── Stats ─────────────────────────────────────────────────────── */

export interface HRStats {
  totalEmployees: number;
  activeEmployees: number;
  pendingLeave: number;
  totalExpenses: number;
}

export async function getHRStats(): Promise<HRStats> {
  const [employees, leave, expenses] = await Promise.all([
    listEmployees(), listLeaveRequests(), listExpenses(),
  ]);
  return {
    totalEmployees: employees.length,
    activeEmployees: employees.filter((e) => e.status === 'active').length,
    pendingLeave: leave.filter((l) => l.status === 'pending').length,
    totalExpenses: expenses.reduce((s, e) => s + e.amount, 0),
  };
}