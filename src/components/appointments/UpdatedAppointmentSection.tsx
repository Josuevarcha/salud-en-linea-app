
import { useState } from "react";
import { Calendar, User, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AppointmentCalendar } from "./AppointmentCalendar";
import { AppointmentForm } from "./AppointmentForm";
import { MyAppointments } from "./MyAppointments";
import { useSupabaseAppointments, AppointmentFormData } from "@/hooks/useSupabaseAppointments";
import { useAuth } from "@/contexts/AuthContext";

export const UpdatedAppointmentSection = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  
  const { 
    appointments,
    addAppointment, 
    getAppointmentsByDate, 
    isTimeSlotAvailable,
    hasPendingAppointment,
    getPendingAppointment
  } = useSupabaseAppointments();
  
  const { user, profile, loading } = useAuth();

  const handleDateSelect = (date: Date | undefined) => {
    if (!user || !profile) {
      toast({
        title: "Inicio de sesión requerido",
        description: "Debes iniciar sesión para agendar una cita",
        variant: "destructive",
      });
      return;
    }

    // Verificar si el cliente puede agendar una nueva cita
    if (hasPendingAppointment(user.id)) {
      const pendingAppointment = getPendingAppointment(user.id);
      toast({
        title: "Ya tienes una cita pendiente",
        description: `Tienes una cita pendiente el ${new Date(pendingAppointment?.date || '').toLocaleDateString('es-ES')} a las ${pendingAppointment?.time}. Debes esperar a que sea confirmada o cancelarla para agendar una nueva.`,
        variant: "destructive",
      });
      return;
    }
    
    setSelectedDate(date);
    if (date) {
      setShowForm(true);
    }
  };

  const handleAppointmentSubmit = async (appointmentData: AppointmentFormData) => {
    if (!user || !profile) {
      toast({
        title: "Error",
        description: "No se encontraron datos del usuario",
        variant: "destructive",
      });
      return;
    }

    // Verificar disponibilidad del horario
    const dateString = appointmentData.date.toISOString().split('T')[0];
    if (!isTimeSlotAvailable(dateString, appointmentData.selectedTime)) {
      toast({
        title: "Horario no disponible",
        description: "El horario seleccionado ya está ocupado. Por favor elige otro.",
        variant: "destructive",
      });
      return;
    }

    const success = await addAppointment(appointmentData, user.id);
    
    if (success) {
      toast({
        title: "Cita agendada exitosamente",
        description: "Tu cita ha sido registrada. Recibirás confirmación pronto.",
      });
      setShowForm(false);
      setSelectedDate(undefined);
    } else {
      toast({
        title: "Error al agendar cita",
        description: "Hubo un problema al registrar tu cita. Inténtalo nuevamente.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Alerta de cita pendiente */}
      {user && hasPendingAppointment(user.id) && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Información:</strong> Ya tienes una cita pendiente. 
            Debes esperar a que sea confirmada por los administradores o cancelarla para poder agendar una nueva cita.
          </AlertDescription>
        </Alert>
      )}

      {/* Sección de Mis Citas */}
      {user && (
        <div>
          <MyAppointments />
        </div>
      )}

      {/* Sección de Agendar Nueva Cita */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Selecciona una Fecha</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AppointmentCalendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              getAppointmentsByDate={getAppointmentsByDate}
            />
          </CardContent>
        </Card>

        {/* Appointment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Información de la Cita</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showForm && selectedDate && profile ? (
              <AppointmentForm
                selectedDate={selectedDate}
                onSubmit={handleAppointmentSubmit}
                onCancel={() => setShowForm(false)}
                isTimeSlotAvailable={isTimeSlotAvailable}
                profile={profile}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  {!user 
                    ? "Inicia sesión y selecciona una fecha para agendar tu cita"
                    : user && !hasPendingAppointment(user.id)
                      ? "Selecciona una fecha en el calendario para agendar tu cita"
                      : "Gestiona tu cita pendiente antes de agendar una nueva"
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
