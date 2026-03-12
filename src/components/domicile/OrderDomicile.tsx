import { useState, useEffect } from 'react';
import { Eye, ListFilter } from 'lucide-react';
import { getOrdersDomicile } from '../../Api/DomicileApi';

export type DeliveryRow = {
  id: string;
  orderId: string;
  date: string;
  status: string;
  statusName: string;
  statusClass: string;
  address: string;
  total: number;
  payment: string;
};

const money = (n: number) =>
  n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export default function OrdersDomicile({
  activeTab,
  searchQuery,
  statusFilter,
  timeFilter,
  onViewOrder,
}: {
  activeTab: string;
  searchQuery: string;
  statusFilter: string;
  timeFilter: string;
  onViewOrder: (orderId: string) => void;
}) {
  const [orders, setOrders] = useState<DeliveryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getOrdersDomicile();
        const transformedOrders = data.map((order: any) => ({
          id: order.orderTransactionDeliveryId.toString(),
          orderId: order.orderTransactionDeliveryId.toString(),
          date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
          status: order.status,
          statusName: order.statusOrder,
          statusClass: '',
          address: order.address,
          total: order.total,
          payment: order.paymentName,
        }));
        setOrders(transformedOrders);
      } catch (error) {
        console.error('Error al obtener los pedidos', error);
      }
      setLoading(false);
    };

    if (activeTab === 'domicilio') {
      fetchOrders();
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [activeTab]);

  const currentOrders = activeTab === 'domicilio' ? orders : [];
  let filteredOrders = currentOrders;

  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase();
    filteredOrders = filteredOrders.filter(r =>
      r.orderId.toLowerCase().includes(lowerQuery) ||
      r.address.toLowerCase().includes(lowerQuery)
    );
  }

  if (statusFilter !== 'todos') {
    filteredOrders = filteredOrders.filter(r => r.status === statusFilter);
  }

  const today = new Date();
  const parseSpanishDate = (dateStr: string): Date => {
    const parts = dateStr.split(' de ');
    if (parts.length !== 3) return new Date(0);
    const day = parseInt(parts[0], 10);
    const monthName = parts[1].toLowerCase();
    const year = parseInt(parts[2], 10);
    const monthMap: { [key: string]: number } = {
      'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
      'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
    };
    const month = monthMap[monthName];
    if (isNaN(month)) return new Date(0);
    return new Date(year, month, day);
  };

  if (timeFilter === 'hoy') {
    filteredOrders = filteredOrders.filter(r => {
      const d = parseSpanishDate(r.date);
      return d.toDateString() === today.toDateString();
    });
  } else if (timeFilter === 'semana') {
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    filteredOrders = filteredOrders.filter(r => parseSpanishDate(r.date) >= weekAgo);
  } else if (timeFilter === 'mes') {
    const monthAgo = new Date(today);
    monthAgo.setDate(today.getDate() - 30);
    filteredOrders = filteredOrders.filter(r => parseSpanishDate(r.date) >= monthAgo);
  }

  const getStatusColor = (statusName: string) => {
    const status = statusName.toLowerCase();
    switch (status) {
      case 'pendiente':   return 'bg-red-100 text-red-700';
      case 'desocupada':  return 'bg-gray-100 text-gray-700';
      case 'en_proceso':  return 'bg-yellow-100 text-yellow-700';
      case 'en_camino':   return 'bg-orange-100 text-orange-700';
      case 'activa':      return 'bg-green-100 text-green-700';
      case 'cancelado':   return 'bg-red-100 text-red-700';
      default:            return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="py-3">
        <div className="animate-pulse">
          <div className="bg-white rounded-2xl p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-3">

      <div className="block md:hidden space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm px-4 py-10 text-center text-gray-500">
            No hay pedidos disponibles
          </div>
        ) : (
          filteredOrders.map((r) => (
            <div key={r.id} className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">

              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800 text-sm">
                  Orden #{r.orderId}
                </span>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(r.status)}`}>
                  {r.statusName}
                </span>
              </div>

              <p className="text-sm text-gray-600 leading-snug">
                <span className="font-medium text-gray-700">Dirección: </span>
                {r.address}
              </p>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                <span>
                  <span className="font-medium text-gray-700">Fecha: </span>
                  {r.date}
                </span>
                <span>
                  <span className="font-medium text-gray-700">Pago: </span>
                  {r.payment}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                <span className="font-semibold text-gray-800 text-sm">
                  {r.total > 0 ? money(r.total) : '$ 0'}
                </span>
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition"
                  onClick={() => onViewOrder(r.orderId)}
                >
                  <Eye size={15} /> Ver detalle
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="w-10 px-4 py-3 text-center border-b border-r border-gray-300">
                <input type="checkbox" className="h-4 w-4 rounded" />
              </th>
              {['ID Orden', 'Fecha', 'Estado', 'Dirección', 'Total', 'Pago'].map((col) => (
                <th key={col} className="px-4 py-3 text-center border-b border-r border-gray-300">
                  <div className="flex items-center justify-center gap-1">
                    {col} <ListFilter size={16} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-center border-b border-gray-300">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-center">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                  </td>
                  <td className="px-4 py-3 text-center font-medium text-gray-800">{r.orderId}</td>
                  <td className="px-4 py-3 text-center">{r.date}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(r.status)}`}>
                      {r.statusName}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-left">{r.address}</td>
                  <td className="px-4 py-3 text-center">{r.total > 0 ? money(r.total) : '$ 0'}</td>
                  <td className="px-4 py-3 text-center">{r.payment}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-3 text-gray-600">
                      <button
                        className="p-2 hover:text-pink-600"
                        title="Ver"
                        onClick={() => onViewOrder(r.orderId)}
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-gray-500">
                  No hay pedidos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}