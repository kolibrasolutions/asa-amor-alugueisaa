
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardStats } from '@/hooks/useDashboard';
import { Package, Users, Calendar, LogOut, ArrowLeft, Folder } from 'lucide-react';
import { ProductsManagement } from '@/components/admin/ProductsManagement';
import { CustomersManagement } from '@/components/admin/CustomersManagement';
import { CategoriesManagement } from '@/components/admin/CategoriesManagement';

const Admin = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading || statsLoading) {
    return (
      <div className="min-h-screen bg-asa-white flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
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
        return (
          <main className="container mx-auto p-6">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Produtos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.productsCount || 0}</div>
                  <p className="text-xs text-muted-foreground">Total de produtos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.customersCount || 0}</div>
                  <p className="text-xs text-muted-foreground">Total de clientes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Aluguéis</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.activeRentalsCount || 0}</div>
                  <p className="text-xs text-muted-foreground">Aluguéis ativos</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setActiveSection('products')}
              >
                <CardContent className="p-6 text-center">
                  <Package className="w-8 h-8 mx-auto mb-2 text-asa-blush" />
                  <h3 className="font-semibold mb-1">Gerenciar Produtos</h3>
                  <p className="text-sm text-gray-600">Adicionar, editar e remover produtos</p>
                </CardContent>
              </Card>

              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setActiveSection('categories')}
              >
                <CardContent className="p-6 text-center">
                  <Folder className="w-8 h-8 mx-auto mb-2 text-asa-blush" />
                  <h3 className="font-semibold mb-1">Gerenciar Categorias</h3>
                  <p className="text-sm text-gray-600">Criar e organizar categorias</p>
                </CardContent>
              </Card>

              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setActiveSection('customers')}
              >
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-asa-blush" />
                  <h3 className="font-semibold mb-1">Gerenciar Clientes</h3>
                  <p className="text-sm text-gray-600">Cadastro e histórico de clientes</p>
                </CardContent>
              </Card>

              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setActiveSection('rentals')}
              >
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-asa-blush" />
                  <h3 className="font-semibold mb-1">Novo Aluguel</h3>
                  <p className="text-sm text-gray-600">Criar novo contrato de aluguel</p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                  <div className="space-y-2">
                    {stats.recentActivity.map((activity: any) => (
                      <div key={activity.id} className="flex justify-between items-center p-2 border-b">
                        <span>Aluguel para {activity.customers?.full_name}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Nenhuma atividade recente.</p>
                )}
              </CardContent>
            </Card>
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen bg-asa-white">
      <header className="bg-asa-dark text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {activeSection !== 'dashboard' && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setActiveSection('dashboard')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            )}
            <h1 className="text-2xl font-serif">
              {activeSection === 'dashboard' ? 'Painel Administrativo - Asa Amor' : 
               activeSection === 'products' ? 'Gestão de Produtos' :
               activeSection === 'categories' ? 'Gestão de Categorias' :
               activeSection === 'customers' ? 'Gestão de Clientes' :
               activeSection === 'rentals' ? 'Gestão de Aluguéis' :
               'Agenda'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Olá, {user.email}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="bg-transparent border-white text-white hover:bg-white hover:text-asa-dark"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {renderContent()}
    </div>
  );
};

export default Admin;
