
import { Clock, Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const FeaturesSection = () => {
  return (
    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="text-center">
        <CardContent className="pt-6">
          <Clock className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h3 className="text-lg font-semibold mb-2">Disponibilidad 24/7</h3>
          <p className="text-gray-600">Agenda tu cita en cualquier momento del día</p>
        </CardContent>
      </Card>

      <Card className="text-center">
        <CardContent className="pt-6">
          <Mail className="h-12 w-12 mx-auto mb-4 text-green-600" />
          <h3 className="text-lg font-semibold mb-2">Confirmación Automática</h3>
          <p className="text-gray-600">Recibe confirmación y recordatorios por email</p>
        </CardContent>
      </Card>

      <Card className="text-center">
        <CardContent className="pt-6">
          <Phone className="h-12 w-12 mx-auto mb-4 text-purple-600" />
          <h3 className="text-lg font-semibold mb-2">Soporte Telefónico</h3>
          <p className="text-gray-600">Contacta directamente para modificaciones</p>
        </CardContent>
      </Card>
    </div>
  );
};
