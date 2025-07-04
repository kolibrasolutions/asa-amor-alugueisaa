import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AdminHeaderProps {
  activeSection: string;
  userEmail: string;
  onBack: () => void;
  onSignOut: () => void;
}

export const AdminHeader = ({ activeSection, userEmail, onBack, onSignOut }: AdminHeaderProps) => {
  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'dashboard': return 'Painel Administrativo - Noivas Cirlene';
      case 'products': return 'Gestão de Produtos';
      case 'categories': return 'Gestão de Categorias';
      case 'colors': return 'Gestão de Cores';
      case 'sizes': return 'Gestão de Tamanhos';
      case 'customers': return 'Gestão de Clientes';
      case 'rentals': return 'Gestão de Aluguéis';
      case 'calendar': return 'Agenda de Aluguéis';
      default: return 'Painel Administrativo';
    }
  };

  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/admin' || location.pathname === '/admin-local';

  return (
    <header className="bg-asa-dark text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {activeSection !== 'dashboard' && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          )}
          <h1 className="text-2xl font-serif">
            {getSectionTitle(activeSection)}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Olá, {userEmail}</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSignOut}
            className="bg-transparent border-white text-white hover:bg-white hover:text-asa-dark"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};

export const AdminBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/admin' || location.pathname === '/admin-local';
  if (isHome) return null;
  return (
    <button
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4"
      onClick={() => navigate(-1)}
    >
      <ArrowLeft className="w-4 h-4" /> Voltar
    </button>
  );
};
