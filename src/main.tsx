import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import App from "./App";
import AppAdmin from "./components/Admin/AppAdmin";
import LoginWrapper from "./components/login/LoginWrapper";
import { Dashboard } from "./pages/Dashboard";
import { DishesComponent } from "./components/dishes/dishesComponent";
import { Promociones } from "./pages/Promociones";
import { TableComponents } from "./components/tables/TableComponents";
import { DomicileComponents } from "./components/domicile/DomicileComponents";
import { Clientes } from "./pages/Clientes";
import RolCRUD from "./Rol/Components/Rol";
import UserCRUD from "./User/Components/UserComponents";
import AreaCRUD from "./Area/Components/Area";
import PositionCRUD from "./Position/Components/Position";
import ProductCRUD from "./Product/Components/ProductCRUD";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("jwt_token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));
    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("company_id");
      localStorage.removeItem("rol_id");
      return <Navigate to="/" replace />;
    }
  } catch {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("jwt_token");
  const rolId = localStorage.getItem("rol_id");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (rolId !== "5") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginWrapper />,
  },
  {
    path: "/admin",
    element: <AdminRoute><AppAdmin /></AdminRoute>, 
    children: [
      { index: true, element: <ProductCRUD /> },
      { path: "roles", element: <RolCRUD /> },
      { path: "users", element: <UserCRUD /> },
      { path: "area", element: <AreaCRUD /> },
      { path: "position", element: <PositionCRUD /> },
    ],
  },
  {
    path: "dashboard",
    element: <ProtectedRoute><App /></ProtectedRoute>,
    children: [{ index: true, element: <Dashboard /> }],
  },
  {
    path: "platos",
    element: <ProtectedRoute><App /></ProtectedRoute>,
    children: [{ index: true, element: <DishesComponent /> }],
  },
  {
    path: "promociones",
    element: <ProtectedRoute><App /></ProtectedRoute>,
    children: [{ index: true, element: <Promociones /> }],
  },
  {
    path: "mesas",
    element: <ProtectedRoute><App /></ProtectedRoute>,
    children: [{ index: true, element: <TableComponents /> }],
  },
  {
    path: "domicilios",
    element: <ProtectedRoute><App /></ProtectedRoute>,
    children: [{ index: true, element: <DomicileComponents /> }],
  },
  {
    path: "clientes",
    element: <ProtectedRoute><App /></ProtectedRoute>,
    children: [{ index: true, element: <Clientes /> }],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);