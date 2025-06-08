
import { useState } from "react";
import { Calendar, Clock, User, Phone, Mail, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabaseAppointments } from "@/hooks/useSupabaseAppointments";

export const MyAppointments = () => {
  const { user } = useAuth();
  const { getUserAppointments, updateAppointment } = useSupabaseAppointments();
  const { toast } = useToast();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  if (!user) return null;

  const userAppointments = getUserAppointments(user.id);

  const handleCancelAppointment = async (appointmentId: string) => {
    setCancellingId(appointmentId);
    
    try {
      const success = await updateAppointment(appointmentId, { status: 'cancelled' });
      
      if (success) {
        toast({
          title: "Cita cancelada",
          description: "Tu cita ha sido cancelada exitosamente",
        });
      } else {
        toast({
          title: "Error",
          description: "No se pudo cancelar la cita. Inténtalo nuevamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al cancelar la cita",
        variant: "destructive",
      });
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case 'confirmed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Confirmada</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (userAppointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Mis Citas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No tienes citas programadas</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Mis Citas ({userAppointments.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">
                      {new Date(appointment.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span>{appointment.time}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-purple-600" />
                    <span>{appointment.patient_name}</span>
                  </div>

                  {appointment.reason && (
                    <div className="text-sm text-gray-600">
                      <strong>Motivo:</strong> {appointment.reason}
                    </div>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span>{appointment.phone}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span>{appointment.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  {getStatusBadge(appointment.status)}
                  
                  {appointment.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelAppointment(appointment.id)}
                      disabled={cancellingId === appointment.id}
                      className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                    >
                      <X className="h-3 w-3 mr-1" />
                      {cancellingId === appointment.id ? "Cancelando..." : "Cancelar"}
                    </Button>
                  )}
                </div>
              </div>

              <div className="text-xs text-gray-400 border-t pt-2">
                Creada: {new Date(appointment.created_at).toLocaleDateString('es-ES')}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
