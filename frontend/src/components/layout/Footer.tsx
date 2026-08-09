import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800/80 px-6 py-4 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 space-y-2 md:space-y-0">
      <div>
        <p className="font-semibold text-slate-700 dark:text-slate-300">
          Intelligent Disaster Response Framework (IDRF)
        </p>
        <p className="mt-0.5">B.Tech Major Project — CSE Group 4 (2026-2027)</p>
      </div>
      <div className="flex space-x-6">
        <div>
          <span className="font-medium text-slate-750 dark:text-slate-350">Supervisor: </span>
          <span>Mrs. Arti Budhiraja</span>
        </div>
        <div>
          <span className="font-medium text-slate-750 dark:text-slate-350">Platform: </span>
          <span>Phase 1 Dev</span>
        </div>
      </div>
    </footer>
  );
};
