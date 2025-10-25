import { CardContent } from "@/components/ui/card";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
interface Residencia {
  id: number;
  titulo: string;
  imagenUrl: string;
  ciudadNombre: string;
  precioPorNoche: number;
}

interface PropiedadCardProps {
  residencia: Residencia;
}

const PropiedadCard = ({ residencia }: PropiedadCardProps) => {
  return (
    <a key={residencia.id} href={`/Propiedad`} className="block">
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
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
  );
};

export default PropiedadCard;
