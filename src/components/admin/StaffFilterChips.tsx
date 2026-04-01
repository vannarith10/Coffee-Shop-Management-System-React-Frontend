type FilterOption = 'ALL' | 'BARISTA' | 'CASHIER' | 'ADMIN';

interface FilterChipProps {
  label: string;
  count: number;
  active?: boolean;
  onClick?: () => void;
}

function FilterChip({ label, count, active = false, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 border rounded-full flex items-center gap-2 cursor-pointer transition-colors ${
        active
          ? 'bg-cream-accent/10 border-cream-accent/20'
          : 'bg-white dark:bg-[#1a2e1e] border-slate-200 dark:border-[#3c5342]'
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${active ? 'bg-primary' : 'bg-slate-400'}`} />
      <span
        className={`text-xs font-bold ${
          active ? 'text-primary' : 'text-slate-600 dark:text-[#9db8a4]'
        }`}
      >
        {label} ({count})
      </span>
    </button>
  );
}

interface StaffFilterChipsProps {
  active: FilterOption;
  counts: Record<FilterOption, number>;
  onChange: (filter: FilterOption) => void;
}

export default function StaffFilterChips({ active, counts, onChange }: StaffFilterChipsProps) {
  const options: { label: string; value: FilterOption }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Baristas', value: 'BARISTA' },
    { label: 'Cashiers', value: 'CASHIER' },
    { label: 'Admin', value: 'ADMIN' },
  ];

  return (
    <section className="px-8 py-4 flex gap-4 overflow-x-auto no-scrollbar flex-shrink-0">
      {options.map((opt) => (
        <FilterChip
          key={opt.value}
          label={opt.label}
          count={counts[opt.value]}
          active={active === opt.value}
          onClick={() => onChange(opt.value)}
        />
      ))}
    </section>
  );
}
