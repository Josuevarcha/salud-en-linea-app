
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Lock, CreditCard } from "lucide-react";
import { useCustomers, CustomerRegistrationData } from "@/hooks/useCustomers";
import { useToast } from "@/hooks/use-toast";

interface CustomerRegistrationProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const CustomerRegistration = ({ onSuccess, onCancel }: CustomerRegistrationProps) => {
  const [formData, setFormData] = useState<CustomerRegistrationData>({
    firstName: "",
    lastName: "",
    email: "",
    cedula: "",
    phone: "",
    password: ""
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const { registerCustomer } = useCustomers();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    const result = registerCustomer(formData);
    
    if (result.success) {
      toast({
        title: "¡Registro exitoso!",
        description: result.message,
      });
      onSuccess();
    } else {
      toast({
        title: "Error en el registro",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof CustomerRegistrationData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Registro de Cliente</CardTitle>
        <p className="text-gray-600">Crea tu cuenta para agendar citas</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Nombre</span>
              </Label>
              <Input
                id="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Tu apellido"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="flex items-center space-x-1">
              <Mail className="h-4 w-4" />
              <span>Correo electrónico</span>
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <Label htmlFor="cedula" className="flex items-center space-x-1">
              <CreditCard className="h-4 w-4" />
              <span>Cédula</span>
            </Label>
            <Input
              id="cedula"
              type="text"
              required
              value={formData.cedula}
              onChange={(e) => handleInputChange("cedula", e.target.value)}
              placeholder="12345678"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="flex items-center space-x-1">
              <Phone className="h-4 w-4" />
              <span>Teléfono</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+57 300 123 4567"
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
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu contraseña"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              Registrarse
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
