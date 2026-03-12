import { Eye, ReceiptText, XCircle, ListFilter } from "lucide-react";
import { closeAccount } from "../../Api/TransactionTable";
import { getOrders } from "../../Api/OrderTableApi";
import { useState } from "react";

export type OrderRow = {
  id: string;
  tableNumber: string;
  products: number;
  statusName: string;
  status: number;
  statusClass: string;
  total: number;
};

const mesero = "/assets/img/mesero.png";
const pagar_cuenta = "/assets/img/pagar_cuenta.png";
const money = (n: number) =>
  n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export default function OrdersListView({
  rows,
  onOpenTable,
}: {
  rows: OrderRow[];
  onOpenTable: (tableNumber: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async (tableNumber: string) => {
    try {
      setLoading(true);
      const isClosed = await closeAccount(parseInt(tableNumber));
      if (isClosed) {
        await fetchTableOrders();
      } else {
        console.error("Hubo un problema al cancelar la cuenta.");
      }
    } catch (error) {
      console.error("Error al cancelar la cuenta:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTableOrders = async () => {
    setLoading(true);
    try {
      const allTables = await getOrders();
      const updatedRows = allTables.filter((t: any) => t.mesa);
      console.log("Órdenes actualizadas", updatedRows);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-2 sm:px-4 md:px-3 lg:px-4 py-3">

      <div className="block md:hidden space-y-3">
        {rows.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm px-4 py-10 text-center text-gray-500">
            No hay pedidos disponibles
          </div>
        ) : (
          rows.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                  <span className="font-bold text-gray-800 text-base">
                    Mesa {r.tableNumber.padStart(2, "0")}
                  </span>
                  {r.status === 3 && (
                    <img src={mesero} alt="Mesero" className="w-7 h-7" />
                  )}
                  {r.status === 5 && (
                    <img src={pagar_cuenta} alt="Pagar cuenta" className="w-7 h-7" />
                  )}
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${r.statusClass}`}
                  style={{
                    backgroundColor:
                      r.statusClass === "bg-green-500"
                        ? "#48bb78"
                        : r.statusClass === "bg-gray-500"
                        ? "#a0aec0"
                        : "",
                  }}
                >
                  {r.statusName}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  <span className="font-medium text-gray-700">Productos: </span>
                  {r.products}
                </span>
                <span>
                  <span className="font-medium text-gray-700">Total: </span>
                  {r.total > 0 ? money(r.total) : "$ 0"}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-100">
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition"
                  title="Ver"
                  onClick={() => onOpenTable(r.tableNumber)}
                >
                  <Eye size={15} /> Ver
                </button>
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition"
                  title="Cuenta"
                >
                  <ReceiptText size={15} /> Cuenta
                </button>
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
                  title="Cancelar"
                  onClick={() => handleCancel(r.tableNumber)}
                >
                  <XCircle size={15} /> Cancelar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white-100">
            <tr>
              <th className="w-10 px-4 py-3 text-center border-b border-r border-gray-300">
                <input type="checkbox" className="h-4 w-4 rounded" />
              </th>
              <th className="px-4 py-3 text-center border-b border-r border-gray-300">
                <div className="flex items-center justify-center gap-1">
                  Mesa <ListFilter size={16} />
                </div>
              </th>
              <th className="px-4 py-3 text-center border-b border-r border-gray-300">
                <div className="flex items-center justify-center gap-1">
                  Productos <ListFilter size={16} />
                </div>
              </th>
              <th className="px-4 py-3 text-center border-b border-r border-gray-300">
                <div className="flex items-center justify-center gap-1">
                  Estado Mesa <ListFilter size={16} />
                </div>
              </th>
              <th className="px-4 py-3 text-center border-b border-r border-gray-300">
                <div className="flex items-center justify-center gap-1">
                  Valor actual <ListFilter size={16} />
                </div>
              </th>
              <th className="px-4 py-3 text-center border-b border-gray-300">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-center">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                </td>
                <td className="px-4 py-3 text-center font-medium text-gray-800 relative">
                  {r.tableNumber.padStart(2, "0")}
                  {r.status === 3 && (
                    <img
                      src={mesero}
                      alt="Mesero"
                      className="w-9 h-9 absolute top-1/2 right-4 -translate-y-1/2"
                    />
                  )}
                  {r.status === 5 && (
                    <img
                      src={pagar_cuenta}
                      alt="Pagar cuenta"
                      className="w-9 h-9 absolute top-1/2 right-4 -translate-y-1/2"
                    />
                  )}
                </td>
                <td className="px-4 py-3 text-center">{r.products}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${r.statusClass}`}
                    style={{
                      backgroundColor:
                        r.statusClass === "bg-green-500"
                          ? "#48bb78"
                          : r.statusClass === "bg-gray-500"
                          ? "#a0aec0"
                          : "",
                    }}
                  >
                    {r.statusName}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {r.total > 0 ? money(r.total) : "$ 0"}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-3 text-gray-600">
                    <button
                      className="p-2 hover:text-pink-600"
                      title="Ver"
                      onClick={() => onOpenTable(r.tableNumber)}
                    >
                      <Eye size={18} />
                    </button>
                    <button className="p-2 hover:text-pink-600" title="Cuenta">
                      <ReceiptText size={18} />
                    </button>
                    <button
                      className="p-2 hover:text-red-600"
                      title="Cancelar"
                      onClick={() => handleCancel(r.tableNumber)}
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
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