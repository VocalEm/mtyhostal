import { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import { User, Mail, Shield, Camera, ArrowLeft, Save } from "lucide-react";
import CrearPropiedadDialog from "./Components/CrearPropiedadDialog";
import PropiedadCard from "./Components/PropiedadCard";
import { useAuth } from "@/context/AuthContext";

interface FormErrors {
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
}

interface Residencia {
  id: number;
  titulo: string;
  imagenUrl: string;
  ciudadNombre: string;
  precioPorNoche: number;
}

const Perfil = () => {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    apellidoPaterno: user?.apellidoPaterno || "",
    apellidoMaterno: user?.apellidoMaterno || "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    user?.fotoPerfilUrl || ""
  );
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [residencias, setResidencias] = useState<Residencia[]>([]);

  useEffect(() => {
    const mockResidencias: Residencia[] = [
      {
        id: 1,
        titulo: "Hermosa casa en San Pedro",
        precioPorNoche: 1500,
        ciudadNombre: "San Pedro Garza García",
        imagenUrl:
          "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500",
      },
      {
        id: 3,
        titulo: "Casa acogedora cerca del estadio",
        precioPorNoche: 1200,
        ciudadNombre: "Guadalupe",
        imagenUrl:
          "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500",
      },
      {
        id: 4,
        titulo: "Loft espacioso en Santa Catarina",
        precioPorNoche: 950,
        ciudadNombre: "Santa Catarina",
        imagenUrl:
          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500",
      },
      {
        id: 5,
        titulo: "Villa de lujo con vista a la montaña",
        precioPorNoche: 2500,
        ciudadNombre: "San Pedro Garza García",
        imagenUrl:
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500",
      },
      {
        id: 6,
        titulo: "Apartamento céntrico y acogedor",
        precioPorNoche: 700,
        ciudadNombre: "Monterrey",
        imagenUrl:
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
      },
    ];
    setResidencias(mockResidencias);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre,
        apellidoPaterno: user.apellidoPaterno,
        apellidoMaterno: user.apellidoMaterno,
      });
      setPreviewUrl(user.fotoPerfilUrl || "");
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Por favor selecciona una imagen válida");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen no debe superar los 5MB");
        return;
      }

      setNewProfilePic(file);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = () => {
    if (validateForm()) {
      console.log("Actualizando perfil:", formData);
      if (newProfilePic) {
        console.log("Nueva foto de perfil:", newProfilePic);
      }

      updateUser({
        ...formData,
        fotoPerfilUrl: previewUrl,
      });

      setIsEditing(false);
      setNewProfilePic(null);
      alert("Perfil actualizado exitosamente");
    }
  };

  const handleCancelEdit = () => {
    if (!user) return;
    setFormData({
      nombre: user.nombre,
      apellidoPaterno: user.apellidoPaterno,
      apellidoMaterno: user.apellidoMaterno,
    });
    setPreviewUrl(user.fotoPerfilUrl || "");
    setNewProfilePic(null);
    setErrors({});
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword) {
      alert("Por favor ingresa tu contraseña actual");
      return;
    }

    if (!passwordData.newPassword) {
      alert("Por favor ingresa una nueva contraseña");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/.test(
        passwordData.newPassword
      )
    ) {
      alert(
        "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial"
      );
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    console.log("Cambiando contraseña");

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsChangingPassword(false);
    alert("Contraseña actualizada exitosamente");
  };

  const getInitials = () => {
    return `${formData.nombre[0] || ""}${
      formData.apellidoPaterno[0] || ""
    }`.toUpperCase();
  };

  const getRolBadge = () => {
    if (!user) return null;
    if (user.rol === 0) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          <Shield className="h-4 w-4 mr-1" />
          Anfitrión
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <User className="h-4 w-4 mr-1" />
        Huésped
      </span>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Cargando...</h2>
          <p className="text-gray-600">Obteniendo información del perfil</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => (window.location.href = "/home")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Button>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={user.fotoPerfilUrl} alt={user.nombre} />
                    <AvatarFallback className="text-3xl">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <label
                      htmlFor="profilePic"
                      className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="h-5 w-5" />
                      <input
                        id="profilePic"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {user.nombre} {user.apellidoPaterno} {user.apellidoMaterno}
                  </h1>
                  <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {user.email}
                    </div>
                    {getRolBadge()}
                  </div>
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="gap-2"
                    >
                      <User className="h-4 w-4" />
                      Editar Perfil
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                {isEditing
                  ? "Actualiza tu información personal"
                  : "Detalles de tu cuenta"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">
                        Nombre <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        type="text"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        className={errors.nombre ? "border-red-500" : ""}
                      />
                      {errors.nombre && (
                        <p className="text-sm text-red-500">{errors.nombre}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="apellidoPaterno">
                        Apellido Paterno <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="apellidoPaterno"
                        name="apellidoPaterno"
                        type="text"
                        value={formData.apellidoPaterno}
                        onChange={handleInputChange}
                        className={
                          errors.apellidoPaterno ? "border-red-500" : ""
                        }
                      />
                      {errors.apellidoPaterno && (
                        <p className="text-sm text-red-500">
                          {errors.apellidoPaterno}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="apellidoMaterno">
                        Apellido Materno <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="apellidoMaterno"
                        name="apellidoMaterno"
                        type="text"
                        value={formData.apellidoMaterno}
                        onChange={handleInputChange}
                        className={
                          errors.apellidoMaterno ? "border-red-500" : ""
                        }
                      />
                      {errors.apellidoMaterno && (
                        <p className="text-sm text-red-500">
                          {errors.apellidoMaterno}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSaveProfile} className="gap-2">
                      <Save className="h-4 w-4" />
                      Guardar Cambios
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline">
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-500">Nombre</Label>
                      <p className="text-lg font-medium">{user.nombre}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Apellido Paterno</Label>
                      <p className="text-lg font-medium">
                        {user.apellidoPaterno}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Apellido Materno</Label>
                      <p className="text-lg font-medium">
                        {user.apellidoMaterno}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-500">
                        Correo Electrónico
                      </Label>
                      <p className="text-lg font-medium">{user.email}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Tipo de Usuario</Label>
                      <p className="text-lg font-medium">
                        {user.rol === 0 ? "Anfitrión" : "Huésped"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seguridad</CardTitle>
              <CardDescription>
                Gestiona la seguridad de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isChangingPassword ? (
                <Button
                  onClick={() => setIsChangingPassword(true)}
                  variant="outline"
                >
                  Cambiar Contraseña
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Contraseña Actual</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nueva Contraseña</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                    />
                    <p className="text-xs text-gray-500">
                      Mínimo 8 caracteres con mayúscula, minúscula, número y
                      carácter especial
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirmar Nueva Contraseña
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleChangePassword}>
                      Actualizar Contraseña
                    </Button>
                    <Button
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      variant="outline"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          {user.rol === 0 && (
            <Card className="mt-5">
              <CardHeader>
                <CardTitle>Mis propiedades</CardTitle>
                <CardDescription>
                  Gestiona tus propiedades desde aqui
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full flex justify-end">
                  {" "}
                  <CrearPropiedadDialog />
                </div>
                <div className="grid lg:grid-cols-2 gap-5 mt-4 sm:grid-cols-1">
                  {residencias.map((residencia) => (
                    <PropiedadCard residencia={residencia} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default Perfil;
