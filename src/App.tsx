import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { requestFirebaseNotificationPermission } from './firebase';
import { getMessaging, onMessage } from 'firebase/messaging';
import { Sidebar } from "./components/layout/Sidebar";
import { X } from "lucide-react";




function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token") || localStorage.getItem("auth_token");
    const userId = localStorage.getItem("user_id");
    if (!token || !userId) { navigate("/", { replace: true }); return; }
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
      } catch { localStorage.clear(); navigate("/", { replace: true }); }
    }
  }, [navigate]);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId && userId !== "admin") {
      requestFirebaseNotificationPermission(() => {});
      const messaging = getMessaging();
      onMessage(messaging, (payload) => {
        if (payload?.notification) console.log(`Nuevo mensaje: ${payload.notification.body}`);
      });
    }
  }, []);

  useEffect(() => {
    const handler = () => setSidebarOpen(true);
    window.addEventListener("toggle-sidebar", handler);
    return () => window.removeEventListener("toggle-sidebar", handler);
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-200 overflow-hidden">

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="h-full flex">
        <div className={`
          fixed lg:relative top-0 left-0 h-full z-50
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <button
            className="lg:hidden absolute top-4 right-4 z-50 text-gray-500 hover:text-[#9D0154]"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
          <Sidebar
            currentPage={currentPage}
            onPageChange={(page) => { setCurrentPage(page); setSidebarOpen(false); }}
          />
        </div>

        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">

          <main className="flex-1 min-h-0 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;