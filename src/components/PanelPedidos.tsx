import React, { useState, useEffect } from "react";
import { Clock, MapPin, Truck, Store, Package, Trash2 } from "lucide-react";
import { getOrders, deleteOrder, updateOrderStatus } from "../Api/DomicileApi";
import { Pedido } from "../types/restaurant";

// Funciones utilitarias
const formatearTiempo = (timestamp: string) => {
  const fecha = new Date(timestamp);
  return fecha.toLocaleString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });
};

const formatearPrecio = (precio: number) => {
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(precio);
};

function PanelPedidos() {
  const [pedidosState, setPedidosState] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar los pedidos
  const cargarPedidos = async (mostrarLoading = false) => {
    try {
      if (mostrarLoading) setLoading(true);
      const pedidos = await getOrders();
      setPedidosState(pedidos);
      setError(null);
    } catch (err) {
      console.error("Error al cargar pedidos:", err);
      setError("Error al cargar los pedidos");
      setPedidosState([]);
    } finally {
      if (mostrarLoading) setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos(true);
  }, []);

  useEffect(() => {
    cargarPedidos();
  }, []);

  const pedidosActivos = pedidosState.filter(
    (p) => p.statusOrder !== "ENTREGADO" && p.status === "ACTIVE"
  );

  const cambiarEstadoPedido = async (orderTransactionDeliveryId: number) => {
    // Busca el pedido actual
    const pedido = pedidosState.find(
      (p) => p.orderTransactionDeliveryId === orderTransactionDeliveryId
    );
    if (!pedido) return;

    // Determina el nuevo estado
    let nuevoEstado: Pedido["statusOrder"];
    if (pedido.statusOrder === "PENDIENTE") {
      nuevoEstado = "PREPARANDO";
    } else if (pedido.statusOrder === "PREPARANDO") {
      nuevoEstado = "LISTO";
    } else if (pedido.statusOrder === "LISTO") {
      nuevoEstado = "ENTREGADO";
    } else {
      nuevoEstado = "PENDIENTE";
    }

    // Actualiza el estado en el backend
    const actualizado = await updateOrderStatus(
      orderTransactionDeliveryId,
      nuevoEstado
    );

    if (actualizado) {
      if (nuevoEstado === "ENTREGADO") {
        // Si es entregado, elimina el pedido
        await eliminarPedido(orderTransactionDeliveryId);
      } else {
        // Si no, actualiza el estado localmente
        setPedidosState((prevPedidos) =>
          prevPedidos.map((p) =>
            p.orderTransactionDeliveryId === orderTransactionDeliveryId
              ? { ...p, statusOrder: nuevoEstado }
              : p
          )
        );
      }
    } else {
      alert("No se pudo actualizar el estado del pedido.");
    }
  };

  const eliminarPedido = async (orderTransactionDeliveryId: number) => {
    const eliminado = await deleteOrder(orderTransactionDeliveryId);
    if (eliminado) {
      setPedidosState((prevPedidos) =>
        prevPedidos.filter(
          (pedido) =>
            pedido.orderTransactionDeliveryId !== orderTransactionDeliveryId
        )
      );
    } else {
      alert("No se pudo eliminar el pedido.");
    }
  };



  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Cargando pedidos...
          </h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <Package size={64} className="mx-auto text-red-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">{error}</h3>
          <button
            onClick={() => cargarPedidos(true)}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (pedidosActivos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No hay pedidos activos
          </h3>
          <p className="text-gray-500">
            Los pedidos aparecerán aquí cuando se reciban
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      {pedidosActivos.map((pedido) => (
        <div
          key={pedido.orderTransactionDeliveryId}
          className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden min-w-[350px]"
        >
          {/* Header del pedido - Número de Cliente */}
          <div className="bg-red-600 text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-xl">{pedido.nameClient}</h3>
              <p className="text-sm">{pedido.phone}</p>
            </div>
            <div className="flex gap-2">
              <div className="text-xl font-bold">
                {formatearPrecio(pedido.total)}
              </div>
              <button
                onClick={() =>
                  eliminarPedido(pedido.orderTransactionDeliveryId)
                }
                className="ml-2 text-white p-2 rounded-md text-sm hover:bg-red-800 transition-colors duration-200"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          {/* Información del cliente */}
          <div className="px-4 py-2 bg-gray-50 border-b">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="font-semibold">Teléfono:</p>
                <p>{pedido.phoneClient}</p>
              </div>
              <div>
                <p className="font-semibold">Identificación:</p>
                <p>
                  {pedido.typeIdentificationName}:{" "}
                  {pedido.numerIdentification || "N/A"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="font-semibold">Email:</p>
                <p>{pedido.mail || "No especificado"}</p>
              </div>
              <div className="col-span-2">
                <p className="font-semibold">Método de pago:</p>
                <p>{pedido.paymentName}</p>
              </div>
            </div>
          </div>

          {/* Contenido del pedido */}
          <div className="p-4">
            {/* Timestamp */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Clock size={16} />
              <span className="font-medium">Pedido recibido</span>
            </div>

            {/* Lista de productos */}
            <p className="font-semibold">Lista de Productos:</p>
            <div className="space-y-2 mb-4">
              {pedido.products.map((producto) => (
                <div
                  key={producto.productId}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="font-medium">
                    {producto.qty} x {producto.productName}
                  </span>
                  <span className="font-bold">
                    {formatearPrecio(producto.unitePrice * producto.qty)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t pt-3 mb-4">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total: {formatearPrecio(pedido.total)}</span>
              </div>
            </div>

            {/* Información de entrega */}
            <div className="space-y-4">
              {/* Opciones de entrega */}
              <div className="flex gap-4">
                {/* Recibir a domicilio */}
                <div
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                    pedido.method === "domicilio"
                      ? "border-blue-500 bg-blue-50 text-blue-800"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Truck size={20} />
                    <span className="font-medium">Recibir a domicilio</span>
                  </div>
                </div>

                {/* Pasa a recogerlo */}
                <div
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                    pedido.method === "recoger"
                      ? "border-green-500 bg-green-50 text-green-800"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Store size={20} />
                    <span className="font-medium">Pasa a recogerlo</span>
                  </div>
                </div>
              </div>

              {/* Campo de dirección */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <div className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-700 min-h-[40px] flex items-center">
                    {pedido.address || "No especificada"}
                  </div>
                </div>
              </div>

              {/* Botón Cambiar Estado */}
              <div className="px-4 py-2 bg-red-50">
                <button
                  onClick={() =>
                    cambiarEstadoPedido(pedido.orderTransactionDeliveryId)
                  }
                  className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors duration-200 font-medium"
                >
                  {pedido.statusOrder === "PENDIENTE"
                    ? "Comenzar preparación"
                    : pedido.statusOrder === "PREPARANDO"
                    ? "Marcar como listo"
                    : pedido.statusOrder === "LISTO"
                    ? "Marcar como entregado"
                    : "Pedido completado"}
                </button>
              </div>

              {/* Estado del pedido */}
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm font-medium text-gray-600">
                  Estado del pedido:
                </span>
                <span
                  className={`text-sm px-3 py-1 rounded-full font-medium ${
                    pedido.statusOrder === "ENTREGADO"
                      ? "bg-green-100 text-green-800"
                      : pedido.statusOrder === "LISTO"
                      ? "bg-blue-100 text-blue-800"
                      : pedido.statusOrder === "PREPARANDO"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {pedido.statusOrder}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Componente principal
export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-red-800 mb-8 text-center"></h1>
        <PanelPedidos />
      </div>
    </div>
  );
}
