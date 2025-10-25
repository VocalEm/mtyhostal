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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import Api from "@/services/Api";
import { useNavigate } from "react-router-dom";

type RolUsuario = "Anfitrion" | "Huesped";

interface RegisterFormData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  password: string;
  confirmPassword: string;
  rol: RolUsuario;
  fotoPerfil: File | null;
}

interface FormErrors {
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  fotoPerfil?: string;
  rol?: string;
}

const Registro = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    email: "",
    password: "",
    confirmPassword: "",
    rol: "Huesped",
    fotoPerfil: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRolChange = (rol: RolUsuario) => {
    setFormData((prev) => ({ ...prev, rol }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          fotoPerfil: "Por favor selecciona una imagen válida",
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          fotoPerfil: "La imagen no debe superar los 5MB",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, fotoPerfil: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (formData.nombre.length > 100) {
      newErrors.nombre = "El nombre no puede exceder 100 caracteres";
    }

    if (!formData.apellidoPaterno.trim()) {
      newErrors.apellidoPaterno = "El apellido paterno es requerido";
    } else if (formData.apellidoPaterno.length > 100) {
      newErrors.apellidoPaterno =
        "El apellido paterno no puede exceder 100 caracteres";
    }

    if (!formData.apellidoMaterno.trim()) {
      newErrors.apellidoMaterno = "El apellido materno es requerido";
    } else if (formData.apellidoMaterno.length > 100) {
      newErrors.apellidoMaterno =
        "El apellido materno no puede exceder 100 caracteres";
    }

    if (!formData.email) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Por favor confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const decodeJwtGetSub = (token: string): string | null => {
    try {
      const payload = token.split(".")[1];
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      const obj = JSON.parse(json);
      return obj.sub || obj.nameid || null;
    } catch (err) {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const rolValue = formData.rol === "Anfitrion" ? 0 : 1;

      const payload = {
        Nombre: formData.nombre,
        ApellidoPaterno: formData.apellidoPaterno,
        ApellidoMaterno: formData.apellidoMaterno,
        Email: formData.email,
        Password: formData.password,
        Rol: rolValue,
      };

      const { data } = await Api.post("/usuario/registro", payload);
      toast.success(data.message || "¡Registro exitoso!");
      console.log(data.message);

      if (formData.fotoPerfil) {
        const loginResp = await Api.post("/usuario/login", {
          Email: formData.email,
          Password: formData.password,
        });

        const token = loginResp.data?.Token || loginResp.data?.token;
        if (!token) {
          toast.error(
            "Registro exitoso, pero no se pudo obtener el token para subir la foto."
          );
          setLoading(false);
          return;
        }

        localStorage.setItem("token", token);

        const sub = decodeJwtGetSub(token);
        if (!sub) {
          setLoading(false);
          return;
        }

        const userId = sub;

        const form = new FormData();
        form.append("file", formData.fotoPerfil as File);

        await Api.put(`/usuario/${userId}/foto-perfil`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (!formData.fotoPerfil) {
        const loginResp = await Api.post("/usuario/login", {
          Email: formData.email,
          Password: formData.password,
        });
        const token = loginResp.data?.Token || loginResp.data?.token;
        if (token) localStorage.setItem("token", token);
      }

      console.log("Registro completado");
      setFormData({
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        email: "",
        password: "",
        confirmPassword: "",
        rol: "Huesped",
        fotoPerfil: null,
      });

      setPreviewUrl(null);
      setErrors({});
      const Navigate = useNavigate();
      Navigate("/Login");
    } catch (err: any) {
      const response = err?.response;
      const data = response?.data;

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

  const getInitials = () => {
    if (formData.nombre && formData.apellidoPaterno) {
      return `${formData.nombre[0]}${formData.apellidoPaterno[0]}`.toUpperCase();
    }
    return "?";
  };

  const fondoImagenUrl =
    "https://res.cloudinary.com/dxstpixjr/image/upload/v1761372062/Monterrey_fondop_orttlz.jpg";
  const fondoStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${fondoImagenUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div
      style={fondoStyle}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8"
    >
      <Card className=" w-full max-w-2xl shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Crear Cuenta
          </CardTitle>
          <CardDescription className="text-center">
            Completa el formulario para registrarte en MtyHostal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="w-24 h-24">
                <AvatarImage src={previewUrl || undefined} alt="Vista previa" />
                <AvatarFallback className="text-2xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <Label
                htmlFor="fotoPerfil"
                className="cursor-pointer text-blue-600 hover:underline text-sm font-medium"
              >
                Subir foto de perfil (opcional)
              </Label>
              <Input
                id="fotoPerfil"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-xs text-gray-500">
                Formatos: JPG, PNG, GIF. Máximo 5MB
              </p>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Usuario</Label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleRolChange("Huesped")}
                  className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                    formData.rol === "Huesped"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold">Huésped</div>
                  <div className="text-sm text-gray-600">
                    Quiero rentar una residencia
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleRolChange("Anfitrion")}
                  className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                    formData.rol === "Anfitrion"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold">Anfitrión</div>
                  <div className="text-sm text-gray-600">
                    Quiero rentar mis propiedades
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nombre">
                  Nombre <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Juan"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={errors.nombre ? "border-red-500" : ""}
                />
                {errors.nombre && (
                  <p className="text-sm text-red-500">{errors.nombre}</p>
                )}
              </div>

              <div className="space-y-2 ">
                <Label htmlFor="apellidoPaterno">
                  Apellido Paterno <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="apellidoPaterno"
                  name="apellidoPaterno"
                  type="text"
                  placeholder="Pérez"
                  value={formData.apellidoPaterno}
                  onChange={handleInputChange}
                  className={errors.apellidoPaterno ? "border-red-500" : ""}
                />
                {errors.apellidoPaterno && (
                  <p className="text-sm text-red-500">
                    {errors.apellidoPaterno}
                  </p>
                )}
              </div>

              <div className="space-y-2 ">
                <Label htmlFor="apellidoMaterno">
                  Apellido Materno <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="apellidoMaterno"
                  name="apellidoMaterno"
                  type="text"
                  placeholder="García"
                  value={formData.apellidoMaterno}
                  onChange={handleInputChange}
                  className={errors.apellidoMaterno ? "border-red-500" : ""}
                />
                {errors.apellidoMaterno && (
                  <p className="text-sm text-red-500">
                    {errors.apellidoMaterno}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Contraseña <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirmar Contraseña <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="bg-blue-600 w-full hover:bg-blue-500 hover:cursor-pointer"
              disabled={loading}
            >
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Inicia sesión aquí
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Registro;
