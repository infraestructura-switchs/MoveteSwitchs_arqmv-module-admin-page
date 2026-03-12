import { useState } from 'react';
import { Header } from '../layout/Header';
import OrdersDomicile from './OrderDomicile';

export function DomicileComponents() {
  const [activeTab, setActiveTab] = useState('domicilio');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [timeFilter, setTimeFilter] = useState('hoy');

  const tabs = [
    { id: 'domicilio', label: 'Domicilio' },
    { id: 'recoger_en_lugar', label: 'Recoger en lugar' }
  ];

  const handleViewOrder = (orderId: string) => {
    console.log(`Ver pedido ${orderId}`);
  };

  return (
    <div className="bg-gray-200 min-h-screen">
      <Header title="Domicilios" onSearch={setSearchQuery} />

      <div className="p-2 sm:p-4 md:p-3 lg:p-4">
        <div className="mb-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-gray-500">
              Listado de pedidos
            </h2>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="todos">Todos los estados</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="en_proceso">En proceso</option>
                <option value="en_camino">En camino</option>
                <option value="activa">Activa</option>
                <option value="cancelado">Cancelado</option>
              </select>

              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="hoy">Hoy</option>
                <option value="semana">Esta semana</option>
                <option value="mes">Este mes</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-1 overflow-x-auto border-b border-gray-300 pb-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-4 py-2 font-medium transition-colors text-sm sm:text-base ${
                  activeTab === tab.id
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <OrdersDomicile
          activeTab={activeTab}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          timeFilter={timeFilter}
          onViewOrder={handleViewOrder}
        />
      </div>
    </div>
  );
}