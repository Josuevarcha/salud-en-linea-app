
import { Calendar, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const { usuario, perfil, cerrarSesion } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Calendar className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Salud en Línea</h1>
          </div>
          <div className="flex items-center space-x-4">
            {usuario && perfil ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Bienvenido, {perfil.first_name} {perfil.last_name}
                  {perfil.role === 'admin' && <span className="text-blue-600 font-medium"> (Admin)</span>}
                </span>
                <Button variant="outline" size="sm" onClick={cerrarSesion}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Salir
                </Button>
              </div>
            ) : (
              <span className="text-sm text-gray-500">No autenticado</span>
            )}
            {perfil?.role === 'admin' && (
              <Button variant="outline" onClick={() => window.location.href = "/admin"}>
                Panel Administrativo
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
