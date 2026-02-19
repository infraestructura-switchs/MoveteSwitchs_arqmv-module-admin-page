import { ObjectResponse } from "../Types/TypesDTO/ObjectResponse";
import { RestaurantTypes } from "../Types/RestaurantTypes";
import { CityType } from "../Types/CityType";
import { BASE_URL_API } from "../../constants/index";


const URL: string = `${BASE_URL_API}`;
//const URL: string = `http://localhost:8080/api/back-whatsapp-qr-app`;

export async function GetProductById(
  id: number
): Promise<ObjectResponse<RestaurantTypes> | null> {
  try {
    const response = await fetch(`${URL}/company/get-all/${id}`);
    if (response.ok) {
      const data: ObjectResponse<RestaurantTypes> = await response.json();
      return data;
    } else {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    return null;
  }
}

export const GetProduct = async (
  page: number,
  size: number,
  filters: Partial<RestaurantTypes>,
  orders: string = '',
  sortBy?: keyof RestaurantTypes
): Promise<RestaurantTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));

  const validSortOrder = orders === 'ASC' || orders === 'DESC' ? orders : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy)); 
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof RestaurantTypes];
    if (value) {
      queryParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(`${URL}/company/get-all?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }
    const data = await response.json();
    return data.content; 
  } catch (error) {
    console.error('Error al obtener los elementos:', error);
    return [];
  }
};

export async function CreateProduct(
  ProductDto: RestaurantTypes,
  imageFile: File | null
): Promise<void> {
  try {
    const formData = new FormData();
    formData.append("companyName", ProductDto.companyName);
    formData.append("logo", ProductDto.logo || "");
    formData.append("whatsappNumber", ProductDto.whatsappNumber);
    formData.append("longitude", String(ProductDto.longitude));
    formData.append("latitude", String(ProductDto.latitude));
    formData.append("baseValue", String(ProductDto.baseValue));
    formData.append("aditionalValue", String(ProductDto.aditionalValue));
    formData.append("externalId", ProductDto.externalId);
    formData.append("cityId", ProductDto.cityId);
    formData.append("apiKey", ProductDto.apiKey);
    formData.append("state", ProductDto.state);
    formData.append("rappyId", ProductDto.rappyId);
    formData.append("numberId", ProductDto.numberId);
    formData.append("tokenMetaQr", ProductDto.tokenMetaQr);
    formData.append("tokenMetaDelivery", ProductDto.tokenMetaDelivery);
    formData.append("numberBotDelivery", ProductDto.numberBotDelivery);
    formData.append("numberBotMesa", ProductDto.numberBotMesa);
    formData.append("statusRappy", ProductDto.statusRappy);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await fetch(`${URL}/company/create`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }

    const data = await response.json();
    console.log("Restaurante creado:", data);
  } catch (error) {
    console.error("Error al llamar a la API:", error);
  }
}

export const GetSearchProduct = async (
  page: number,
  size: number,
  filters: Partial<RestaurantTypes>,
  sortOrder: string = "ASC",
  sortBy?: keyof RestaurantTypes
): Promise<RestaurantTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append("page", String(page));
  queryParams.append("size", String(size));

  const validSortOrder =
    sortOrder === "ASC" || sortOrder === "DESC" ? sortOrder : "ASC";
  queryParams.append("orders", validSortOrder);

  if (sortBy) {
    queryParams.append("sortBy", String(sortBy));
  }

  Object.keys(filters).forEach((key) => {
    const value = filters[key as keyof RestaurantTypes];
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(`${URL}/company/search?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor");
    }
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("Error al obtener los elementos:", error);
    return [];
  }
};

export async function UpdateProduct(
  companyId: string,
  ProductDto: RestaurantTypes,
  imageFile?: File | null
): Promise<void> {
  try {

    console.log("companyId recibido en UpdateProduct:", companyId);
    const formData = new FormData();
    formData.append("companyName", ProductDto.companyName);
    formData.append("whatsappNumber", ProductDto.whatsappNumber);
    formData.append("logo", ProductDto.logo || "");
    formData.append("longitude", String(ProductDto.longitude));
    formData.append("latitude", String(ProductDto.latitude));
    formData.append("baseValue", String(ProductDto.baseValue));
    formData.append("aditionalValue", String(ProductDto.aditionalValue));
    formData.append("externalId", ProductDto.externalId);
    formData.append("cityId", ProductDto.cityId);
    formData.append("apiKey", ProductDto.apiKey);
    formData.append("state", ProductDto.state);
    formData.append("rappyId", ProductDto.rappyId);
    formData.append("numberId", ProductDto.numberId);
    formData.append("tokenMetaQr", ProductDto.tokenMetaQr);
    formData.append("tokenMetaDelivery", ProductDto.tokenMetaDelivery);
    formData.append("numberBotDelivery", ProductDto.numberBotDelivery);
    formData.append("numberBotMesa", ProductDto.numberBotMesa);
    formData.append("statusRappy", ProductDto.statusRappy);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    console.log("Data:", ProductDto);

    const response = await fetch(`${URL}/company/updateByCompanynId/${companyId}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }

    const data = await response.json();
    console.log("Restaurante actualizado:", data);
  } catch (error) {
    console.error("Error al llamar a la API:", error);
  }
}



export async function DeleteProduct(id: number): Promise<void> {
  try {
    const response = await fetch(`${URL}/company/delete/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
  }
}

export async function GetAllProductNoPage(): Promise<RestaurantTypes[]> {
  try {
    const response = await fetch(`${URL}/city/getAllNoPage`);
    if (response.ok) {
      const data: RestaurantTypes[] = await response.json();
      return data;
    } else {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    return [];
  }
}


export async function GetAllCitiesNoPage(): Promise<CityType[]> {
  try {
    const response = await fetch(`${URL}/city/getAllNoPage`);
    if (response.ok) {
      const data: CityType[] = await response.json();
      return data;
    } else {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    return [];
  }
}