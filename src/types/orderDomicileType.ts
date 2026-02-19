
export interface Producto {
  productId: number;
  productName: string;
  qty: number;
  unitePrice: number;
  comment:string;
}

export interface OrderDomicileType {
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
  date:string;
  numerIdentification: string | null;
  status:string;
  statusOrder: string;
}
