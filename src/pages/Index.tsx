
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/layout/HeroSection";
import { FeaturesSection } from "@/components/layout/FeaturesSection";
import { AppointmentSection } from "@/components/appointments/AppointmentSection";
import { AuthSection } from "@/components/auth/AuthSection";

const Index = () => {
  const { isAuthenticated } = useCustomerAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {!isAuthenticated ? (
          <AuthSection />
        ) : (
          <AppointmentSection />
        )}

        {/* Features Section */}
        <FeaturesSection />
      </div>
    </div>
  );
};

export default Index;
