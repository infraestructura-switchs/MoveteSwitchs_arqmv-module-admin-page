// Mock API service - Replace with real endpoints
import { Restaurant, Dish, Promotion, Table, DashboardMetrics, SalesData, BestSeller, Client } from '../types';

class ApiService {
  private baseUrl = '/api'; // Replace with your actual API base URL

  // Dashboard methods
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    // Mock data - replace with actual API call
    return {
      totalOrders: "",
      readyOrders: "",
      processingOrders: "",
      totalRevenue: "",
      totalAccount: "",
      ordersGrowth: "",
      readyOrdersGrowth: "",
      processingOrdersGrowth: "",
      revenueGrowth: "",
      accountGrowth: ""
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
  async getDishes(): Promise<Dish[]> {
    return [];
  }

  async createDish(dish: Omit<Dish, 'id'>): Promise<Dish> {
    const newDish = { ...dish, id: Date.now().toString() };
    return newDish;
  }

  async updateDish(id: string, dish: Partial<Dish>): Promise<Dish> {
    return { id, ...dish } as Dish;
  }

  async deleteDish(id: string): Promise<void> {
    // API call to delete dish
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