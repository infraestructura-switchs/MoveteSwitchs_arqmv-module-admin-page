import { BASE_URL_API } from "../constants/index";

const URL: string = `${BASE_URL_API}`;

export const statusTable: Record<number, { label: string; ring: string; text: string; border: string }> = {
  1: { label: "Disponible", ring: "ring-green-400",  text: "text-green-600",  border: "border-green-400" },  
  2: { label: "Ocupada",    ring: "ring-red-500",    text: "text-red-600",    border: "border-red-400" },   
  3: { label: "Ocupada  ",  ring: "ring-red-500",   text: "text-red-600",   border: "border-red-400" },
  4: { label: "Reservada",  ring: "ring-yellow-400", text: "text-yellow-700", border: "border-yellow-400" },
  5: { label: "Ocupada  ",  ring: "ring-red-500",   text: "text-red-600",   border: "border-red-400" },
};

export const statusMap: Record<number, { label: string }> = {
  1: { label: "Disponible" },
  2: { label: "Ocupada" },
  3: { label: "Ocupada" },
  4: { label: "Reservada" },
  5: { label: "Ocupada" },
};

export const statusColors = {
  "Disponible": "bg-green-500 text-green-100",  
  "Activa": "bg-yellow-500 text-yellow-100",  
  "Desocupada": "bg-gray-200 text-gray-700",  
  "Solicitando Atención": "bg-blue-500 text-blue-100", 
  "Ocupada": "bg-red-500 text-red-100",      
};



export function obtenerTextoEstado(status: number): { texto: string; clase: string; bgColor: string } {
  switch(status) {
    case 1: 
      return { 
        texto: "Disponible", 
        clase: "disponible",
        bgColor: "bg-green-100 text-green-800 border-green-200"
      };
    case 2: 
      return { 
        texto: "Ocupada", 
        clase: "ocupada",
        bgColor: "bg-red-100 text-red-800 border-red-200"
      };
    case 3: 
      return { 
        texto: "Solicitando atención", 
        clase: "solicitandoAtencion",
        bgColor: "bg-yellow-100 text-yellow-800 border-yellow-200"
      };
    case 4: 
      return { 
        texto: "Reservada", 
        clase: "reservada",
        bgColor: "bg-yellow-100 text-yellow-800 border-yellow-200"
      };
    default:
      return { 
        texto: "Desconocido", 
        clase: "desconocido",
        bgColor: "bg-gray-100 text-gray-800 border-gray-200"
      };
  }
}

export function formatearTiempo(timestamp: string): string {
  const fecha = new Date(timestamp);
  return fecha.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

export function formatearPrecio(precio: number): string {
  return `$${precio.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// Función para actualizar estados de mesas desde la API
export async function actualizarEstadoMesas(setMesas: React.Dispatch<React.SetStateAction<any[]>>) {
  try {
    const response = await fetch(`${URL}/restauranttable`);
    if (!response.ok) throw new Error("No se pudo obtener el estado de las mesas");
    
    const mesasAPI = await response.json();

    setMesas(prevMesas => prevMesas.map(mesa => {
      const mesaAPI = mesasAPI.find((m: any) => m.tableNumber === mesa.tableNumber);
      if (mesaAPI) {
        return {
          ...mesa,
          status: mesaAPI.status
        };
      }
      return mesa;
    }));

    console.log('Estados de mesas actualizados desde API');
  } catch (error) {
    console.error("Error al actualizar el estado de las mesas:", error);
  }
}