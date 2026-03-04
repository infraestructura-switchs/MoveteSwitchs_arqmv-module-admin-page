import { useMemo, useState, useEffect } from "react"; 
import { Plus, List } from "lucide-react";
import { Header, ActionButton } from "../layout/Header";
import { Table } from "./TableLayout";
import { useApi } from "../../hooks/useApi";
import { createTable } from "../../Api/TableApi";
import { getOrders as getTable  } from "../../Api/OrderTableApi";
import { statusMap, statusColors } from "../../utils/mesaUtils";
import {obtenerToken} from "../../Api/Token"; 
import { getCompanyIdAsNumber } from "../../utils/auth";
import { OrderTable } from "./OrderTable";
import OrdersListView, { OrderRow } from "./OrderList";
import { initializeApp } from 'firebase/app';
import {  onMessage } from 'firebase/messaging';
import { messaging,firebaseConfig } from '../../firebase'; 

export function TableComponents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showOrders, setShowOrders] = useState(false);
  const [isNewTableModalOpen, setIsNewTableModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState("");
  const [creating, setCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [token, setToken] = useState<string | null>(null);
  

  const app = initializeApp(firebaseConfig);

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

const { data: tables, loading, refetch } = useApi(async () => {
  const apiTables = await getTable(token);
  return apiTables.map((t) => ({
    number: String(t.mesa),
    status: t.statusMesa as number,
    statusLabel: statusMap[t.statusMesa]?.label ?? "Desconocido",
    currentBill: t.totalGeneral,                                       
    products: (t.orders?.length ?? 0) + (t.sentOrders?.length ?? 0),  
  }));
});

  useEffect(() => {
    const handleMessage = (payload) => {
      console.log('¡Notificación recibida en foreground!', payload); 
       alert(payload.notification.title);
      refetch(); 
    };

    onMessage(messaging, handleMessage);

  }, [refetch]); 

const handleCloseModal = () => {
  setIsOrderModalOpen(false); // Usa setIsOrderModalOpen en lugar de setIsOpen
};

  const handleOpenNewTableModal = () => {
    setIsNewTableModalOpen(true);
    setNewTableNumber("");
    setErrorMessage("");
  };
  const handleCloseNewTableModal = () => { if (!creating) setIsNewTableModalOpen(false); };

  const handleOpenOrderModal = (tableNumber: string) => {
    const items = [
      { name: "Hamburguesa Clásica", quantity: 1, price: 44990 },
      { name: "Papas Fritas", quantity: 2, price: 15000 },
    ];
    const total = items.reduce((s, it) => s + it.price * it.quantity, 0);
    setSelectedTable(tableNumber);
    setOrderItems(items);
    setTotal(total);
    setIsOrderModalOpen(true);
  };
  const handleCloseOrderModal = () => setIsOrderModalOpen(false);

  const handleCreateTable = async () => {
    const num = parseInt(newTableNumber, 10);
    if (Number.isNaN(num) || num <= 0) {
      alert("Ingresa un número de mesa válido."); return;
    }
    try {
      setCreating(true);
      await createTable(num);
      await refetch();
      setIsNewTableModalOpen(false);
      setNewTableNumber("");
      setErrorMessage("");
    } catch (e: any) {
      console.error(e);
      setErrorMessage(e.message || "Ocurrió un error al crear la mesa.");
    } finally {
      setCreating(false);
    }
  };

  const ordersRows: OrderRow[] = useMemo(() => {
    return (tables ?? []).map((t: any) => {
      const key = String(t.statusLabel) as keyof typeof statusColors;
      return {
      id: t.id,
      tableNumber: t.number,
      products: t.products ?? 0,  
      status: t.status,
      statusName: t.statusLabel,
      statusClass: statusColors[key],
      total: t.currentBill ?? 0,  
      };
    });
  }, [tables]);

  const filteredTables = (tables ?? []).filter((t: any) =>
    t.number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const headerActions = (
    <div className="flex gap-3">
      {showOrders ? (
        <>
          <ActionButton variant="secondary" onClick={() => setShowOrders(false)}>
            <span>Ver mesas</span>
          </ActionButton>
          <ActionButton onClick={handleOpenNewTableModal}>
            <Plus size={20} />
            <span>Crear nueva mesa</span>
          </ActionButton>
        </>
      ) : (
        <>
          <ActionButton variant="secondary" onClick={() => setShowOrders(true)}>
            <List size={20} />
            <span>Lista de pedidos</span>
          </ActionButton>
          <ActionButton onClick={handleOpenNewTableModal}>
            <Plus size={20} />
            <span>Crear nueva mesa</span>
          </ActionButton>
        </>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="bg-gray-200 min-h-screen">
        <Header title={showOrders ? "Pedidos Mesas" : "Mesas"} subtitle="" rightActions={headerActions} />
        <div className="p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-12 gap-y-12">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-44 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 min-h-screen">
      <Header
        title={showOrders ? "Pedidos Mesas" : "Mesas"}
        subtitle={showOrders ? `Mesas (${ordersRows.length})` : `Mesas (${filteredTables.length})`}
        onSearch={setSearchQuery}
        rightActions={headerActions}
      />

      {showOrders ? (
        <OrdersListView
          rows={ordersRows.filter((r) =>
            r.tableNumber.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          onOpenTable={(mesa) => handleOpenOrderModal(mesa)}
        />
      ) : (
        <div className="px-6 md:px-10 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-12 gap-y-12 pb-8 overflow-visible">
            {filteredTables.map((table: any) => (
              <Table key={table.id} table={table} onClick={() => handleOpenOrderModal(table.number)} />
            ))}
            <button
              onClick={handleOpenNewTableModal}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:border-pink-300 hover:bg-pink-50 transition-colors group"
            >
              <div className="text-center">
                <div className="w-7 h-[1px] mx-auto bg-gray-100 group-hover:bg-pink-100 rounded-xl flex items-center justify-center mb-3 transition-colors">
                  <Plus className="text-gray-400 group-hover:text-pink-500 transition-colors" size={24} />
                </div>
                <span className="text-gray-600 group-hover:text-pink-600 font-medium transition-colors">
                  Nueva Mesa
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {isOrderModalOpen && selectedTable && (
        <OrderTable
          isOpen={isOrderModalOpen}
          tableNumber={selectedTable!}
          items={orderItems}
          total={total}
          onClose={handleCloseModal}
          status={(tables ?? []).find(t => t.number === selectedTable)?.status} 
          onWaiterAck={() => {
            console.log("Mesero en camino a mesa", selectedTable);
          }}
          onAccountClosed={() => refetch()}
        />
      )}

      {isNewTableModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-center">Agregar Nueva Mesa</h2>
            <input
              type="text"
              placeholder="Número de Mesa"
              value={newTableNumber}
              onChange={(e) => setNewTableNumber(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreateTable(); }}
              className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:border-green-500"
            />
            {errorMessage && (
              <div className="bg-red-100 text-red-700 p-2 rounded-lg mb-4 shadow-md flex items-center border border-red-300">
                <span className="mr-2">⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleCreateTable}
                disabled={creating}
                className="bg-green-500 text-white px-4 py-2 rounded-md w-full hover:bg-green-600 disabled:opacity-60 text-sm"
              >
                {creating ? "CREANDO..." : "AGREGAR"}
              </button>
              <button
                onClick={handleCloseNewTableModal}
                disabled={creating}
                className="bg-red-500 text-white px-4 py-2 rounded-md w-full hover:bg-red-600 disabled:opacity-60 text-sm"
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}