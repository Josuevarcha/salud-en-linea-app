
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";

interface AppointmentCalendarProps {
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
  getAppointmentsByDate: (date: string) => any[];
}

export const AppointmentCalendar = ({ selectedDate, onDateSelect, getAppointmentsByDate }: AppointmentCalendarProps) => {
  
  const isDateBusy = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const dayAppointments = getAppointmentsByDate(dateString);
    return dayAppointments.some(apt => apt.status !== 'cancelled');
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Deshabilitar fechas pasadas y domingos
    return date < today || date.getDay() === 0;
  };

  // Obtener fechas ocupadas para el modificador
  const getBusyDates = () => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setMonth(today.getMonth() + 3); // Próximos 3 meses
    
    const busyDates = [];
    const currentDate = new Date(today);
    
    while (currentDate <= futureDate) {
      if (isDateBusy(currentDate)) {
        busyDates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return busyDates;
  };

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        disabled={isDateDisabled}
        className="rounded-md border shadow-sm"
        modifiers={{
          busy: getBusyDates()
        }}
        modifiersStyles={{
          busy: { backgroundColor: "#fef2f2", color: "#dc2626" }
        }}
      />
      
      <div className="flex flex-wrap gap-2 text-sm">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-600 rounded"></div>
          <span>Disponible</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-200 rounded"></div>
          <span>Ocupado</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gray-300 rounded"></div>
          <span>No disponible</span>
        </div>
      </div>

      {selectedDate && (
        <div className="mt-4">
          <Badge variant="outline" className="text-sm">
            Fecha seleccionada: {selectedDate.toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Badge>
        </div>
      )}
    </div>
  );
};
