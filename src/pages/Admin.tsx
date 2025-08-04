import { useEffect } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAuth } from "@/hooks/useAuth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminQuickActions } from "@/components/admin/AdminQuickActions";
import { ProductsManagement } from "@/components/admin/ProductsManagement";
import { CategoriesManagement } from "@/components/admin/CategoriesManagement";
import { CustomersManagement } from "@/components/admin/CustomersManagement";
import { RentalsManagement } from "@/components/admin/RentalsManagement";
import { RentalsCalendar } from "@/components/admin/RentalsCalendar";
import ColorsManagement from "@/components/admin/ColorsManagement";
import SizesManagement from "@/components/admin/SizesManagement";
import { BannersManagement } from "@/components/admin/BannersManagement";
import { SettingsManagement } from "@/components/admin/SettingsManagement";

const Admin = () => {
  const { user, isAdmin, loading } = useAdminAuth();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isDevelopment = import.meta.env.DEV;
  const adminBasePath = isDevelopment ? '/admin-local' : '/admin';

  // Determinar a seção ativa baseada na URL
  const getActiveSection = () => {
    const path = location.pathname;
    if (path === adminBasePath || path === adminBasePath + '/') {
      return 'dashboard';
    }
    const section = path.replace(adminBasePath + '/', '').split('/')[0];
    return section || 'dashboard';
  };

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/access-denied");
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  const handleSectionChange = (section: string) => {
    navigate(`${adminBasePath}/${section}`);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        activeSection={getActiveSection()}
        userEmail={user?.email || ""}
        onBack={() => navigate(adminBasePath)}
        onSignOut={handleSignOut}
        adminBasePath={adminBasePath}
      />
      <main className="container mx-auto py-8">
        <Routes>
          <Route index element={<AdminQuickActions />} />
          <Route path="products/*" element={<ProductsManagement />} />
          <Route path="categories" element={<CategoriesManagement />} />
          <Route path="customers" element={<CustomersManagement />} />
          <Route path="rentals" element={<RentalsManagement onSectionChange={handleSectionChange} />} />
          <Route path="calendar" element={<RentalsCalendar onSectionChange={handleSectionChange} />} />
          <Route path="colors" element={<ColorsManagement />} />
          <Route path="sizes" element={<SizesManagement />} />
          <Route path="banners" element={<BannersManagement />} />
          <Route path="settings/*" element={<SettingsManagement />} />
        </Routes>
      </main>
    </div>
  );
};

export default Admin;
