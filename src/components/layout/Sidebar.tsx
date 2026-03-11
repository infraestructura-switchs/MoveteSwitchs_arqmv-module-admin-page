import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Tag,
  Table as TableIcon,
  Truck,
  Users,
  Settings,
  LogOut, 
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const imageMovete = "/assets/img/movete.png";
const imageChuzoIvan = "/assets/img/Footer.png";
const imageNino = "/assets/img/NINO.png";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

type MenuItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "platos", label: "Platos", icon: UtensilsCrossed },
  { id: "promociones", label: "Promociones", icon: Tag },
  { id: "mesas", label: "Mesas", icon: TableIcon },
  { id: "domicilios", label: "Domicilios", icon: Truck },
  { id: "clientes", label: "Clientes", icon: Users },
];

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const navigate = useNavigate();
  const [restaurantImage, setRestaurantImage] = useState(imageNino);

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt_token");
    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken);
        if (decoded.companyId === 273) {
          setRestaurantImage(imageNino);
        } else if (decoded.companyId === 238) {
          setRestaurantImage(imageChuzoIvan);
        } else {
          setRestaurantImage(imageNino);
        }
      } catch {
        setRestaurantImage(imageNino);
      }
    } else {
      setRestaurantImage(imageNino);
    }
  }, []);

  const handleClick = (id: string) => {
    onPageChange(id);
    navigate(`/${id}`);
  };

  const handleLogout = () => {
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("company_id");
  navigate("/", { replace: true }); 
};

  return (
    <aside className="w-64 flex-shrink-0 h-full bg-white shadow-lg flex flex-col rounded-xl">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <img src={imageMovete} alt="Movete" className="h-8" />
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              aria-current={isActive ? "page" : undefined}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-pink-800 to-[#9D0154] text-white shadow-lg"
                  : "text-gray-600 hover:bg-[#9D0154] hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <img src={restaurantImage} alt="Restaurante" className="h-12" />
          <div className="flex-1 flex justify-center items-center space-x-3">
            <button
              onClick={() => console.log("Abrir configuración")}
              className="text-gray-500 hover:text-[#9D0154] transition-colors"
              aria-label="Configuración"
              title="Configuración"
            >
              <Settings size={20} />
            </button>


            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-500 transition-colors"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}