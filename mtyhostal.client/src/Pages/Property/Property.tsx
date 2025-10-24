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

const Property = () => {
  // Estado para la propiedad (reemplazar con API call usando el ID de la URL)
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

  // Simular carga de datos (reemplazar con useEffect que llame a la API)
  useEffect(() => {
    // TODO: Obtener ID de la URL y hacer llamada a la API
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
        "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800",
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

  const calculateNights = () => {
    if (dateRange.from && dateRange.to) {
      const nights = Math.ceil(
        (dateRange.to.getTime() - dateRange.from.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      return nights;
    }
    return 0;
  };

  const calculateTotal = () => {
    if (propiedad) {
      const nights = calculateNights();
      const subtotal = propiedad.precioPorNoche * nights;
      const serviceFee = subtotal * 0.1; // 10% comisión
      return subtotal + serviceFee;
    }
    return 0;
  };

  const handleReserve = () => {
    if (!dateRange.from || !dateRange.to) {
      alert("Por favor selecciona las fechas de tu estadía");
      return;
    }

    // TODO: Implementar lógica de reservación
    console.log("Reservando:", {
      propiedadId: propiedad?.id,
      fechaInicio: dateRange.from,
      fechaFin: dateRange.to,
      huespedes: guests,
      total: calculateTotal(),
    });

    alert("Reservación iniciada");
  };

  if (!propiedad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Cargando propiedad...</p>
      </div>
    );
  }

  const nights = calculateNights();
  const subtotal = propiedad.precioPorNoche * nights;
  const serviceFee = subtotal * 0.1;
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
        {/* Title and Actions */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {propiedad.titulo}
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">4.8</span>
                <span className="text-gray-600">(24 reseñas)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{propiedad.ciudad.nombre}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Compartir</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span className="hidden sm:inline">Guardar</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative h-96 sm:h-[500px] rounded-xl overflow-hidden bg-gray-200">
            <img
              src={propiedad.imagenesUrls[currentImageIndex]}
              alt={`${propiedad.titulo} - Imagen ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Navigation Arrows */}
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

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {propiedad.imagenesUrls.length}
            </div>
          </div>

          {/* Thumbnail Gallery */}
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host Info */}
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

            {/* Description */}
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

            {/* Location */}
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

            {/* Reviews Preview */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                <h3 className="text-xl font-semibold">4.8 · 24 reseñas</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mock Reviews */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar>
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">Juan Díaz</p>
                        <p className="text-sm text-gray-500">Marzo 2025</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Excelente lugar, muy limpio y cómodo. Perfecto para
                      disfrutar del mundial.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar>
                        <AvatarFallback>LM</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">Laura Martínez</p>
                        <p className="text-sm text-gray-500">Febrero 2025</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">
                      La anfitriona fue muy amable y la casa es tal como se ve
                      en las fotos.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    ${propiedad.precioPorNoche.toLocaleString("es-MX")}
                    <span className="text-base font-normal text-gray-600">
                      {" "}
                      / noche
                    </span>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">4.8</span>
                    <span>(24 reseñas)</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Date Selection */}
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">
                      Fechas de estadía
                    </Label>
                    <div className="border border-gray-300 rounded-lg p-3 hover:border-gray-400 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">
                          {dateRange.from && dateRange.to
                            ? `${dateRange.from.toLocaleDateString(
                                "es-MX"
                              )} - ${dateRange.to.toLocaleDateString("es-MX")}`
                            : dateRange.from
                            ? `${dateRange.from.toLocaleDateString(
                                "es-MX"
                              )} - Selecciona fecha final`
                            : "Selecciona fechas de entrada y salida"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-center">
                      <Calendar
                        mode="range"
                        selected={dateRange as any}
                        onSelect={(range: any) => {
                          if (range) {
                            setDateRange({
                              from: range.from,
                              to: range.to,
                            });
                          } else {
                            setDateRange({ from: undefined, to: undefined });
                          }
                        }}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                        numberOfMonths={1}
                        className="rounded-md border p-3"
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">
                      Número de huéspedes
                    </Label>
                    <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between hover:border-gray-400 transition-colors">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">
                          {guests} {guests === 1 ? "huésped" : "huéspedes"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                          disabled={guests <= 1}
                          className="h-8 w-8 p-0"
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {guests}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setGuests(Math.min(10, guests + 1))}
                          disabled={guests >= 10}
                          className="h-8 w-8 p-0"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    {guests >= 10 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Capacidad máxima: 10 huéspedes
                      </p>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  {nights > 0 && dateRange.from && dateRange.to && (
                    <div className="space-y-3 pt-4">
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            ${propiedad.precioPorNoche.toLocaleString("es-MX")}{" "}
                            x {nights} {nights === 1 ? "noche" : "noches"}
                          </span>
                          <span className="font-medium">
                            ${subtotal.toLocaleString("es-MX")}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Tarifa de servicio (10%)
                          </span>
                          <span className="font-medium">
                            ${serviceFee.toLocaleString("es-MX")}
                          </span>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">Total</span>
                        <span className="font-bold text-xl text-blue-600">
                          ${total.toLocaleString("es-MX")} MXN
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleReserve}
                    className="w-full mt-4"
                    size="lg"
                    disabled={!dateRange.from || !dateRange.to}
                  >
                    {dateRange.from && dateRange.to
                      ? "Reservar ahora"
                      : "Selecciona fechas para reservar"}
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    {dateRange.from && dateRange.to
                      ? "No se te cobrará en este momento"
                      : "Selecciona las fechas de tu estadía"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for Label
const Label = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <label className={className}>{children}</label>;

export default Property;
