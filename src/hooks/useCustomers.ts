
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

  // Función para cargar desde localStorage
  const loadFromLocalStorage = () => {
    const storedCustomers = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    if (storedCustomers) {
      try {
        const parsed = JSON.parse(storedCustomers);
        console.log('Clientes cargados desde localStorage:', parsed);
        setCustomers(parsed);
        return parsed;
      } catch (error) {
        console.error('Error al cargar clientes:', error);
        setCustomers([]);
        return [];
      }
    }
    return [];
  };

  // Función para guardar en localStorage
  const saveToLocalStorage = (customersData: Customer[]) => {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customersData));
    console.log('Datos guardados en localStorage:', customersData);
  };

  // Cargar datos al inicializar
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  const registerCustomer = (customerData: CustomerRegistrationData): { success: boolean; message: string } => {
    try {
      console.log('Intentando registrar cliente:', customerData);
      
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

      console.log('Nuevo cliente creado:', newCustomer);

      const updatedCustomers = [...customers, newCustomer];
      setCustomers(updatedCustomers);
      
      // Guardar en localStorage
      saveToLocalStorage(updatedCustomers);
      
      return { success: true, message: 'Cliente registrado exitosamente' };
    } catch (error) {
      console.error('Error al registrar cliente:', error);
      return { success: false, message: 'Error al registrar cliente' };
    }
  };

  const authenticateCustomer = (email: string, password: string): Customer | null => {
    console.log('Intentando autenticar:', email);
    console.log('Clientes disponibles:', customers);
    const customer = customers.find(c => c.email === email && c.password === password);
    console.log('Cliente encontrado:', customer ? 'Sí' : 'No');
    return customer || null;
  };

  const getCustomerByEmail = (email: string): Customer | null => {
    return customers.find(c => c.email === email) || null;
  };

  const reloadCustomers = () => {
    loadFromLocalStorage();
  };

  return {
    customers,
    registerCustomer,
    authenticateCustomer,
    getCustomerByEmail,
    reloadCustomers
  };
};
