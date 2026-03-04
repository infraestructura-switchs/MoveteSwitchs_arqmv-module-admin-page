export interface Table {
  tableId: number;
  tableNumber: number;
  status: number;
}

export type TableProps = {
  id?: string;
  number: string;
  status: number;
  timeOccupied?: string;
  currentBill?: number;
  orders?: number;
  statusLabel?: string;
  statusBorder?: string;
  statusText?: string;
};


export interface TableResponse {
  mesa: number;          // Número de la mesa (ej: 1, 2, 3)
  statusMesa: number;    // Estado de la mesa (ej: 1 = libre?, 2 = ocupada?)
  orders: OrderItem[];   // Órdenes actuales/pendientes
  sentOrders: OrderItem[]; // Órdenes enviadas
  totalGeneral: number;  // Total general de la mesa (en pesos, float)
  transactionId: number | null; // ID de transacción (puede ser null si no hay)
}

export interface OrderItem {
  orderId: number;       // ID de la orden
  productId: string;     // ID del producto (como string)
  name: string;          // Nombre del producto (ej: "COMBO DIA DEL NIÑO")
  qty: number;           // Cantidad
  unitePrice: number;    // Precio unitario (float, nota: parece un typo por "unitPrice")
  totalPrice: number;    // Precio total (qty * unitePrice, float)
  date: string;          // Fecha y hora en formato string (ej: "2025-09-17 08:43:49.1662")
}

export interface SendOrdersRequest {
  ordersIds: number[]; 
}


export interface sendWaiterRequest {
  tableNumber: number; 
  companyId: number;


}

