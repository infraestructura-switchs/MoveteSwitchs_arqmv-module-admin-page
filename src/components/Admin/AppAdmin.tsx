import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

function AppAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex w-screen bg-slate-100 h-screen overflow-hidden">

      {sidebarOpen && (
        <div className="hidden md:flex flex-shrink-0">
          <Sidebar />
        </div>
      )}

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-50">
            <Sidebar onClose={() => setSidebarOpen(false)} />
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-3 right-3 p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="bg-white border-b border-slate-200 px-2 py-2 flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="p-3 sm:p-5 flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AppAdmin;