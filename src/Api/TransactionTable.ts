import { BASE_URL_API } from "../constants/index";

const URL: string = `${BASE_URL_API}/transaction`;
//const URL = '/api/back-whatsapp-qr-app/transaction'


export const closeAccount = async (tableNumber: number): Promise<boolean> => {
  try {
    const token = localStorage.getItem('jwt_token');
    const response = await fetch(`${URL}/finish/${tableNumber}`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ tableNumber }),
      }
    );
    return response.ok; 
  } catch (error) {
    console.error('Error al cerrar cuenta:', error);
    return false; 
  }
};