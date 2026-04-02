import { useState, useEffect, useCallback } from 'react';
import { STAFF_DATA } from './constants';
import { StaffMember } from './types';
import StaffFilterChips from './StaffFilterChips';
import StaffTable from './StaffTable';
import AddEmployeeForm from './addEmployee';
import EditEmployeeForm from './editEmployee';

type FilterOption = 'ALL' | 'BARISTA' | 'CASHIER' | 'ADMIN';

/** Map a StaffMember (table data) into the edit form's initialData shape */
function toEditInitialData(member: StaffMember) {
  const roleMap: Record<StaffMember['role'], 'barista' | 'cashier' | 'admin'> = {
    BARISTA: 'barista',
    CASHIER: 'cashier',
    ADMIN: 'admin',
  };

  // Parse working days from the shiftDays string (e.g. "Mon, Tue, Wed, Fri")
  const dayMap: Record<string, string> = {
    mon: 'mon', tue: 'tue', wed: 'wed', thu: 'thu',
    fri: 'fri', sat: 'sat', sun: 'sun',
  };
  const parsedDays = member.shiftDays
    ? member.shiftDays
        .split(',')
        .map((d) => d.trim().toLowerCase().slice(0, 3))
        .filter((d) => d in dayMap)
    : [];

  return {
    staffName: member.name,
    email: member.email,
    phone: member.phone ?? '',
    workingDays: parsedDays,
    role: roleMap[member.role],
    isActive: member.status === 'ACTIVE',
  };
}

export default function StaffContent() {
  const [filter, setFilter] = useState<FilterOption>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);

  const anyModalOpen = showAddModal || editingMember !== null;

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAddModal(false);
        setEditingMember(null);
      }
    },
    [],
  );

  useEffect(() => {
    if (anyModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [anyModalOpen, handleKeyDown]);

  const filteredStaff = STAFF_DATA.filter((member) => {
    const matchesFilter = filter === 'ALL' || member.role === filter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      member.name.toLowerCase().includes(q) ||
      member.email.toLowerCase().includes(q) ||
      member.staffId.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const counts: Record<FilterOption, number> = {
    ALL: STAFF_DATA.length,
    BARISTA: STAFF_DATA.filter((s) => s.role === 'BARISTA').length,
    CASHIER: STAFF_DATA.filter((s) => s.role === 'CASHIER').length,
    ADMIN: STAFF_DATA.filter((s) => s.role === 'ADMIN').length,
  };

  return (
    <>
      {/* Page Header */}
      <header className="px-8 pt-8 pb-4 flex-shrink-0">
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex min-w-72 flex-col gap-1">
            <h2 className="text-3xl font-black tracking-tight dark:text-white">Staff Management</h2>
            <p className="text-slate-500 dark:text-[#9db8a4] text-base">
              Oversee your team and manage shift schedules.
            </p>
          </div>

          <div className="flex gap-3">
            {/* Search */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                search
              </span>
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-lg text-sm focus:ring-primary focus:border-primary dark:text-white w-64 shadow-sm outline-none"
              />
            </div>

            {/* Add Employee — opens add modal */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 cursor-pointer text-white rounded-lg text-sm font-bold shadow-md hover:bg-opacity-90 transition-all"
            >
              <span className="material-symbols-outlined text-lg">person_add</span>
              <span>Add New Employee</span>
            </button>
          </div>
        </div>
      </header>

      {/* Filter Chips */}
      <StaffFilterChips active={filter} counts={counts} onChange={setFilter} />

      {/* Table */}
      <StaffTable members={filteredStaff} onEdit={(member) => setEditingMember(member)} />

      {/* ── Add Employee Modal ── */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-employee-title"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative z-10 w-full max-w-2xl">
            <AddEmployeeForm
              onClose={() => setShowAddModal(false)}
              onSubmit={(data) => {
                console.log('New employee:', data);
                setShowAddModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* ── Edit Employee Modal ── */}
      {editingMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-employee-title"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setEditingMember(null)}
          />
          <div className="relative z-10 w-full max-w-lg">
            <EditEmployeeForm
              staffName={editingMember.name}
              avatarUrl={editingMember.avatar}
              initialData={toEditInitialData(editingMember)}
              onClose={() => setEditingMember(null)}
              onSubmit={(data) => {
                console.log('Updated employee:', data);
                setEditingMember(null);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
