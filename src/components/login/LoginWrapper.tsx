import { useNavigate } from "react-router-dom";
import AuthScreens from "./Login";

export default function LoginWrapper() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    const userId = localStorage.getItem("user_id");
    if (userId === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  return <AuthScreens onLoginSuccess={handleLoginSuccess} />;
}