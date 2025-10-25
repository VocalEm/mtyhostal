import React, { createContext, useState, useEffect, useContext } from "react";
import Api from "../services/Api";
import { jwtDecode } from "jwt-decode";

// Interfaz para el usuario
interface Usuario {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  rol: number; // 0 = Anfitrion, 1 = Huesped
  fotoPerfilUrl?: string;
}

// Interfaz para el contexto
interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<Usuario>) => void;
  isAuthenticated: boolean;
  isAnfitrion: boolean;
  isHuesped: boolean;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Función para decodificar el JWT y obtener información básica
  const decodeToken = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      return {
        id: parseInt(decoded.sub),
        email: decoded.email,
        rol: parseInt(decoded.role),
      };
    } catch (error) {
      console.error("Error al decodificar token:", error);
      return null;
    }
  };

  // Cargar perfil completo del usuario
  const loadUserProfile = async (authToken: string) => {
    try {
      const { data } = await Api.get("/usuario/perfil", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setUser(data);
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      // Si falla, usar datos básicos del token
      const basicInfo = decodeToken(authToken);
      if (basicInfo) {
        setUser({
          id: basicInfo.id,
          nombre: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          email: basicInfo.email,
          rol: basicInfo.rol,
        });
      }
    }
  };

  // Inicializar autenticación al cargar la app
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        // Verificar si el token está expirado
        try {
          const decoded: any = jwtDecode(storedToken);
          const currentTime = Date.now() / 1000;

          if (decoded.exp && decoded.exp < currentTime) {
            // Token expirado
            console.log("Token expirado");
            localStorage.removeItem("token");
            setLoading(false);
            return;
          }

          // Token válido, cargar usuario
          setToken(storedToken);
          await loadUserProfile(storedToken);
        } catch (error) {
          console.error("Error al verificar token:", error);
          localStorage.removeItem("token");
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    try {
      const { data } = await Api.post("/usuario/login", {
        Email: email,
        Password: password,
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        await loadUserProfile(data.token);
      }
    } catch (error: any) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  // Registro
  const register = async (userData: any) => {
    try {
      // Primero registrar
      await Api.post("/usuario/registro", userData);

      // Luego hacer login automático
      await login(userData.Email, userData.Password);
    } catch (error: any) {
      console.error("Error en registro:", error);
      throw error;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Actualizar información del usuario
  const updateUser = (userData: Partial<Usuario>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user && !!token,
    isAnfitrion: user?.rol === 0,
    isHuesped: user?.rol === 1,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export default AuthContext;
