import { TableResponse, SendOrdersRequest } from '../types/TableType';
import { BASE_URL_API } from "../constants/index";

const URL: string = `${BASE_URL_API}/order`; 
//const URL = '/api/back-whatsapp-qr-app/order';



export const getOrders = async (): Promise<TableResponse[]> => {
  try { 
    const token = localStorage.getItem('jwt_token');
    const response = await fetch(`${URL}/get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener las órdenes: ${response.status} - ${response.statusText}`);
    }

    const data: TableResponse[] = await response.json();
    return data;  
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    return [];  
  }
};

export const sendOrders = async (request: SendOrdersRequest): Promise<void> => {
  try {
     const token = localStorage.getItem('jwt_token');
    const response = await fetch(`${URL}/status/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Error al confirmar órdenes: ${response.status} - ${response.statusText}`);
    }

    return;
  } catch (error) {
    console.error('Error al confirmar órdenes:', error);
    throw error; 
  }
};

