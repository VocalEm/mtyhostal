import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAnfitrion?: boolean;
}

const ProtectedRoute = ({
  children,
  requireAnfitrion = false,
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Mientras carga, mostrar pantalla de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si requiere ser anfitrión y no lo es, redirigir a home
  if (requireAnfitrion && user.rol !== 0) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
