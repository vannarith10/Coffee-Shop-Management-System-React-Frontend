import React from 'react';
import { Coffee, Clock } from 'lucide-react';
import { FilterTabs } from './FilterTabs';

type TabKey = 'all' | 'preparing' | 'done';

interface HeaderProps {
  currentTime: string;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  activeCount: number;
  handleLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentTime, 
  activeTab, 
  onTabChange, 
  activeCount ,
  handleLogout
}) => (
  <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-[#f6f8f6]/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md px-6 py-4">
    <div className="mx-auto flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500 rounded-lg text-black">
            <Coffee className="w-6 h-6 block" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">BARISTA KDS</h1>
        </div>
        <div className="h-6 w-px bg-slate-700 mx-2 hidden sm:block"></div>
        <div className="hidden sm:flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium tabular-nums">{currentTime}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <FilterTabs activeTab={activeTab} onTabChange={onTabChange} />

        <div className="flex items-center gap-3 h-10">
          <div className="bg-emerald-500/10 border border-emerald-500/20 h-full w-24 rounded-sm flex items-center justify-center">
            <span className="text-emerald-500 text-sm font-bold tracking-wide">{activeCount} ACTIVE</span>
          </div>
          <button onClick={handleLogout} className='bg-red-600 text-white font-bold rounded-sm h-full w-24 cursor-pointer hover:bg-red-800 transition-all duration-150'>Logout</button>
        </div>
      </div>
    </div>
  </header>
);