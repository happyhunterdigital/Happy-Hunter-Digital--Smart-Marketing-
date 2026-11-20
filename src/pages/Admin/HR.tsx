import React, { useState, useEffect, useCallback } from 'react';
import { Users, Plus, Edit3, Trash2, Clock, Calendar, FileText, DollarSign, CheckCircle2, XCircle, Flag } from 'lucide-react';
import {
  listEmployees, createEmployee, updateEmployee, deleteEmployee,
  listAttendance, clockIn, clockOut,
  listLeaveRequests, createLeaveRequest, updateLeaveStatus,
  listPayrollRuns, createPayrollRun,
  listExpenses, createExpense, updateExpenseStatus,
  getHRStats,
  type Employee, type Attendance, type LeaveRequest, type Expense,
} from '../../lib/hr';

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

/* ── Main HR Component ─────────────────────────────────────────── */

export const HR: React.FC = () => {
  const [tab, setTab] = useState<'employees' | 'attendance' | 'leave' | 'payroll' | 'expenses'>('employees');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [leave, setLeave] = useState<LeaveRequest[]>([]);
  const [payroll, setPayroll] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Forms
  const [showEmpForm, setShowEmpForm] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [emps, att, lv, pr, ex, st] = await Promise.all([
        listEmployees(), listAttendance(), listLeaveRequests(), listPayrollRuns(), listExpenses(), getHRStats(),
      ]);
      setEmployees(emps);
      setAttendance(att);
      setLeave(lv);
      setPayroll(pr);
      setExpenses(ex);
      setStats(st);
    } catch (e) { console.error('HR refresh error:', e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, []);

  const fmt = (d: any) => d?.toDate ? d.toDate().toLocaleDateString() : new Date(d).toLocaleDateString();

  if (loading) return <div className="p-10 text-center text-gray-500 font-mono animate-pulse">Loading HR...</div>;

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stat('Employees', stats?.totalEmployees ?? employees.length)}
        {stat('Active', stats?.activeEmployees ?? employees.filter(e => e.status === 'active').length, 'text-green-500')}
        {stat('Pending Leave', stats?.pendingLeave ?? leave.filter(l => l.status === 'pending').length, 'text-yellow-500')}
        {stat('Expenses', fmtMoney(stats?.totalExpenses ?? expenses.reduce((s, e) => s + e.amount, 0)), 'text-red-500')}
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {([
          { key: 'employees', label: 'Employees', icon: <Users size={14} /> },
          { key: 'attendance', label: 'Attendance', icon: <Clock size={14} /> },
          { key: 'leave', label: 'Leave', icon: <Calendar size={14} /> },
          { key: 'payroll', label: 'Payroll', icon: <DollarSign size={14} /> },
          { key: 'expenses', label: 'Expenses', icon: <FileText size={14} /> },
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
        <Btn onClick={() => {
          if (tab === 'employees') setShowEmpForm(true);
          if (tab === 'leave') setShowLeaveForm(true);
          if (tab === 'expenses') setShowExpenseForm(true);
        }}><Plus size={12} className="inline mr-1" /> New</Btn>
      </div>

      {/* Employees */}
      {tab === 'employees' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Employees ({employees.length})</h3>
            <Btn onClick={() => setShowEmpForm(true)}><Plus size={12} className="inline mr-1" /> New Employee</Btn>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {employees.length === 0 ? (
              <p className="text-gray-500 text-xs font-mono text-center py-8 col-span-full">No employees yet.</p>
            ) : employees.map((e) => (
              <div key={e.id} className="bg-black border border-gray-800 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-500 font-black text-lg">
                    {e.firstName.charAt(0)}{e.lastName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white">{e.firstName} {e.lastName}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{e.role}</p>
                  </div>
                  <span className={`ml-auto px-2 py-1 rounded text-[9px] font-black uppercase ${e.status === 'active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-gray-700 text-gray-500 border border-gray-700/30'}`}>{e.status}</span>
                </div>
                {e.email && <p className="text-xs text-gray-400 flex items-center gap-1 mb-1"><Users size={10} className="text-gray-600" /> {e.email}</p>}
                {e.phone && <p className="text-xs text-gray-400 flex items-center gap-1 mb-1">{e.phone}</p>}
                {e.department && <p className="text-xs text-gray-400">{e.department}</p>}
                <div className="mt-4 flex gap-2">
                  <button onClick={() => { /* edit */ }} className="flex-1 bg-gray-800 border border-gray-700 text-gray-400 text-[10px] font-black uppercase py-2 rounded-xl hover:text-white hover:border-yellow-500 transition-colors">Edit</button>
                  <button onClick={() => { if (confirm('Delete employee?')) { deleteEmployee(e.id!).then(refresh); } }} className="flex-1 bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-black uppercase py-2 rounded-xl hover:bg-red-500/20 transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attendance */}
      {tab === 'attendance' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Attendance ({attendance.length})</h3>
            <Btn onClick={() => { /* quick clock in */ }} variant="ghost"><Clock size={14} className="inline mr-1" /> Quick Clock In</Btn>
          </div>
          <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0a0a0a] text-gray-500 text-[10px] font-black uppercase tracking-widest">
                <tr><th className="p-4">Employee</th><th className="p-4">Date</th><th className="p-4">Check In</th><th className="p-4">Check Out</th><th className="p-4">Hours</th><th className="p-4">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {attendance.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-gray-600 font-mono text-xs">No attendance records yet.</td></tr>
                ) : attendance.slice(0, 50).map((a) => (
                  <tr key={a.id} className="hover:bg-gray-900/50">
                    <td className="p-4 font-bold text-white">{a.employeeName || a.employeeId}</td>
                    <td className="p-4 text-gray-400 text-xs font-mono">{fmt(a.date)}</td>
                    <td className="p-4 text-gray-300 text-xs font-mono">{a.checkIn ? fmt(a.checkIn) : '—'}</td>
                    <td className="p-4 text-gray-300 text-xs font-mono">{a.checkOut ? fmt(a.checkOut) : '—'}</td>
                    <td className="p-4 text-gray-300">{a.hoursWorked ?? '—'}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${a.status === 'present' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-gray-700 text-gray-500 border border-gray-700/30'}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leave */}
      {tab === 'leave' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Leave Requests ({leave.length})</h3>
            <Btn onClick={() => setShowLeaveForm(true)}><Plus size={12} className="inline mr-1" /> New Request</Btn>
          </div>
          <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0a0a0a] text-gray-500 text-[10px] font-black uppercase tracking-widest">
                <tr><th className="p-4">Employee</th><th className="p-4">Type</th><th className="p-4">Start</th><th className="p-4">End</th><th className="p-4">Days</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {leave.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-gray-600 font-mono text-xs">No leave requests yet.</td></tr>
                ) : leave.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-900/50">
                    <td className="p-4 font-bold text-white">{l.employeeName || l.employeeId}</td>
                    <td className="p-4 text-gray-300">{l.type}</td>
                    <td className="p-4 text-gray-400 text-xs font-mono">{fmt(l.startDate)}</td>
                    <td className="p-4 text-gray-400 text-xs font-mono">{fmt(l.endDate)}</td>
                    <td className="p-4 text-gray-300">{l.days}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${l.status === 'approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : l.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/30' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>{l.status}</span></td>
                    <td className="p-4 text-right">
                      {l.status === 'pending' && (
                        <>
                          <button onClick={() => updateLeaveStatus(l.id!, 'approved', 'admin').then(refresh)} className="text-xs font-black text-green-500 mr-2">Approve</button>
                          <button onClick={() => updateLeaveStatus(l.id!, 'rejected', 'admin').then(refresh)} className="text-xs font-black text-red-500">Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payroll */}
      {tab === 'payroll' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Payroll Runs ({payroll.length})</h3>
            <Btn onClick={() => { /* create payroll */ }} variant="ghost"><DollarSign size={14} className="inline mr-1" /> Run Payroll</Btn>
          </div>
          <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0a0a0a] text-gray-500 text-[10px] font-black uppercase tracking-widest">
                <tr><th className="p-4">Period</th><th className="p-4">Pay Date</th><th className="p-4">Gross</th><th className="p-4">Deductions</th><th className="p-4">Net</th><th className="p-4">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {payroll.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-gray-600 font-mono text-xs">No payroll runs yet.</td></tr>
                ) : payroll.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-900/50">
                    <td className="p-4 font-bold text-white">{fmt(p.periodStart)} → {fmt(p.periodEnd)}</td>
                    <td className="p-4 text-gray-300 text-xs font-mono">{fmt(p.payDate)}</td>
                    <td className="p-4 text-gray-300">{fmtMoney(p.totalGross)}</td>
                    <td className="p-4 text-gray-300">{fmtMoney(p.totalDeductions)}</td>
                    <td className="p-4 text-gray-300">{fmtMoney(p.totalNet)}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${p.status === 'paid' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expenses */}
      {tab === 'expenses' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Expenses ({expenses.length})</h3>
            <Btn onClick={() => setShowExpenseForm(true)}><Plus size={12} className="inline mr-1" /> New Expense</Btn>
          </div>
          <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0a0a0a] text-gray-500 text-[10px] font-black uppercase tracking-widest">
                <tr><th className="p-4">Employee</th><th className="p-4">Category</th><th className="p-4">Description</th><th className="p-4">Amount</th><th className="p-4">Date</th><th className="p-4">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {expenses.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-gray-600 font-mono text-xs">No expenses yet.</td></tr>
                ) : expenses.slice(0, 50).map((e) => (
                  <tr key={e.id} className="hover:bg-gray-900/50">
                    <td className="p-4 font-bold text-white">{e.employeeName || e.employeeId || '—'}</td>
                    <td className="p-4 text-gray-300">{e.category}</td>
                    <td className="p-4 text-gray-400">{e.description}</td>
                    <td className="p-4 text-gray-300">{fmtMoney(e.amount, e.currency)}</td>
                    <td className="p-4 text-gray-400 text-xs font-mono">{fmt(e.date)}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${e.status === 'approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : e.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/30' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>{e.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Employee Form */}
      {showEmpForm && (
        <Modal title="New Employee" onClose={() => setShowEmpForm(false)}>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            await createEmployee({
              employeeId: fd.get('employeeId') as string,
              firstName: fd.get('firstName') as string,
              lastName: fd.get('lastName') as string,
              email: fd.get('email') as string,
              phone: fd.get('phone') as string,
              role: fd.get('role') as string,
              department: fd.get('department') as string,
              hireDate: fd.get('hireDate') ? new Date(fd.get('hireDate') as string) : undefined,
              salary: parseFloat(fd.get('salary') as string) || 0,
              currency: 'ZAR',
              status: 'active',
              address: fd.get('address') as string,
              emergencyContact: fd.get('emergencyContact') as string,
              createdBy: 'admin',
            });
            setShowEmpForm(false);
            refresh();
          }}>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Employee ID *" name="employeeId" required />
              <Input label="First Name *" name="firstName" required />
              <Input label="Last Name *" name="lastName" required />
              <Input label="Email" name="email" type="email" />
              <Input label="Phone" name="phone" />
              <Input label="Role" name="role" />
              <Input label="Department" name="department" />
              <Input label="Hire Date" name="hireDate" type="date" />
              <Input label="Salary" name="salary" type="number" />
              <Select label="Status" name="status" defaultValue="active" options={[{ value: 'active', label: 'Active' }, { value: 'on-leave', label: 'On Leave' }, { value: 'terminated', label: 'Terminated' }]} />
            </div>
            <Textarea label="Address" name="address" />
            <Textarea label="Emergency Contact" name="emergencyContact" />
            <div className="flex gap-3 justify-end">
              <Btn variant="ghost" onClick={() => setShowEmpForm(false)}>Cancel</Btn>
              <Btn type="submit">Create Employee</Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* Leave Form */}
      {showLeaveForm && (
        <Modal title="Leave Request" onClose={() => setShowLeaveForm(false)}>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            await createLeaveRequest({
              employeeId: fd.get('employeeId') as string,
              employeeName: fd.get('employeeName') as string,
              type: fd.get('type') as any,
              startDate: new Date(fd.get('startDate') as string),
              endDate: new Date(fd.get('endDate') as string),
              days: parseFloat(fd.get('days') as string) || 1,
              reason: fd.get('reason') as string,
              status: 'pending',
              createdBy: 'admin',
            });
            setShowLeaveForm(false);
            refresh();
          }}>
            <Input label="Employee ID *" name="employeeId" required />
            <Input label="Employee Name *" name="employeeName" required />
            <Select label="Leave Type *" name="type" required options={[
              { value: 'annual', label: 'Annual' }, { value: 'sick', label: 'Sick' },
              { value: 'personal', label: 'Personal' }, { value: 'unpaid', label: 'Unpaid' },
            ]} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Start Date *" name="startDate" type="date" required />
              <Input label="End Date *" name="endDate" type="date" required />
            </div>
            <Input label="Days" name="days" type="number" defaultValue="1" />
            <Textarea label="Reason" name="reason" />
            <div className="flex gap-3 justify-end">
              <Btn variant="ghost" onClick={() => setShowLeaveForm(false)}>Cancel</Btn>
              <Btn type="submit">Submit Request</Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* Expense Form */}
      {showExpenseForm && (
        <Modal title="Expense Claim" onClose={() => setShowExpenseForm(false)}>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            await createExpense({
              employeeId: fd.get('employeeId') as string,
              employeeName: fd.get('employeeName') as string,
              category: fd.get('category') as string,
              description: fd.get('description') as string,
              amount: parseFloat(fd.get('amount') as string) || 0,
              currency: 'ZAR',
              date: new Date(fd.get('date') as string),
              status: 'pending',
              createdBy: 'admin',
            });
            setShowExpenseForm(false);
            refresh();
          }}>
            <Input label="Employee ID *" name="employeeId" required />
            <Input label="Employee Name *" name="employeeName" required />
            <Input label="Category *" name="category" required />
            <Textarea label="Description *" name="description" required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Amount *" name="amount" type="number" required />
              <Input label="Date *" name="date" type="date" required />
            </div>
            <div className="flex gap-3 justify-end">
              <Btn variant="ghost" onClick={() => setShowExpenseForm(false)}>Cancel</Btn>
              <Btn type="submit">Submit Claim</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default HR;