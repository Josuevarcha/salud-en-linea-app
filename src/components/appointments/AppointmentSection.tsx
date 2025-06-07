
import { useState } from "react";
import { Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AppointmentCalendar } from "./AppointmentCalendar";
import { AppointmentForm } from "./AppointmentForm";
import { useAppointments, AppointmentFormData } from "@/hooks/useAppointments";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";

export const AppointmentSection = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  
  const { addAppointment, getAppointmentsByDate, isTimeSlotAvailable } = useAppointments();
  const { isAuthenticated, customer } = useCustomerAuth();

  const handleDateSelect = (date: Date | undefined) => {
    if (!isAuthenticated) {
      toast({
        title: "Inicio de sesión requerido",
        description: "Debes iniciar sesión para agendar una cita",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedDate(date);
    if (date) {
      setShowForm(true);
    }
  };

  const handleAppointmentSubmit = (appointmentData: AppointmentFormData) => {
    if (!customer) {
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

    // Los datos ya vienen correctos del formulario
    const success = addAppointment(appointmentData);
    
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

  return (
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
          {showForm && selectedDate ? (
            <AppointmentForm
              selectedDate={selectedDate}
              onSubmit={handleAppointmentSubmit}
              onCancel={() => setShowForm(false)}
              isTimeSlotAvailable={isTimeSlotAvailable}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Selecciona una fecha en el calendario para agendar tu cita</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
