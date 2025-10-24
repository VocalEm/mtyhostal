import { useState } from "react";
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

type RolUsuario = "Anfitrion" | "Huesped";

interface UserProfile {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  rol: RolUsuario;
  fotoPerfilUrl?: string;
}

interface FormErrors {
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
}

const Profile = () => {
  // Estado para simular usuario actual (reemplazar con contexto/API real)
  const [user, setUser] = useState<UserProfile>({
    id: 1,
    nombre: "Juan",
    apellidoPaterno: "Pérez",
    apellidoMaterno: "García",
    email: "juan.perez@ejemplo.com",
    rol: "Huesped",
    fotoPerfilUrl: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user.nombre,
    apellidoPaterno: user.apellidoPaterno,
    apellidoMaterno: user.apellidoMaterno,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    user.fotoPerfilUrl || ""
  );
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        alert("Por favor selecciona una imagen válida");
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen no debe superar los 5MB");
        return;
      }

      setNewProfilePic(file);

      // Crear preview
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
      // TODO: Implementar llamada a la API para actualizar perfil
      console.log("Actualizando perfil:", formData);
      if (newProfilePic) {
        console.log("Nueva foto de perfil:", newProfilePic);
      }

      // Actualizar estado local
      setUser((prev) => ({
        ...prev,
        ...formData,
        fotoPerfilUrl: previewUrl,
      }));

      setIsEditing(false);
      setNewProfilePic(null);
      alert("Perfil actualizado exitosamente");
    }
  };

  const handleCancelEdit = () => {
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
    // Validaciones
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

    // TODO: Implementar llamada a la API para cambiar contraseña
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
    if (user.rol === "Anfitrion") {
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => (window.location.href = "/")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Button>

        {/* Profile Header Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={previewUrl} alt={user.nombre} />
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

              {/* User Info */}
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
                  <Button onClick={() => setIsEditing(true)} className="gap-2">
                    <User className="h-4 w-4" />
                    Editar Perfil
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Card */}
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
              // Edit Mode
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre */}
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

                  {/* Apellido Paterno */}
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
                      className={errors.apellidoPaterno ? "border-red-500" : ""}
                    />
                    {errors.apellidoPaterno && (
                      <p className="text-sm text-red-500">
                        {errors.apellidoPaterno}
                      </p>
                    )}
                  </div>

                  {/* Apellido Materno */}
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
                      className={errors.apellidoMaterno ? "border-red-500" : ""}
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
              // View Mode
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
                    <Label className="text-gray-500">Correo Electrónico</Label>
                    <p className="text-lg font-medium">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Tipo de Usuario</Label>
                    <p className="text-lg font-medium">
                      {user.rol === "Anfitrion" ? "Anfitrión" : "Huésped"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Card */}
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
      </div>
    </div>
  );
};

export default Profile;
