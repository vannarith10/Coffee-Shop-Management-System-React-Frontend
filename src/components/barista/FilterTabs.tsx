//src/components/barista/FilterTabs.tsx
import React from 'react';

type TabKey = 'all' | 'preparing' | 'done';

interface FilterTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const tabs: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All Orders' },
  { key: 'preparing', label: 'Active' },
  { key: 'done', label: 'Completed' }
];

export const FilterTabs: React.FC<FilterTabsProps> = ({ activeTab, onTabChange }) => (
  <div className="hidden md:flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-800">
    {tabs.map((tab) => {
      const isActive = activeTab === tab.key;
      
      return (
        <button 
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-4 cursor-pointer py-1.5 rounded-md text-sm font-bold transition-all ${
            isActive 
              ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' 
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
);