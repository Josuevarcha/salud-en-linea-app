
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/layout/HeroSection";
import { FeaturesSection } from "@/components/layout/FeaturesSection";
import { UpdatedAppointmentSection } from "@/components/appointments/UpdatedAppointmentSection";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { usuario, perfil, cargando } = useAuth();
  const navigate = useNavigate();

  // Redirigir basado en el rol del usuario
  useEffect(() => {
    if (!cargando && usuario && perfil) {
      if (perfil.role === 'admin') {
        navigate('/admin');
      }
    }
  }, [usuario, perfil, cargando, navigate]);

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  // Mostrar mensaje de redirección si el admin intenta acceder a la página principal
  if (usuario && perfil?.role === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Redirigiendo al panel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {!usuario ? (
          <>
            <div className="text-center mb-8">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Iniciar Sesión / Registrarse
              </Button>
            </div>
            <FeaturesSection />
          </>
        ) : (
          <>
            <UpdatedAppointmentSection />
            <FeaturesSection />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
