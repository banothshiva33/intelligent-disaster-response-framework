import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, AlertOctagon, Users2, Map, Shield } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { to: '/', label: 'Welcome Page', icon: Home },
    { to: '/dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { to: '/incidents', label: 'Incident Management', icon: AlertOctagon },
    { to: '/volunteers', label: 'Volunteer Roster', icon: Users2 },
    { to: '/location', label: 'Location Intelligence', icon: Map },
  ];

  const activeStyle = "flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#F3E8FF] text-[#7C3AED] border border-[#DDD6FE] transition-all";
  const inactiveStyle = "flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-655 hover:text-slate-900 hover:bg-slate-50 transition-colors border border-transparent";

  return (
    <>
      {/* Mobile drawer backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/20 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar sidebar element */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 pt-20 lg:pt-0 transform lg:transform-none lg:static transition-transform duration-300 ease-out flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-4 py-6 space-y-6 flex-1 overflow-y-auto">
          {/* Header block for sidebar */}
          <div className="hidden lg:flex items-center space-x-2 pb-5 border-b border-slate-100">
            <div className="bg-violet-600 p-2 rounded-lg text-white flex items-center justify-center">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base tracking-tight block">
                IDRF Platform
              </span>
              <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">
                Emergency Control
              </span>
            </div>
          </div>

          {/* Navigation group */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
                >
                  <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Info card */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-800">Local Node Console</h4>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
              Phase 2 Mock Execution. Map rendering active with local coordinates.
            </p>
            <div className="mt-3 flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-emerald-600">Simulating APIs</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
