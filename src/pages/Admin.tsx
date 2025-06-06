
import { useState } from "react";
import { Calendar, Users, Clock, Search, ArrowLeft, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AppointmentList } from "@/components/admin/AppointmentList";
import { AppointmentStats } from "@/components/admin/AppointmentStats";
import { CustomerList } from "@/components/admin/CustomerList";
import { useAuth } from "@/hooks/useAuth";
import { useAppointments } from "@/hooks/useAppointments";
import { useCustomers } from "@/hooks/useCustomers";

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const { toast } = useToast();
  
  const { isAuthenticated, login, logout } = useAuth();
  const { appointments, updateAppointment, deleteAppointment } = useAppointments();
  const { customers, reloadCustomers } = useCustomers();

  const handleLogin = (credentials: { username: string; password: string }) => {
    const success = login(credentials);
    
    if (success) {
      toast({
        title: "Acceso concedido",
        description: "Bienvenido al portal administrativo",
      });
      // Recargar datos de clientes al hacer login
      reloadCustomers();
    } else {
      toast({
        title: "Error de autenticación",
        description: "Usuario o contraseña incorrectos",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAppointment = (appointmentId: number) => {
    const success = deleteAppointment(appointmentId);
    
    if (success) {
      toast({
        title: "Cita eliminada",
        description: "La cita ha sido eliminada exitosamente",
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudo eliminar la cita",
        variant: "destructive",
      });
    }
  };

  const handleEditAppointment = (appointmentId: number, updatedData: any) => {
    const success = updateAppointment(appointmentId, updatedData);
    
    if (success) {
      toast({
        title: "Cita actualizada",
        description: "Los cambios han sido guardados",
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudo actualizar la cita",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const filteredAppointments = appointments.filter(apt => 
    apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(apt => 
    filterDate ? apt.date === filterDate : true
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => window.location.href = "/"}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div className="flex items-center space-x-2">
                <div className="bg-green-600 text-white p-2 rounded-lg">
                  <Users className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Portal Administrativo</h1>
              </div>
            </div>
            <Button variant="outline" onClick={logout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Citas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nuevos Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customers.filter(c => {
                  const createdDate = new Date(c.createdAt).toDateString();
                  const today = new Date().toDateString();
                  return createdDate === today;
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="appointments">Citas Médicas</TabsTrigger>
            <TabsTrigger value="customers">Clientes</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-6">
            {/* Filters for appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Filtros y Búsqueda de Citas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Input
                      placeholder="Buscar por nombre o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Button 
                      onClick={() => {
                        setSearchTerm("");
                        setFilterDate("");
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Limpiar Filtros
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appointments List */}
            <AppointmentList
              appointments={filteredAppointments}
              onDelete={handleDeleteAppointment}
              onEdit={handleEditAppointment}
            />
          </TabsContent>

          <TabsContent value="customers">
            <CustomerList customers={customers} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
