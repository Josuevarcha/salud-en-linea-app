
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User, ArrowLeft } from "lucide-react";

interface AdminLoginProps {
  onLogin: (credentials: { username: string; password: string }) => void;
}

export const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(credentials);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Button variant="ghost" onClick={() => window.location.href = "/"} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="bg-green-600 text-white p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Lock className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl">Portal Administrativo</CardTitle>
            <p className="text-gray-600">Accede con tus credenciales de administrador</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username" className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Usuario</span>
                </Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({
                    ...prev,
                    username: e.target.value
                  }))}
                  placeholder="Ingresa tu usuario"
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
                  placeholder="Ingresa tu contraseña"
                />
              </div>

              <Button type="submit" className="w-full">
                Iniciar Sesión
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Credenciales de prueba:</strong><br />
                Usuario: admin<br />
                Contraseña: admin123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
