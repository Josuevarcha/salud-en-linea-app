
import { useState } from "react";
import { CustomerLogin } from "@/components/customer/CustomerLogin";
import { CustomerRegistration } from "@/components/customer/CustomerRegistration";

export const AuthSection = () => {
  const [showRegistration, setShowRegistration] = useState(false);

  const handleRegistrationSuccess = () => {
    setShowRegistration(false);
    // No necesitamos mostrar toast aquí porque ya se muestra en el componente de registro
  };

  return (
    <div className="flex justify-center">
      {showRegistration ? (
        <CustomerRegistration
          onSuccess={handleRegistrationSuccess}
          onCancel={() => setShowRegistration(false)}
        />
      ) : (
        <CustomerLogin onRegisterClick={() => setShowRegistration(true)} />
      )}
    </div>
  );
};
