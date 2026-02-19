import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { CategoryTypes } from "./../Types/CategoryTypes";
import { categorySortFieldMap } from "../Types/MapeoCategory";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";
import {
  GetCategory,
  CreateCategory,
  GetSearchCategory,
  UpdateCategory,
  DeleteCategory,
} from "../API/Category";
const CategoryCRUD = () => {
  const itemTemplate = (): CategoryTypes => ({
    id: 0,
    categoryType: "",
    description: "",
    status: "ACTIVE",
    image: "",
  });

  type ColumnType = {
    key: keyof CategoryTypes;
    label: string;
    hidden?: boolean;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
    editable?: boolean;
    render?: (item: CategoryTypes) => React.ReactNode;
    imageOptions?: {
      maxSize: number;
      acceptedFormats: string[];
    };
  };

  const columns: ColumnType[] = [
    {
      key: "id",
      label: "ID",
      hiddenInCreate: true,
      hiddenInEdit: true,
    },
    {
      key: "categoryType",
      label: "Tipo de Categoría",
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    {
      key: "description",
      label: "Descripción",
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    {
      key: "status",
      label: "Estado",
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    {
      key: "image",
      label: "Imagen",
      required: false,
      imageOptions: {
        maxSize: 2 * 1024 * 1024,
        acceptedFormats: ["image/jpeg", "image/png", "image/webp"],
      },
      render: (item) =>
        item.image ? (
          <img
            src={item.image}
            alt="Imagen"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        ) : (
          "N/A"
        ),
      editable: true,
    },
  ];

const renderCustomFormField = (
  colKey: keyof CategoryTypes,
  value: any,
  onChange: (newValue: any) => void
) => {
  if (colKey === "image") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onChange(file); 
            }
          }}
        />
        {value instanceof File && (
          <img
            src={URL.createObjectURL(value)}
            alt="Vista previa"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        )}
      </div>
    );
  }

    if (colKey === "status") {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label
            style={{
              fontSize: "14px",
              color: "#333",
            }}
          >
            Estado
          </label>
          <input
            type="checkbox"
            checked={value === "ACTIVE"}
            onChange={(e) => onChange(e.target.checked ? "ACTIVE" : "INACTIVE")}
            style={{
              width: "20px",
              height: "20px",
              cursor: "pointer",
              borderRadius: "4px",
              border: "2px solid #ddd",
              transition: "all 0.3s ease",
            }}
          />
          <span
            style={{
              fontSize: "14px",
              color: value === "ACTIVE" ? "#4CAF50" : "#F44336",
              fontWeight: "bold",
            }}
          >
            {value === "ACTIVE" ? "Activo" : "Inactivo"}
          </span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="app-content content">
      <div className="content-overlay" />
      <div className="header-navbar-shadow" />
      <div className="content-wrapper container-xxl p-0">
        <div className="content-header row" />
        <div className="content-body">
          <div style={{ display: "flex", alignItems: "center" }}>
            <h3
              className="content-body"
              style={{ margin: 0, fontSize: "21px" }}
            >
              Gestión de Categorías
            </h3>
            <FavoritoButton path="/category" label="Categorías" />
          </div>
          <p>
            Administre las categorías mediante la creación, edición o
            eliminación de registros.
          </p>
          <div className="card">
            <div className="card-datatable table-responsive">
              <CRUDForm<CategoryTypes>
                fetchItems={GetCategory}
                searchItem={GetSearchCategory}
                createItem={CreateCategory}
                updateItem={UpdateCategory}
                deleteItem={DeleteCategory}
                itemTemplate={itemTemplate}
                columns={columns}
                sortFieldMap={categorySortFieldMap}
                renderCustomFormField={renderCustomFormField}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCRUD;
