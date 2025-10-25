import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  User,
  Home,
  XCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

const EstatusReservacion = {
  Pendiente: 0,
  Pagada: 1,
  Cancelada: 2,
} as const;

type EstatusReservacionType =
  (typeof EstatusReservacion)[keyof typeof EstatusReservacion];

interface Reservacion {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  estatus: EstatusReservacionType;
  precioTotal: number;
  residenciaId: number;
  residencia: {
    id: number;
    titulo: string;
    direccion: string;
    ciudadNombre: string;
    imagenUrl?: string;
    anfitrionNombre: string;
  };
}

const ReservacionesHuesped = () => {
  const { user } = useAuth();
  const [reservaciones, setReservaciones] = useState<Reservacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservacion, setSelectedReservacion] =
    useState<Reservacion | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      obtenerReservaciones();
    }
  }, [user]);

  const obtenerReservaciones = async () => {
    try {
      setLoading(true);

      const mockReservaciones: Reservacion[] = [
        {
          id: 1,
          fechaInicio: "2025-11-01",
          fechaFin: "2025-11-05",
          estatus: EstatusReservacion.Pagada,
          precioTotal: 6000,
          residenciaId: 1,
          residencia: {
            id: 1,
            titulo: "Hermosa casa en San Pedro",
            direccion: "Av. Gómez Morín 1234",
            ciudadNombre: "San Pedro Garza García",
            imagenUrl:
              "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500",
            anfitrionNombre: "Juan Pérez",
          },
        },
        {
          id: 2,
          fechaInicio: "2025-12-15",
          fechaFin: "2025-12-20",
          estatus: EstatusReservacion.Pendiente,
          precioTotal: 7500,
          residenciaId: 2,
          residencia: {
            id: 2,
            titulo: "Villa de lujo con vista a la montaña",
            direccion: "Calle Sierra Madre 567",
            ciudadNombre: "San Pedro Garza García",
            imagenUrl:
              "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500",
            anfitrionNombre: "María González",
          },
        },
        {
          id: 3,
          fechaInicio: "2025-10-10",
          fechaFin: "2025-10-12",
          estatus: EstatusReservacion.Cancelada,
          precioTotal: 2400,
          residenciaId: 3,
          residencia: {
            id: 3,
            titulo: "Apartamento céntrico y acogedor",
            direccion: "Av. Constitución 890",
            ciudadNombre: "Monterrey",
            imagenUrl:
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
            anfitrionNombre: "Carlos Rodríguez",
          },
        },
      ];

      setReservaciones(mockReservaciones);
    } catch (error: any) {
      console.error("Error al obtener reservaciones:", error);
      toast.error("No se pudieron cargar las reservaciones");
    } finally {
      setLoading(false);
    }
  };

  const getEstatusConfig = (estatus: EstatusReservacionType) => {
    switch (estatus) {
      case EstatusReservacion.Pagada:
        return {
          label: "Pagada",
          variant: "default" as const,
          icon: CheckCircle,
          className: "bg-green-500 hover:bg-green-600 text-white",
        };
      case EstatusReservacion.Pendiente:
        return {
          label: "Pendiente",
          variant: "secondary" as const,
          icon: AlertCircle,
          className: "bg-yellow-500 hover:bg-yellow-600 text-white",
        };
      case EstatusReservacion.Cancelada:
        return {
          label: "Cancelada",
          variant: "destructive" as const,
          icon: XCircle,
          className: "bg-red-500 hover:bg-red-600 text-white",
        };
      default:
        return {
          label: "Desconocido",
          variant: "secondary" as const,
          icon: AlertCircle,
          className: "bg-gray-500 hover:bg-gray-600 text-white",
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateNights = (inicio: string, fin: string) => {
    const start = new Date(inicio);
    const end = new Date(fin);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleVerDetalles = (reservacion: Reservacion) => {
    setSelectedReservacion(reservacion);
    setDialogOpen(true);
  };

  const handleCancelarReservacion = async (reservacionId: number) => {
    try {
      console.log(`Cancelando reservación ${reservacionId}`);
      toast.success("Reservación cancelada exitosamente");
      obtenerReservaciones();
      setDialogOpen(false);
    } catch (error: any) {
      console.error("Error al cancelar reservación:", error);
      toast.error("No se pudo cancelar la reservación");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reservaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => (window.location.href = "/home")}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mis Reservaciones
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona y revisa todas tus reservaciones
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {reservaciones.length}{" "}
              {reservaciones.length === 1 ? "Reservación" : "Reservaciones"}
            </Badge>
          </div>
        </div>

        {/* Lista de Reservaciones */}
        {reservaciones.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No tienes reservaciones
              </h3>
              <p className="text-gray-600 mb-6">
                Explora nuestras propiedades y realiza tu primera reservación
              </p>
              <Button onClick={() => (window.location.href = "/home")}>
                Explorar propiedades
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reservaciones.map((reservacion) => {
              const estatusConfig = getEstatusConfig(reservacion.estatus);
              const Icon = estatusConfig.icon;
              const noches = calculateNights(
                reservacion.fechaInicio,
                reservacion.fechaFin
              );

              return (
                <Card
                  key={reservacion.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleVerDetalles(reservacion)}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-64 h-48 sm:h-auto flex-shrink-0">
                        <img
                          src={
                            reservacion.residencia.imagenUrl ||
                            "https://via.placeholder.com/300x200?text=Sin+Imagen"
                          }
                          alt={reservacion.residencia.titulo}
                          className="w-full h-full object-cover sm:rounded-l-lg"
                        />
                      </div>

                      {/* Contenido */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {reservacion.residencia.titulo}
                            </h3>
                            <div className="flex items-center text-gray-600 text-sm mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              {reservacion.residencia.direccion},{" "}
                              {reservacion.residencia.ciudadNombre}
                            </div>
                            <div className="flex items-center text-gray-600 text-sm">
                              <User className="h-4 w-4 mr-1" />
                              Anfitrión:{" "}
                              {reservacion.residencia.anfitrionNombre}
                            </div>
                          </div>

                          <Badge className={estatusConfig.className}>
                            <Icon className="h-3 w-3 mr-1" />
                            {estatusConfig.label}
                          </Badge>
                        </div>

                        <Separator className="my-4" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-start gap-2">
                            <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Check-in
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {formatDate(reservacion.fechaInicio)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Check-out
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {formatDate(reservacion.fechaFin)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Duración
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {noches} {noches === 1 ? "noche" : "noches"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="text-xs text-gray-500">
                                Precio Total
                              </p>
                              <p className="text-lg font-bold text-gray-900">
                                $
                                {reservacion.precioTotal.toLocaleString(
                                  "es-MX"
                                )}{" "}
                                MXN
                              </p>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVerDetalles(reservacion);
                            }}
                          >
                            Ver detalles
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Detalles */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedReservacion && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  Detalles de la Reservación
                </DialogTitle>
                <DialogDescription>
                  ID de Reservación: #{selectedReservacion.id}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <img
                    src={
                      selectedReservacion.residencia.imagenUrl ||
                      "https://via.placeholder.com/600x300?text=Sin+Imagen"
                    }
                    alt={selectedReservacion.residencia.titulo}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge
                      className={
                        getEstatusConfig(selectedReservacion.estatus).className
                      }
                    >
                      {getEstatusConfig(selectedReservacion.estatus).label}
                    </Badge>
                  </div>
                </div>

                {/* Información de la propiedad */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedReservacion.residencia.titulo}
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {selectedReservacion.residencia.direccion},{" "}
                        {selectedReservacion.residencia.ciudadNombre}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>
                        Anfitrión:{" "}
                        {selectedReservacion.residencia.anfitrionNombre}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Fechas y duración */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        Check-in
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">
                        {formatDate(selectedReservacion.fechaInicio)}
                      </p>
                      <p className="text-sm text-gray-500">
                        A partir de las 15:00
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        Check-out
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">
                        {formatDate(selectedReservacion.fechaFin)}
                      </p>
                      <p className="text-sm text-gray-500">Hasta las 11:00</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Resumen de precio */}
                <Card className="bg-gray-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Resumen de Pago</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>
                        $
                        {(
                          selectedReservacion.precioTotal /
                          calculateNights(
                            selectedReservacion.fechaInicio,
                            selectedReservacion.fechaFin
                          )
                        ).toLocaleString("es-MX")}{" "}
                        x{" "}
                        {calculateNights(
                          selectedReservacion.fechaInicio,
                          selectedReservacion.fechaFin
                        )}{" "}
                        noches
                      </span>
                      <span>
                        $
                        {selectedReservacion.precioTotal.toLocaleString(
                          "es-MX"
                        )}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-green-600">
                        $
                        {selectedReservacion.precioTotal.toLocaleString(
                          "es-MX"
                        )}{" "}
                        MXN
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Información adicional */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">
                        Política de Cancelación
                      </p>
                      <p>
                        Las cancelaciones realizadas con más de 7 días de
                        anticipación tienen reembolso completo. Cancelaciones
                        con menos de 7 días no son reembolsables.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2">
                {selectedReservacion.estatus ===
                  EstatusReservacion.Pendiente && (
                  <Button
                    variant="destructive"
                    onClick={() =>
                      handleCancelarReservacion(selectedReservacion.id)
                    }
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancelar Reservación
                  </Button>
                )}
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cerrar
                </Button>
                <Button
                  onClick={() =>
                    (window.location.href = `/propiedad/${selectedReservacion.residenciaId}`)
                  }
                >
                  <Home className="h-4 w-4 mr-2" />
                  Ver Propiedad
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReservacionesHuesped;
