import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { PositionTypes } from "../Types/PositionTypes";
import { PositionSortFieldMap } from "../Types/MapeoPosition";
import {
  GetPosition,
  CreatePosition,
  UpdatePosition,
  DeletePosition,
  GetSearchPosition,
} from "../API/PositionAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const PositionCRUD = () => {
  const itemTemplate = (): PositionTypes => ({
    id: 0,
    description: "",
    status: "ACTIVE",
  });

  const columns: {
    key: keyof PositionTypes;
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
            Gestión de cargos
          </h3>
        </div>
        <p className="text-gray-500 mb-4">
          Administre los cargos mediante la creación, edición o eliminación de registros.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive">
              <CRUDForm<PositionTypes>
                fetchItems={GetPosition}
                searchItem={GetSearchPosition}
                createItem={CreatePosition}
                updateItem={UpdatePosition}
                deleteItem={DeletePosition}
                itemTemplate={itemTemplate}
                columns={columns}
                sortFieldMap={PositionSortFieldMap}
              />
            </div>
          </div>
        </div>
      </div>
  );
};

export default PositionCRUD;
