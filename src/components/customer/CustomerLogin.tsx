
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, UserPlus } from "lucide-react";
import { useCustomers } from "@/hooks/useCustomers";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { useToast } from "@/hooks/use-toast";

interface CustomerLoginProps {
  onRegisterClick: () => void;
}

export const CustomerLogin = ({ onRegisterClick }: CustomerLoginProps) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const { authenticateCustomer } = useCustomers();
  const { login } = useCustomerAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const customer = authenticateCustomer(credentials.email, credentials.password);
    
    if (customer) {
      login(customer);
      toast({
        title: "¡Bienvenido!",
        description: `Hola ${customer.firstName}, ya puedes agendar tus citas`,
      });
    } else {
      toast({
        title: "Error de autenticación",
        description: "Email o contraseña incorrectos",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
        <p className="text-gray-600">Accede a tu cuenta para agendar citas</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="flex items-center space-x-1">
              <Mail className="h-4 w-4" />
              <span>Correo electrónico</span>
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={credentials.email}
              onChange={(e) => setCredentials(prev => ({
                ...prev,
                email: e.target.value
              }))}
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <Label htmlFor="password" className="flex items-center space-x-1">
              <Lock className="h-4 w-4" />
              <span>Contraseña</span>
            </Label>
            <Input
              id="password"
              type="password"
              required
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({
                ...prev,
                password: e.target.value
              }))}
              placeholder="Tu contraseña"
            />
          </div>

          <Button type="submit" className="w-full">
            Iniciar Sesión
          </Button>
        </form>

        <div className="text-center">
          <p className="text-gray-600 mb-2">¿No tienes cuenta?</p>
          <Button 
            variant="outline" 
            onClick={onRegisterClick}
            className="w-full"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Registrarse
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
