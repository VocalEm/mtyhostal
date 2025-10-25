import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  MapPin,
  Star,
  Share2,
  Heart,
  Calendar as CalendarIcon,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Ciudad {
  id: number;
  nombre: string;
}

interface Anfitrion {
  id: number;
  nombre: string;
  fotoPerfilUrl?: string;
}

interface Residencia {
  id: number;
  titulo: string;
  descripcion: string;
  precioPorNoche: number;
  ciudad: Ciudad;
  anfitrion: Anfitrion;
  imagenesUrls: string[];
  direccion?: string;
}

const Propiedad = () => {
  const [propiedad, setPropiedad] = useState<Residencia | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [guests, setGuests] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const mockPropiedad: Residencia = {
      id: 1,
      titulo: "Hermosa casa moderna en San Pedro",
      descripcion:
        "Disfruta de una estancia inolvidable en esta hermosa casa ubicada en el corazón de San Pedro Garza García. Perfecta para familias o grupos que visitan Monterrey para el Mundial 2026. \n\nLa casa cuenta con amplios espacios, decoración moderna y todas las comodidades que necesitas. Ubicada en una zona segura y tranquila, con fácil acceso a centros comerciales, restaurantes y el estadio. \n\nCaracterísticas destacadas:\n• 3 recámaras espaciosas con camas king size\n• 2.5 baños completos\n• Cocina equipada con electrodomésticos modernos\n• Sala y comedor amplios\n• Terraza con vista a las montañas\n• Estacionamiento para 2 autos\n• Internet de alta velocidad\n• Smart TV en todas las habitaciones\n• Aire acondicionado y calefacción\n• Seguridad 24/7",
      precioPorNoche: 1500,
      ciudad: {
        id: 1,
        nombre: "San Pedro Garza García",
      },
      anfitrion: {
        id: 1,
        nombre: "María González",
        fotoPerfilUrl: "",
      },
      imagenesUrls: [
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      ],
      direccion: "Av. Gómez Morín 1000, San Pedro Garza García, N.L.",
    };
    setPropiedad(mockPropiedad);
  }, []);

  const nextImage = () => {
    if (propiedad) {
      setCurrentImageIndex(
        (prev) => (prev + 1) % propiedad.imagenesUrls.length
      );
    }
  };

  const prevImage = () => {
    if (propiedad) {
      setCurrentImageIndex(
        (prev) =>
          (prev - 1 + propiedad.imagenesUrls.length) %
          propiedad.imagenesUrls.length
      );
    }
  };

  if (!propiedad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Cargando propiedad...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => (window.location.href = "/Home")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {propiedad.titulo}
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{propiedad.ciudad.nombre}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="relative h-96 sm:h-[500px] rounded-xl overflow-hidden bg-gray-200">
              <img
                src={propiedad.imagenesUrls[currentImageIndex]}
                alt={`${propiedad.titulo} - Imagen ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {propiedad.imagenesUrls.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-800" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                  >
                    <ChevronRight className="h-6 w-6 text-gray-800" />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {propiedad.imagenesUrls.length}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-5 gap-2">
              {propiedad.imagenesUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-20 rounded-lg overflow-hidden ${
                    index === currentImageIndex
                      ? "ring-2 ring-blue-600"
                      : "hover:opacity-75 transition-opacity"
                  }`}
                >
                  <img
                    src={url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-lg">
                <CardContent className="p-6 space-y-6">
                  <div className="border-b pb-4">
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-3xl font-bold text-gray-900">
                        ${propiedad.precioPorNoche.toLocaleString("es-MX")}
                      </span>
                      <span className="text-gray-600">MXN / noche</span>
                    </div>
                  </div>

                  <a href="/Reservacion">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold">
                      Reservar ahora
                    </Button>
                  </a>

                  <Separator />

                  <div className="flex items-center gap-3 pt-2">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={propiedad.anfitrion.fotoPerfilUrl} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {propiedad.anfitrion.nombre[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Anfitrión: {propiedad.anfitrion.nombre}
                      </p>
                      <p className="text-xs text-gray-600">Se unió en 2024</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-semibold mb-1">
                    Anfitrión: {propiedad.anfitrion.nombre}
                  </h2>
                  <p className="text-gray-600">
                    Ubicación en {propiedad.ciudad.nombre}
                  </p>
                </div>
                <Avatar className="h-16 w-16">
                  <AvatarImage src={propiedad.anfitrion.fotoPerfilUrl} />
                  <AvatarFallback className="text-xl">
                    {propiedad.anfitrion.nombre[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div className="pb-8 border-b border-gray-200">
              <h3 className="text-xl font-semibold mb-4">
                Acerca de este espacio
              </h3>
              <div className="text-gray-700 whitespace-pre-line">
                {showFullDescription
                  ? propiedad.descripcion
                  : propiedad.descripcion.slice(0, 300) + "..."}
              </div>
              <Button
                variant="link"
                className="mt-2 p-0 h-auto font-semibold"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? "Mostrar menos" : "Mostrar más"}
              </Button>
            </div>

            <div className="pb-8 border-b border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Ubicación</h3>
              <div className="flex items-center gap-2 text-gray-700 mb-4">
                <MapPin className="h-5 w-5" />
                <span>{propiedad.direccion || propiedad.ciudad.nombre}</span>
              </div>
              <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center text-gray-500">
                Mapa de ubicación (integrar Google Maps)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Label = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <label className={className}>{children}</label>;

export default Propiedad;
