
import { useState, useEffect } from 'react';
import { Customer } from './useCustomers';

interface CustomerAuthState {
  isAuthenticated: boolean;
  customer: Customer | null;
}

const CUSTOMER_AUTH_STORAGE_KEY = 'medical_app_customer_auth';

export const useCustomerAuth = () => {
  const [authState, setAuthState] = useState<CustomerAuthState>({
    isAuthenticated: false,
    customer: null
  });

  // Verificar si hay una sesión guardada al inicializar
  useEffect(() => {
    const storedAuth = localStorage.getItem(CUSTOMER_AUTH_STORAGE_KEY);
    console.log('useCustomerAuth - Cargando desde localStorage:', storedAuth);
    
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        console.log('useCustomerAuth - Datos parseados:', parsed);
        setAuthState(parsed);
      } catch (error) {
        console.error('Error al cargar sesión de cliente:', error);
        localStorage.removeItem(CUSTOMER_AUTH_STORAGE_KEY);
      }
    }
  }, []);

  const login = (customer: Customer) => {
    console.log('useCustomerAuth - Iniciando sesión con:', customer);
    
    const newAuthState = {
      isAuthenticated: true,
      customer: customer
    };
    
    setAuthState(newAuthState);
    localStorage.setItem(CUSTOMER_AUTH_STORAGE_KEY, JSON.stringify(newAuthState));
    
    console.log('useCustomerAuth - Estado actualizado:', newAuthState);
  };

  const logout = () => {
    console.log('useCustomerAuth - Cerrando sesión');
    
    setAuthState({
      isAuthenticated: false,
      customer: null
    });
    localStorage.removeItem(CUSTOMER_AUTH_STORAGE_KEY);
  };

  console.log('useCustomerAuth - Estado actual:', authState);

  return {
    isAuthenticated: authState.isAuthenticated,
    customer: authState.customer,
    login,
    logout
  };
};
