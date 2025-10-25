import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload, X } from "lucide-react";
import { toast } from "sonner";
import Api from "@/services/Api";

interface Ciudad {
  id: number;
  nombre: string;
}

interface PropiedadFormData {
  titulo: string;
  descripcion: string;
  direccion: string;
  precioPorNoche: string;
  ciudadSedeId: string;
}

interface FormErrors {
  titulo?: string;
  descripcion?: string;
  direccion?: string;
  precioPorNoche?: string;
  ciudadSedeId?: string;
  imagenes?: string;
}

export function CrearPropiedadDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<PropiedadFormData>({
    titulo: "",
    descripcion: "",
    direccion: "",
    precioPorNoche: "",
    ciudadSedeId: "",
  });

  useEffect(() => {
    const fetchCiudades = async () => {
      try {
        const mockCiudades: Ciudad[] = [
          { id: 1, nombre: "Monterrey" },
          { id: 2, nombre: "San Pedro Garza García" },
          { id: 3, nombre: "Guadalupe" },
          { id: 4, nombre: "Santa Catarina" },
          { id: 5, nombre: "San Nicolás de los Garza" },
          { id: 6, nombre: "Apodaca" },
          { id: 7, nombre: "Escobedo" },
          { id: 8, nombre: "García" },
        ];
        setCiudades(mockCiudades);
      } catch (error) {
        console.error("Error al cargar ciudades:", error);
      }
    };

    if (open) {
      fetchCiudades();
    }
  }, [open]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of newFiles) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} no es una imagen válida`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} excede el tamaño máximo de 5MB`);
        continue;
      }

      validFiles.push(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validFiles.length) {
          setPreviewUrls((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    }

    setImagenes((prev) => [...prev, ...validFiles]);
    if (errors.imagenes) {
      setErrors((prev) => ({ ...prev, imagenes: undefined }));
    }
  };

  const removeImage = (index: number) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = "El título es requerido";
    } else if (formData.titulo.length > 200) {
      newErrors.titulo = "El título no puede exceder 200 caracteres";
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    } else if (formData.descripcion.length > 2000) {
      newErrors.descripcion = "La descripción no puede exceder 2000 caracteres";
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es requerida";
    } else if (formData.direccion.length > 250) {
      newErrors.direccion = "La dirección no puede exceder 250 caracteres";
    }

    if (!formData.precioPorNoche) {
      newErrors.precioPorNoche = "El precio es requerido";
    } else {
      const precio = parseFloat(formData.precioPorNoche);
      if (isNaN(precio) || precio < 1 || precio > 99999.99) {
        newErrors.precioPorNoche = "El precio debe estar entre 1 y 99999.99";
      }
    }

    if (!formData.ciudadSedeId) {
      newErrors.ciudadSedeId = "Debes seleccionar una ciudad";
    }

    if (imagenes.length === 0) {
      newErrors.imagenes = "Debes subir al menos una imagen";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        Titulo: formData.titulo,
        Descripcion: formData.descripcion,
        Direccion: formData.direccion,
        PrecioPorNoche: parseFloat(formData.precioPorNoche),
        CiudadSedeId: parseInt(formData.ciudadSedeId),
      };

      const { data } = await Api.post("/residencias", payload);
      const residenciaId = data.id;

      if (imagenes.length > 0) {
        const formDataImages = new FormData();
        imagenes.forEach((imagen) => {
          formDataImages.append("files", imagen);
        });

        await Api.post(
          `/residencias/${residenciaId}/imagenes`,
          formDataImages,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      toast.success("Propiedad creada exitosamente");
      setOpen(false);
      resetForm();

      setTimeout(() => {
        window.location.reload();
      }, 1000);
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
        } else {
          toast.error("Error al validar los datos del formulario");
        }
      } else if (response?.status === 403) {
        toast.error("No tienes permisos para crear propiedades");
      } else if (response?.status === 401) {
        toast.error("Debes iniciar sesión como anfitrión");
      } else {
        toast.error("Error al crear la propiedad. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      descripcion: "",
      direccion: "",
      precioPorNoche: "",
      ciudadSedeId: "",
    });
    setImagenes([]);
    setPreviewUrls([]);
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Crear propiedad
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Crear nueva propiedad</DialogTitle>
          <DialogDescription>
            Completa los datos de tu propiedad para publicarla en MtyHostal
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">
              Título de la propiedad <span className="text-red-500">*</span>
            </Label>
            <Input
              id="titulo"
              name="titulo"
              type="text"
              placeholder="Ej: Hermosa casa en San Pedro"
              value={formData.titulo}
              onChange={handleInputChange}
              className={errors.titulo ? "border-red-500" : ""}
              maxLength={200}
            />
            {errors.titulo && (
              <p className="text-sm text-red-500">{errors.titulo}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">
              Descripción <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              placeholder="Describe tu propiedad: características, amenidades, ubicación..."
              value={formData.descripcion}
              onChange={handleInputChange}
              className={errors.descripcion ? "border-red-500" : ""}
              rows={5}
              maxLength={2000}
            />
            <p className="text-xs text-gray-500">
              {formData.descripcion.length}/2000 caracteres
            </p>
            {errors.descripcion && (
              <p className="text-sm text-red-500">{errors.descripcion}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="direccion">
                Dirección <span className="text-red-500">*</span>
              </Label>
              <Input
                id="direccion"
                name="direccion"
                type="text"
                placeholder="Calle, Número, Colonia"
                value={formData.direccion}
                onChange={handleInputChange}
                className={errors.direccion ? "border-red-500" : ""}
                maxLength={250}
              />
              {errors.direccion && (
                <p className="text-sm text-red-500">{errors.direccion}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ciudadSedeId">
                Ciudad <span className="text-red-500">*</span>
              </Label>
              <select
                id="ciudadSedeId"
                name="ciudadSedeId"
                value={formData.ciudadSedeId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    ciudadSedeId: e.target.value,
                  }))
                }
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.ciudadSedeId ? "border-red-500" : ""
                }`}
              >
                <option value="">Selecciona una ciudad</option>
                {ciudades.map((ciudad) => (
                  <option key={ciudad.id} value={ciudad.id.toString()}>
                    {ciudad.nombre}
                  </option>
                ))}
              </select>
              {errors.ciudadSedeId && (
                <p className="text-sm text-red-500">{errors.ciudadSedeId}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="precioPorNoche">
              Precio por noche (MXN) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="precioPorNoche"
              name="precioPorNoche"
              type="number"
              placeholder="1500"
              value={formData.precioPorNoche}
              onChange={handleInputChange}
              className={errors.precioPorNoche ? "border-red-500" : ""}
              min="1"
              max="99999.99"
              step="0.01"
            />
            {errors.precioPorNoche && (
              <p className="text-sm text-red-500">{errors.precioPorNoche}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imagenes">
              Imágenes de la propiedad <span className="text-red-500">*</span>
            </Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input
                id="imagenes"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="imagenes"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-12 w-12 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  Click para subir imágenes
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF hasta 5MB por imagen
                </span>
              </label>
            </div>
            {errors.imagenes && (
              <p className="text-sm text-red-500">{errors.imagenes}</p>
            )}

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Creando..." : "Crear propiedad"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CrearPropiedadDialog;
