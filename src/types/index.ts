export interface Restaurant {
  id: string;
  name: string;
  slogan?: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  address: string;
  hours: OpeningHour[];
}

export interface OpeningHour {
  id: string;
  day: string;
  openTime: string;
  closeTime: string;
  closed: boolean;
}

export interface Dish {
  id: string;
  name: string;
  ingredients: string[];
  category?: {
  categoryId: number;
  name: string;
  status: string;
  companyId: number;
}
  price: number;
  image?: string;
  menu: string;
  description?: string | null;
  status?: 'ACTIVE' | 'INACTIVE' | string;
  information?: string | null;
  preparationTime?: number | null;
  companyId?: number;
  comments?: string[];
  categoryId?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiPagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ApiProduct {
  id: number;
  productName: string;
  price: number;
  status: 'ACTIVE' | 'INACTIVE' | string;
  categoryId: number;
  category?: {
    categoryId: number;
    name: string;
    status: string;
    companyId: number;
  };
  description?: string | null;
  image?: string | null;
  comments?: string[];
  companyId: number;
  information?: string | null;
  preparationTime?: number | null;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  discount: number;
  category: 'restaurant' | 'delivery';
  active: boolean;
  validUntil: Date;
}

export interface Table {
  id: string;
  number: string;
  status: 'available' | 'occupied' | 'reserved';
  capacity: number;
  currentBill?: number;
  timeOccupied?: string;
  orders?: number;
}

export interface DashboardMetrics {
  totalOrders: number;
  readyOrders: number;
  processingOrders: number;
  totalRevenue: number;
  totalAccount: number;
  ordersGrowth: number;
  readyOrdersGrowth: number;
  processingOrdersGrowth: number;
  revenueGrowth: number;
  accountGrowth: number;
}

export interface SalesData {
  month: string;
  restaurant: number;
  delivery: number;
  pickup: number;
}

export interface BestSeller {
  id: string;
  name: string;
  sales: number;
  image: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: Date;
  totalOrders: number;
  lastOrder: Date;
  lastAddress: string;
}

export interface DeliveryOrder {
  id: string;
  orderId: string;
  date: Date;
  status: 'desocupada' | 'en_proceso' | 'en_camino' | 'activa' | 'cancelado';
  address: string;
  total: number;
  paymentMethod: string;
  pickupTime?: string;
  type: 'domicilio' | 'recoger_en_lugar';
}