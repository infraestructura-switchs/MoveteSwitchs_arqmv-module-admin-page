// API service
import axios, { AxiosInstance } from 'axios';
import {
  Restaurant,
  Dish,
  Promotion,
  Table,
  DashboardMetrics,
  SalesData,
  BestSeller,
  Client,
  PaginatedResponse,
  ApiPagedResponse,
  ApiProduct,
} from '../types';
import { BASE_URL_API } from '../constants';

class ApiService {
  private readonly http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: BASE_URL_API,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

private mapProductToDish(product: ApiProduct): Dish {
  const category = product.categoryId === 44 ? 'restaurant' : 'delivery';
  const menu = category === 'restaurant' ? 'Menú Restaurante' : 'Menú Domicilios';

  return {
    id: String(product.id),
    name: product.productName,
    ingredients: [],
    category: product.category ?? { categoryId: product.categoryId, name: 'Sin categoría', status: '', companyId: product.companyId }, // ← aquí
    price: product.price,
    image: product.image ?? undefined,
    menu,
    description: product.description,
    status: product.status,
    information: product.information,
    preparationTime: product.preparationTime,
    companyId: product.companyId,
    comments: product.comments ?? [],
    categoryId: product.categoryId,
  };
}
  private mapPagedProductsToPaginatedResponse(
    data: ApiPagedResponse<ApiProduct>
  ): PaginatedResponse<Dish> {
    return {
      items: data.content.map((p) => this.mapProductToDish(p)),
      total: data.totalElements,
      page: data.number + 1,
      pageSize: data.size,
      totalPages: data.totalPages,
    };
  }

