
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, MessageSquare, X, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppointments, Appointment } from "@/hooks/useAppointments";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const MyAppointments = () => {
  const { customer } = useCustomerAuth();
  const { appointments, updateAppointment } = useAppointments();
  const { toast } = useToast();
  const [customerAppointments, setCustomerAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (customer) {
      // Filtrar solo las citas del cliente actual
      const userAppointments = appointments.filter(
        apt => apt.email === customer.email && apt.status !== 'cancelled'
      );
      setCustomerAppointments(userAppointments);
    }
  }, [appointments, customer]);

  const handleCancelAppointment = (appointmentId: number) => {
    const success = updateAppointment(appointmentId, { status: 'cancelled' });
    
    if (success) {
      toast({
        title: "Cita cancelada",
        description: "Tu cita ha sido cancelada exitosamente.",
      });
      // Actualizar la lista local
      setCustomerAppointments(prev => 
        prev.filter(apt => apt.id !== appointmentId)
      );
    } else {
      toast({
        title: "Error",
        description: "No se pudo cancelar la cita. Inténtalo nuevamente.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendiente", variant: "secondary" as const },
      confirmed: { label: "Confirmada", variant: "default" as const },
      cancelled: { label: "Cancelada", variant: "destructive" as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!customer) {
    return (
      <div className="text-center py-8 text-gray-500">
        <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Debes iniciar sesión para ver tus citas</p>
      </div>
    );
  }

  if (customerAppointments.length === 0) {
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
            <p className="text-sm mt-2">Agenda una nueva cita para comenzar</p>
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
          <span>Mis Citas</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {customerAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{formatDate(appointment.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span>{appointment.time}</span>
                  </div>
                  {appointment.reason && (
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">{appointment.reason}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {getStatusBadge(appointment.status)}
                  {appointment.status === 'pending' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <X className="h-4 w-4 mr-1" />
                          Cancelar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center space-x-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            <span>Confirmar Cancelación</span>
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            ¿Estás seguro que deseas cancelar tu cita del {formatDate(appointment.date)} a las {appointment.time}?
                            Esta acción no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>No, mantener cita</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Sí, cancelar cita
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
              
              <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                <strong>Creada:</strong> {new Date(appointment.createdAt).toLocaleString('es-ES')}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
