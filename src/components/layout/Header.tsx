import React from "react";
import { Search, FileText, Plus } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  rightActions?: React.ReactNode;
}

export function Header({
  title,
  subtitle,
  showSearch = true,
  onSearch,
  rightActions,
}: HeaderProps) {
  return (
    <div className="bg-gray-200 border-b border-gray-300 px-4 py-3  space-y-4">
      {/* Fila 1: Título + Búsqueda */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>

        {showSearch && (
          <div className="relative">
            <div className="flex items-center bg-white rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-pink-500 focus-within:border-transparent">
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Buscar"
                className="pl-40 pr-4 py-2 bg-transparent border-none outline-none focus:outline-none max-w-md d-lg"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Fila 2: Subtítulo + Botones */}
      <div className="flex items-center justify-between">
        {subtitle && (
          <p className="text-sm text-gray-600 font-medium">{subtitle}</p>
        )}

        <div className="flex items-center space-x-3">{rightActions}</div>
      </div>
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
      className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-colors ${
        variant === "primary"
          ? "bg-red-500 text-white hover:bg-red-600"
          : "border border-red-500 text-red-500 hover:bg-red-50"
      }`}
    >
      {children}
    </button>
  );
}
