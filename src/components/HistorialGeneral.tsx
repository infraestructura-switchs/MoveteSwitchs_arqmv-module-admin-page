import React, { useState } from 'react';
import { Calendar, Clock, Filter, Search } from 'lucide-react';
import { Mesa, Pedido } from '../types/restaurant';
import { formatearTiempo, formatearPrecio } from '../utils/mesaUtils';

interface HistorialGeneralProps {
  mesas: Mesa[];
}

export default function HistorialGeneral({ mesas }: HistorialGeneralProps) {
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroMesa, setFiltroMesa] = useState('');
  const [busqueda, setBusqueda] = useState('');


  const todosPedidos = mesas.flatMap(mesa => 
    mesa.pedidos.map(pedido => ({
      ...pedido,
      mesaNumero: mesa.tableNumber
    }))
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Filtrar pedidos
  const pedidosFiltrados = todosPedidos.filter(pedido => {
    const coincideFecha = !filtroFecha || pedido.timestamp.includes(filtroFecha);
    const coincideMesa = !filtroMesa || pedido.mesaNumero.toString() === filtroMesa;
    const coincideBusqueda = !busqueda || 
      pedido.clienteNumero.toLowerCase().includes(busqueda.toLowerCase()) ||
      pedido.productos.some(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));

    return coincideFecha && coincideMesa && coincideBusqueda;
  });

  const totalVentas = pedidosFiltrados.reduce((sum, pedido) => sum + pedido.total, 0);
  const totalPedidos = pedidosFiltrados.length;

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Pedidos</p>
              <p className="text-2xl font-bold text-gray-900">{totalPedidos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Clock className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Ventas Totales</p>
              <p className="text-2xl font-bold text-gray-900">{formatearPrecio(totalVentas)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Filter className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Promedio por Pedido</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalPedidos > 0 ? formatearPrecio(totalVentas / totalPedidos) : '$0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Cliente, producto..."
                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mesa
            </label>
            <select
              value={filtroMesa}
              onChange={(e) => setFiltroMesa(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Todas las mesas</option>
              {mesas.map(mesa => (
                <option key={mesa.tableId} value={mesa.tableNumber}>
                  Mesa {mesa.tableNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFiltroFecha('');
                setFiltroMesa('');
                setBusqueda('');
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de pedidos */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Historial de Pedidos</h3>
        </div>
        
        <div className="divide-y">
          {pedidosFiltrados.length > 0 ? (
            pedidosFiltrados.map((pedido) => (
              <div key={`${pedido.mesaNumero}-${pedido.id}`} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                      Mesa {pedido.mesaNumero}
                    </div>
                    <div className="text-sm text-gray-600">
                      Cliente: {pedido.clienteNumero}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatearTiempo(pedido.timestamp)}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatearPrecio(pedido.total)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Productos:</h4>
                    <div className="space-y-1">
                      {pedido.productos.map((producto, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          {producto.cantidad} x {producto.nombre} - {formatearPrecio(producto.precio * producto.cantidad)}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Entrega:</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Tipo: {pedido.tipo === 'domicilio' ? 'A domicilio' : 'Recoger en local'}</div>
                      {pedido.direccion && <div>Dirección: {pedido.direccion}</div>}
                      <div className="flex items-center gap-2">
                        <span>Estado:</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          pedido.estado === 'entregado' ? 'bg-green-100 text-green-800' : 
                          pedido.estado === 'listo' ? 'bg-blue-100 text-blue-800' :
                          pedido.estado === 'preparando' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {pedido.estado}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <Clock size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No se encontraron pedidos</h3>
              <p className="text-gray-500">Ajusta los filtros para ver más resultados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}