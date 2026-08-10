import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white text-slate-900">
      {/* Header occupies the full width of the screen */}
      <Header onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

      {/* Main container split between sidebar and central scroll content */}
      <div className="flex flex-1 overflow-hidden relative bg-white">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={closeSidebar} 
          isCollapsed={isCollapsed} 
          onToggleCollapse={toggleCollapse} 
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-white">
          <main className="flex-grow p-4 md:p-6 lg:p-8 bg-white">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};
export default AppLayout;
