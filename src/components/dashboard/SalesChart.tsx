import React from 'react';
import { SalesData } from '../../types/index';

interface SalesChartProps {
  data: SalesData[];
}

export function SalesChart({ data }: SalesChartProps) {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500">No hay datos disponibles.</div>;
  }

  const maxValue = Math.max(...data.flatMap(d => [d.restaurant, d.delivery, d.pickup]));
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Ingreso total</h3>
        </div>
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1 text-gray-600">
          <option>Todo el año</option>
        </select>
      </div>

      <div className="mb-4">
        <div className="text-sm font-medium text-gray-900 mb-2">
          {/* Calculamos el ingreso total */}
          ${data.reduce((acc, curr) => acc + curr.restaurant + curr.delivery + curr.pickup, 0).toLocaleString()}
        </div>
      </div>

      <div className="relative h-64 mb-4">
        <div className="absolute inset-0 flex items-end justify-between">
          {data.map((item, index) => {
            const totalHeight = 200;
            const restaurantHeight = (item.restaurant / maxValue) * totalHeight;
            const deliveryHeight = (item.delivery / maxValue) * totalHeight;
            const pickupHeight = (item.pickup / maxValue) * totalHeight;

            return (
              <div key={index} className="flex flex-col items-center space-y-1" style={{ width: `${100 / data.length}%` }}>
                <div className="relative w-8 flex flex-col justify-end" style={{ height: totalHeight }}>
                  {/* Restaurant (pink) */}
                  <div 
                    className="w-full bg-pink-300 rounded-t-sm"
                    style={{ height: restaurantHeight }}
                  />
                  {/* Delivery (red) */}
                  <div 
                    className="w-full bg-red-500"
                    style={{ height: deliveryHeight }}
                  />
                  {/* Pickup (purple) */}
                  <div 
                    className="w-full bg-purple-900 rounded-b-sm"
                    style={{ height: pickupHeight }}
                  />
                </div>
                <span className="text-xs text-gray-500 font-medium">{item.month}</span>
              </div>
            );
          })}
        </div>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-8">
          <span>$ {maxValue.toLocaleString()}</span>
          <span>$ {(maxValue / 2).toLocaleString()}</span>
          <span>$ {(maxValue / 5).toLocaleString()}</span>
          <span>$ {(maxValue / 10).toLocaleString()}</span>
          <span>$ {(maxValue / 20).toLocaleString()}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-pink-300 rounded-sm"></div>
          <span className="text-gray-600">Punto físico Restaurante</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
          <span className="text-gray-600">Domicilio</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-900 rounded-sm"></div>
          <span className="text-gray-600">Recoger en punto físico</span>
        </div>
      </div>
    </div>
  );
}
