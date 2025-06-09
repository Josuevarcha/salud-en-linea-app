
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Perfil {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  cedula: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

interface EstadoAuth {
  usuario: User | null;
  sesion: Session | null;
  perfil: Perfil | null;
  cargando: boolean;
}

interface TipoContextoAuth extends EstadoAuth {
  iniciarSesion: (email: string, password: string) => Promise<{ error: any }>;
  registrarse: (email: string, password: string, datosUsuario: { firstName: string; lastName: string; phone: string; cedula: string }) => Promise<{ error: any }>;
  cerrarSesion: () => Promise<void>;
  actualizarPerfil: (actualizaciones: Partial<Perfil>) => Promise<{ error: any }>;
}

const ContextoAuth = createContext<TipoContextoAuth | undefined>(undefined);

// Función para limpiar el estado de autenticación
const limpiarEstadoAuth = () => {
  Object.keys(localStorage).forEach((clave) => {
    if (clave.startsWith('supabase.auth.') || clave.includes('sb-')) {
      localStorage.removeItem(clave);
    }
  });
  Object.keys(sessionStorage || {}).forEach((clave) => {
    if (clave.startsWith('supabase.auth.') || clave.includes('sb-')) {
      sessionStorage.removeItem(clave);
    }
  });
};

export const ProveedorAuth = ({ children }: { children: ReactNode }) => {
  const [estadoAuth, setEstadoAuth] = useState<EstadoAuth>({
    usuario: null,
    sesion: null,
    perfil: null,
    cargando: true
  });

  const obtenerPerfil = async (idUsuario: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', idUsuario)
        .single();

      if (error) {
        console.error('Error al obtener perfil:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Error en obtenerPerfil:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('Configurando listener de auth...');
    
    // Configurar listener de estado de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (evento, sesion) => {
        console.log('Cambio de estado de auth:', evento, sesion?.user?.id);
        
        if (sesion?.user) {
          // Usar setTimeout para evitar deadlocks
          setTimeout(async () => {
            const perfil = await obtenerPerfil(sesion.user.id);
            setEstadoAuth({
              usuario: sesion.user,
              sesion,
              perfil,
              cargando: false
            });
          }, 0);
        } else {
          setEstadoAuth({
            usuario: null,
            sesion: null,
            perfil: null,
            cargando: false
          });
        }
      }
    );

    // Verificar sesión existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        obtenerPerfil(session.user.id).then(perfil => {
          setEstadoAuth({
            usuario: session.user,
            sesion: session,
            perfil,
            cargando: false
          });
        });
      } else {
        setEstadoAuth(prev => ({ ...prev, cargando: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const iniciarSesion = async (email: string, password: string) => {
    try {
      // Limpiar estado antes de iniciar sesión
      limpiarEstadoAuth();
      
      // Intentar cerrar sesión global primero
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continuar aunque falle
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { error };
      }

      // Si el login es exitoso, forzar recarga de página
      if (data.user) {
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const registrarse = async (email: string, password: string, datosUsuario: { firstName: string; lastName: string; phone: string; cedula: string }) => {
    try {
      // Limpiar estado antes de registrarse
      limpiarEstadoAuth();

      const urlRedireccion = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: urlRedireccion,
          data: {
            first_name: datosUsuario.firstName,
            last_name: datosUsuario.lastName,
            phone: datosUsuario.phone,
            cedula: datosUsuario.cedula
          }
        }
      });

      if (error) return { error };

      // Actualizar perfil con datos adicionales
      if (data.user) {
        await supabase
          .from('profiles')
          .update({
            first_name: datosUsuario.firstName,
            last_name: datosUsuario.lastName,
            phone: datosUsuario.phone,
            cedula: datosUsuario.cedula
          })
          .eq('id', data.user.id);
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const cerrarSesion = async () => {
    try {
      // Limpiar estado primero
      limpiarEstadoAuth();
      
      // Intentar cerrar sesión global
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignorar errores
      }
      
      // Forzar recarga de página
      window.location.href = '/auth';
    } catch (error) {
      // En caso de error, forzar recarga de página
      window.location.href = '/auth';
    }
  };

  const actualizarPerfil = async (actualizaciones: Partial<Perfil>) => {
    if (!estadoAuth.usuario) return { error: 'No hay usuario logueado' };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(actualizaciones)
        .eq('id', estadoAuth.usuario.id);

      if (!error && estadoAuth.perfil) {
        setEstadoAuth(prev => ({
          ...prev,
          perfil: { ...prev.perfil!, ...actualizaciones }
        }));
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  return (
    <ContextoAuth.Provider value={{
      ...estadoAuth,
      iniciarSesion,
      registrarse,
      cerrarSesion,
      actualizarPerfil
    }}>
      {children}
    </ContextoAuth.Provider>
  );
};

export const useAuth = () => {
  const contexto = useContext(ContextoAuth);
  if (contexto === undefined) {
    throw new Error('useAuth debe usarse dentro de un ProveedorAuth');
  }
  return contexto;
};
