import React, { useState } from "react";
import { Plus, Filter, Eye, Copy, Trash2 } from "lucide-react";
import { Header, ActionButton } from "../components/layout/Header";
import { EmptyState } from "../components/common/EmptyState";
import { useApi } from "../hooks/useApi";
import { apiService } from "../services/api";

export function Platos() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: dishes,
    loading,
    refetch,
  } = useApi(() => apiService.getDishes());

  const tabs = [
    { id: "all", label: "Todos los platos" },
    { id: "restaurant", label: "Menú Restaurante" },
    { id: "delivery", label: "Menú Domicilios" },
  ];

  const handleCreateDish = () => {
    console.log("Create new dish");
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header
          title="Platos"
          subtitle={`Tus platos (${dishes?.length || 0})`}
          rightActions={
            <ActionButton onClick={handleCreateDish}>
              <Plus size={20} />
              <span>Crear nuevo plato</span>
            </ActionButton>
          }
        />
        <div className="p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredDishes =
    dishes?.filter((dish) => {
      const matchesSearch = dish.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "all" || dish.category === activeTab;
      return matchesSearch && matchesTab;
    }) || [];

  return (
    <div className="bg-gray-200 min-h-screen">
      <Header
        title="Platos"
        subtitle={`Tus platos (${dishes?.length || 0})`}
        onSearch={setSearchQuery}
        rightActions={
          <ActionButton onClick={handleCreateDish}>
            <Plus size={20} />
            <span>Crear nuevo plato</span>
          </ActionButton>
        }
      />

      <div className="p-8">
        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-red-500 border-b-2 border-red-500"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filteredDishes.length === 0 ? (
          <EmptyState
            title="No tienes ningún plato creado"
            subtitle="Empieza a crearlos y armar tu menú en segundos"
            buttonText="Crear nuevo plato"
            onAction={handleCreateDish}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-8 gap-4 p-6 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-600">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-red-600 rounded border-gray-300"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span>Foto</span>
                <Filter size={14} />
              </div>
              <div className="flex items-center space-x-2">
                <span>Nombre</span>
                <Filter size={14} />
              </div>
              <div className="flex items-center space-x-2">
                <span>Ingredientes</span>
                <Filter size={14} />
              </div>
              <div className="flex items-center space-x-2">
                <span>Categoría</span>
                <Filter size={14} />
              </div>
              <div className="flex items-center space-x-2">
                <span>Precio</span>
                <Filter size={14} />
              </div>
              <div className="flex items-center space-x-2">
                <span>Menú</span>
                <Filter size={14} />
              </div>
              <div>Acciones</div>
            </div>

            {/* Sample Empty Row */}
            <div className="grid grid-cols-8 gap-4 p-6 border-b border-gray-100">
              <div>
                <input
                  type="checkbox"
                  className="w-4 h-4 text-pink-600 rounded border-gray-300"
                />
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-500">100 px x 100 px</span>
              </div>
              <div>
                <span className="text-gray-400">Ingresar nombre</span>
              </div>
              <div>
                <span className="text-gray-400">Ingresar ingredientes</span>
              </div>
              <div>
                <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm">
                  Seleccionar
                </button>
              </div>
              <div>
                <span className="text-gray-900 font-medium">$ 0.0</span>
              </div>
              <div>
                <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm">
                  Seleccionar
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Eye size={16} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Copy size={16} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Trash2 size={16} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Add New Row Button */}
            <div className="p-6 text-center">
              <button
                onClick={handleCreateDish}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                + Crear nuevo plato
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
