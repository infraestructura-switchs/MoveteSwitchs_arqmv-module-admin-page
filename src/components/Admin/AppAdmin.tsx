import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

function AppAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
    <div className="flex w-screen bg-slate-100 h-screen overflow-auto">
      
      {sidebarOpen && (
        <Sidebar />
      )}

      <div className="flex-1 flex flex-col">

        
        <div className="bg-white border-b border-slate-200 px-2 py-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
    </>
    
  );
}

export default AppAdmin;
