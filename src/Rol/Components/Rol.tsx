import CRUDForm from "../../GeneralComponents/GeneralCrud/CRUDForm";
import { RolTypes } from "../Types/RolTypes";
import { RolSortFieldMap } from "../Types/MapeoRol";
import {
  GetRol,
  CreateRol,
  UpdateRol,
  DeleteRol,
  GetSearchRol,
} from "../API/RolAPI";
import FavoritoButton from "../../FavoritoButton/components/FavoritoButton";

const RolCRUD = () => {
  const itemTemplate = (): RolTypes => ({
    id: 0,
    name: "",
    status: "ACTIVE",
  });

  const columns: {
    key: keyof RolTypes;
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
      key: "name",
      label: "Nombre",
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
            Gestión de Roles
          </h3>
        </div>
        <p className="text-gray-500 mb-4">
          Administre los roles mediante la creación, edición o eliminación de registros.
        </p>
        <div className="card">
          <div className="card-datatable table-responsive">
              <CRUDForm<RolTypes>
                fetchItems={GetRol}
                searchItem={GetSearchRol}
                createItem={CreateRol}
                updateItem={UpdateRol}
                deleteItem={DeleteRol}
                itemTemplate={itemTemplate}
                columns={columns}
                sortFieldMap={RolSortFieldMap}
              />
            </div>
          </div>
        </div>
      </div>
  );
};

export default RolCRUD;
