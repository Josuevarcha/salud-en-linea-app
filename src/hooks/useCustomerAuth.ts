
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
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        setAuthState(parsed);
      } catch (error) {
        console.error('Error al cargar sesión de cliente:', error);
        localStorage.removeItem(CUSTOMER_AUTH_STORAGE_KEY);
      }
    }
  }, []);

  const login = (customer: Customer) => {
    const newAuthState = {
      isAuthenticated: true,
      customer: customer
    };
    
    setAuthState(newAuthState);
    localStorage.setItem(CUSTOMER_AUTH_STORAGE_KEY, JSON.stringify(newAuthState));
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      customer: null
    });
    localStorage.removeItem(CUSTOMER_AUTH_STORAGE_KEY);
  };

  return {
    isAuthenticated: authState.isAuthenticated,
    customer: authState.customer,
    login,
    logout
  };
};
