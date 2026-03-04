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
import { Platos } from "./pages/Platos";
import { Promociones } from "./pages/Promociones";
import { TableComponents } from "./components/tables/TableComponents";
import { DomicileComponents } from "./components/domicile/DomicileComponents";
import { Clientes } from "./pages/Clientes";
import RolCRUD from "./Rol/Components/Rol";
import UserCRUD from "./User/Components/UserComponents";
import AreaCRUD from "./Area/Components/Area";
import PositionCRUD from "./Position/Components/Position";
import ProductCRUD from "./Product/Components/ProductCRUD";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginWrapper />,
  },
  {
    path: "/admin",
    element: <AppAdmin />,
    children: [
      { index: true, element: <ProductCRUD /> },
      { path: "roles", element: <RolCRUD /> },
      { path: "users", element: <UserCRUD /> },
      { path: "area", element: <AreaCRUD /> },
      { path: "position", element: <PositionCRUD /> },
    ],
  },
  { path: "dashboard", element: <App />, children: [
      { index: true, element: <Dashboard /> },
    ]
  },
  { path: "platos", element: <App />, children: [
      { index: true, element: <Platos /> },
    ]
  },
  { path: "promociones", element: <App />, children: [
      { index: true, element: <Promociones /> },
    ]
  },
  { path: "mesas", element: <App />, children: [
      { index: true, element: <TableComponents /> },
    ]
  },
  { path: "domicilios", element: <App />, children: [
      { index: true, element: <DomicileComponents /> },
    ]
  },
  { path: "clientes", element: <App />, children: [
      { index: true, element: <Clientes /> },
    ]
  },
  { path: "*", element: <Navigate to="dashboard" replace /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
