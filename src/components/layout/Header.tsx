import React from "react";
import { Search, Menu } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  rightActions?: React.ReactNode;
  onMenuClick?: () => void;
}

export function Header({
  title,
  subtitle,
  showSearch = true,
  onSearch,
  rightActions,
  onMenuClick,
}: HeaderProps) {

  // ✅ Si no recibe onMenuClick, dispara un evento global que App.tsx escucha
  const handleMenuClick = () => {
    if (onMenuClick) {
      onMenuClick();
    } else {
      window.dispatchEvent(new CustomEvent("toggle-sidebar"));
    }
  };

  return (
    <div className="bg-gray-200 border-b border-gray-300 px-4 py-3 space-y-2">

      {/* ── MÓVIL/TABLET: fila 1 → hamburguesa + buscador ── */}
      <div className="flex lg:hidden items-center gap-3">
        <button
          className="flex-shrink-0 bg-white rounded-xl p-2 shadow-md"
          onClick={handleMenuClick} // ✅ siempre funciona
        >
          <Menu size={20} className="text-[#9D0154]" />
        </button>

        {showSearch && (
          <div className="relative flex-1">
            <div className="flex items-center bg-white rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-pink-500">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Buscar"
                className="w-full pl-9 pr-4 py-2 bg-transparent border-none outline-none text-sm"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── MÓVIL/TABLET: fila 2 → título ── */}
      <div className="lg:hidden">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      </div>

      {/* ── DESKTOP: fila única → título + buscador ── */}
      <div className="hidden lg:flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>

        {showSearch && (
          <div className="relative w-72 xl:w-80">
            <div className="flex items-center bg-white rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-pink-500">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Buscar"
                className="w-full pl-9 pr-4 py-2 bg-transparent border-none outline-none text-sm"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── TODAS LAS PANTALLAS: subtítulo + botones ── */}
      {(subtitle || rightActions) && (
        <div className="flex items-center justify-between">
          {subtitle && (
            <p className="text-sm text-gray-600 font-medium">{subtitle}</p>
          )}
          <div className="flex items-center space-x-3 ml-auto">
            {rightActions}
          </div>
        </div>
      )}
    </div>
  );
}

export function ActionButton({
  children,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-colors text-sm ${
        variant === "primary"
          ? "bg-red-500 text-white hover:bg-red-600"
          : "border border-red-500 text-red-500 hover:bg-red-50"
      }`}
    >
      {children}
    </button>
  );
}