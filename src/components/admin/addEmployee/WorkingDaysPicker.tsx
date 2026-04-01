import { WeekDay } from '../types';
import { WEEKDAYS, LABEL_CLASS } from './constants';

interface WorkingDaysPickerProps {
  selectedDays: WeekDay[];
  onToggle: (day: WeekDay) => void;
}

export default function WorkingDaysPicker({ selectedDays, onToggle }: WorkingDaysPickerProps) {
  return (
    <div>
      <label className={LABEL_CLASS}>Working Days</label>
      <div className="flex flex-wrap gap-1.5 mt-1">
        {WEEKDAYS.map((day) => {
          const selected = selectedDays.includes(day.id);
          return (
            <button
              key={day.id}
              type="button"
              onClick={() => onToggle(day.id)}
              className={`flex items-center justify-center w-8 h-8 rounded-md text-[10px] font-bold cursor-pointer transition-all border ${
                selected
                  ? 'bg-primary border-primary text-white'
                  : `bg-slate-50 dark:bg-[#112115] border-slate-200 dark:border-[#3c5342] hover:border-primary dark:text-slate-300 ${
                      day.isWeekend ? 'text-red-400' : ''
                    }`
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
