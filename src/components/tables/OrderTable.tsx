import React, { useState, useEffect } from "react";
import { ArrowLeft, Clock, Plus, Utensils } from "lucide-react";
import { TableResponse, OrderItem } from '../../types/TableType';
import { getOrders, sendOrders } from '../../Api/OrderTableApi';
import { sendWaiter } from '../../Api/TableApi'; 
import { closeAccount } from "../../Api/TransactionTable";

type OrderModalProps = {
  isOpen: boolean;
  tableNumber: string;
  onClose: () => void;
  status?: number;
  onWaiterAck?: () => void;
  onConfirm?: () => void; 
};

const mesero = "/assets/img/mesero.png";
const pagar_cuenta = "/assets/img/pagar_cuenta.png";

const money = (n: number) =>
  n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export const OrderTable: React.FC<OrderModalProps> = ({
  isOpen,
  tableNumber,
  onClose,
  status,
  onWaiterAck,
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);
  const [sentOrders, setSentOrders] = useState<OrderItem[]>([]);
  const [pendingOrders, setPendingOrders] = useState<OrderItem[]>([]);
  const [total, setTotal] = useState(0);
  const [transactionId, setTransactionId] = useState<number | null>(null);
  const [selectedPending, setSelectedPending] = useState<Set<number>>(new Set()); 

  useEffect(() => {
    if (isOpen) {
      fetchTableOrders();
      setSelectedPending(new Set()); 
    }
  }, [isOpen, tableNumber]);

  const fetchTableOrders = async () => {
    setLoading(true);
    try {
      const allTables: TableResponse[] = await getOrders(); 
      const selectedTable = allTables.find(t => t.mesa === parseInt(tableNumber));
      
      if (selectedTable) {
        setSentOrders(selectedTable.sentOrders || []);
        setPendingOrders(selectedTable.orders || []);
        setTotal(selectedTable.totalGeneral || 0);
        setTransactionId(selectedTable.transactionId);
      } else {
        setSentOrders([]);
        setPendingOrders([]);
        setTotal(0);
        setTransactionId(null);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectionPending = (orderId: number) => {
    const newSelected = new Set(selectedPending);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedPending(newSelected);
  };

  const handleConfirm = async () => {
    if (selectedPending.size === 0) return; 

    const ordersIds = Array.from(selectedPending);
    try {
      setLoading(true);
      await sendOrders({ ordersIds }); 

      await fetchTableOrders();

      setSelectedPending(new Set());

 
      if (onConfirm) onConfirm();
      console.log("Órdenes confirmadas:", ordersIds);
    } catch (error) {
      console.error("Error al confirmar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnCamino = async () => {
    try {
      setLoading(true);
      await sendWaiter({ tableNumber: parseInt(tableNumber) }); 


      await fetchTableOrders();

      if (onWaiterAck) onWaiterAck();
    } catch (error) {
      console.error("Error al enviar mesero:", error);

    } finally {
      setLoading(false);
    }
  };

  const handleCloseAccount = async () => { 
  try {
    const tableNum = parseInt(tableNumber);
    
    if (isNaN(tableNum)) {
      console.error('Número de mesa inválido:', tableNumber);
      return;
    }

    const isClosed = await closeAccount(tableNum);
    console.log('isClosed:', isClosed); 

    await fetchTableOrders();

    if (isClosed) {
      console.log('Cuenta cerrada correctamente');
      onClose(); 
    } else {
      console.error('Hubo un problema al cerrar la cuenta');

    }
  } catch (error) {
    console.error('Excepción en handleCloseAccount:', error);

  }
};

  const handleCloseModal = () => {
  setIsOpen(false); 
};

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const datePart = date.toLocaleDateString("es-CO", { 
      day: "numeric", 
      month: "short", 
      year: "numeric" 
    });
    const timePart = date.toLocaleTimeString("es-CO", { 
      hour: "2-digit", 
      minute: "2-digit", 
      hour12: true 
    }).toLowerCase();
    return `${datePart}, ${timePart}`;
  };

  const pedidoNumber = transactionId ? `#${transactionId.toString().padStart(5, "0")}` : "#00000";

  if (!isOpen) return null;

  const hasPending = pendingOrders.length > 0;
  const hasNotificationTable = status === 3 && onWaiterAck;
  const hasNotificationPay = status === 5 && onWaiterAck;
  const selectedCountPending = selectedPending.size;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-end z-50">
      <div className="bg-white rounded-xl shadow-lg h-full w-[340px] flex flex-col overflow-hidden">

        <div className="p-3 border-b flex flex-col items-center">
          <div className="flex justify-between items-center w-full ">
            <button onClick={onClose} className="text-red-500 p-1">
              <ArrowLeft size={20} />
            </button>
            <div className="w-6" /> 
          </div>
          <h2 className="text-xl font-bold text-gray-900 ">Total</h2>
          <p className="text-3xl font-semibold text-gray-900 mb-2">
            {money(total)}
          </p>
          <div className="self-start text-xs">
            <h3 className="font-semibold text-gray-900">Mesa #{tableNumber}</h3>
            {transactionId && <h4 className="text-gray-500">Pedido {pedidoNumber}</h4>}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar">

          {sentOrders.length > 0 && (
            <div className="mb-2">
              <h3 className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-1">
                <Clock size={14} className="text-gray-500" />
                Órdenes Enviadas
              </h3>
              <div className="space-y-3 max-h-24 overflow-y-auto pr-1 custom-scrollbar-inner">
                {sentOrders.map((item, i) => (
                  <div key={i} className="text-xs">
                    <div className="flex justify-between items-start">
                      <span className="flex-1 truncate">
                        {item.name} <span className="text-gray-400">x{item.qty}</span>
                      </span>
                      <span className="font-medium ml-2">{money(item.totalPrice)}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5 text-left">
                      {formatDate(item.date)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {hasPending && (
            <div className="self-start flex items-center gap-3 mb-4">
              <div className="bg-red-500 rounded-full p-1.5 flex items-center justify-center">
                <Plus size={15} className="text-white" />
                <Utensils size={15} className="text-white" />
              </div>
              <span className="text-xs font-medium text-black">Adicionales</span>
            </div>
          )}

          {hasPending && (
            <div className="mb-3">
              <div className="space-y-3 max-h-24 overflow-y-auto pr-1 custom-scrollbar-inner">
                {pendingOrders.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={selectedPending.has(item.orderId)}
                      onChange={() => toggleSelectionPending(item.orderId)}
                      className="h-3 w-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="truncate">
                          {item.name} <span className="text-gray-400">x{item.qty}</span>
                        </span>
                        <span className="font-medium">{money(item.totalPrice)}</span>
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5 text-left">
                        {formatDate(item.date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleConfirm}
                disabled={loading || selectedCountPending === 0}
                className={`w-full font-semibold py-1.5 text-sm rounded-full transition-colors mt-1 ${selectedCountPending === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
              >
                Confirmado{selectedCountPending > 0 ? ` (${selectedCountPending})` : ''}
              </button>
            </div>
          )}

          {hasNotificationTable && (
            <div className="mb-3 p-2 bg-white rounded-xl shadow-sm ring-1 ring-gray-200">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 grid place-items-center shrink-0 bg-green-100 rounded-full">
                  <img src={mesero} alt="Mesero" className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-xs leading-tight">Llamando mesero</div>
                  <div className="text-[10px] text-gray-500 leading-tight">
                    La mesa Nº {tableNumber} está solicitando un mesero
                  </div>
                </div>
              </div>
              <button
                onClick={handleEnCamino}
                disabled={loading}
                className="mt-2 w-full bg-orange-500 text-white font-semibold py-1.5 text-sm rounded-full hover:bg-orange-600 transition-colors disabled:opacity-60"
              >
                En camino
              </button>
            </div>
          )}

        {hasNotificationPay && (
            <div className="mb-3 p-2 bg-white rounded-xl shadow-sm ring-1 ring-gray-200">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 grid place-items-center shrink-0 bg-green-100 rounded-full">
                  <img src={pagar_cuenta} alt="Mesero" className="w-9 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-xs leading-tight">Piendo cuenta</div>
                  <div className="text-[10px] text-gray-500 leading-tight">
                    La mesa Nº {tableNumber} está solicitando la cuenta
                  </div>
                </div>
              </div>
              <button
                onClick={handleEnCamino}
                disabled={loading}
                className="mt-2 w-full bg-orange-500 text-white font-semibold py-1.5 text-sm rounded-full hover:bg-orange-600 transition-colors disabled:opacity-60"
              >
                En camino
              </button>
            </div>
          )}
        </div>


        <div className="border-t p-3 bg-gray-50">
          <p className="text-sm font-semibold text-gray-900 mb-2">Resumen</p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Subtotal</span>
            <span className="text-base font-semibold text-gray-900">{money(total)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCloseAccount}
              className="rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 text-sm shadow transition-colors"
            >
              Cerrar cuenta
            </button>
            <button
              onClick={onClose}
              className="rounded-full border-2 border-gray-900 text-gray-900 font-semibold py-2 text-sm bg-white hover:bg-gray-100 transition-colors"
            >
              Cancelar cuenta
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 1.5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 1.5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .custom-scrollbar-inner::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar-inner::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar-inner::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 1px;
        }
      `}</style>
    </div>
  );
};