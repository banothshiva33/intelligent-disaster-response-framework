import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 px-6 py-4 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 space-y-2 md:space-y-0">
      <div>
        <p className="font-semibold text-slate-700">
          Intelligent Disaster Response Framework (IDRF)
        </p>
        <p className="mt-0.5">B.Tech Major Project — CSE Group 4 (2026-2027)</p>
      </div>
      <div className="flex space-x-6">
        <div>
          <span className="font-medium text-slate-600">Supervisor: </span>
          <span>Mrs. Arti Budhiraja</span>
        </div>
        <div>
          <span className="font-medium text-slate-600">Platform: </span>
          <span>Frontend Development</span>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
