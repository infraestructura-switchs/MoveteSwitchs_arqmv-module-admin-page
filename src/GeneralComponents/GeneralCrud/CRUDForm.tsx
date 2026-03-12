import React, { useState, useEffect, useRef } from "react";
import withReactContent from "sweetalert2-react-content";
import Swal, { SweetAlertResult } from "sweetalert2";
import {
  AddIcon,
  FilterIcon,
  FilterIcon2,
  EditIcon,
  DeleteIcon,
} from "../Icons/Icons";

const MySwal = withReactContent(Swal);

type Orders = "ASC" | "DESC" | "neutral";

interface CRUDIcon {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  ariaLabel?: string;
}

export interface ColumnDefinition<T> {
  key: keyof T;
  label: string;
  hidden?: boolean;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  regex?: RegExp;
  hiddenInCreate?: boolean;
  hiddenInEdit?: boolean;
  render?: (item: T) => React.ReactNode;
  type?: "text" | "number" | "image" | "password";
  imageOptions?: {
    maxSize?: number;
    acceptedFormats?: string[];
    width?: number;
    height?: number;
  };
}

interface CRUDFormProps<T> {
  fetchItems: (
    page: number,
    size: number,
    filters: Partial<T>,
    sortOrder?: string,
    sortBy?: keyof T,
  ) => Promise<T[]>;
  searchItem?: (
    page: number,
    size: number,
    filters: Partial<T>,
    sortOrder?: string,
    sortBy?: keyof T,
  ) => Promise<T[]>;
  createItem: (item: T, imageFile: File | null) => Promise<void>;
  updateItem: (id: number, item: T) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  itemTemplate: () => T;
  columns: ColumnDefinition<T>[];
  sortFieldMap: Record<string, string>;
  renderCustomFormField?: (
    colKey: keyof T,
    value: any,
    onChange: (newValue: any) => void,
  ) => React.ReactNode;
  customIcons?: CRUDIcon[];
  onRowClick?: (item: T) => void;
  rowClassName?: (row: T) => string;
}

