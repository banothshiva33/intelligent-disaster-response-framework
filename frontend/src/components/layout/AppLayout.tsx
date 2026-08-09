import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      {/* Header occupies the full width of the screen */}
      <Header onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

      {/* Main container split between sidebar and central scroll content */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <main className="flex-grow p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};
