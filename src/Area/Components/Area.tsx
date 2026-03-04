import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { AreaTypes } from "../Types/AreaTypes";
import { AreaSortFieldMap } from "../Types/MapeoArea";
import {
  GetArea,
  CreateArea,
  UpdateArea,
  DeleteArea,
  GetSearchArea,
} from "../API/AreaAPI";

const AreaCRUD = () => {
  const itemTemplate = (): AreaTypes => ({
    id: 0,
    description: "",
    status: "ACTIVE",
  });

  const columns: {
    key: keyof AreaTypes;
    label: string;
    hidden?: boolean;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    hiddenInCreate?: boolean;
    hiddenInEdit?: boolean;
  }[] = [
    { key: "id", label: "ID", hiddenInCreate: true, hiddenInEdit: true },
    {
      key: "description",
      label: "Descripcion",
      required: true,
      minLength: 2,
      maxLength: 100,
      regex: /^[A-Za-z\s]+$/,
    },
  ];

  return (
<div className="p-0">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold text-gray-800 m-0">
            Gestión de Áreas
          </h3>
        </div>
        <p className="text-gray-500 mb-4">
          Administre las áreas mediante la creación, edición o eliminación de registros.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive">
              <CRUDForm<AreaTypes>
                fetchItems={GetArea}
                searchItem={GetSearchArea}
                createItem={CreateArea}
                updateItem={UpdateArea}
                deleteItem={DeleteArea}
                itemTemplate={itemTemplate}
                columns={columns}
                sortFieldMap={AreaSortFieldMap}
              />
            </div>
          </div>
        </div>
      </div>
  );
};

export default AreaCRUD;
