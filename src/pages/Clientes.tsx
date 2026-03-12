import { useState } from 'react';
import { Filter, Eye } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { useApi } from '../hooks/useApi';
import { apiService } from '../services/api';

export function Clientes() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: clients, loading } = useApi(() => apiService.getClientsList());

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header title="Clientes" />
        <div className="p-4 sm:p-6 md:p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="bg-white rounded-2xl p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  const sampleClient = {
    name: 'Juan Esteban',
    fechaIngreso: 'Junio 1, 2025, 08:22 AM',
    pedidos: 2,
    ultimoPedido: 'Junio 1, 2025, 08:22 AM',
    direccion: 'Calle 12 # 23 - 21, Riomar Edificio Sysca Apto 401',
    telefono: '+ 57 318 328 2839',
    email: 'juanesteban@gmail.com',
  };

  const allClients = clients && clients.length > 0 ? clients : [sampleClient];

  return (
    <div className="bg-gray-200 min-h-screen">
      <Header title="Clientes" onSearch={setSearchQuery} />

      <div className="p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Listado de clientes</h2>
        </div>
        <div className="block md:hidden space-y-3">
          {(!clients || clients.length === 0) ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay clientes registrados
              </h3>
              <p className="text-gray-600 text-sm">
                Los clientes aparecerán aquí cuando realicen su primer pedido.
              </p>
            </div>
          ) : (
            allClients.map((client: any, i: number) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-pink-600 rounded border-gray-300" />
                    <span className="font-semibold text-gray-900 text-sm">{client.name}</span>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Eye size={16} className="text-gray-500" />
                  </button>
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0 mt-1"></div>
                  <span>{client.direccion}</span>
                </div>

                <div className="text-xs text-gray-500 space-y-0.5">
                  <div>{client.telefono}</div>
                  <div>{client.email}</div>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 pt-1 border-t border-gray-100">
                  <span><span className="font-medium text-gray-700">Ingreso: </span>{client.fechaIngreso}</span>
                  <span><span className="font-medium text-gray-700">Pedidos: </span>{client.pedidos}</span>
                  <span><span className="font-medium text-gray-700">Último: </span>{client.ultimoPedido}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-8 gap-4 p-6 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-600">
            <div className="flex items-center">
              <input type="checkbox" className="w-4 h-4 text-pink-600 rounded border-gray-300" />
            </div>
            <div className="flex items-center space-x-2">
              <span>Nombre</span><Filter size={14} />
            </div>
            <div className="flex items-center space-x-2">
              <span>Fecha Ingreso</span><Filter size={14} />
            </div>
            <div className="flex items-center space-x-2">
              <span>Pedidos</span><Filter size={14} />
            </div>
            <div className="flex items-center space-x-2">
              <span>Último Pedido</span><Filter size={14} />
            </div>
            <div className="flex items-center space-x-2">
              <span>Última Dirección</span><Filter size={14} />
            </div>
            <div className="flex items-center space-x-2">
              <span>Datos</span><Filter size={14} />
            </div>
            <div>Acciones</div>
          </div>

          {(!clients || clients.length === 0) && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay clientes registrados
              </h3>
              <p className="text-gray-600">
                Los clientes aparecerán aquí cuando realicen su primer pedido.
              </p>
            </div>
          )}

          <div className="grid grid-cols-8 gap-4 p-6 border-b border-gray-100 text-sm text-gray-400">
            <div>
              <input type="checkbox" className="w-4 h-4 text-pink-600 rounded border-gray-300" disabled />
            </div>
            <div>Juan Esteban</div>
            <div>Junio 1, 2025, 08:22 AM</div>
            <div>2</div>
            <div>Junio 1, 2025, 08:22 AM</div>
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
                <span>Calle 12 # 23 - 21, Riomar Edificio Sysca Apto 401</span>
              </div>
            </div>
            <div className="text-xs">
              <div>+ 57 318 328 2839</div>
              <div>juanesteban@gmail.com</div>
            </div>
            <div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Eye size={16} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}