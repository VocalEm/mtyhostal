import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [passwordError, setPasswordError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError("");

    if (!formData.password || formData.password.length <= 0) {
      setPasswordError("Debes ingresar la contraseña");
      setLoading(false);
      return;
    }

    try {
      await login(formData.email, formData.password);
      toast.success("Inicio de sesión exitoso");
      navigate("/home");
    } catch (err: any) {
      const response = err?.response;
      const data = response?.data;
      toast.error("Fallo al iniciar sesión");

      if (response?.status === 400 && data && typeof data === "object") {
        const errorKey = Object.keys(data)[0];

        if (
          errorKey &&
          Array.isArray(data[errorKey]) &&
          data[errorKey].length > 0
        ) {
          const errorMessage = data[errorKey][0];
          toast.error(errorMessage);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const imageFondoUrl =
    "https://res.cloudinary.com/dxstpixjr/image/upload/v1761372206/fondoEstadio_jle8ev.jpg";
  const fondoStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imageFondoUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div
      style={fondoStyle}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Iniciar Sesión
          </CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            {passwordError.length > 0 && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}

            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 w-full "
              disabled={loading}
            >
              Iniciar Sesión
            </Button>

            <div className="text-center text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <a
                href="/Registro"
                className="text-blue-600 hover:underline font-medium"
              >
                Regístrate aquí
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
