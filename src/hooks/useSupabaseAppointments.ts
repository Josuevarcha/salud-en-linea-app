
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Appointment {
  id: string;
  user_id: string;
  patient_name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  reason: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
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

export const useSupabaseAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        return;
      }

      setAppointments(data || []);
    } catch (error) {
      console.error('Error in fetchAppointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const addAppointment = async (formData: AppointmentFormData, userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          user_id: userId,
          patient_name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          date: formData.date.toISOString().split('T')[0],
          time: formData.selectedTime,
          reason: formData.reason || 'Consulta general',
          status: 'pending'
        });

      if (error) {
        console.error('Error adding appointment:', error);
        return false;
      }

      // Refresh appointments
      await fetchAppointments();
      return true;
    } catch (error) {
      console.error('Error in addAppointment:', error);
      return false;
    }
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating appointment:', error);
        return false;
      }

      // Refresh appointments
      await fetchAppointments();
      return true;
    } catch (error) {
      console.error('Error in updateAppointment:', error);
      return false;
    }
  };

  const deleteAppointment = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting appointment:', error);
        return false;
      }

      // Refresh appointments
      await fetchAppointments();
      return true;
    } catch (error) {
      console.error('Error in deleteAppointment:', error);
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

  const getUserAppointments = (userId: string): Appointment[] => {
    return appointments.filter(apt => apt.user_id === userId && apt.status !== 'cancelled');
  };

  const hasPendingAppointment = (userId: string): boolean => {
    return appointments.some(apt => 
      apt.user_id === userId && 
      apt.status === 'pending'
    );
  };

  const getPendingAppointment = (userId: string): Appointment | null => {
    return appointments.find(apt => 
      apt.user_id === userId && 
      apt.status === 'pending'
    ) || null;
  };

  return {
    appointments,
    loading,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByDate,
    isTimeSlotAvailable,
    getUserAppointments,
    hasPendingAppointment,
    getPendingAppointment,
    refreshAppointments: fetchAppointments
  };
};
