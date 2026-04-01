import { WeekDay } from '../types';
import { WEEKDAYS, LABEL_CLASS } from './constants';

interface EditWorkingDaysPickerProps {
  selectedDays: string[];
  onToggle: (day: WeekDay) => void;
}

export default function EditWorkingDaysPicker({ selectedDays, onToggle }: EditWorkingDaysPickerProps) {
  return (
    <div>
      <span className={LABEL_CLASS}>Working Days</span>
      <div className="flex flex-wrap gap-2 mt-1.5">
        {WEEKDAYS.map((day) => {
          const selected = selectedDays.includes(day.id);
          return (
            <button
              key={day.id}
              type="button"
              onClick={() => onToggle(day.id)}
              className={`flex-1 min-w-[45px] py-2 flex items-center justify-center text-[10px] font-bold rounded-lg border cursor-pointer transition-all ${
                selected
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white dark:bg-[#1a2e1e] border-slate-200 dark:border-[#3c5342] text-slate-500 dark:text-[#9db8a4] hover:border-primary'
              }`}
            >
              {day.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

