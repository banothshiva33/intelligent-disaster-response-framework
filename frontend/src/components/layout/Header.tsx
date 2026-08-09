import React from 'react';
import { Menu, Bell, Shield } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, sidebarOpen }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs">
      <div className="flex items-center space-x-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg lg:hidden hover:bg-slate-50 text-slate-600 focus:outline-none transition-colors cursor-pointer"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Brand/Logo */}
        <div className="flex items-center space-x-2">
          <div className="bg-violet-600 p-2 rounded-lg text-white flex items-center justify-center">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-lg tracking-tight block">
              IDRF
            </span>
            <span className="hidden sm:inline text-xs font-medium text-slate-500">
              Intelligent Disaster Response Framework
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications Mock Icon */}
        <button className="relative p-2 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
        </button>

        {/* Profile Mock */}
        <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
          <div className="h-9 w-9 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-sm select-none">
            GM
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-900">G. Mahipal</p>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Emergency Coordinator</p>
          </div>
        </div>
      </div>
    </header>
  );
};
