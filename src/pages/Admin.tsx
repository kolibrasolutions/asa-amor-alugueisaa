import { useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
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

const Admin = () => {
  const { user, isAdmin, loading } = useAdminAuth();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/access-denied");
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  const handleSectionChange = (section: string) => {
    navigate(`/admin/${section}`);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        activeSection="dashboard"
        userEmail={user?.email || ""}
        onBack={() => navigate("/admin")}
        onSignOut={handleSignOut}
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
        </Routes>
      </main>
    </div>
  );
};

export default Admin;