  // Dashboard methods
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    // Mock data - replace with actual API call
    return {
      totalOrders: '',
      readyOrders: '',
      processingOrders: '',
      totalRevenue: '',
      totalAccount: '',
      ordersGrowth: '',
      readyOrdersGrowth: '',
      processingOrdersGrowth: '',
      revenueGrowth: '',
      accountGrowth: '',
    };
  }

  async getSalesData(): Promise<SalesData[]> {
    // Mock data - replace with actual API call
    return [
      { month: 'En', restaurant: 0, delivery: 2000000, pickup: 1000000 },
      { month: 'Fb', restaurant: 0, delivery: 3000000, pickup: 1500000 },
      { month: 'Mr', restaurant: 6000000, delivery: 4000000, pickup: 2000000 },
      { month: 'Ab', restaurant: 3500000, delivery: 2500000, pickup: 1200000 },
      { month: 'Ma', restaurant: 8000000, delivery: 6000000, pickup: 3000000 },
      { month: 'Jn', restaurant: 5000000, delivery: 3500000, pickup: 1800000 },
      { month: 'Jl', restaurant: 7000000, delivery: 5000000, pickup: 2500000 },
      { month: 'Ag', restaurant: 6500000, delivery: 4500000, pickup: 2200000 },
      { month: 'Sp', restaurant: 7500000, delivery: 5500000, pickup: 2800000 },
      { month: 'Oc', restaurant: 6000000, delivery: 4000000, pickup: 2000000 },
      { month: 'Nv', restaurant: 5500000, delivery: 3800000, pickup: 1900000 },
      { month: 'Dc', restaurant: 4500000, delivery: 3200000, pickup: 1600000 }
    ];
  }

  async getBestSellers(): Promise<BestSeller[]> {
    return [
      { id: '1', name: 'Hamburguesa Clásica', sales: 58, image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
      { id: '2', name: 'Hamburguesa Clásica', sales: 58, image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
      { id: '3', name: 'Hamburguesa Clásica', sales: 58, image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
      { id: '4', name: 'Hamburguesa Clásica', sales: 58, image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' }
    ];
  }

  async getClients(): Promise<{ online: number; local: number }> {
    return { online: 349, local: 250 };
  }

  async getClientsList(): Promise<Client[]> {
    return [];
  }

  async getDeliveryOrders(): Promise<DeliveryOrder[]> {
    return [];
  }

  // Dishes methods
  private readonly dishesStorageKey = 'movete:dishes';



  private setStoredDishes(dishes: Dish[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.dishesStorageKey, JSON.stringify(dishes));
  }

  async getDishes(
    page = 1,
    size = 5,
    filters?: { search?: string; category?: Dish['category']; status?: Dish['status']; companyId?: number }
  ): Promise<PaginatedResponse<Dish>> {
    const params: Record<string, unknown> = {
      page: Math.max(0, page - 1),
      size,
    };

    if (filters?.companyId) params.companyId = filters.companyId;
    if (filters?.search) params.search = filters.search;

    // The backend uses numeric categoryId, so we translate the frontend category
    // to the API categoryId (44 = restaurant, otherwise delivery).
    if (filters?.category) {
      params.categoryId = filters.category === 'restaurant' ? 44 : 45;
    }

    if (filters?.status) params.status = filters.status;

    const response = await this.http.get<ApiPagedResponse<ApiProduct>>(
      '/admin/product',
      {
        params,
      }
    );

    return this.mapPagedProductsToPaginatedResponse(response.data);
  }

  async createDish(dish: Omit<Dish, 'id'>): Promise<Dish> {
    const companyId = dish.companyId ?? 0;

    const payload: Partial<ApiProduct> = {
      productName: dish.name,
      price: dish.price,
      status: dish.status,
      categoryId: dish.category === 'restaurant' ? 44 : 45,
      description: dish.description ?? null,
      image: dish.image ?? null,
      comments: dish.comments ?? [],
      companyId,
      information: dish.information ?? null,
      preparationTime: dish.preparationTime ?? null,
    };

    const makeRequest = async (url: string) =>
      this.http.post<ApiProduct>(url, payload, {
        params: { companyId },
      });

    // Some backend versions expect POST /admin/product/create, others POST /admin/product
    const urlsToTry = ['/admin/product/create', '/admin/product'];

    for (const url of urlsToTry) {
      try {
        const response = await makeRequest(url);
        return this.mapProductToDish(response.data);
      } catch (err) {
        // If the endpoint doesn't allow POST, keep trying
        if (axios.isAxiosError(err) && err.response?.status === 405) {
          continue;
        }
        throw err;
      }
    }

    throw new Error('No se pudo crear el producto.');
  }

async updateDish(id: string, dish: Partial<Dish>): Promise<Dish> {
  const payload: Partial<ApiProduct> = {
    productName: dish.name,
    price: dish.price,
    status: dish.status,
    categoryId: typeof dish.categoryId === 'object'
      ? (dish.categoryId as any)?.categoryId
      : dish.categoryId,
    description: dish.description ?? null,
    image: dish.image ?? null,
    comments: dish.comments ?? [],
    companyId: dish.companyId ?? 0,
    information: dish.information ?? null,
    preparationTime: dish.preparationTime ?? null,
  };


    const response = await this.http.put<ApiProduct>(
      `/admin/product/update/${id}`,
      payload,
    );

    return this.mapProductToDish(response.data);
  }

  async deleteDish(id: string, companyId: number): Promise<void> {
    await this.http.delete(`/admin/product/delete/${id}`, {
      params: { companyId },
    });
  }

  // Promotions methods
  async getPromotions(): Promise<Promotion[]> {
    return [];
  }

  async createPromotion(promotion: Omit<Promotion, 'id'>): Promise<Promotion> {
    const newPromotion = { ...promotion, id: Date.now().toString() };
    return newPromotion;
  }

  async updatePromotion(id: string, promotion: Partial<Promotion>): Promise<Promotion> {
    return { id, ...promotion } as Promotion;
  }

  async deletePromotion(id: string): Promise<void> {
    // API call to delete promotion
  }

  // Tables methods
  async getTables(): Promise<Table[]> {
    return [
      { id: '1', number: 'M01', status: 'occupied', capacity: 4, currentBill: 45000, timeOccupied: '0:17h' },
       { id: '2', number: 'M01', status: 'occupied', capacity: 4, currentBill: 45000, timeOccupied: '0:17h' },

    ];
  }

  async updateTableStatus(id: string, status: Table['status']): Promise<Table> {
    return { id, status } as Table;
  }

  // Restaurant methods
  async getRestaurant(): Promise<Restaurant> {
    return {
      id: '1',
      name: '',
      slogan: '',
      primaryColor: '#D946EF',
      secondaryColor: '#EC4899',
      address: '',
      hours: [
        { id: '1', day: 'Lun - Dom', openTime: '00:00', closeTime: '00:00', closed: false }
      ]
    };
  }

  async updateRestaurant(restaurant: Partial<Restaurant>): Promise<Restaurant> {
    return restaurant as Restaurant;
  }
}

export const apiService = new ApiService();