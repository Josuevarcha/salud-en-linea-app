
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer } from '@/hooks/useCustomers';

interface CustomerAuthState {
  isAuthenticated: boolean;
  customer: Customer | null;
}

interface CustomerAuthContextType extends CustomerAuthState {
  login: (customer: Customer) => void;
  logout: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

const CUSTOMER_AUTH_STORAGE_KEY = 'medical_app_customer_auth';

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<CustomerAuthState>({
    isAuthenticated: false,
    customer: null
  });

  // Cargar estado inicial desde localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem(CUSTOMER_AUTH_STORAGE_KEY);
    console.log('CustomerAuthProvider - Cargando desde localStorage:', storedAuth);
    
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        console.log('CustomerAuthProvider - Datos parseados:', parsed);
        setAuthState(parsed);
      } catch (error) {
        console.error('Error al cargar sesión de cliente:', error);
        localStorage.removeItem(CUSTOMER_AUTH_STORAGE_KEY);
      }
    }
  }, []);

  const login = (customer: Customer) => {
    console.log('CustomerAuthProvider - Iniciando sesión con:', customer);
    
    const newAuthState = {
      isAuthenticated: true,
      customer: customer
    };
    
    setAuthState(newAuthState);
    localStorage.setItem(CUSTOMER_AUTH_STORAGE_KEY, JSON.stringify(newAuthState));
    
    console.log('CustomerAuthProvider - Estado actualizado:', newAuthState);
  };

  const logout = () => {
    console.log('CustomerAuthProvider - Cerrando sesión');
    
    const newAuthState = {
      isAuthenticated: false,
      customer: null
    };
    
    setAuthState(newAuthState);
    localStorage.removeItem(CUSTOMER_AUTH_STORAGE_KEY);
    
    // Forzar recarga de la página para limpiar completamente el estado
    window.location.reload();
  };

  console.log('CustomerAuthProvider - Estado actual:', authState);

  return (
    <CustomerAuthContext.Provider value={{
      isAuthenticated: authState.isAuthenticated,
      customer: authState.customer,
      login,
      logout
    }}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (context === undefined) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};
