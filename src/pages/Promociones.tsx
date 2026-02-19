import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Header, ActionButton } from '../components/layout/Header';
import { EmptyState } from '../components/common/EmptyState';
import { useApi } from '../hooks/useApi';
import { apiService } from '../services/api';

export function Promociones() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: promotions, loading, refetch } = useApi(() => apiService.getPromotions());

  const tabs = [
    { id: 'all', label: 'Todas las promociones' },
    { id: 'restaurant', label: 'Menú Restaurante' },
    { id: 'delivery', label: 'Menú Domicilios' }
  ];

  const handleCreatePromotion = () => {
    console.log('Create new promotion');
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header 
          title="Promociones" 
          subtitle={`Tus promociones (${promotions?.length || 0})`}
          rightActions={
            <ActionButton onClick={handleCreatePromotion}>
              <Plus size={20} />
              <span>Crear nueva promoción</span>
            </ActionButton>
          }
        />
        <div className="p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const filteredPromotions = promotions?.filter(promotion => {
    const matchesSearch = promotion.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || promotion.category === activeTab;
    return matchesSearch && matchesTab;
  }) || [];

  return (
    <div className="bg-gray-200 min-h-screen">
      <Header 
        title="Promociones" 
        subtitle={`Tus promociones (${promotions?.length || 0})`}
        onSearch={setSearchQuery}
        rightActions={
          <ActionButton onClick={handleCreatePromotion}>
            <Plus size={20} />
            <span>Crear nueva promoción</span>
          </ActionButton>
        }
      />
      
      <div className="p-8">
        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab.id
                 ?  "text-red-500 border-b-2 border-red-500"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <EmptyState
          title="No tienes ninguna promoción creada"
          subtitle="Empieza a crearlas en segundos"
          buttonText="+ Crear nueva promoción"
          onAction={handleCreatePromotion}
        />
      </div>
    </div>
  );
}