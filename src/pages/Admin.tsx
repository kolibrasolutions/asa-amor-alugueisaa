
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardStats } from '@/hooks/useDashboard';
import { ProductsManagement } from '@/components/admin/ProductsManagement';
import { CustomersManagement } from '@/components/admin/CustomersManagement';
import { CategoriesManagement } from '@/components/admin/CategoriesManagement';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

const Admin = () => {
  const { user, isAdmin, loading } = useAdminAuth();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        navigate('/access-denied');
      }
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleBackToDashboard = () => {
    setActiveSection('dashboard');
  };

  if (loading || statsLoading) {
    return (
      <div className="min-h-screen bg-asa-white flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'products':
        return <ProductsManagement />;
      case 'customers':
        return <CustomersManagement />;
      case 'categories':
        return <CategoriesManagement />;
      case 'rentals':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold">Gestão de Aluguéis</h1>
            <p className="text-gray-600 mt-2">Em desenvolvimento...</p>
          </div>
        );
      case 'calendar':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold">Agenda</h1>
            <p className="text-gray-600 mt-2">Em desenvolvimento...</p>
          </div>
        );
      default:
        return <AdminDashboard stats={stats} onSectionChange={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-asa-white">
      <AdminHeader 
        activeSection={activeSection}
        userEmail={user.email}
        onBack={handleBackToDashboard}
        onSignOut={handleSignOut}
      />
      {renderContent()}
    </div>
  );
};

export default Admin;
