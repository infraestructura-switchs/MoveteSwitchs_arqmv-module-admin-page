import React from 'react';
import { ShoppingCart, CheckCircle, Clock, DollarSign, CreditCard } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { MetricCard } from '../components/dashboard/MetricCard';
import { SalesChart } from '../components/dashboard/SalesChart';
import { useApi } from '../hooks/useApi';
import { apiService } from '../services/api';

export function Dashboard() {
  const { data: metrics, loading: metricsLoading } = useApi(() => apiService.getDashboardMetrics());
  const { data: salesData, loading: salesLoading } = useApi(() => apiService.getSalesData());
  const { data: bestSellers, loading: sellersLoading } = useApi(() => apiService.getBestSellers());
  const { data: clients, loading: clientsLoading } = useApi(() => apiService.getClients());

  if (metricsLoading || salesLoading || sellersLoading || clientsLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header title="Dashboard" subtitle="Tu actividad reciente" />
        <div className="p-8">
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-gray-200 rounded-2xl"></div>
              <div className="h-96 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 min-h-screen">
      <Header 
        title="Dashboard" 
        subtitle="Tu actividad reciente"
        rightActions={
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium">
            Exportar
          </button>
        }
      />
      
      <div className="p-8 space-y-6">
        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <MetricCard
            title="Ordenes totales"
            value={metrics?.totalOrders || 0}
            change={metrics?.ordersGrowth}
            icon={<ShoppingCart className="text-pink-600" size={24} />}
            color="bg-pink-100"
          />
          <MetricCard
            title="Ordenes listas"
            value={metrics?.readyOrders || 0}
            change={metrics?.readyOrdersGrowth}
            icon={<CheckCircle className="text-green-600" size={24} />}
            color="bg-green-100"
          />
          <MetricCard
            title="Ordenes de proceso"
            value={metrics?.processingOrders || 0}
            change={metrics?.processingOrdersGrowth}
            icon={<Clock className="text-purple-600" size={24} />}
            color="bg-purple-100"
          />
          <MetricCard
            title="Ganancia Total"
            value={metrics?.totalRevenue || 0}
            change={metrics?.revenueGrowth}
            icon={<DollarSign className="text-green-600" size={24} />}
            color="bg-green-100"
          />
          <MetricCard
            title="Cuenta Total"
            value={metrics?.totalAccount || 0}
            change={metrics?.accountGrowth}
            icon={<CreditCard className="text-pink-600" size={24} />}
            color="bg-pink-100"
          />
        </div>

        {/* Charts and Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <div className="lg:col-span-2">
            {salesData && <SalesChart data={salesData} />}
          </div>

          {/* Side Stats */}
          <div className="space-y-6">
            {/* Best Sellers */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos más vendidos</h3>
              <div className="space-y-4">
                {bestSellers?.map((seller, index) => (
                  <div key={seller.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <img 
                      src={seller.image} 
                      alt={seller.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{seller.name}</p>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{seller.sales}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sales Hours */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Horarios de mayor venta</h3>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#f3f4f6" strokeWidth="10"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#ec4899" strokeWidth="10"
                          strokeDasharray={`${45 * 3.14159} ${55 * 3.14159}`} strokeLinecap="round"/>
                  <circle cx="60" cy="60" r="35" fill="none" stroke="#8b5cf6" strokeWidth="8"
                          strokeDasharray={`${30 * 2.199} ${70 * 2.199}`} strokeLinecap="round"/>
                  <circle cx="60" cy="60" r="20" fill="none" stroke="#6b21a8" strokeWidth="6"
                          strokeDasharray={`${25 * 1.257} ${75 * 1.257}`} strokeLinecap="round"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">100%</span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {['Mañana', 'Tarde', 'Noche'].map((time, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 bg-${index === 0 ? 'pink' : index === 1 ? 'purple' : 'purple-900'}-500 rounded-full`}></div>
                      <span className="text-gray-600">{time}</span>
                    </div>
                    <span className="font-medium">{Math.floor(Math.random() * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Averages */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Medio de ventas</h3>
            <div className="space-y-4">
              {['Punto físico Restaurante', 'Domicilio', 'Recoger en punto físico'].map((method, index) => (
                <div key={index} className={`flex items-center justify-between p-3 bg-${index === 0 ? 'pink' : 'purple'}-50 rounded-xl`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 bg-${index === 0 ? 'pink' : 'purple'}-400 rounded-sm`}></div>
                    <span className="text-gray-800 font-medium">{method}</span>
                  </div>
                  <span className="font-bold text-gray-900">${(Math.random() * 100000).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reports and Clients */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Last Report */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Último Reporte</h3>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 mb-2">Reporte Julio</p>
                <p className="text-xs text-gray-500 mb-4">2025</p>
                <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-pink-300 hover:text-pink-500 transition-colors">
                  <span className="text-2xl mb-1 block">+</span>
                  <span className="text-sm">Crear nuevo</span>
                </button>
              </div>
            </div>

            {/* Clients */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Clientes</h3>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-1 text-gray-600">
                  <option>Todo el año</option>
                </select>
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{clients?.online}</div>
                  <div className="text-sm text-gray-600">Online</div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full" style={{ width: '58%' }}></div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{clients?.local}</div>
                  <div className="text-sm text-gray-600">En local</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
