
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Mail, Phone } from "lucide-react";
import { AppointmentFormData } from "@/hooks/useAppointments";

interface AppointmentFormProps {
  selectedDate: Date;
  onSubmit: (data: AppointmentFormData) => void;
  onCancel: () => void;
  isTimeSlotAvailable: (date: string, time: string) => boolean;
}

export const AppointmentForm = ({ selectedDate, onSubmit, onCancel, isTimeSlotAvailable }: AppointmentFormProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
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
    
    const appointmentData: AppointmentFormData = {
      ...formData,
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

      {/* Patient Information Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>Nombre</span>
            </Label>
            <Input
              id="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Apellido</Label>
            <Input
              id="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Tu apellido"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="flex items-center space-x-1">
            <Mail className="h-4 w-4" />
            <span>Correo electrónico</span>
          </Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="flex items-center space-x-1">
            <Phone className="h-4 w-4" />
            <span>Teléfono</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="+57 300 123 4567"
          />
        </div>

        <div>
          <Label htmlFor="reason">Motivo de la consulta</Label>
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
