
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AppointmentCalendarProps {
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
}

export const AppointmentCalendar = ({ selectedDate, onDateSelect }: AppointmentCalendarProps) => {
  // Simular horarios ocupados (esto vendría de la API)
  const busyDates = [
    new Date(2024, 5, 10),
    new Date(2024, 5, 15),
    new Date(2024, 5, 20),
  ];

  const isDateBusy = (date: Date) => {
    return busyDates.some(busyDate => 
      date.getDate() === busyDate.getDate() &&
      date.getMonth() === busyDate.getMonth() &&
      date.getFullYear() === busyDate.getFullYear()
    );
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Deshabilitar fechas pasadas y domingos
    return date < today || date.getDay() === 0;
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
          busy: busyDates
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
