export interface Mesa {
  tableId: number;
  tableNumber: number;
  status: number; // 1: Disponible, 2: Ocupada, 3: Reservada
  
}

export interface Producto {
  productId: number;
  productName: string;
  qty: number;
  unitePrice: number;
}

export interface OrderDelivery {
  phone: string;
  orderTransactionDeliveryId: number;
  products: Producto[];
  total: number;
  paymentId: number;
  paymentName: string;
  typeIdentificationId: number;
  typeIdentificationName: string;
  method: string;
  nameClient: string;
  address: string;
  phoneClient: string;
  mail: string;
  numerIdentification: string | null;
  status:string;
  statusOrder: string;
}

export interface LlamadaActiva {
  id: string;
  numero: string;
  timestamp: string;
}