import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2, Shield, ChevronDown, LogOut } from 'lucide-react'; 

export default function Sidebar() {
  const [showSecuritySubmenu, setShowSecuritySubmenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentView = location.pathname.split('/')[2] || 'products';

  const securitySubItems = [
    { id: 3.1, title: "Roles (Rls)", path: "roles" },
    { id: 3.2, title: "Usuarios (Usr)", path: "users" },
    { id: 3.3, title: "Area (Ar)", path: "area" },
    { id: 3.4, title: "Cargo (Cr)", path: "position" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("company_id");
    localStorage.removeItem("auth_token");
    navigate("/"); 
  };

  return (
    <div className="w-64 bg-[#980046] text-white min-h-screen flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white p-2 rounded-lg">
            <Building2 className="w-6 h-6 text-[#980046]" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Panel</h1>
            <h2 className="text-lg font-bold">Administrativo</h2>
          </div>
        </div>
        <p className="text-sm text-white mt-1 opacity-80">Gestión de información de restaurantes</p>
      </div>

      <div className="px-4 flex-1">
        <h3 className="text-xs font-semibold text-white mb-3 px-2 opacity-80">Menú Principal</h3>

        <button
          onClick={() => navigate('/admin')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            currentView === undefined || currentView === 'products'
              ? 'bg-white text-[#980046]'
              : 'text-white hover:bg-white hover:text-[#980046]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span className="text-sm">Nuevo Restaurante</span>
        </button>

        <div className="my-2" />

        <div>
          <button
            onClick={() => setShowSecuritySubmenu((v) => !v)}
            className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              ['roles', 'users', 'area', 'position'].includes(currentView)
                ? 'bg-white text-[#980046]'
                : 'text-white hover:bg-white hover:text-[#980046]'
            }`}
          >
            <span className="flex items-center gap-3">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Seguridad</span>
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showSecuritySubmenu ? 'rotate-180' : ''}`} />
          </button>
          {showSecuritySubmenu && (
            <div className="ml-7 mt-2 flex flex-col gap-1">
              {securitySubItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/admin/${item.path}`)}
                  className={`text-left text-sm px-2 py-1 rounded hover:bg-white hover:text-[#980046] transition-colors ${
                    currentView === item.path ? 'bg-white text-[#980046]' : ''
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 pb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white hover:text-[#980046] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}