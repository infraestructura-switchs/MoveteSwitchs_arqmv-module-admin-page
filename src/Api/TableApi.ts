import { Table, sendWaiterRequest } from '../types/TableType';
import { BASE_URL_API } from "../constants/index";

const URL: string = `${BASE_URL_API}/restauranttable`;
//const URL = '/api/back-whatsapp-qr-app/restauranttable';

const getToken = (): string | null => {
  return localStorage.getItem("jwt_token");
};

export const getTable = async (): Promise<Table[]> => {
  const token = getToken();

  if (!token) {
    console.error("No se encontró un token de autenticación");
    return [];
  }

  try {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      console.error('No hay token en localStorage. Redirige al login.');
      return [];  
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
    };
    console.log('Headers que se envían:', headers);

    const response = await fetch(`${URL}/get`, {
      method: 'GET',
      headers: headers,
    });

    console.log('Response status:', response.status);
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    const data: Table[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener las mesas:', error);
    return [];
  }
};

export async function createTable(tableNumber: number) {
  const url = `${URL}/createTable?tableNumber=${encodeURIComponent(tableNumber)}`;

  const token = getToken();

  if (!token) {
    throw new Error("No se encontró un token de autenticación");
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({})); 
    throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
  }

  return await res.json();
}


export async function deleteTable(tableId: number): Promise<void> {
  const token = localStorage.getItem('jwt_token');
  const res = await fetch(`${URL}/${encodeURIComponent(tableId)}`, {
    method: "DELETE",
     headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
  });

  if (!res.ok) {
    let msg = `La solicitud a la API falló (HTTP ${res.status})`;
    try {
      const text = await res.text();
      if (text) msg = (JSON.parse(text)?.message ?? msg);
    } catch {
    }
    throw new Error(msg);
  }
}


export const sendWaiter = async (request: sendWaiterRequest): Promise<void> => {
  try {
     const token = localStorage.getItem('jwt_token');
    const response = await fetch(`${URL}/change/status-ocuped`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Error al cambiar status de mesa: ${response.status} - ${response.statusText}`);
    }

    return;
  } catch (error) {
    console.error('Error al cambiar status de mesa:', error);
    throw error; 
  }
};


