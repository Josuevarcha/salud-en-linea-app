
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, Mail, Lock, User, Phone, CreditCard } from "lucide-react";

export const CreateFirstAdmin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    cedula: ""
  });
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // Crear el usuario
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            cedula: formData.cedula
          }
        }
      });

      if (authError) {
        toast({
          title: "Error",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      if (authData.user) {
        // Actualizar el perfil para que sea admin
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            cedula: formData.cedula,
            role: 'admin'
          })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
        }

        toast({
          title: "¡Administrador creado!",
          description: `Usuario administrador creado con email: ${formData.email}`,
        });

        // Limpiar formulario
        setFormData({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          phone: "",
          cedula: ""
        });
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al crear el administrador",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center space-x-2">
            <UserPlus className="h-6 w-6" />
            <span>Crear Primer Administrador</span>
          </CardTitle>
          <p className="text-gray-600">
            Crea el usuario administrador para acceder al panel de control
          </p>
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
                placeholder="admin@ejemplo.com"
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

            <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating ? "Creando administrador..." : "Crear Administrador"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
