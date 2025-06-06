
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
const CUSTOMERS_JSON_PATH = '/data/customers.json';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Función para cargar datos del archivo JSON
  const loadCustomersFromJSON = async () => {
    try {
      const response = await fetch(CUSTOMERS_JSON_PATH);
      if (response.ok) {
        const jsonData = await response.json();
        console.log('Datos cargados desde JSON:', jsonData);
        setCustomers(jsonData);
        // También guardamos en localStorage como respaldo
        localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(jsonData));
      } else {
        console.log('No se pudo cargar el archivo JSON, usando localStorage');
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Error al cargar desde JSON:', error);
      loadFromLocalStorage();
    }
  };

  // Función para cargar desde localStorage
  const loadFromLocalStorage = () => {
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
  };

  // Función para guardar en archivo JSON (simulado)
  const saveCustomersToJSON = (customersData: Customer[]) => {
    // Como no podemos escribir directamente al archivo desde el navegador,
    // creamos un blob y lo descargamos
    const dataStr = JSON.stringify(customersData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // También guardamos en localStorage
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customersData));
    
    // Crear enlace de descarga automática
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'customers.json';
    
    // Auto-descargar el archivo actualizado
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('Datos guardados:', customersData);
  };

  // Cargar datos al inicializar
  useEffect(() => {
    loadCustomersFromJSON();
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
      
      // Guardar en JSON y localStorage
      saveCustomersToJSON(updatedCustomers);
      
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
    return customer || null;
  };

  const getCustomerByEmail = (email: string): Customer | null => {
    return customers.find(c => c.email === email) || null;
  };

  return {
    customers,
    registerCustomer,
    authenticateCustomer,
    getCustomerByEmail,
    loadCustomersFromJSON // Función para recargar datos manualmente
  };
};
