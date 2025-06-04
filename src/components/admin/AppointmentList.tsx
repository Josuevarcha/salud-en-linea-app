
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Mail, Phone, Clock, User } from "lucide-react";
import { EditAppointmentDialog } from "./EditAppointmentDialog";

interface Appointment {
  id: number;
  patientName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  reason: string;
  status: string;
}

interface AppointmentListProps {
  appointments: Appointment[];
  onDelete: (appointmentId: number) => void;
  onEdit: (appointmentId: number, updatedData: any) => void;
}

export const AppointmentList = ({ appointments, onDelete, onEdit }: AppointmentListProps) => {
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: "default",
      pending: "secondary",
      cancelled: "destructive"
    };
    
    const labels = {
      confirmed: "Confirmada",
      pending: "Pendiente",
      cancelled: "Cancelada"
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] as any}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
  };

  const handleEditSave = (updatedData: any) => {
    if (editingAppointment) {
      onEdit(editingAppointment.id, updatedData);
      setEditingAppointment(null);
    }
  };

  const handleDelete = (appointmentId: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta cita?")) {
      onDelete(appointmentId);
    }
  };

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay citas</h3>
          <p className="text-gray-600">No se encontraron citas con los filtros aplicados.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Lista de Citas ({appointments.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                    <div>
                      <h3 className="font-semibold text-lg">{appointment.patientName}</h3>
                      <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                        <Mail className="h-4 w-4" />
                        <span>{appointment.email}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                        <Phone className="h-4 w-4" />
                        <span>{appointment.phone}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(appointment.date).toLocaleDateString('es-ES')} - {appointment.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        <strong>Motivo:</strong> {appointment.reason || "No especificado"}
                      </p>
                      <div className="mt-2">
                        {getStatusBadge(appointment.status)}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(appointment)}
                        className="flex items-center space-x-1"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="hidden sm:inline">Editar</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(appointment.id)}
                        className="flex items-center space-x-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Eliminar</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {editingAppointment && (
        <EditAppointmentDialog
          appointment={editingAppointment}
          onSave={handleEditSave}
          onCancel={() => setEditingAppointment(null)}
        />
      )}
    </>
  );
};
