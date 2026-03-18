import { useMemo, useState, useEffect } from "react";
import {
  Plus,
  Filter,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Header, ActionButton } from "../layout/Header";
import { EmptyState } from "../common/EmptyState";
import { useApi } from "../../hooks/useApi";
import { GetAllCategoryByCompanyNoPage } from "../../Category/API/Category";
import { apiService } from "../../services/api";
import { Dish, PaginatedResponse } from "../../types";
import Modal from "../Modal";

const DEFAULT_PAGE_SIZE = 5;
function formatMoney(value: number) {
  return `$ ${value.toLocaleString("es-CO")}`;
}

function parseList(text: string) {
  return text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}


export function DishesComponent() {
  const COMPANY_ID = Number(localStorage.getItem("company_id")) || 0;
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [categories, setCategories] = useState<{ categoryId: number; name: string }[]>([]);
  const [formValues, setFormValues] = useState<Partial<Dish>>({
    name: "",
    ingredients: [],
    category: "restaurant",
    price: 0,
    menu: "Menú Restaurante",
    status: "ACTIVE",
    description: "",
    information: "",
    preparationTime: 0,
    companyId: COMPANY_ID,
    comments: [],
    image: "",
  });

  const {
    data: paginated,
    loading,
    refetch,
  } = useApi<PaginatedResponse<Dish>>(
    () =>
      apiService.getDishes(page, pageSize, {
        companyId: COMPANY_ID,
        search: searchQuery,
        category:
          activeTab === "all" ? undefined : (activeTab as Dish["category"]),
      }),
    [page, pageSize, searchQuery, activeTab],
  );

  useEffect(() => {
    GetAllCategoryByCompanyNoPage(COMPANY_ID).then(setCategories);
  }, []);

  const dishes = paginated?.items || [];
  const total = paginated?.total || 0;
  const totalPages = paginated?.totalPages || 1;

  const tabs = [
    { id: "all", label: "Todos los platos" },
    { id: "restaurant", label: "Menú Restaurante" },
    { id: "delivery", label: "Menú Domicilios" },
  ];

  const openCreateModal = () => {
    setEditingDish(null);
    setFormValues({
      name: "",
      ingredients: [],
      category: "restaurant",
      price: 0,
      menu: "Menú Restaurante",
      status: "ACTIVE",
      description: "",
      information: "",
      preparationTime: 0,
      companyId: 0,
      comments: [],
      image: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (dish: Dish) => {
    setEditingDish(dish);
    setFormValues({
      ...dish,
      categoryId: dish.categoryId,
      information: dish.information || [],
      comments: dish.comments || [],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDish(null);
  };

  const handleSubmit = async () => {
    const payload: Omit<Dish, "id"> = {
      name: formValues.name || "",
      ingredients:
        typeof formValues.ingredients === "string"
          ? [formValues.ingredients]
          : Array.isArray(formValues.ingredients)
            ? formValues.ingredients
            : [],
      category: (formValues.category as Dish["category"]) || "restaurant",
      categoryId: formValues.categoryId,
      price: Number(formValues.price) || 0,
      menu: formValues.menu || "Menú Restaurante",
      description: formValues.description || "",
      status: (formValues.status as Dish["status"]) || "ACTIVE",
      information: formValues.information || "",
      preparationTime: Number(formValues.preparationTime) || 0,
      companyId: COMPANY_ID,
      comments: Array.isArray(formValues.comments)
        ? formValues.comments
        : parseList(String(formValues.comments || "")),
      image: formValues.image || "",
    };

    if (editingDish) {
      await apiService.updateDish(editingDish.id, payload);
    } else {
      await apiService.createDish(payload);
    }

    closeModal();
    refetch();
  };

  const handleDelete = async (dishId: string) => {
    const confirmed = window.confirm(
      "¿Estás seguro que quieres eliminar este plato?",
    );
    if (!confirmed) return;

    await apiService.deleteDish(dishId, COMPANY_ID);
    refetch();
  };

  const startItem = useMemo(() => (page - 1) * pageSize + 1, [page, pageSize]);
  const endItem = useMemo(
    () => Math.min(page * pageSize, total),
    [page, pageSize, total],
  );

  const colStyle = {
    gridTemplateColumns: "36px 100px 2fr 1.5fr 1fr 1fr 1fr 72px",
  };

  if (loading && !paginated) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header
          title="Platos"
          subtitle={`Tus platos (${total})`}
          rightActions={
            <ActionButton onClick={openCreateModal}>
              <Plus size={20} />
              <span>Crear nuevo plato</span>
            </ActionButton>
          }
        />
        <div className="p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 min-h-screen">
      <Header
        title="Platos"
        subtitle={`Tus platos (${total})`}
        onSearch={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
        rightActions={
          <ActionButton onClick={openCreateModal}>
            <Plus size={20} />
            <span>Crear nuevo plato</span>
          </ActionButton>
        }
      />

      <div className="p-4 md:p-8">
        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setPage(1);
              }}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-red-500 border-b-2 border-red-500"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {dishes.length === 0 ? (
          <EmptyState
            title="No tienes ningún plato creado"
            subtitle="Empieza a crearlos y armar tu menú en segundos"
            buttonText="Crear nuevo plato"
            onAction={openCreateModal}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto w-full">
              {/* Table Header */}
              <div
                className="w-full grid gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-600 items-center"
                style={colStyle}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-red-600 rounded border-gray-300"
                  />
                </div>
                <div className="flex items-center space-x-1">
                  <span>Imagen</span>
                  <Filter size={13} />
                </div>
                <div className="flex items-center space-x-1">
                  <span>Nombre</span>
                  <Filter size={13} />
                </div>
                <div className="flex items-center space-x-1">
                  <span>Ingredientes</span>
                  <Filter size={13} />
                </div>
                <div className="flex items-center space-x-1">
                  <span>Categoría</span>
                  <Filter size={13} />
                </div>
                <div className="flex items-center space-x-1">
                  <span>Precio</span>
                  <Filter size={13} />
                </div>
                <div className="flex items-center space-x-1">
                  <span>Preparación</span>
                  <Filter size={13} />
                </div>
                <div>Acciones</div>
              </div>

              {/* Rows */}
              {dishes.map((dish) => (
                <div
                  key={dish.id}
                  className="w-full grid gap-4 px-4 py-3 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors"
                  style={colStyle}
                >
                  <div>
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-pink-600 rounded border-gray-300"
                    />
                  </div>
                  <div
                    className="shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"
                    style={{ width: "72px", height: "72px", minWidth: "72px" }}
                  >
                    {dish.image ? (
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-400 text-center leading-tight px-1">
                        Sin imagen
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {dish.name}
                    </div>
                    {dish.description && (
                      <div className="text-xs text-gray-500 truncate">
                        {dish.description}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {dish.information}
                  </div>
                  <div className="text-sm text-gray-700 truncate">
                    {dish.category?.name || "Sin categoría"}
                  </div>
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {formatMoney(dish.price)}
                  </div>
                  <div className="text-sm text-gray-700">
                    {dish.preparationTime ? `${dish.preparationTime} min` : "—"}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(dish)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Pencil size={15} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(dish.id)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={15} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              <div className="px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-sm text-gray-600">
                  Mostrando {startItem} - {endItem} de {total}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-600">
                    Página {page} de {totalPages}
                  </div>
                  <button
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft size={16} />
                    Anterior
                  </button>
                  <button
                    onClick={() =>
                      setPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={page === totalPages}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Siguiente
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {editingDish ? "Editar plato" : "Crear nuevo plato"}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            <label className="flex flex-col text-sm font-medium text-gray-700">
              Nombre
              <input
                value={formValues.name || ""}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, name: e.target.value }))
                }
                className="mt-1 p-2 border border-gray-200 rounded-lg"
                placeholder="Nombre del plato"
              />
            </label>

            <label className="flex flex-col text-sm font-medium text-gray-700">
              Descripción
              <textarea
                value={formValues.description || ""}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="mt-1 p-2 border border-gray-200 rounded-lg resize-none"
                rows={3}
                placeholder="Descripción breve"
              />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col text-sm font-medium text-gray-700">
                Precio
                <input
                  type="number"
                  value={formValues.price ?? ""}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      price: Number(e.target.value),
                    }))
                  }
                  className="mt-1 p-2 border border-gray-200 rounded-lg"
                  placeholder="0"
                />
              </label>

              <label className="flex flex-col text-sm font-medium text-gray-700">
                Tiempo (min)
                <input
                  type="number"
                  value={formValues.preparationTime ?? ""}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      preparationTime: Number(e.target.value),
                    }))
                  }
                  className="mt-1 p-2 border border-gray-200 rounded-lg"
                  placeholder="15"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col text-sm font-medium text-gray-700">
                Categoría
                <select
                  value={formValues.categoryId ?? ""}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      categoryId: Number(e.target.value),
                    }))
                  }
                  className="mt-1 p-2 border border-gray-200 rounded-lg"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col text-sm font-medium text-gray-700">
                Estado
                <select
                  value={formValues.status}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="mt-1 p-2 border border-gray-200 rounded-lg"
                >
                  <option value="ACTIVE">Activo</option>
                  <option value="INACTIVE">Inactivo</option>
                </select>
              </label>
            </div>

            <label className="flex flex-col text-sm font-medium text-gray-700">
              Ingredientes
              <textarea
                value={formValues.information || ""}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    information: e.target.value,
                  }))
                }
                className="mt-1 p-2 border border-gray-200 rounded-lg resize-none"
                rows={3}
                placeholder="Describe los ingredientes del plato"
              />
            </label>

            <label className="flex flex-col text-sm font-medium text-gray-700">
              Comentarios
              <div className="mt-1 p-2 border border-gray-200 rounded-lg min-h-[42px] flex flex-wrap gap-1">
                {Array.isArray(formValues.comments) &&
                  formValues.comments.map((comment, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {comment}
                      <button
                        type="button"
                        onClick={() =>
                          setFormValues((prev) => ({
                            ...prev,
                            comments: (prev.comments as string[]).filter(
                              (_, j) => j !== i,
                            ),
                          }))
                        }
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                <input
                  type="text"
                  className="outline-none text-sm flex-1 min-w-[120px]"
                  placeholder="Escribe y presiona Enter o coma..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val) {
                        setFormValues((prev) => ({
                          ...prev,
                          comments: [
                            ...(Array.isArray(prev.comments)
                              ? prev.comments
                              : []),
                            val,
                          ],
                        }));
                        (e.target as HTMLInputElement).value = "";
                      }
                    }
                  }}
                />
              </div>
              <span className="text-xs text-gray-400 mt-1">
                Presiona Enter o , para añadir
              </span>
            </label>

            <label className="flex flex-col text-sm font-medium text-gray-700">
              Imagen
              <div className="mt-1 flex flex-col gap-2">
                {formValues.image && (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={formValues.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormValues((prev) => ({ ...prev, image: "" }))
                      }
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      setFormValues((prev) => ({
                        ...prev,
                        image: reader.result as string,
                      }));
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                />
              </div>
            </label>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600"
              >
                {editingDish ? "Guardar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}