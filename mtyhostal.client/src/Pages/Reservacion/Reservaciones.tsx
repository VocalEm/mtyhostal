import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Users,
  CreditCard,
  Check,
  AlertCircle,
  MapPin,
} from "lucide-react";

interface Residencia {
  id: number;
  titulo: string;
  descripcion: string;
  precioPorNoche: number;
  ciudad: string;
  direccion: string;
  imagenUrl?: string;
  anfitrion: {
    nombre: string;
    fotoPerfilUrl?: string;
  };
}

interface ReservationFormData {
  fechaInicio: Date | undefined;
  fechaFin: Date | undefined;
  numeroHuespedes: number;
  nombreCompleto: string;
  telefono: string;
  email: string;
  notasEspeciales: string;
  numeroTarjeta: string;
  nombreTarjeta: string;
  fechaExpiracion: string;
  cvv: string;
}

interface FormErrors {
  fechas?: string;
  numeroHuespedes?: string;
  nombreCompleto?: string;
  telefono?: string;
  email?: string;
  numeroTarjeta?: string;
  nombreTarjeta?: string;
  fechaExpiracion?: string;
  cvv?: string;
}

const Reservation = () => {
  const [propiedad, setPropiedad] = useState<Residencia | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<ReservationFormData>({
    fechaInicio: undefined,
    fechaFin: undefined,
    numeroHuespedes: 1,
    nombreCompleto: "",
    telefono: "",
    email: "",
    notasEspeciales: "",
    numeroTarjeta: "",
    nombreTarjeta: "",
    fechaExpiracion: "",
    cvv: "",
  });

  useEffect(() => {
    const mockPropiedad: Residencia = {
      id: 1,
      titulo: "Hermosa casa moderna en San Pedro",
      descripcion: "Casa perfecta para el Mundial 2026",
      precioPorNoche: 1500,
      ciudad: "San Pedro Garza García",
      direccion: "Av. Gómez Morín 1000",
      imagenUrl:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400",
      anfitrion: {
        nombre: "María González",
        fotoPerfilUrl: "",
      },
    };
    setPropiedad(mockPropiedad);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (range: any) => {
    if (range) {
      setFormData((prev) => ({
        ...prev,
        fechaInicio: range.from,
        fechaFin: range.to,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        fechaInicio: undefined,
        fechaFin: undefined,
      }));
    }
  };

  const calculateNights = () => {
    if (formData.fechaInicio && formData.fechaFin) {
      const nights = Math.ceil(
        (formData.fechaFin.getTime() - formData.fechaInicio.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      return nights;
    }
    return 0;
  };

  const calculateSubtotal = () => {
    if (propiedad) {
      return propiedad.precioPorNoche * calculateNights();
    }
    return 0;
  };

  const calculateServiceFee = () => {
    return calculateSubtotal() * 0.1;
  };

  const calculateCleaningFee = () => {
    return 300;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateServiceFee() + calculateCleaningFee();
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fechaInicio || !formData.fechaFin) {
      newErrors.fechas = "Por favor selecciona las fechas de tu estadía";
    }

    if (formData.numeroHuespedes < 1) {
      newErrors.numeroHuespedes = "Debe haber al menos 1 huésped";
    } else if (formData.numeroHuespedes > 10) {
      newErrors.numeroHuespedes = "Máximo 10 huéspedes permitidos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nombreCompleto.trim()) {
      newErrors.nombreCompleto = "El nombre completo es requerido";
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido";
    } else if (!/^\d{10}$/.test(formData.telefono.replace(/\D/g, ""))) {
      newErrors.telefono = "Ingresa un teléfono válido de 10 dígitos";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Ingresa un email válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: FormErrors = {};

    const cardNumber = formData.numeroTarjeta.replace(/\s/g, "");
    if (!cardNumber) {
      newErrors.numeroTarjeta = "El número de tarjeta es requerido";
    } else if (!/^\d{16}$/.test(cardNumber)) {
      newErrors.numeroTarjeta =
        "Ingresa un número de tarjeta válido (16 dígitos)";
    }

    if (!formData.nombreTarjeta.trim()) {
      newErrors.nombreTarjeta = "El nombre en la tarjeta es requerido";
    }

    if (!formData.fechaExpiracion) {
      newErrors.fechaExpiracion = "La fecha de expiración es requerida";
    } else if (!/^\d{2}\/\d{2}$/.test(formData.fechaExpiracion)) {
      newErrors.fechaExpiracion = "Formato: MM/AA";
    }

    if (!formData.cvv) {
      newErrors.cvv = "El CVV es requerido";
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "CVV inválido (3-4 dígitos)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    }

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
      setErrors({});
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
    setErrors({});
  };

  const handleSubmitReservation = async () => {
    if (!validateStep3()) {
      return;
    }

    setIsProcessing(true);

    console.log("Creando reservación:", {
      residenciaId: propiedad?.id,
      fechaInicio: formData.fechaInicio,
      fechaFin: formData.fechaFin,
      numeroHuespedes: formData.numeroHuespedes,
      nombreCompleto: formData.nombreCompleto,
      telefono: formData.telefono,
      email: formData.email,
      notasEspeciales: formData.notasEspeciales,
      precioTotal: calculateTotal(),
    });

    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep(4);
    }, 2000);
  };

  if (!propiedad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">
          Cargando información de la reservación...
        </p>
      </div>
    );
  }

  const nights = calculateNights();
  const subtotal = calculateSubtotal();
  const serviceFee = calculateServiceFee();
  const cleaningFee = calculateCleaningFee();
  const total = calculateTotal();

  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <CardContent className="pt-12 pb-8">
              <div className="mb-6">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                ¡Reservación Confirmada!
              </h1>
              <p className="text-gray-600 mb-8">
                Tu reservación ha sido procesada exitosamente
              </p>

              <Card className="mb-6 text-left">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={propiedad.imagenUrl}
                        alt={propiedad.titulo}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {propiedad.titulo}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {propiedad.ciudad}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Check-in</p>
                        <p className="font-medium">
                          {formData.fechaInicio?.toLocaleDateString("es-MX")}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Check-out</p>
                        <p className="font-medium">
                          {formData.fechaFin?.toLocaleDateString("es-MX")}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Huéspedes</p>
                        <p className="font-medium">
                          {formData.numeroHuespedes}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total pagado</p>
                        <p className="font-bold text-green-600">
                          ${total.toLocaleString("es-MX")} MXN
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <p className="text-sm text-gray-600 mb-6">
                Se ha enviado un correo de confirmación a{" "}
                <span className="font-medium">{formData.email}</span>
              </p>

              <div className="flex gap-3 justify-center">
                <Button onClick={() => (window.location.href = "/")}>
                  Volver al inicio
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/mis-reservaciones")}
                >
                  Ver mis reservaciones
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => (window.location.href = `/property`)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la propiedad
        </Button>

        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-24 h-1 mx-2 ${
                      currentStep > step ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <div className="grid grid-cols-3 gap-24 text-sm text-center">
              <span
                className={
                  currentStep >= 1
                    ? "text-blue-600 font-medium"
                    : "text-gray-500"
                }
              >
                Fechas y Huéspedes
              </span>
              <span
                className={
                  currentStep >= 2
                    ? "text-blue-600 font-medium"
                    : "text-gray-500"
                }
              >
                Tus Datos
              </span>
              <span
                className={
                  currentStep >= 3
                    ? "text-blue-600 font-medium"
                    : "text-gray-500"
                }
              >
                Pago
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 && "Selecciona tus fechas"}
                  {currentStep === 2 && "Información del huésped"}
                  {currentStep === 3 && "Información de pago"}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 &&
                    "Elige las fechas de tu estadía y número de huéspedes"}
                  {currentStep === 2 && "Proporciona tus datos de contacto"}
                  {currentStep === 3 && "Completa el pago de forma segura"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-sm font-semibold mb-3 block">
                        Fechas de estadía
                      </Label>
                      <div className="flex justify-center">
                        <Calendar
                          mode="range"
                          selected={{
                            from: formData.fechaInicio,
                            to: formData.fechaFin,
                          }}
                          onSelect={handleDateSelect}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                          numberOfMonths={2}
                          className="rounded-md border p-3"
                        />
                      </div>
                      {errors.fechas && (
                        <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.fechas}
                        </p>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-sm font-semibold mb-3 block">
                        Número de huéspedes
                      </Label>
                      <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-gray-500" />
                          <span className="text-gray-700">
                            {formData.numeroHuespedes}{" "}
                            {formData.numeroHuespedes === 1
                              ? "huésped"
                              : "huéspedes"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                numeroHuespedes: Math.max(
                                  1,
                                  prev.numeroHuespedes - 1
                                ),
                              }))
                            }
                            disabled={formData.numeroHuespedes <= 1}
                            className="h-8 w-8 p-0"
                          >
                            -
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {formData.numeroHuespedes}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                numeroHuespedes: Math.min(
                                  10,
                                  prev.numeroHuespedes + 1
                                ),
                              }))
                            }
                            disabled={formData.numeroHuespedes >= 10}
                            className="h-8 w-8 p-0"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      {errors.numeroHuespedes && (
                        <p className="text-sm text-red-500 mt-2">
                          {errors.numeroHuespedes}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombreCompleto">
                        Nombre completo <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nombreCompleto"
                        name="nombreCompleto"
                        type="text"
                        placeholder="Juan Pérez García"
                        value={formData.nombreCompleto}
                        onChange={handleInputChange}
                        className={
                          errors.nombreCompleto ? "border-red-500" : ""
                        }
                      />
                      {errors.nombreCompleto && (
                        <p className="text-sm text-red-500">
                          {errors.nombreCompleto}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="telefono">
                          Teléfono <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="telefono"
                          name="telefono"
                          type="tel"
                          placeholder="8112345678"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          className={errors.telefono ? "border-red-500" : ""}
                        />
                        {errors.telefono && (
                          <p className="text-sm text-red-500">
                            {errors.telefono}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notasEspeciales">
                        Notas especiales (opcional)
                      </Label>
                      <Textarea
                        id="notasEspeciales"
                        name="notasEspeciales"
                        placeholder="Alergias, preferencias, hora estimada de llegada, etc."
                        value={formData.notasEspeciales}
                        onChange={handleInputChange}
                        rows={4}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="numeroTarjeta">
                        Número de tarjeta{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="numeroTarjeta"
                          name="numeroTarjeta"
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={formData.numeroTarjeta}
                          onChange={handleInputChange}
                          maxLength={19}
                          className={`pl-10 ${
                            errors.numeroTarjeta ? "border-red-500" : ""
                          }`}
                        />
                      </div>
                      {errors.numeroTarjeta && (
                        <p className="text-sm text-red-500">
                          {errors.numeroTarjeta}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nombreTarjeta">
                        Nombre en la tarjeta{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nombreTarjeta"
                        name="nombreTarjeta"
                        type="text"
                        placeholder="JUAN PEREZ"
                        value={formData.nombreTarjeta}
                        onChange={handleInputChange}
                        className={errors.nombreTarjeta ? "border-red-500" : ""}
                      />
                      {errors.nombreTarjeta && (
                        <p className="text-sm text-red-500">
                          {errors.nombreTarjeta}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fechaExpiracion">
                          Fecha de expiración{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="fechaExpiracion"
                          name="fechaExpiracion"
                          type="text"
                          placeholder="MM/AA"
                          value={formData.fechaExpiracion}
                          onChange={handleInputChange}
                          maxLength={5}
                          className={
                            errors.fechaExpiracion ? "border-red-500" : ""
                          }
                        />
                        {errors.fechaExpiracion && (
                          <p className="text-sm text-red-500">
                            {errors.fechaExpiracion}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cvv">
                          CVV <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          type="text"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          maxLength={4}
                          className={errors.cvv ? "border-red-500" : ""}
                        />
                        {errors.cvv && (
                          <p className="text-sm text-red-500">{errors.cvv}</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-900">
                          <p className="font-medium mb-1">Pago seguro</p>
                          <p className="text-blue-700">
                            Tu información está protegida con encriptación de
                            nivel bancario. No almacenamos tu información de
                            pago.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-8 pt-6 border-t">
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={handleBack}>
                      Atrás
                    </Button>
                  )}
                  {currentStep < 3 && (
                    <Button onClick={handleNext} className="flex-1">
                      Continuar
                    </Button>
                  )}
                  {currentStep === 3 && (
                    <Button
                      onClick={handleSubmitReservation}
                      className="flex-1"
                      disabled={isProcessing}
                    >
                      {isProcessing
                        ? "Procesando..."
                        : `Pagar $${total.toLocaleString("es-MX")}`}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Resumen de reservación
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    {propiedad.imagenUrl && (
                      <img
                        src={propiedad.imagenUrl}
                        alt={propiedad.titulo}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-sm">
                        {propiedad.titulo}
                      </h3>
                      <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {propiedad.ciudad}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {formData.fechaInicio && formData.fechaFin && (
                    <>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Check-in</span>
                          <span className="font-medium">
                            {formData.fechaInicio.toLocaleDateString("es-MX")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Check-out</span>
                          <span className="font-medium">
                            {formData.fechaFin.toLocaleDateString("es-MX")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Huéspedes</span>
                          <span className="font-medium">
                            {formData.numeroHuespedes}
                          </span>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            ${propiedad.precioPorNoche.toLocaleString("es-MX")}{" "}
                            x {nights} {nights === 1 ? "noche" : "noches"}
                          </span>
                          <span className="font-medium">
                            ${subtotal.toLocaleString("es-MX")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Tarifa de servicio
                          </span>
                          <span className="font-medium">
                            ${serviceFee.toLocaleString("es-MX")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Tarifa de limpieza
                          </span>
                          <span className="font-medium">
                            ${cleaningFee.toLocaleString("es-MX")}
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
                    </>
                  )}

                  {propiedad.anfitrion && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Anfitrión</p>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={propiedad.anfitrion.fotoPerfilUrl}
                            />
                            <AvatarFallback>
                              {propiedad.anfitrion.nombre[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {propiedad.anfitrion.nombre}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
