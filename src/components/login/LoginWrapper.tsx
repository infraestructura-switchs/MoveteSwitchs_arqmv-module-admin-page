import { useNavigate } from "react-router-dom";
import AuthScreens from "./Login";

export default function LoginWrapper() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    const rolId = localStorage.getItem("rol_id");
    
    if (rolId === "5") {
      navigate("/admin", { replace: true }); 
    } else {
      navigate("/dashboard", { replace: true }); 
    }
  };

  return <AuthScreens onLoginSuccess={handleLoginSuccess} />;
}