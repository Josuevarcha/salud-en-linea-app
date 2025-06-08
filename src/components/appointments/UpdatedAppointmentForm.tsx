
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, User, MessageSquare } from "lucide-react";
import { AppointmentFormData } from "@/hooks/useSupabaseAppointments";

interface Profile {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  cedula: string | null;
}

interface UpdatedAppointmentFormProps {
  selectedDate: Date;
  onSubmit: (data: AppointmentFormData) => void;
  onCancel: () => void;
  isTimeSlotAvailable: (date: string, time: string) => boolean;
  profile: Profile;
}

export const UpdatedAppointmentForm = ({ selectedDate, onSubmit, onCancel, isTimeSlotAvailable, profile }: UpdatedAppointmentFormProps) => {
  const [formData, setFormData] = useState({
    reason: "",
    selectedTime: ""
  });

  // Horarios disponibles
  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

  const dateString = selectedDate.toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.selectedTime) {
      alert("Por favor selecciona un horario");
      return;
    }
    
    if (!profile) {
      alert("Error: No se encontraron datos del usuario");
      return;
    }
    
    const appointmentData: AppointmentFormData = {
      firstName: profile.first_name || '',
      lastName: profile.last_name || '',
      email: '', // Will be filled from user session
      phone: profile.phone || '',
      reason: formData.reason,
      selectedTime: formData.selectedTime,
      date: selectedDate
    };
    
    onSubmit(appointmentData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!profile) {
    return (
      <div className="text-center py-8 text-gray-500">
        <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Error: No se encontraron datos del usuario</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selected Date Display */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Fecha seleccionada:</h3>
        <Badge variant="secondary" className="text-sm">
          {selectedDate.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Badge>
      </div>

      {/* User Information Display */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-green-900 mb-2 flex items-center space-x-1">
          <User className="h-4 w-4" />
          <span>Datos del paciente:</span>
        </h3>
        <div className="grid grid-cols-1 gap-2 text-sm text-green-700">
          <p><strong>Nombre:</strong> {profile.first_name} {profile.last_name}</p>
          <p><strong>Teléfono:</strong> {profile.phone}</p>
          <p><strong>Cédula:</strong> {profile.cedula}</p>
        </div>
      </div>

      {/* Time Selection */}
      <div>
        <Label className="text-sm font-medium flex items-center space-x-1 mb-3">
          <Clock className="h-4 w-4" />
          <span>Selecciona un horario</span>
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map((time) => {
            const isAvailable = isTimeSlotAvailable(dateString, time);
            return (
              <Button
                key={time}
                type="button"
                variant={formData.selectedTime === time ? "default" : "outline"}
                className={`text-sm ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => isAvailable && handleInputChange("selectedTime", time)}
                disabled={!isAvailable}
              >
                {time}
                {!isAvailable && <span className="ml-1 text-xs">(Ocupado)</span>}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Appointment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="reason" className="flex items-center space-x-1">
            <MessageSquare className="h-4 w-4" />
            <span>Motivo de la consulta</span>
          </Label>
          <Input
            id="reason"
            type="text"
            value={formData.reason}
            onChange={(e) => handleInputChange("reason", e.target.value)}
            placeholder="Breve descripción del motivo"
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <Button type="submit" className="flex-1" disabled={!formData.selectedTime}>
            Confirmar Cita
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>

      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
        <p><strong>Nota:</strong> Para cancelar o modificar tu cita, por favor contacta al consultorio telefónicamente.</p>
      </div>
    </div>
  );
};
