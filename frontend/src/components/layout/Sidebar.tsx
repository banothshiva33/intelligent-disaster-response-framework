import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  AlertOctagon, 
  Users2, 
  Map, 
  Shield, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const navItems = [
    { to: '/', label: 'Welcome Page', icon: Home },
    { to: '/dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { to: '/incidents', label: 'Incident Management', icon: AlertOctagon },
    { to: '/volunteers', label: 'Volunteer Roster', icon: Users2 },
    { to: '/location', label: 'Location Intelligence', icon: Map },
  ];

  // Helper to determine Link classes based on active state and collapsed state
  const getLinkClass = (isActive: boolean) => {
    const baseClass = "flex items-center transition-all duration-200 cursor-pointer";
    
    if (isCollapsed) {
      // Centered compact icon loop
      return isActive 
        ? `${baseClass} justify-center h-11 w-11 rounded-lg bg-[#F3E8FF] text-[#7C3AED] border-l-4 border-[#7C3AED] mx-auto shadow-2xs`
        : `${baseClass} justify-center h-11 w-11 rounded-lg text-slate-500 hover:text-[#7C3AED] hover:bg-[#F8FAFC] border-l-4 border-transparent mx-auto`;
    }

    // Standard expanded menu item list
    return isActive
      ? `${baseClass} space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#F3E8FF] text-[#7C3AED] border-l-4 border-[#7C3AED] shadow-2xs`
      : `${baseClass} space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium text-[#334155] hover:text-[#7C3AED] hover:bg-[#F8FAFC] border-l-4 border-transparent`;
  };

  return (
    <>
      {/* Mobile drawer backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/20 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar navigation viewport */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 bg-white border-r border-slate-200 pt-20 lg:pt-0 transform lg:transform-none lg:static transition-all duration-200 ease-in-out flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-18 lg:w-[72px]' : 'w-64 lg:w-[250px]'}`}
      >
        <div className={`px-4 py-6 flex-1 overflow-y-auto ${isCollapsed ? 'space-y-4 px-2' : 'space-y-6'}`}>
          {/* Header branding (hidden on collapsed mode except logo icon) */}
          <div className={`hidden lg:flex items-center pb-5 border-b border-slate-100 ${
            isCollapsed ? 'justify-center space-x-0' : 'space-x-2'
          }`}>
            <div className="bg-[#7C3AED] p-2 rounded-lg text-white flex items-center justify-center shadow-xs flex-shrink-0">
              <Shield className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="font-bold text-slate-900 text-sm tracking-tight block truncate">
                  IDRF Platform
                </span>
                <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block truncate">
                  Emergency Control
                </span>
              </div>
            )}
          </div>

          {/* Navigation group */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.to} className="relative group flex items-center w-full">
                  <NavLink
                    to={item.to}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={({ isActive }) => getLinkClass(isActive)}
                    aria-label={item.label}
                  >
                    <Icon className={`h-4.5 w-4.5 flex-shrink-0 ${isCollapsed ? '' : 'text-slate-500 group-hover:text-[#7C3AED]'}`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>

                  {/* 6. TOOLTIP RULE (ONLY when collapsed) */}
                  {isCollapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md">
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Console status block (hidden on collapsed) */}
        {!isCollapsed && (
          <div className="p-4 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800">Local Node Console</h4>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                Frontend Development Mode. Local static data coordinates mapping.
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
        )}

        {/* 5. SIDEBAR COLLAPSE TOGGLE TRIGGER */}
        <div className="p-3 border-t border-slate-100 flex items-center justify-center">
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-[#7C3AED] transition-colors w-full flex items-center justify-center border border-slate-200 cursor-pointer shadow-2xs"
            aria-label={isCollapsed ? "Expand sidebar menu" : "Collapse sidebar menu"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4.5 w-4.5" />
            ) : (
              <div className="flex items-center space-x-2">
                <ChevronLeft className="h-4.5 w-4.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Collapse Menu</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
