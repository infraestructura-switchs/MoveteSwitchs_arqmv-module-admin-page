import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { RestaurantTypes } from "../Types/RestaurantTypes";
import { ProductSortFieldMap } from "../Types/MapeoProductTypes";
import CitySelect from "./CitySelectProps";
import {
  GetProduct,
  CreateProduct,
  GetSearchProduct,
  UpdateProduct,
  DeleteProduct,
} from "../API/ProductAPI";

const ProductCRUD = () => {
  const itemTemplate = (): RestaurantTypes => ({
    id: 0,
    companyId: "",
    companyName: "",
    whatsappNumber: "",
    logo: "",
    longitude: 0,
    latitude: 0,
    baseValue: 0,
    aditionalValue: 0,
    externalId: "",
    cityId: "",
    cityName: "",
    apiKey: "",
    rappyId: "",
    numberId: "",
    tokenMetaQr: "",
    tokenMetaDelivery: "",
    numberBotDelivery: "",
    numberBotMesa: "",
    statusRappy: "",
    state: "ACTIVE",
  });

  type ColumnType = {
    key: keyof RestaurantTypes;
    label: string;
    hidden?: boolean;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
    editable?: boolean;
    render?: (item: RestaurantTypes) => React.ReactNode;
    imageOptions?: {
      maxSize: number;
      acceptedFormats: string[];
    };
  };

  const columns: ColumnType[] = [
    {
      key: "companyName",
      label: "Nombre de la Empresa",
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    {
      key: "whatsappNumber",
      label: "Número de WhatsApp",
      required: false,
    },
    {
      key: "longitude",
      label: "Longitud",
      required: false,
    },
    {
      key: "latitude",
      label: "Latitud",
      required: false,
    },
    {
      key: "baseValue",
      label: "Valor Domicilio",
      required: false,
    },
    {
      key: "aditionalValue",
      label: "Valor Adicional Domicilio",
      required: false,
    },
    {
      key: "externalId",
      label: "ID Externo",
      required: false,
      hidden: true,
    },
    {
      key: "cityId",
      label: "ID Ciudad",
      required: false,
      hidden: true,
    },

     {
      key: "cityName",
      label: "Ciudad",
      required: false,
    },

    {
      key: "apiKey",
      label: "API Key",
      required: false,
      hidden: true,
    },
    {
      key: "rappyId",
      label: "ID Rappy",
      required: false,
      hidden: true,
    },
    {
      key: "numberId",
      label: "Número ID",
      required: false,
      hidden: true,
    },
    {
      key: "tokenMetaQr",
      label: "Token Meta QR",
      required: false,
      hidden: true,
    },
    {
      key: "tokenMetaDelivery",
      label: "Token Meta Delivery",
      required: false,
      hidden: true,

    },
    {
      key: "numberBotDelivery",
      label: "# Bot Delivery",
      required: false,
      hidden: true,
    },
    {
      key: "numberBotMesa",
      label: "# Bot Mesa",
      required: false,
      hidden: true,
    },
    {
      key: "statusRappy",
      label: "Estado Rappy",
      required: false,
      hidden: true,
    },
    {
      key: "logo",
      label: "Logo",
      required: false,
      hiddenInCreate: false,
      hiddenInEdit: false,
      render: (item) =>
        item.logo ? (
          <img
            src={item.logo}
            alt="Logo"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        ) : (
          "N/A"
        ),
      editable: true,
    },
    {
      key: "state",
      label: "Estado",
      required: true,
      hidden: true,
    },
  ];

  const renderCustomFormField = (
    colKey: keyof RestaurantTypes,
    value: any,
    onChange: (newValue: any) => void
  ) => {
    if (colKey === "logo") {
      return (
        <div className="flex flex-col gap-2 mt-2">
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onChange(file);
              }
            }}
            className="block w-full border rounded px-2 py-1"
          />
          {value instanceof File && (
            <img
              src={URL.createObjectURL(value)}
              alt="Vista previa"
              className="w-20 h-20 object-cover rounded border border-gray-300"
            />
          )}
        </div>
      );
    }

    if (colKey === "state") {
      return (
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">Estado</label>
          <input
            type="checkbox"
            checked={value === "ACTIVE"}
            onChange={(e) => onChange(e.target.checked ? "ACTIVE" : "INACTIVE")}
            className="w-5 h-5 cursor-pointer rounded border-2 border-gray-300 transition"
          />
          <span
            className={`text-sm font-bold ${
              value === "ACTIVE" ? "text-green-600" : "text-red-600"
            }`}
          >
            {value === "ACTIVE" ? "Activo" : "Inactivo"}
          </span>
        </div>
      );
    }

    if (colKey === "cityId") {
      return (
        <CitySelect
          value={value}
          onChange={onChange}
        />
      );
    }

    return null;
  };

  return (
    <div className="p-0">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold text-gray-800 m-0">
            Gestión de Restaurantes
          </h3>
        </div>
        <p className="text-gray-500 mb-4">
          Administre los restaurantes mediante la creación, edición o
          eliminación de registros.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive">
            <CRUDForm<RestaurantTypes>
              fetchItems={GetProduct}
              searchItem={GetSearchProduct}
              createItem={CreateProduct}
              updateItem={UpdateProduct}
              deleteItem={DeleteProduct}
              itemTemplate={itemTemplate}
              columns={columns}
              sortFieldMap={ProductSortFieldMap}
              renderCustomFormField={renderCustomFormField}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCRUD;
