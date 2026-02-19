//import React from 'react';
import { Bell, ShoppingCart, History } from 'lucide-react';

interface HeaderProps {
  vistaActual: 'mesas' | 'pedidos' | 'historial';
  onCambiarVista: (vista: 'mesas' | 'pedidos' | 'historial') => void;
  llamadasActivas: number;
}

export default function Header({ vistaActual, onCambiarVista, llamadasActivas }: HeaderProps) {
  return (
    <div>
      {/* Header Principal */}
      <div className="bg-red-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">Chuzo de Ivan</h1>
          
          <div className="flex justify-center gap-4 mb-6">
            <button 
              onClick={() => onCambiarVista('mesas')}
              className={`px-4 py-2 rounded-lg border-2 border-white transition-all duration-200 flex items-center gap-2 ${
                vistaActual === 'mesas' 
                  ? 'bg-white text-red-500 shadow-md' 
                  : 'bg-transparent text-white hover:bg-white hover:text-red-600'
              }`}
            >
              <Bell size={20} />
              Panel de Notificaciones
            </button>
            
            <button 
              onClick={() => onCambiarVista('pedidos')}
              className={`px-4 py-2 rounded-lg border-2 border-white transition-all duration-200 flex items-center gap-2 ${
                vistaActual === 'pedidos' 
                  ? 'bg-white text-red-600 shadow-md' 
                  : 'bg-transparent text-white hover:bg-white hover:text-red-600'
              }`}
            >
              <ShoppingCart size={20} />
              Domicilios
            </button>
          </div>
        </div>
      </div>

      {/* Sub Header */}
      <div className="bg-red-500 text-white px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Bell size={20} />
              <span className="font-medium">
                {vistaActual === 'mesas' ? 'Panel De Notificaciones' : 'Panel de Pedidos'}
              </span>
            </div>           
          </div>
          
         {/*  <button 
            onClick={() => onCambiarVista('historial')}
            className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:shadow-md transition-all duration-200 flex items-center gap-2"
          >
            <History size={16} />
            Historial
          </button>*/}  
        </div>
      </div>
    </div>
  );
}