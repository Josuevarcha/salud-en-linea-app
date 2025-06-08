
import { useAuth } from "@/contexts/AuthContext";

export const HeroSection = () => {
  const { user, profile } = useAuth();

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Agenda tu Cita Médica en Línea
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          {user && profile
            ? `Bienvenido ${profile.first_name}, selecciona una fecha para agendar tu cita`
            : "Inicia sesión o regístrate para comenzar a agendar tus citas médicas"
          }
        </p>
      </div>
    </section>
  );
};
