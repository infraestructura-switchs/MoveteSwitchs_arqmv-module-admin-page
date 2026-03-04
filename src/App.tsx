// App.tsx
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
    if (!token || userId === "admin") {
      navigate("/", { replace: true });
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