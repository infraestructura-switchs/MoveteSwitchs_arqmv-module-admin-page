import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { requestFirebaseNotificationPermission } from './firebase';
import { getMessaging, onMessage } from 'firebase/messaging';
import { Sidebar } from "./components/layout/Sidebar";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const navigate = useNavigate();
  useEffect(() => {
  const token = localStorage.getItem("jwt_token") || localStorage.getItem("auth_token");
  const userId = localStorage.getItem("user_id");

  if (!token || !userId) {
    navigate("/", { replace: true });
    return;
  }

  if (token !== "admin-token") {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = JSON.parse(atob(base64));
      const now = Math.floor(Date.now() / 1000); 

      if (decoded.exp && decoded.exp < now) {
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("company_id");
        navigate("/", { replace: true });
      }
    } catch {
      localStorage.clear();
      navigate("/", { replace: true });
    }
  }
}, [navigate]);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId && userId !== "admin") {
      requestFirebaseNotificationPermission(() => {
        console.log("Se recibió una notificación en primer plano.");
      });

      const messaging = getMessaging();
      onMessage(messaging, (payload) => {
        if (payload?.notification) {
          console.log(`Nuevo mensaje: ${payload.notification.body}`);
        }
      });
    }
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-200 p-4">
      <div className="h-full flex gap-4">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        <main className="flex-1 min-h-0 overflow-auto rounded-xl">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}

export default App;