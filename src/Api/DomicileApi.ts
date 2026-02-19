import { OrderDomicileType } from "../types/orderDomicileType";
import { BASE_URL_API } from "../constants/index";

const URL: string = `${BASE_URL_API}/order-delivery`;
//const URL = '/api/back-whatsapp-qr-app/order-delivery';

export const getOrdersDomicile = async (): Promise<OrderDomicileType[]> => {
  try {
    const token = localStorage.getItem('jwt_token');
    const response = await fetch(`${URL}/get-all-orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los pedidos');
    }

    const data: OrderDomicileType[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};


export const deleteOrder = async (orderTransactionDeliveryId: number): Promise<boolean> => {
  try {
     const token = localStorage.getItem('jwt_token');
    const response = await fetch(
      `${URL}/delete/${orderTransactionDeliveryId}`, {
      method: "DELETE",
     headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
  });
    return response.ok;
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    return false;
  }
};


export const updateOrderStatus = async (
  orderTransactionDeliveryId: number,
  orderStatus: string
): Promise<boolean> => {
  try {
     const token = localStorage.getItem('jwt_token');
    const response = await fetch(
      `${URL}/updateStatus/${orderTransactionDeliveryId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus }),
      }
    );
    return response.ok;
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    return false;
  }
};



