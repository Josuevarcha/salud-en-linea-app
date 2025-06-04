
import { useState, useEffect } from 'react';

export interface Appointment {
  id: number;
  patientName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface AppointmentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  reason: string;
  selectedTime: string;
  date: Date;
}

const STORAGE_KEY = 'medical_appointments';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Cargar citas desde localStorage al inicializar
  useEffect(() => {
    const storedAppointments = localStorage.getItem(STORAGE_KEY);
    if (storedAppointments) {
      try {
        const parsed = JSON.parse(storedAppointments);
        setAppointments(parsed);
      } catch (error) {
        console.error('Error al cargar citas:', error);
        setAppointments([]);
      }
    }
  }, []);

  // Guardar citas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  }, [appointments]);

  const addAppointment = (formData: AppointmentFormData): boolean => {
    try {
      const newAppointment: Appointment = {
        id: Date.now(), // ID simple usando timestamp
        patientName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        date: formData.date.toISOString().split('T')[0],
        time: formData.selectedTime,
        reason: formData.reason || 'Consulta general',
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      setAppointments(prev => [...prev, newAppointment]);
      return true;
    } catch (error) {
      console.error('Error al crear cita:', error);
      return false;
    }
  };

  const updateAppointment = (id: number, updatedData: Partial<Appointment>): boolean => {
    try {
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === id ? { ...apt, ...updatedData } : apt
        )
      );
      return true;
    } catch (error) {
      console.error('Error al actualizar cita:', error);
      return false;
    }
  };

  const deleteAppointment = (id: number): boolean => {
    try {
      setAppointments(prev => prev.filter(apt => apt.id !== id));
      return true;
    } catch (error) {
      console.error('Error al eliminar cita:', error);
      return false;
    }
  };

  const getAppointmentsByDate = (date: string): Appointment[] => {
    return appointments.filter(apt => apt.date === date);
  };

  const isTimeSlotAvailable = (date: string, time: string): boolean => {
    return !appointments.some(apt => 
      apt.date === date && 
      apt.time === time && 
      apt.status !== 'cancelled'
    );
  };

  return {
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByDate,
    isTimeSlotAvailable
  };
};
