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
        console.log(`La cuenta de la mesa ${tableNumber} ha sido cancelada correctamente.`);
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
      const updatedRows = allTables.filter(t => t.mesa); 
      console.log("Órdenes actualizadas", updatedRows);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-8 md:px-0 py-3">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-whire-100">
            <tr>
              <th className="w-10 px-4 py-3 text-center border-b border-r border-gray-300">
                <input type="checkbox" className="h-4 w-4 rounded" />
              </th>
              <th className="px-4 py-3 text-center border-b border-r border-gray-300">
                <div className="flex items-center justify-center gap-1">
                  Mesa
                  <ListFilter size={16} />
                </div>
              </th>
              <th className="px-4 py-3 text-center border-b border-r border-gray-300">
                <div className="flex items-center justify-center gap-1">
                  Productos
                  <ListFilter size={16} />
                </div>
              </th>
              <th className="px-4 py-3 text-center border-b border-r border-gray-300">
                <div className="flex items-center justify-center gap-1">
                  Estado Mesa
                  <ListFilter size={16} />
                </div>
              </th>
              <th className="px-4 py-3 text-center border-b border-r border-gray-300">
                <div className="flex items-center justify-center gap-1">
                  Valor actual
                  <ListFilter size={16} />
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
