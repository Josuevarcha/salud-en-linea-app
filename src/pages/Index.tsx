
import { useState } from "react";
import { Calendar, Clock, User, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { useAppointments, AppointmentFormData } from "@/hooks/useAppointments";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const { addAppointment, getAppointmentsByDate, isTimeSlotAvailable } = useAppointments();

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setShowForm(true);
    }
  };

  const handleAppointmentSubmit = (appointmentData: AppointmentFormData) => {
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

    // Intentar crear la cita
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Calendar className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Salud en Línea</h1>
            </div>
            <Button variant="outline" onClick={() => window.location.href = "/admin"}>
              Portal Administrativo
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Agenda tu Cita Médica en Línea
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Reserva tu cita de forma rápida y sencilla, sin necesidad de registro previo
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
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

        {/* Features Section */}
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
      </div>
    </div>
  );
};

export default Index;