const CRUDForm = <T extends { id: number }>({
  fetchItems,
  searchItem,
  createItem,
  updateItem,
  deleteItem,
  itemTemplate,
  columns,
  sortFieldMap,
  renderCustomFormField,
  customIcons,
  onRowClick,
  rowClassName,
}: CRUDFormProps<T>) => {
  const [items, setItems] = useState<T[]>([]);
  const [currentItem, setCurrentItem] = useState<T | null>(null);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [operation, setOperation] = useState<"add" | "edit">("add");
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [filters, setFilters] = useState<Partial<T>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<Orders>("neutral");

  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAndSetData();
  }, [page, filters, sortField, sortOrder]);

  useEffect(() => {
    if (currentItem) {
      validateAllFields();
    }
  }, [currentItem]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target as Node)
      ) {
        setSelectedItem(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchAndSetData = async () => {
    try {
      const sortFieldParam =
        sortField !== null
          ? sortFieldMap[sortField as string] || String(sortField)
          : undefined;
      const sortOrderParam = sortOrder !== "neutral" ? sortOrder : undefined;
      const activeFilters: Partial<T> = {};
      Object.keys(filters).forEach((key) => {
        if (filters[key as keyof T]) {
          activeFilters[key as keyof T] = filters[key as keyof T];
        }
      });
      const hasFilters = Object.keys(activeFilters).length > 0;
      const fetchedItems = hasFilters
        ? await searchItem!(
            page - 1,
            pageSize,
            activeFilters,
            sortOrderParam,
            sortFieldParam as keyof T,
          )
        : await fetchItems(
            page - 1,
            pageSize,
            {},
            sortOrderParam,
            sortFieldParam as keyof T,
          );
      setItems(fetchedItems);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      MySwal.fire("Error", "Error al obtener los datos", "error");
    }
  };

  const handleShowModal = (
    operation: "add" | "edit",
    item: T | null = null,
  ) => {
    setOperation(operation);
    setCurrentItem(item || itemTemplate());
    setErrors({});
    setIsSaveDisabled(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentItem(null);
    setErrors({});
  };

  const handleRowClick = (item: T) => {
    setSelectedItem(item);
    if (onRowClick) {
      onRowClick(item);
    }
  };

  const handleEditSelectedRow = () => {
    if (selectedItem) {
      handleShowModal("edit", selectedItem);
    }
  };

  const handleDeleteSelectedRow = () => {
    if (selectedItem) {
      handleDelete(selectedItem.id);
    }
  };

  const validateField = (key: keyof T, value: string): string | null => {
    const column = columns.find((col) => col.key === key);
    if (column) {
      if (column.required && !value) {
        return `${column.label} es obligatorio.`;
      }
      if (column.minLength && value.length < column.minLength) {
        return `${column.label} debe tener al menos ${column.minLength} caracteres.`;
      }
      if (column.maxLength && value.length > column.maxLength) {
        return `${column.label} no puede exceder los ${column.maxLength} caracteres.`;
      }
      if (column.regex && !column.regex.test(value)) {
        return `${column.label} tiene un formato inválido.`;
      }
    }
    return null;
  };

  const validateAllFields = () => {
    if (!currentItem) return;

    const newErrors: Partial<Record<keyof T, string>> = {};
    let allValid = true;

    for (const col of columns) {
      if (!col.hidden) {
        const error = validateField(col.key, String(currentItem[col.key]));
        if (error) {
          allValid = false;
          newErrors[col.key] = error;
          break;
        }
      }
    }

    setErrors(newErrors);
    setIsSaveDisabled(!allValid);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (currentItem) {
      const key = name as keyof T;
      setCurrentItem({ ...currentItem, [key]: value } as T);

      const error = validateField(key, value);
      setErrors((prevErrors) => ({ ...prevErrors, [key]: error }));

      validateAllFields();
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof T,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !currentItem) return;

    const column = columns.find((col) => col.key === key);

    if (!file || !column?.imageOptions) {
      setErrors((prev) => ({
        ...prev,
        [key]: "No se pudo validar la imagen. Datos incompletos.",
      }));
      return;
    }

    const maxSize = column.imageOptions.maxSize;
    if (maxSize && file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        [key]: `El archivo excede el tamaño máximo de ${(
          maxSize /
          1024 /
          1024
        ).toFixed(2)} MB`,
      }));
      return;
    }

    const acceptedFormats = column.imageOptions.acceptedFormats;
    if (acceptedFormats && !acceptedFormats.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [key]: `Formato de imagen no válido. Formatos aceptados: ${acceptedFormats.join(
          ", ",
        )}`,
      }));
      return;
    }

    const { width, height } = column.imageOptions;
    if (width || height) {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (result) {
          img.src = result.toString();
          img.onload = () => {
            if (
              (width && img.width !== width) ||
              (height && img.height !== height)
            ) {
              setErrors((prev) => ({
                ...prev,
                [key]: `La imagen debe tener dimensiones exactas de ${
                  width || "libre"
                } x ${height || "libre"} px.`,
              }));
              return;
            }

            setCurrentItem({ ...currentItem, [key]: result } as T);
            if (errors[key]) {
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
              });
            }
            validateAllFields();
          };
        }
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentItem({ ...currentItem, [key]: reader.result } as T);
        if (errors[key]) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[key];
            return newErrors;
          });
        }
        validateAllFields();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!currentItem || isSaveDisabled) return;

    const imageFile = currentItem.image ? currentItem.image : null;

    try {
      if (operation === "add") {
        await createItem(currentItem, imageFile);
        MySwal.fire("Hecho!", "Elemento añadido con éxito.", "success");
      } else {
        await updateItem(currentItem.id, currentItem, imageFile);
        MySwal.fire(
          "Actualizado!",
          "Elemento actualizado con éxito.",
          "success",
        );
      }
      fetchAndSetData();
      handleCloseModal();
    } catch (error) {
      console.error("Error al guardar:", error);
      MySwal.fire("Error", "No se pudo guardar el elemento.", "error");
    }
  };

  const handleDelete = (id: number) => {
    MySwal.fire({
      title: "¿Estás seguro?",
      text: "¡Estas seguro de eliminarlo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "No, cancelar!",
      buttonsStyling: false,
      customClass: {
        confirmButton: "btn btn-success me-2",
        cancelButton: "btn btn-danger ms-2",
      },
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        deleteItem(id)
          .then(() => {
            MySwal.fire(
              "Eliminado!",
              "El elemento ha sido eliminado.",
              "success",
            );
            fetchAndSetData();
          })
          .catch((error) => {
            console.error("Error al eliminar:", error);
            MySwal.fire("Error", "No se pudo eliminar el elemento.", "error");
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        MySwal.fire("Cancelado", "Tu elemento está seguro :)", "error");
      }
    });
  };

  const handleCancel = () => {
    MySwal.fire({
      title:
        "<span style='font-size:1.5rem;font-weight:600;'>¿Estás seguro?</span>",
      html: "<div style='font-size:1rem;color:#666;margin-top:8px;'>Tienes cambios sin guardar, ¿quieres cancelar la edición?</div>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No, continuar editando",
      buttonsStyling: false,
      customClass: {
        popup: "p-6 rounded-lg",
        icon: "swal2-warning-icon",
        title: "mb-2",
        htmlContainer: "mb-4",
        confirmButton:
          "bg-green-500 text-white px-6 py-2 rounded mr-2 text-base font-semibold",
        cancelButton:
          "bg-red-500 text-white px-6 py-2 rounded text-base font-semibold",
        actions: "flex justify-center gap-4 mt-4",
      },
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        handleCloseModal();
      }
    });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value || undefined });
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSortChange = (key: keyof T) => {
    if (sortField === key) {
      setSortOrder((prevOrder) =>
        prevOrder === "ASC" ? "DESC" : prevOrder === "DESC" ? "neutral" : "ASC",
      );
    } else {
      setSortField(key);
      setSortOrder("ASC");
    }
  };

  const editableColumns = columns.filter((col) => {
    if (operation === "add" && col.hiddenInCreate) return false;
    if (operation === "edit" && col.hiddenInEdit) return false;
    return true;
  });

  return (
    <div className="w-full p-1" ref={tableRef}>
      <div className="mt-1">
        {/* Barra de Acciones Superior */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800"></h2>
          <div className="flex gap-2">
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1"
              onClick={() => handleDeleteSelectedRow()}
              disabled={!selectedItem}
              aria-label="Eliminar Elemento Seleccionado"
            >
              <DeleteIcon />
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded flex items-center gap-1"
              onClick={handleEditSelectedRow}
              disabled={!selectedItem}
              aria-label="Editar Elemento Seleccionado"
            >
              <EditIcon />
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1"
              onClick={() => handleShowModal("add")}
              aria-label="Añadir Nuevo Elemento"
            >
              <AddIcon />
            </button>
            <button
              className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded flex items-center gap-1"
              onClick={() => setShowFilters(!showFilters)}
              aria-label={showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
            >
              {showFilters ? <FilterIcon /> : <FilterIcon2 />}
            </button>
            {customIcons &&
              customIcons.map((iconConfig, index) => (
                <button
                  key={index}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded flex items-center gap-1"
                  onClick={iconConfig.onClick}
                  aria-label={iconConfig.ariaLabel || iconConfig.label}
                >
                  {iconConfig.icon}
                </button>
              ))}
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map(
                  (col) =>
                    !col.hidden && (
                      <th
                        key={String(col.key)}
                        onClick={() => handleSortChange(col.key)}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer relative group"
                      >
                        <div className="flex items-center gap-1">
                          <span>{col.label}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            fill="currentColor"
                            className={`bi bi-arrow-down-up opacity-50 group-hover:opacity-100 transition-opacity ${
                              sortField === col.key
                                ? sortOrder === "ASC"
                                  ? "text-blue-600"
                                  : "text-blue-600 rotate-180"
                                : ""
                            }`}
                            viewBox="0 0 16 16"
                          >
                            <path
                              fillRule="evenodd"
                              d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5m-7-14a.5.5 0 0 1 .5-.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5"
                            />
                          </svg>
                        </div>
                        {showFilters && (
                          <div className="mt-2">
                            <input
                              type="text"
                              name={String(col.key)}
                              placeholder={`Filtrar...`}
                              onChange={handleFilterChange}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        )}
                      </th>
                    ),
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr
                  key={item.id ?? "unknown"}
                  onClick={() => handleRowClick(item)}
                  className={`cursor-pointer hover:bg-gray-50 ${selectedItem && selectedItem.id === item.id ? "bg-violet-500 text-white" : ""}`}
                >
                  {columns.map(
                    (col) =>
                      !col.hidden && (
                        <td
                          key={String(col.key)}
                          className="px-4 py-3 whitespace-nowrap text-sm text-gray-700"
                        >
                          {col.render ? (
                            col.render(item)
                          ) : col.type === "image" && item[col.key] ? (
                            <img
                              src={String(item[col.key])}
                              alt={`${col.label}`}
                              className="max-w-[50px] max-h-[50px] object-contain"
                              style={{
                                maxWidth: col.imageOptions?.width || 50,
                                maxHeight: col.imageOptions?.height || 50,
                              }}
                            />
                          ) : item[col.key] !== undefined &&
                            item[col.key] !== null ? (
                            String(item[col.key])
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                      ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            className="bg-violet-400 hover:bg-violet-500 text-white px-3 py-2 rounded disabled:opacity-50"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            aria-label="Página anterior"
          >
            {/* Flecha izquierda */}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <span className="bg-violet-400 text-white px-3 py-2 rounded">
            {page}
          </span>
          <button
            className="bg-violet-400 hover:bg-violet-500 text-white px-3 py-2 rounded disabled:opacity-50"
            onClick={() => handlePageChange(page + 1)}
            disabled={items.length < pageSize}
            aria-label="Página siguiente"
          >
            {/* Flecha derecha */}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Modal Formulario */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4 sm:px-6">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center mb-4 px-6 pt-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {operation === "add" ? "Añadir Nuevo" : "Editar"}
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  onClick={handleCancel}
                >
                  ×
                </button>
              </div>
              <div className="px-6 pb-6 overflow-y-auto flex-1">
                {currentItem && (
                  <form>
                    <div
                      className={`grid gap-4 ${editableColumns.length <= 4 ? "grid-cols-1" : "grid-cols-2"}`}
                    >
                      {editableColumns.map((col, index) => (
                        <div key={index}>
                          <label className="block font-medium text-gray-700 mb-1">
                            {col.label}
                          </label>
                          {renderCustomFormField &&
                            renderCustomFormField(
                              col.key,
                              String(currentItem[col.key]),
                              (newValue) =>
                                setCurrentItem({
                                  ...currentItem,
                                  [col.key]: newValue,
                                } as T),
                            )}
                          {(!renderCustomFormField ||
                            !renderCustomFormField(
                              col.key,
                              String(currentItem[col.key]),
                              () => {},
                            )) && (
                            <>
                              {col.type === "image" ? (
                                <div>
                                  <input
                                    type="file"
                                    accept={
                                      col.imageOptions?.acceptedFormats?.join(
                                        ",",
                                      ) || "image/*"
                                    }
                                    className="block w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                    name={String(col.key)}
                                    onChange={(e) =>
                                      handleFileChange(
                                        e as React.ChangeEvent<HTMLInputElement>,
                                        col.key,
                                      )
                                    }
                                    aria-label={col.label}
                                  />
                                  {currentItem[col.key] && (
                                    <div className="mt-2">
                                      <img
                                        src={String(currentItem[col.key])}
                                        alt="Vista previa"
                                        className="w-20 h-20 object-cover rounded"
                                        style={{
                                          maxWidth: "100%",
                                          maxHeight: "200px",
                                          objectFit: "contain",
                                        }}
                                      />
                                    </div>
                                  )}
                                  {errors[col.key] && (
                                    <div className="text-red-600 mt-1 text-xs">
                                      {errors[col.key]}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <>
                                  <input
                                    type={
                                      col.type === "password"
                                        ? "password"
                                        : col.type === "number"
                                          ? "number"
                                          : "text"
                                    }
                                    name={String(col.key)}
                                    placeholder={col.label}
                                    value={String(currentItem[col.key]) || ""}
                                    onChange={handleChange}
                                    aria-label={col.label}
                                    className={`block w-full border rounded px-2 py-1 text-sm ${
                                      errors[col.key]
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                  />
                                  {errors[col.key] && (
                                    <div className="text-red-600 mt-1 text-xs">
                                      {errors[col.key]}
                                    </div>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                      <button
                        type="button"
                        className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md ${
                          isSaveDisabled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={handleSave}
                        disabled={isSaveDisabled}
                      >
                        <i className="fa-solid fa-floppy-disk mr-2"></i> Guardar
                      </button>
                      <button
                        type="button"
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                        onClick={handleCancel}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CRUDForm;
