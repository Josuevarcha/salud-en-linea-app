
import { useState, useEffect } from 'react';

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  cedula: string;
  phone: string;
  password: string;
  createdAt: string;
}

export interface CustomerRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  cedula: string;
  phone: string;
  password: string;
}

const CUSTOMERS_STORAGE_KEY = 'medical_app_customers';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Cargar clientes desde localStorage al inicializar
  useEffect(() => {
    const storedCustomers = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    if (storedCustomers) {
      try {
        const parsed = JSON.parse(storedCustomers);
        setCustomers(parsed);
      } catch (error) {
        console.error('Error al cargar clientes:', error);
        setCustomers([]);
      }
    }
  }, []);

  // Guardar clientes en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  }, [customers]);

  const registerCustomer = (customerData: CustomerRegistrationData): { success: boolean; message: string } => {
    try {
      // Verificar si el email ya existe
      const existingEmailCustomer = customers.find(c => c.email === customerData.email);
      if (existingEmailCustomer) {
        return { success: false, message: 'Este email ya está registrado' };
      }

      // Verificar si la cédula ya existe
      const existingCedulaCustomer = customers.find(c => c.cedula === customerData.cedula);
      if (existingCedulaCustomer) {
        return { success: false, message: 'Esta cédula ya está registrada' };
      }

      const newCustomer: Customer = {
        id: Date.now(),
        ...customerData,
        createdAt: new Date().toISOString()
      };

      setCustomers(prev => [...prev, newCustomer]);
      return { success: true, message: 'Cliente registrado exitosamente' };
    } catch (error) {
      console.error('Error al registrar cliente:', error);
      return { success: false, message: 'Error al registrar cliente' };
    }
  };

  const authenticateCustomer = (email: string, password: string): Customer | null => {
    const customer = customers.find(c => c.email === email && c.password === password);
    return customer || null;
  };

  const getCustomerByEmail = (email: string): Customer | null => {
    return customers.find(c => c.email === email) || null;
  };

  return {
    customers,
    registerCustomer,
    authenticateCustomer,
    getCustomerByEmail
  };
};
