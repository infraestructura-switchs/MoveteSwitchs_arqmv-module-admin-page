import { useEffect, useState } from "react";
import { Clock, Trash, Bell } from "lucide-react";
//import { Mesa as MesaType } from "../types/restaurant";
import { obtenerTextoEstado } from "../utils/mesaUtils";
import {closeAccount} from "../Api/DomicileApi";
import {
  GroupedOrder,
  OrderHistoryResponse,
  OrderItem,
  TableOrderWithId,
} from "../types/TableType";
import Modal from "./Modal";

interface MesaProps {
  mesa: TableOrderWithId;
  onCerrarCuenta: (mesaId: number) => void;
  onVerHistorial: (mesaId: number) => void;
  onCambiarEstado: (tableId: number, statusMesa: number) => Promise<void>;
  onEliminarMesa: (tableId: number) => Promise<void>;
  onWaiterCall: (tableId: number, tableNumber: number) => Promise<void>;
  onSendOrder: (orderId: number) => Promise<void>;
  onGetOrdersHistory: (tableNumber: number) => Promise<OrderHistoryResponse[]>;
  onCloseAccount: (tableNumber: number) => Promise<void>;
}

export default function Mesa({
  mesa,
  onCerrarCuenta,
  onVerHistorial,
  onCambiarEstado,
  onEliminarMesa,
  onWaiterCall,
  onSendOrder,
  onGetOrdersHistory,
  onCloseAccount,
}: MesaProps) {
  const { texto: estadoTexto } = obtenerTextoEstado(mesa.statusMesa);
  const [mostrandoHistorial, setMostrandoHistorial] = useState(false);
  const [llamadaMeseroAtendida, setLlamadaMeseroAtendida] = useState(false);
  const [message, setMessage] = useState({
    text: "Mesa sin solicitudes.",
    color: "text-gray-600",
  });
  //const [orders, setOrders] = useState<OrderItem[]>(mesa.orders || []);
  const [groupedOrders, setGroupedOrders] = useState<GroupedOrder[]>([]);
  const [groupedOrdersHistory, setGroupedOrdersHistory] = useState<
    GroupedOrder[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCloseAccount, setCloseAcccount] = useState(false);

  useEffect(() => {
    if (mesa.statusMesa !== 3) setLlamadaMeseroAtendida(true);
  }, [mesa.statusMesa]);

  useEffect(() => {
    console.log(mesa);
    getOrdersHistory(mesa.mesa);
  }, [groupedOrders]);

  useEffect(() => {
    if (mesa?.orders && mesa.orders.length > 0) {
      const grouped = groupOrdersByOrderId(mesa.orders);
      setGroupedOrders(grouped);
    }
  }, [mesa?.orders]);
  
  const estadoInfo = {
    1: { texto: "Disponible", color: "bg-green-200" },
    2: { texto: "Ocupada", color: "bg-red-200" },
    3: { texto: "Solicitando Atención", color: "bg-blue-200" },
    4: { texto: "Reservada", color: "bg-yellow-200" },
  };

  const currentStatus = estadoInfo[
    mesa.statusMesa as keyof typeof estadoInfo
  ] || {
    texto: "Desconocido",
    color: "bg-gray-500",
  };

  const handleChangeStatus = async (nuevoEstado: number) => {
    setMessage({ text: "Procesando solicitud...", color: "text-blue-600" });

    try {
      await onCambiarEstado(mesa.mesa, nuevoEstado);
      setMessage({
        text: "La solicitud ha sido atendida.",
        color: "text-green-600",
      });
      setLlamadaMeseroAtendida(true); 
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
      setMessage({
        text: "No se pudo atender la solicitud.",
        color: "text-red-600",
      });
      setTimeout(() => {
        setLlamadaMeseroAtendida(false);
      }, 5000);
    }

    // Resetear mensaje después de 2 segundos
    setTimeout(() => {
      setMessage({ text: "Mesa sin solicitudes.", color: "text-gray-600" });
      // Opcional: reiniciar llamada mesero solo si quieres permitir nuevas solicitudes
      // setLlamadaMeseroAtendida(false);
    }, 5000);
  };

  const handleEliminarMesa = async () => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar la Mesa ${mesa.mesa}?`
      )
    ) {
      await onEliminarMesa(mesa.tableId);
    }
  };

  const waiterCall = async (tableId: number, tableNumber: number) => {
    // Iniciar estado de carga
    setMessage({ text: "Procesando solicitud...", color: "text-blue-600" });
    //setLlamadaMeseroAtendida(false); // Reiniciar estado visual mientras procesa

    // const nuevoEstado = mesa.statusMesa === 1 ? 2 : 1; // Alternar entre libre y ocupada

    try {
      await onWaiterCall(tableId, tableNumber);

      // Éxito
      setMessage({
        text: "La solicitud ha sido atendida.",
        color: "text-green-600",
      });
      setLlamadaMeseroAtendida(true); // Indicar que fue atendida
      mesa.statusMesa = 2;
    } catch (error) {
      // Error
      console.error("Error al cambiar el estado:", error);
      setMessage({
        text: "No se pudo atender la solicitud.",
        color: "text-red-600",
      });
      setTimeout(() => {
        setLlamadaMeseroAtendida(false); // No se atendió por error
      }, 5000);
    }

    // Resetear mensaje después de 2 segundos
    setTimeout(() => {
      setMessage({ text: "Mesa sin solicitudes.", color: "text-gray-600" });
      // Opcional: reiniciar llamada mesero solo si quieres permitir nuevas solicitudes
      // setLlamadaMeseroAtendida(false);
    }, 5000);
  };

  const groupOrdersByOrderId = (orders: OrderItem[]): GroupedOrder[] => {
    const groupedMap = new Map<number, OrderItem[]>();

    for (const order of orders) {
      if (!groupedMap.has(order.orderId)) {
        groupedMap.set(order.orderId, []);
      }
      groupedMap.get(order.orderId)?.push(order);
    }

    return Array.from(groupedMap.entries()).map(([orderId, items]) => ({
      orderId,
      items,
    }));
  };

  const sendOrder = async (orderId: number) => {
    try {
      const data = await onSendOrder(orderId);
      console.log("Pedido enviado:", data);

      // Aquí puedes actualizar el estado local para eliminar el pedido
      setGroupedOrders((prev) =>
        prev.filter((order) => order.orderId !== orderId)
      );
    } catch (error) {
      console.error("Error al enviar el pedido:", error);
      alert("Hubo un problema al enviar el pedido.");
    }
  };

  const getOrdersHistory = async (tableNumber: number) => {
    try {
      const data = await onGetOrdersHistory(tableNumber);
      if (data.length < 1) {
        return;
      }
      // console.log(data[0]);
      const orders = data[0]?.orders;
      const groupedOrdersHistory = groupOrdersByOrderId(orders);
      setGroupedOrdersHistory(groupedOrdersHistory);
    } catch (error) {
      console.error("Error: ", error);
      setGroupedOrdersHistory([]);
    }
  };

const closeAccount = async (tableNumber: number) => {
  if (mesa.statusMesa === 1 || mesa.statusMesa === 4) {
    return;
  }
  try {
    await onCloseAccount(tableNumber);
    setCloseAcccount(true); 
    setTimeout(() => {
      setCloseAcccount(false);
    }, 2000);
  } catch (error) {
    console.error('Error al cerrar la cuenta', error);
  }
};


const handleCloseAccount = async (tableNumber: number) => {
  try {
    await closeAccount(tableNumber); 
    console.log("Cuenta cerrada correctamente");
  } catch (error) {
    console.error("Error al cerrar cuenta", error);
  }
};



  return (
    <div
      className={`
    bg-white rounded-lg shadow-lg border-2 overflow-hidden hover:shadow-xl transition-all duration-300
    border-red-400 relative
  `}
    >
      {/* Header de la mesa */}
      <div className="bg-red-600 text-white p-4 flex justify-between items-center">
        <h3 className="font-bold text-lg">Mesa {mesa.mesa}</h3>
        {mesa.totalGeneral > 0 ? (
          <p>
            $<span>{mesa.totalGeneral}</span>
          </p>
        ) : null}
        <button
          onClick={handleEliminarMesa}
          className="ml-2 bg-red-700 text-white p-2 rounded-md text-sm hover:bg-red-800 transition-colors duration-200"
          aria-label="Eliminar mesa"
        >
          <Trash size={20} />
        </button>
      </div>

      {/* Botón Cerrar Cuenta */}
      <div className="px-4 py-2 bg-red-50">
        <button
          onClick={() => handleCloseAccount(mesa.mesa)}
          className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors duration-200 font-medium"
        >
          Cerrar Cuenta
      </button>

      </div>

      {/* Contenido principal */}
      <div className="p-4">
        <div className="space-y-3">
          {/* Estado de la mesa */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} />
            <span>{estadoTexto}</span>
          </div>

          {/* Estado visual */}
          <div
            className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${currentStatus.color}`}
          >
            <div
              className={`w-2 h-2 rounded-full mr-2 ${currentStatus.color}`}
            ></div>
            {currentStatus.texto}
          </div>

          {/* Pedidos realizados */}
          <div className="max-h-[150px] overflow-scroll flex flex-col gap-2 pr-3">
            {groupedOrders.length > 0 ? (
              groupedOrders.map((group) => (
                <div className="flex items-center gap-2">
                  <div
                    key={group.orderId}
                    className="border border-gray-300 p-3 rounded"
                  >
                    <h3 className="font-bold mb-2">Pedido #{group.orderId}</h3>
                    <ul className="space-y-2">
                      {group.items.map((item, index) => (
                        <li key={index} className="flex justify-between">
                          <span>
                            {item.qty}x {item.name}
                          </span>
                          <span>${item.totalPrice.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    <hr className="my-2" />
                    <p className="text-right font-semibold">
                      Total: $
                      {group.items
                        .reduce((sum, item) => sum + item.totalPrice, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 cursor-pointer"
                    title="Marcar como enviado"
                    onChange={() => sendOrder(group.orderId)}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500">No hay pedidos aún.</p>
            )}
          </div>

          {/* Botón para ver historial */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => {
                setMostrandoHistorial(!mostrandoHistorial);
                onVerHistorial(mesa.tableId); // Llama a la función para cargar el historial
                setIsModalOpen(true);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors duration-200 flex items-center gap-1 font-medium"
            >
              Historial
            </button>
          </div>

          {/* Sección para llamar al mesero */}
          <div className="flex flex-col gap-2 pt-4 relative">
            {!llamadaMeseroAtendida ? (
              <>
                <div className="text-sm text-gray-600">
                  La mesa {mesa.mesa} está solicitando atención.
                </div>
                <button
                  onClick={() => {
                    waiterCall(mesa.tableId, mesa.mesa);
                    setLlamadaMeseroAtendida(true);
                  }}
                  className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors duration-200 font-medium"
                >
                  Enviar Mesero
                </button>
                <div className="absolute top-0 right-0 mt-2 mr-2 animate-pulse">
                  <Bell size={30} className="text-yellow-600" />
                </div>
              </>
            ) : (
              <div className={`text-sm ${message.color} font-medium`}>
                {message.text}
              </div>
            )}
          </div>
        </div>
      </div>

      {isCloseAccount === true ? (
        <div className="w-full h-full z-50 absolute top-0 bg-white flex items-center justify-center"><p className="font-bold text-xl">Cuenta cerrada</p></div>
      ) : null}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="max-h-[450px] overflow-scroll flex flex-col gap-2 pr-3">
          <h2 className="font-bold text-xl">
            Historial de pedidos (entregados)
          </h2>
          {groupedOrdersHistory.length > 0 ? (
            groupedOrdersHistory.map((group) => (
              <div className="flex flex-col gap-3">
                <div
                  key={group.orderId}
                  className="border-[2px] border-green-500 p-3 rounded-md"
                >
                  <h3 className="font-bold mb-2 text-green-600">
                    Pedido #{group.orderId}
                  </h3>
                  <ul className="space-y-2">
                    {group.items.map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <span>
                          {item.qty}x {item.name}
                        </span>
                        <span>${item.totalPrice.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <hr className="my-2" />
                  <p className="text-right font-semibold">
                    Total: $
                    {group.items
                      .reduce((sum, item) => sum + item.totalPrice, 0)
                      .toFixed(2)}
                  </p>
                </div>
                {/* <input
                    type="checkbox"
                    className="w-4 h-4 cursor-pointer"
                    title="Marcar como enviado"
                    onChange={() => sendOrder(group.orderId)}
                  /> */}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No hay pedidos aún.</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
