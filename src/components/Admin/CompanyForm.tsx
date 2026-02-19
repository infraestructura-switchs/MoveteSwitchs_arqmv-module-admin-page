import { useState, useRef } from "react";
import { Upload } from "lucide-react";

interface CompanyFormProps {
  onSubmit: (data: CompanyFormData) => void;
  isLoading?: boolean;
}

export interface CompanyFormData {
  name: string;
  nit_ruc: string;
  city: string;
  phone: string;
  address: string;
  logo_url?: string;
}

export default function CompanyForm({ onSubmit, isLoading }: CompanyFormProps) {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    nit_ruc: "",
    city: "",
    phone: "",
    address: "",
    logo_url: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
      setFormData({
        ...formData,
        logo_url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Nuevo Restaurante
        </h1>
        <p className="text-slate-600">
          Complete el formulario con la información del restaurante
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Nombre del Restaurante
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ingrese el nombre"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#980046] focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <label
              htmlFor="nit_ruc"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Contraseña
            </label>
            <input
              type="text"
              id="nit_ruc"
              name="nit_ruc"
              value={formData.nit_ruc}
              onChange={handleChange}
              placeholder="Contraseña de acceso"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#980046] focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Ciudad
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Ingrese la ciudad"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#980046] focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Teléfono/Celular
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ingrese el teléfono"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#980046] focus:border-transparent outline-none transition"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Dirección
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Ingrese la dirección"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#980046] focus:border-transparent outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Logo del Restaurante
          </label>
          <div
            className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-[#980046] transition cursor-pointer"
            onClick={handleLogoClick}
          >
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-700 mb-1">
              Seleccionar logo
            </p>
            <p className="text-xs text-slate-500">PNG, JPG hasta 2MB</p>
            {logoFile && (
              <p className="text-xs text-[#980046] mt-2 font-semibold">
                {logoFile.name}
              </p>
            )}
            <input
              type="file"
              accept="image/png, image/jpeg"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleLogoChange}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-[#980046] text-white font-medium rounded-lg hover:bg-[#7a0038] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Guardando..." : "Guardar Información"}
          </button>
        </div>
      </form>
    </div>
  );
}
