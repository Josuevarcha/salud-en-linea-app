
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, User, Phone, CreditCard, ArrowLeft } from "lucide-react";

export const AuthPage = () => {
  const [esLogin, setEsLogin] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [datosFormulario, setDatosFormulario] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    cedula: ""
  });

  const { iniciarSesion, registrarse } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    try {
      if (esLogin) {
        const { error } = await iniciarSesion(datosFormulario.email, datosFormulario.password);
        
        if (error) {
          toast({
            title: "Error de autenticación",
            description: error.message || "Credenciales incorrectas",
            variant: "destructive",
          });
        } else {
          toast({
            title: "¡Bienvenido!",
            description: "Has iniciado sesión exitosamente",
          });
          // La redirección se maneja automáticamente en el contexto
        }
      } else {
        if (datosFormulario.password.length < 6) {
          toast({
            title: "Error",
            description: "La contraseña debe tener al menos 6 caracteres",
            variant: "destructive",
          });
          return;
        }

        const { error } = await registrarse(datosFormulario.email, datosFormulario.password, {
          firstName: datosFormulario.firstName,
          lastName: datosFormulario.lastName,
          phone: datosFormulario.phone,
          cedula: datosFormulario.cedula
        });

        if (error) {
          toast({
            title: "Error en el registro",
            description: error.message || "Error al crear la cuenta",
            variant: "destructive",
          });
        } else {
          toast({
            title: "¡Registro exitoso!",
            description: "Tu cuenta ha sido creada exitosamente",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      });
    } finally {
      setCargando(false);
    }
  };

  const manejarCambioInput = (campo: string, valor: string) => {
    setDatosFormulario(prev => ({ ...prev, [campo]: valor }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {esLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </CardTitle>
            <p className="text-gray-600">
              {esLogin 
                ? "Accede a tu cuenta para agendar citas" 
                : "Crea tu cuenta para comenzar"
              }
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={manejarEnvio} className="space-y-4">
              {!esLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre" className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>Nombre</span>
                      </Label>
                      <Input
                        id="nombre"
                        type="text"
                        required
                        value={datosFormulario.firstName}
                        onChange={(e) => manejarCambioInput("firstName", e.target.value)}
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <Label htmlFor="apellido">Apellido</Label>
                      <Input
                        id="apellido"
                        type="text"
                        required
                        value={datosFormulario.lastName}
                        onChange={(e) => manejarCambioInput("lastName", e.target.value)}
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
                      value={datosFormulario.cedula}
                      onChange={(e) => manejarCambioInput("cedula", e.target.value)}
                      placeholder="12345678"
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefono" className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>Teléfono</span>
                    </Label>
                    <Input
                      id="telefono"
                      type="tel"
                      required
                      value={datosFormulario.phone}
                      onChange={(e) => manejarCambioInput("phone", e.target.value)}
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="email" className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>Correo electrónico</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={datosFormulario.email}
                  onChange={(e) => manejarCambioInput("email", e.target.value)}
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
                  value={datosFormulario.password}
                  onChange={(e) => manejarCambioInput("password", e.target.value)}
                  placeholder={esLogin ? "Tu contraseña" : "Mínimo 6 caracteres"}
                />
              </div>

              <Button type="submit" className="w-full" disabled={cargando}>
                {cargando 
                  ? (esLogin ? "Iniciando sesión..." : "Creando cuenta...")
                  : (esLogin ? "Iniciar Sesión" : "Crear Cuenta")
                }
              </Button>
            </form>

            <div className="text-center mt-4">
              <Button 
                variant="ghost" 
                onClick={() => setEsLogin(!esLogin)}
                disabled={cargando}
              >
                {esLogin 
                  ? "¿No tienes cuenta? Regístrate"
                  : "¿Ya tienes cuenta? Inicia sesión"
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
