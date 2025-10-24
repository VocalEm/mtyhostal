import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Menu,
  Search,
  MapPin,
  SlidersHorizontal,
  DollarSign,
} from "lucide-react";

const logoImage =
  "https://res.cloudinary.com/dxstpixjr/image/upload/v1760911746/mtyhostal_logo_dark_apoeqv.png";

interface ResidenciaCard {
  id: number;
  titulo: string;
  precioPorNoche: number;
  ciudadNombre: string;
  imagenUrl?: string;
}

const Home = () => {
  // Estado para simular si hay un usuario en sesión (cambiar por contexto real después)
  const [user, setUser] = useState<{
    nombre: string;
    fotoPerfilUrl?: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [residencias, setResidencias] = useState<ResidenciaCard[]>([]);

  // Estados para filtros
  const [selectedCiudades, setSelectedCiudades] = useState<string[]>([]);
  const [precioMin, setPrecioMin] = useState<number>(0);
  const [precioMax, setPrecioMax] = useState<number>(10000);
  const [ordenamiento, setOrdenamiento] = useState<
    "menor" | "mayor" | "ninguno"
  >("ninguno");

  // Ciudades disponibles en Nuevo León
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

  // Datos de ejemplo (reemplazar con API call después)
  useEffect(() => {
    // TODO: Implementar llamada a la API para obtener residencias
    const mockResidencias: ResidenciaCard[] = [
      {
        id: 1,
        titulo: "Hermosa casa en San Pedro",
        precioPorNoche: 1500,
        ciudadNombre: "San Pedro Garza García",
        imagenUrl:
          "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500",
      },
      {
        id: 2,
        titulo: "Departamento moderno en Monterrey Centro",
        precioPorNoche: 800,
        ciudadNombre: "Monterrey",
        imagenUrl:
          "https://images.unsplash.com/photo-1502672260066-6bc2a9d2c953?w=500",
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

  const handleLogout = () => {
    // TODO: Implementar logout real
    setUser(null);
    console.log("Cerrando sesión...");
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
    setOrdenamiento("ninguno");
    setSearchQuery("");
  };

  const filteredResidencias = residencias
    .filter((residencia) => {
      // Filtro de búsqueda por texto
      const matchesSearch =
        residencia.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        residencia.ciudadNombre
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      // Filtro por ciudades seleccionadas
      const matchesCiudad =
        selectedCiudades.length === 0 ||
        selectedCiudades.includes(residencia.ciudadNombre);

      // Filtro por rango de precio
      const matchesPrecio =
        residencia.precioPorNoche >= precioMin &&
        residencia.precioPorNoche <= precioMax;

      return matchesSearch && matchesCiudad && matchesPrecio;
    })
    .sort((a, b) => {
      if (ordenamiento === "menor") {
        return a.precioPorNoche - b.precioPorNoche;
      } else if (ordenamiento === "mayor") {
        return b.precioPorNoche - a.precioPorNoche;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/">
                <img
                  src={logoImage}
                  alt="MtyHostal"
                  className="h-12 sm:h-16 w-auto"
                />
              </a>
            </div>

            {/* Centered Search Bar - Hidden on mobile */}
            <div className="hidden lg:flex flex-1 justify-center">
              <div className="w-full max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Buscar por ciudad o nombre de residencia..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-6 rounded-full border-gray-300 shadow-sm hover:shadow-md transition-shadow w-full"
                  />
                </div>
              </div>
            </div>
            {/* User Menu / Login Button */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {user ? (
                // Usuario autenticado
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 border border-gray-300 rounded-full py-2 px-3 hover:shadow-md transition-shadow">
                      <Menu className="h-5 w-5 text-gray-600" />
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.fotoPerfilUrl}
                          alt={user.nombre}
                        />
                        <AvatarFallback>{user.nombre[0]}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>
                      <a href="/perfil" className="w-full">
                        Mi Perfil
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <a href="/mis-reservaciones" className="w-full">
                        Mis Reservaciones
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <a href="/mis-residencias" className="w-full">
                        Mis Residencias
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600"
                    >
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // Usuario no autenticado
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => (window.location.href = "/register")}
                    className="hidden sm:inline-flex"
                  >
                    Registrarse
                  </Button>
                  <Button onClick={() => (window.location.href = "/login")}>
                    Iniciar Sesión
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden pb-4">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar residencias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-5 rounded-full border-gray-300 shadow-sm"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Hospedaje en Nuevo León
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100">
            Encuentra tu hogar temporal para el Mundial 2026
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters Bar */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          {/* Filtro de Municipios */}
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

          {/* Filtro de Precio */}
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

          {/* Ordenamiento */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Ordenar
                {ordenamiento !== "ninguno" && (
                  <span className="ml-1 bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs">
                    ✓
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Ordenar por precio</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setOrdenamiento("ninguno")}>
                Ninguno
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOrdenamiento("menor")}>
                Precio: Menor a Mayor
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOrdenamiento("mayor")}>
                Precio: Mayor a Menor
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Limpiar Filtros */}
          {(selectedCiudades.length > 0 ||
            precioMin > 0 ||
            precioMax < 10000 ||
            ordenamiento !== "ninguno" ||
            searchQuery) && (
            <Button
              variant="ghost"
              onClick={limpiarFiltros}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Limpiar filtros
            </Button>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {filteredResidencias.length > 0
              ? `${filteredResidencias.length} ${
                  filteredResidencias.length === 1
                    ? "residencia encontrada"
                    : "residencias encontradas"
                }`
              : "No se encontraron residencias"}
          </h2>
          {selectedCiudades.length > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              Filtrando por: {selectedCiudades.join(", ")}
            </p>
          )}
        </div>

        {/* Properties Grid */}
        {filteredResidencias.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResidencias.map((residencia) => (
              <a key={residencia.id} href={`/property`} className="block">
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-gray-200">
                    <img
                      src={
                        residencia.imagenUrl ||
                        "https://via.placeholder.com/400x300?text=Sin+Imagen"
                      }
                      alt={residencia.titulo}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
                        {residencia.titulo}
                      </h3>
                    </div>

                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{residencia.ciudadNombre}</span>
                    </div>

                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold text-gray-900">
                        ${residencia.precioPorNoche.toLocaleString("es-MX")}
                      </span>
                      <span className="text-gray-600 ml-1">/ noche</span>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-gray-600">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 MtyHostal. Todos los derechos reservados.</p>
            <p className="text-sm mt-2">
              Hospedaje para el Mundial 2026 en Nuevo León
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
