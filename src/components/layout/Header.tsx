
import { Calendar, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";

export const Header = () => {
  const { isAuthenticated, customer, logout } = useCustomerAuth();

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
            {isAuthenticated && customer && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Bienvenido, {customer.firstName}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Salir
                </Button>
              </div>
            )}
            <Button variant="outline" onClick={() => window.location.href = "/admin"}>
              Portal Administrativo
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
