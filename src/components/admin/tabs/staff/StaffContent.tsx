import { useState, useEffect, useCallback, useRef } from 'react';
import { StaffAPI } from './types';
import StaffFilterChips from './StaffFilterChips';
import StaffTable, { StaffSkeletonRow } from './StaffTable';
import AddEmployeeForm from './addEmployee';
import EditEmployeeForm from './editEmployee';
import { dashboardService } from '../../../../services/adminDashboardService';

type FilterOption = 'ALL' | 'STAFF' | 'BARISTA' | 'CASHIER' | 'ADMIN';

const PAGE_SIZE = 10;

/** Map a StaffAPI item into the edit form's initialData shape */
function toEditInitialData(member: StaffAPI) {
  const roleMap: Record<StaffAPI['role'], 'staff' | 'barista' | 'cashier' | 'admin'> = {
    STAFF:   'staff',
    BARISTA: 'barista',
    CASHIER: 'cashier',
    ADMIN:   'admin',
  };

  const dayMap: Record<string, string> = {
    MONDAY: 'mon', TUESDAY: 'tue', WEDNESDAY: 'wed', THURSDAY: 'thu',
    FRIDAY: 'fri', SATURDAY: 'sat', SUNDAY: 'sun',
  };

  return {
    staffName: member.name,
    email: member.email,
    phone: member.phone_number ?? '',
    workingDays: member.schedules.map((d) => dayMap[d]).filter(Boolean),
    role: roleMap[member.role],
    isActive: member.status === 'ACTIVE',
  };
}

export default function StaffContent() {
  // ── Data state ─────────────────────────────────────────────────────────────
  const [allStaff, setAllStaff]     = useState<StaffAPI[]>([]);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore]       = useState(false);
  const [error, setError]                   = useState<string | null>(null);

  // ── UI state ───────────────────────────────────────────────────────────────
  const [filter, setFilter]             = useState<FilterOption>('ALL');
  const [searchQuery, setSearchQuery]   = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffAPI | null>(null);

  const anyModalOpen = showAddModal || editingMember !== null;
  const tableWrapRef = useRef<HTMLDivElement>(null);

  // ── Fetch page ─────────────────────────────────────────────────────────────
  const fetchPage = useCallback(async (pageNum: number, append: boolean) => {
    if (append) setLoadingMore(true);
    else setInitialLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getStaffProfiles(pageNum, PAGE_SIZE);
      setAllStaff((prev) => append ? [...prev, ...data.staffs] : data.staffs);
      // Use the page number WE requested — the API returns a 0-based page
      // value that does not reliably match what we sent (e.g. sends page=0
      // for our page=1 request), which would cause "See More" to always
      // re-fetch the same first page.
      setPage(pageNum);
      setTotalPages(data.pagination.total_pages);
      setTotalItems(data.pagination.total_items);
    } catch {
      setError('Failed to load staff profiles.');
    } finally {
      setInitialLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(1, false);
  }, [fetchPage]);

  const handleLoadMore = () => {
    if (!loadingMore && page < totalPages) fetchPage(page + 1, true);
  };

  // ── Escape key / body scroll lock ─────────────────────────────────────────
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowAddModal(false);
      setEditingMember(null);
    }
  }, []);

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

  // ── Role sorting priority ──────────────────────────────────────────────────
  const ROLE_PRIORITY: Record<string, number> = {
    ADMIN: 1,
    CASHIER: 2,
    BARISTA: 3,
    STAFF: 4
  };

  // ── Filter + search (client-side over accumulated data) ───────────────────
  const filteredStaff = allStaff
    .filter((member) => {
      const matchesFilter = filter === 'ALL' || member.role === filter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        member.name.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q) ||
        member.id.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      const priorityA = ROLE_PRIORITY[a.role] ?? 99;
      const priorityB = ROLE_PRIORITY[b.role] ?? 99;
      return priorityA - priorityB;
    });

  const counts: Record<FilterOption, number> = {
    ALL:     totalItems,
    STAFF:   allStaff.filter((s) => s.role === 'STAFF').length,
    BARISTA: allStaff.filter((s) => s.role === 'BARISTA').length,
    CASHIER: allStaff.filter((s) => s.role === 'CASHIER').length,
    ADMIN:   allStaff.filter((s) => s.role === 'ADMIN').length,
  };

  const hasMore = page < totalPages;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Page Header */}
      <header className="px-4 md:px-8 pt-6 md:pt-8 pb-4 flex-shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex flex-col gap-1 min-w-0">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight dark:text-white truncate">
              Staff Management
            </h2>
            <p className="text-slate-500 dark:text-[#9db8a4] text-sm md:text-base">
              Oversee your team and manage shift schedules.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 sm:flex-none">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                search
              </span>
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-lg text-sm focus:ring-primary focus:border-primary dark:text-white shadow-sm outline-none"
              />
            </div>

            {/* Add Employee */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 cursor-pointer text-white rounded-lg text-sm font-bold shadow-md hover:bg-opacity-90 transition-all whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-lg">
                person_add
              </span>
              <span>Add Employee</span>
            </button>
          </div>
        </div>
      </header>

      {/* Filter Chips */}
      <div className="px-4 md:px-8">
        <StaffFilterChips
          active={filter}
          counts={counts}
          onChange={setFilter}
        />
      </div>

      {/* Table container */}
      <section className="px-4 md:px-8 py-4 mb-8">
        <div
          ref={tableWrapRef}
          className="bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-xl shadow-sm overflow-x-auto relative scroll-smooth no-scrollbar"
        >
          {/* ── Initial loading skeleton ── */}
          {initialLoading && (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-[#142618] text-xs uppercase text-slate-500 dark:text-[#9db8a4] tracking-wider font-bold shadow-sm">
                <tr>
                  <th className="px-6 py-4">Staff Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Shift &amp; Schedule</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#29382d]">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <StaffSkeletonRow key={i} />
                ))}
              </tbody>
            </table>
          )}

          {/* ── Error state ── */}
          {!initialLoading && error && (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-500 dark:text-[#9db8a4]">
              <span className="material-symbols-outlined text-4xl text-red-400">error</span>
              <p className="text-sm">{error}</p>
              <button
                onClick={() => fetchPage(1, false)}
                className="px-4 py-2 bg-[#14b83d] text-white text-sm font-bold rounded-lg hover:bg-opacity-90 transition"
              >
                Retry
              </button>
            </div>
          )}

          {/* ── Data ── */}
          {!initialLoading && !error && (
            <>
              {filteredStaff.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-slate-500 dark:text-[#9db8a4]">
                  No staff members found matching your criteria.
                </div>
              ) : (
                <StaffTable
                  members={filteredStaff}
                  onEdit={(member) => setEditingMember(member)}
                  loadingMore={loadingMore}
                  skeletonRows={3}
                />
              )}

              {/* ── Load More button ── */}
              {hasMore && !searchQuery && filter === 'ALL' && (
                <div className="flex justify-center py-5 border-t border-slate-100 dark:border-[#29382d]">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="flex items-center gap-2 px-6 py-2.5 border-2 border-[#14b83d] text-[#14b83d] font-bold text-sm rounded-xl hover:bg-[#14b83d]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? (
                      <>
                        <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                        Loading...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base">expand_more</span>
                        See More
                        <span className="text-xs font-normal opacity-70">
                          ({allStaff.length} of {totalItems})
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

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
              onSuccess={() => {
                setShowAddModal(false);
                setAllStaff([]);
                fetchPage(1, false);
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
              avatarUrl={editingMember.image_url || undefined}
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
