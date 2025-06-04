
import { useState, useEffect } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  user: { username: string } | null;
}

const AUTH_STORAGE_KEY = 'medical_app_auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null
  });

  // Verificar si hay una sesión guardada al inicializar
  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        setAuthState(parsed);
      } catch (error) {
        console.error('Error al cargar sesión:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  const login = (credentials: { username: string; password: string }): boolean => {
    // Validación simple - en un entorno real usarías una API
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      const newAuthState = {
        isAuthenticated: true,
        user: { username: credentials.username }
      };
      
      setAuthState(newAuthState);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newAuthState));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null
    });
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    login,
    logout
  };
};
