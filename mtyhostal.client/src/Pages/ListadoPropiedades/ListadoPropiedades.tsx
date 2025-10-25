import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Search,
  MapPin,
  DollarSign,
  SlidersHorizontal,
  Home,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import CrearPropiedadDialog from "@/Pages/Perfil/Components/CrearPropiedadDialog";
import EdicionPropiedadDialog from "./Components/EdicionPropiedadDialog";

interface Residencia {
  id: number;
  titulo: string;
  descripcion: string;
  direccion: string;
  precioPorNoche: number;
  ciudadSedeId?: number;
  ciudadNombre: string;
  imagenUrl?: string;
  isActive: boolean;
  reservacionesCount: number;
  createdAt: string;
}

const ListadoPropiedades = () => {
  const { user } = useAuth();
  const [residencias, setResidencias] = useState<Residencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCiudades, setSelectedCiudades] = useState<string[]>([]);
  const [precioMin, setPrecioMin] = useState<number>(0);
  const [precioMax, setPrecioMax] = useState<number>(10000);
  const [ordenamiento, setOrdenamiento] = useState<
    "precio-asc" | "precio-desc" | "fecha-asc" | "fecha-desc" | "ninguno"
  >("fecha-desc");
  const [filtroEstatus, setFiltroEstatus] = useState<
    "todas" | "activas" | "inactivas"
  >("todas");
  const [selectedResidencia, setSelectedResidencia] =
    useState<Residencia | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const ciudadesDisponibles = [
    "Monterrey",
    "San Pedro Garza García",
    "Guadalupe",
    "Santa Catarina",
    "San Nicolás de los Garza",
    "Apodaca",
    "Escobedo",
    "García",
  ];

  useEffect(() => {
    if (user) {
      obtenerPropiedades();
    }
  }, [user]);

  const obtenerPropiedades = async () => {
    try {
      setLoading(true);

      const mockResidencias: Residencia[] = [
        {
          id: 1,
          titulo: "Hermosa casa en San Pedro",
          descripcion:
            "Amplia casa con 4 habitaciones, jardín y alberca. Perfecta para familias.",
          direccion: "Av. Gómez Morín 1234",
          precioPorNoche: 1500,
          ciudadSedeId: 2,
          ciudadNombre: "San Pedro Garza García",
          imagenUrl:
            "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500",
          isActive: true,
          reservacionesCount: 12,
          createdAt: "2025-01-15",
        },
        {
          id: 2,
          titulo: "Villa de lujo con vista a la montaña",
          descripcion:
            "Espectacular villa con acabados de lujo y vista panorámica.",
          direccion: "Calle Sierra Madre 567",
          precioPorNoche: 2500,
          ciudadSedeId: 2,
          ciudadNombre: "San Pedro Garza García",
          imagenUrl:
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500",
          isActive: true,
          reservacionesCount: 8,
          createdAt: "2025-02-10",
        },
        {
          id: 3,
          titulo: "Apartamento céntrico y acogedor",
          descripcion:
            "Ideal para parejas o viajeros de negocios. Totalmente equipado.",
          direccion: "Av. Constitución 890",
          precioPorNoche: 700,
          ciudadSedeId: 1,
          ciudadNombre: "Monterrey",
          imagenUrl:
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
          isActive: false,
          reservacionesCount: 5,
          createdAt: "2024-12-20",
        },
        {
          id: 4,
          titulo: "Casa acogedora cerca del estadio",
          descripcion:
            "Ubicación estratégica cerca del estadio BBVA. Perfecta para eventos.",
          direccion: "Calle Tecnológico 345",
          precioPorNoche: 1200,
          ciudadSedeId: 3,
          ciudadNombre: "Guadalupe",
          imagenUrl:
            "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500",
          isActive: true,
          reservacionesCount: 15,
          createdAt: "2025-01-05",
        },
      ];

      setResidencias(mockResidencias);
    } catch (error: any) {
      console.error("Error al obtener propiedades:", error);
      toast.error("No se pudieron cargar las propiedades");
    } finally {
      setLoading(false);
    }
  };

  const toggleCiudad = (ciudad: string) => {
    setSelectedCiudades((prev) =>
      prev.includes(ciudad)
        ? prev.filter((c) => c !== ciudad)
        : [...prev, ciudad]
    );
  };

  const limpiarFiltros = () => {
    setSelectedCiudades([]);
    setPrecioMin(0);
    setPrecioMax(10000);
    setOrdenamiento("fecha-desc");
    setSearchQuery("");
    setFiltroEstatus("todas");
  };

  const toggleActivarPropiedad = async (id: number, currentStatus: boolean) => {
    try {
      console.log(`Cambiando estado de propiedad ${id} a ${!currentStatus}`);
      toast.success(
        `Propiedad ${!currentStatus ? "activada" : "desactivada"} exitosamente`
      );
      obtenerPropiedades();
    } catch (error: any) {
      console.error("Error al cambiar estado:", error);
      toast.error("No se pudo cambiar el estado de la propiedad");
    }
  };

  const handleEliminarPropiedad = async () => {
    if (!selectedResidencia) return;

    try {
      console.log(`Eliminando propiedad ${selectedResidencia.id}`);
      toast.success("Propiedad eliminada exitosamente");
      setDeleteDialogOpen(false);
      setSelectedResidencia(null);
      obtenerPropiedades();
    } catch (error: any) {
      console.error("Error al eliminar propiedad:", error);
      toast.error("No se pudo eliminar la propiedad");
    }
  };

  const filteredResidencias = residencias
    .filter((residencia) => {
      const matchesSearch =
        residencia.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        residencia.direccion.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCiudad =
        selectedCiudades.length === 0 ||
        selectedCiudades.includes(residencia.ciudadNombre);

      const matchesPrecio =
        residencia.precioPorNoche >= precioMin &&
        residencia.precioPorNoche <= precioMax;

      const matchesEstatus =
        filtroEstatus === "todas" ||
        (filtroEstatus === "activas" && residencia.isActive) ||
        (filtroEstatus === "inactivas" && !residencia.isActive);

      return matchesSearch && matchesCiudad && matchesPrecio && matchesEstatus;
    })
    .sort((a, b) => {
      switch (ordenamiento) {
        case "precio-asc":
          return a.precioPorNoche - b.precioPorNoche;
        case "precio-desc":
          return b.precioPorNoche - a.precioPorNoche;
        case "fecha-asc":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "fecha-desc":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

  const estadisticas = {
    total: residencias.length,
    activas: residencias.filter((r) => r.isActive).length,
    inactivas: residencias.filter((r) => !r.isActive).length,
    totalReservaciones: residencias.reduce(
      (sum, r) => sum + r.reservacionesCount,
      0
    ),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando propiedades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => (window.location.href = "/home")}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mis Propiedades
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona y administra tus propiedades publicadas
              </p>
            </div>
            <CrearPropiedadDialog />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Propiedades
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {estadisticas.total}
                  </p>
                </div>
                <Home className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Activas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {estadisticas.activas}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactivas</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {estadisticas.inactivas}
                  </p>
                </div>
                <EyeOff className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Reservaciones
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {estadisticas.totalReservaciones}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar por título o dirección..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 rounded-lg"
            />
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {filtroEstatus === "todas" ? (
                  <Home className="h-4 w-4" />
                ) : filtroEstatus === "activas" ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
                Estatus:{" "}
                {filtroEstatus === "todas"
                  ? "Todas"
                  : filtroEstatus === "activas"
                  ? "Activas"
                  : "Inactivas"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFiltroEstatus("todas")}>
                Todas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFiltroEstatus("activas")}>
                Activas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFiltroEstatus("inactivas")}>
                Inactivas
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <MapPin className="h-4 w-4" />
                Municipios
                {selectedCiudades.length > 0 && (
                  <span className="ml-1 bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs">
                    {selectedCiudades.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              <DropdownMenuLabel>Selecciona municipios</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ciudadesDisponibles.map((ciudad) => (
                <DropdownMenuCheckboxItem
                  key={ciudad}
                  checked={selectedCiudades.includes(ciudad)}
                  onCheckedChange={() => toggleCiudad(ciudad)}
                >
                  {ciudad}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <DollarSign className="h-4 w-4" />
                Precio
                {(precioMin > 0 || precioMax < 10000) && (
                  <span className="ml-1 bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs">
                    ✓
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 p-4">
              <DropdownMenuLabel>Rango de precio por noche</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Mínimo: ${precioMin.toLocaleString("es-MX")}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={precioMin}
                    onChange={(e) => setPrecioMin(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Máximo: ${precioMax.toLocaleString("es-MX")}
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="100"
                    value={precioMax}
                    onChange={(e) => setPrecioMax(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Ordenar
                {ordenamiento !== "fecha-desc" && (
                  <span className="ml-1 bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs">
                    ✓
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setOrdenamiento("fecha-desc")}>
                Más Recientes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOrdenamiento("fecha-asc")}>
                Más Antiguas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOrdenamiento("precio-asc")}>
                Precio: Menor a Mayor
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOrdenamiento("precio-desc")}>
                Precio: Mayor a Menor
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {(selectedCiudades.length > 0 ||
            precioMin > 0 ||
            precioMax < 10000 ||
            ordenamiento !== "fecha-desc" ||
            searchQuery ||
            filtroEstatus !== "todas") && (
            <Button
              variant="ghost"
              onClick={limpiarFiltros}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Limpiar filtros
            </Button>
          )}
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando{" "}
            <span className="font-semibold text-gray-900">
              {filteredResidencias.length}
            </span>{" "}
            de{" "}
            <span className="font-semibold text-gray-900">
              {residencias.length}
            </span>{" "}
            {residencias.length === 1 ? "propiedad" : "propiedades"}
          </p>
        </div>

        {filteredResidencias.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron propiedades
              </h3>
              <p className="text-gray-600 mb-6">
                {residencias.length === 0
                  ? "Crea tu primera propiedad para comenzar"
                  : "Intenta ajustar los filtros de búsqueda"}
              </p>
              {residencias.length === 0 && <CrearPropiedadDialog />}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredResidencias.map((residencia) => (
              <Card
                key={residencia.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className=" ml-3 sm:w-48 h-48 flex-shrink-0 relative">
                      <img
                        src={
                          residencia.imagenUrl ||
                          "https://via.placeholder.com/300x200?text=Sin+Imagen"
                        }
                        alt={residencia.titulo}
                        className="  w-full h-full object-cover rounded-lg sm:rounded-l-lg"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge
                          className={
                            residencia.isActive
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-gray-500 hover:bg-gray-600"
                          }
                        >
                          {residencia.isActive ? "Activa" : "Inactiva"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                          {residencia.titulo}
                        </h3>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {residencia.direccion}, {residencia.ciudadNombre}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span>
                            {residencia.reservacionesCount} reservaciones
                          </span>
                        </div>
                      </div>

                      <div className="flex items-baseline mb-4">
                        <span className="text-xl font-bold text-gray-900">
                          ${residencia.precioPorNoche.toLocaleString("es-MX")}
                        </span>
                        <span className="text-gray-600 ml-1">/ noche</span>
                      </div>

                      <Separator className="my-3" />

                      <div className="flex items-center gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => (window.location.href = `/propiedad`)}
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedResidencia(residencia);
                            setEditDialogOpen(true);
                          }}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            toggleActivarPropiedad(
                              residencia.id,
                              residencia.isActive
                            )
                          }
                          className="flex-1"
                        >
                          {residencia.isActive ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-1" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-1" />
                              Activar
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedResidencia(residencia);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedResidencia && (
        <EdicionPropiedadDialog
          residencia={selectedResidencia}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSuccess={obtenerPropiedades}
        />
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Confirmar Eliminación
            </DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. La propiedad será eliminada
              permanentemente.
            </DialogDescription>
          </DialogHeader>

          {selectedResidencia && (
            <div className="py-4">
              <p className="text-sm text-gray-600 mb-2">
                ¿Estás seguro que deseas eliminar esta propiedad?
              </p>
              <div className="bg-gray-50 rounded-lg p-3 border">
                <p className="font-semibold text-gray-900">
                  {selectedResidencia.titulo}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedResidencia.direccion}
                </p>
                {selectedResidencia.reservacionesCount > 0 && (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Tiene {selectedResidencia.reservacionesCount} reservaciones
                    registradas
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedResidencia(null);
              }}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleEliminarPropiedad}>
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar Propiedad
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListadoPropiedades;
