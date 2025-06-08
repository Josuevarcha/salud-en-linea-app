
import { useAppointments } from "./useAppointments";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";

export const useAppointmentValidation = () => {
  const { appointments } = useAppointments();
  const { customer } = useCustomerAuth();

  const hasPendingAppointment = (): boolean => {
    if (!customer) return false;
    
    return appointments.some(
      apt => apt.email === customer.email && apt.status === 'pending'
    );
  };

  const getPendingAppointment = () => {
    if (!customer) return null;
    
    return appointments.find(
      apt => apt.email === customer.email && apt.status === 'pending'
    );
  };

  const canScheduleNewAppointment = (): boolean => {
    return !hasPendingAppointment();
  };

  return {
    hasPendingAppointment,
    getPendingAppointment,
    canScheduleNewAppointment
  };
};
