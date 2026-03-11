import React, { useState } from "react";
import { login } from "../../Api/LoginApi";
import {
  UserIcon,
  LockIcon,
  EyeOffIcon,
  MailIcon,
  PhoneIcon,
  EyeIcon,
} from "../../icons/icons";

interface AuthScreensProps {
  onLoginSuccess: () => void;
}

export default function AuthScreens({ onLoginSuccess }: AuthScreensProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotValue, setForgotValue] = useState("");
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);

  const cardWidth =
    tab === "register" ? "w-[720px] md:w-[760px]" : "w-[600px] md:w-[400px]";

  const switchTab = (next: "login" | "register") => {
    setTab(next);
    setShowForgot(false);
  };

  const loginImage = "/assets/img/logo-movete.png";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#980046] px-4">
      <div className="text-center select-none w-full">
        <div className="flex items-center justify-center gap-2 mb-3">
          <img src={loginImage} alt="logo" className="w-10 h-7" />
          <span className="font-extrabold text-5xl text-white tracking-wide">
            movete
          </span>
        </div>

        {tab === "login" && !showForgot ? (
          <>
            <h2 className="text-white font-semibold text-xl">
              ¡Bienvenido nuevamente!
            </h2>
            <p className="text-white/85 text-[13px] leading-snug mt-1">
              Ingresa tu usuario y tu contraseña para acceder a tu cuenta
            </p>
          </>
        ) : (
          <>
            <h2 className="text-white font-semibold text-xl">
              {showForgot ? "Recuperar contraseña" : "Regístrate en segundos"}
            </h2>
            <p className="text-white/85 text-[13px] leading-snug mt-1">
              {showForgot
                ? "Ingresa tu correo para recuperar tu contraseña"
                : "Ingresa tus datos personales para poder crear tu cuenta"}
            </p>
          </>
        )}

        <div className="mt-6">
          <div
            className={`bg-white rounded-3xl shadow-xl ring-1 ring-black/5 mx-auto p-6 ${cardWidth}`}
          >
            <div className="mb-4">
              <div className="bg-gray-100 rounded-full p-1 w-full flex shadow-inner">
                <button
                  onClick={() => switchTab("login")}
                  className={`flex-1 rounded-full py-2.5 text-sm transition font-medium ${
                    tab === "login"
                      ? "bg-white shadow text-[#980046]"
                      : "text-[#980046]/70 hover:text-[#980046]"
                  }`}
                >
                  Inicio Sesión
                </button>
                <button
                  onClick={() => switchTab("register")}
                  className={`flex-1 rounded-full py-2.5 text-sm transition font-medium ${
                    tab === "register"
                      ? "bg-white shadow text-[#980046]"
                      : "text-[#980046]/70 hover:text-[#980046]"
                  }`}
                >
                  Registro
                </button>
              </div>
            </div>

            {tab === "login" && showForgot ? (
              <ForgotPasswordForm
                forgotValue={forgotValue}
                setForgotValue={setForgotValue}
                forgotMsg={forgotMsg}
                setForgotMsg={setForgotMsg}
                forgotLoading={forgotLoading}
                setForgotLoading={setForgotLoading}
                onBack={() => {
                  setShowForgot(false);
                  setTab("login");
                }}
              />
            ) : tab === "login" ? (
              <LoginForm
                onLoginSuccess={onLoginSuccess}
                setShowForgot={setShowForgot}
              />
            ) : (
              <RegisterForm />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ForgotPasswordForm({
  forgotValue,
  setForgotValue,
  forgotMsg,
  setForgotMsg,
  forgotLoading,
  setForgotLoading,
  onBack,
}: any) {
  const handleForgotSubmit = async () => {
    if (!forgotValue.trim()) {
      setForgotMsg("Escribe tu usuario o correo.");
      return;
    }
    setForgotLoading(true);
    setForgotMsg(null);
    try {
      // await requestPasswordReset(forgotValue);
      setForgotMsg("Si el usuario existe, enviamos instrucciones a tu correo.");
    } catch {
      setForgotMsg("No se pudo procesar la solicitud. Intenta de nuevo.");
    } finally {
      setForgotLoading(false);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") handleForgotSubmit();
  };

  return (
    <div className="space-y-4">
      <LabeledInput
        label="Ingrese el correo"
        placeholder="Ingrese el correo"
        icon={<MailIcon />}
        value={forgotValue}
        onChange={(e) => setForgotValue(e.target.value)}
      />
      {forgotMsg && (
        <div className="text-[12px] text-[#E5393A] text-left">{forgotMsg}</div>
      )}

      <div className="text-right">
        <button
          type="button"
          className="text-[13px] text-[#E5393A] hover:underline"
          onClick={onBack}
        >
          Iniciar sesión
        </button>
      </div>

      <button
        type="button"
        className="w-full rounded-full py-3 text-white text-sm font-semibold shadow"
        style={{ backgroundColor: "#E5393A" }}
        onClick={handleForgotSubmit}
        disabled={forgotLoading}
      >
        {forgotLoading ? "Enviando..." : "Recuperar contraseña"}
      </button>
    </div>
  );
}

interface LoginFormProps {
  onLoginSuccess: () => void;
  setShowForgot: (v: boolean) => void;
}

function LoginForm({ onLoginSuccess, setShowForgot }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error al decodificar el token JWT:", error);
      return null;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Hardcode admin login
    if (username === "admin" && password === "123") {
      localStorage.setItem("auth_token", "admin-token"); // Opcional: puedes guardar un token falso
      localStorage.setItem("user_id", "admin");
      onLoginSuccess(); // Esto activa el App.tsx
      setIsLoading(false);
      return;
    }

    try {
      const response = await login(username, password);
      console.log("response completo:", JSON.stringify(response));
      const payload = response?.data ?? response;
      console.log("payload:", JSON.stringify(payload));
      console.log("token:", payload?.token);
      if (payload?.token) {
        const fetchedToken = payload.token;
        const decoded = parseJwt(fetchedToken);
        const userId = decoded?.userId;

        console.log("companyId del token:", decoded?.companyId);

        if (!userId) {
          setError("Token inválido: no se encontró el userId.");
          return;
        }

        localStorage.setItem("jwt_token", fetchedToken);
        localStorage.setItem("user_id", userId.toString());
        localStorage.setItem("company_id", decoded?.companyId?.toString());
        console.log("Token almacenado:", fetchedToken);
        console.log("User ID almacenado:", userId);

        onLoginSuccess();
      } else {
        setError("Credenciales incorrectas. Inténtalo nuevamente.");
      }
    } catch {
      setError("Ocurrió un error. Inténtalo nuevamente más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  if (showSidebar) {
    // Puedes controlar la vista del Sidebar aquí
    return <Sidebar currentView="list" onNavigate={() => {}} />;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3.5">
        <LabeledInput
          label="Usuario"
          placeholder="Usuario"
          icon={<UserIcon />}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <LabeledInput
          label="Contraseña"
          type="password"
          placeholder="Contraseña"
          icon={<LockIcon />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="text-right">
        <button
          type="button"
          className="text-[11px] text-[#E5393A] hover:underline"
          onClick={() => setShowForgot(true)}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <button
        className="w-full rounded-full py-3 text-white text-sm font-semibold shadow mt-2"
        style={{ backgroundColor: "#E5393A" }}
        onClick={(e) => {
          e.preventDefault();
          handleLogin(e as any);
        }}
        disabled={isLoading}
      >
        {isLoading ? "Cargando..." : "Iniciar Sesión"}
      </button>
    </div>
  );
}

function RegisterForm() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[12px] font-semibold text-gray-700 mb-2.5">
          Datos personales
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <LabeledInput
            label="Nombre completo"
            placeholder="Nombre completo"
            icon={<UserIcon />}
          />
          <LabeledInput
            label="Teléfono celular"
            placeholder="Teléfono celular"
            icon={<PhoneIcon />}
          />
          <LabeledInput
            label="Correo electrónico"
            placeholder="Correo electrónico"
            icon={<MailIcon />}
          />
        </div>
      </div>

      <div>
        <p className="text-[12px] font-semibold text-gray-700 mb-2.5">
          Contraseña
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <LabeledInput
            label="Crear contraseña"
            type="password"
            placeholder="Crear contraseña"
            icon={<LockIcon />}
          />
          <LabeledInput
            label="Ingresar nuevamente la contraseña"
            type="password"
            placeholder="Ingresar nuevamente la contraseña"
            icon={<LockIcon />}
          />
        </div>
      </div>

      <button
        className="w-full rounded-full py-3 text-white text-sm font-semibold shadow"
        style={{ backgroundColor: "#E5393A" }}
      >
        Registrarme
      </button>
    </div>
  );
}

function LabeledInput({
  label,
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  icon?: React.ReactNode;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <label className="block">
      <div className="relative flex items-center">
        <span className="absolute left-3 text-[#980046]">{icon}</span>
        <input
          type={inputType}
          placeholder={placeholder || label}
          className="w-full bg-[#F4F4F4] rounded-full pl-10 pr-10 h-11 text-sm placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#E5393A]/30"
          value={value}
          onChange={onChange}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 text-[#980046] focus:outline-none"
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        )}
      </div>
    </label>
  );
}
