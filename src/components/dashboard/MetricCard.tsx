import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

export function MetricCard({ title, value, change, icon, color }: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number' && val >= 1000000) {
      return `$ ${(val / 1000000).toFixed(0)}.000.000`;
    }
    if (typeof val === 'number' && val >= 1000) {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
          <div className="text-2xl font-bold text-gray-900 mb-3">
            {formatValue(value)}
          </div>
          {change !== undefined && (
            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              change >= 0 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              {change >= 0 ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              <span>{change >= 0 ? '+' : ''}{change}%</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}