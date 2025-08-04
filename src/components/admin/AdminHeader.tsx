import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';

interface AdminHeaderProps {
  activeSection: string;
  userEmail: string;
  onBack: () => void;
  onSignOut: () => void;
  adminBasePath?: string;
}

export const AdminHeader = ({ activeSection, userEmail, onBack, onSignOut, adminBasePath = '/admin' }: AdminHeaderProps) => {
  const isMobile = useIsMobile();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const getSectionTitle = (section: string, isMobile: boolean = false) => {
    const titles = {
      dashboard: isMobile ? 'Dashboard' : 'Painel Administrativo - Noivas Cirlene',
      products: isMobile ? 'Produtos' : 'Gestão de Produtos',
      categories: isMobile ? 'Categorias' : 'Gestão de Categorias',
      colors: isMobile ? 'Cores' : 'Gestão de Cores',
      sizes: isMobile ? 'Tamanhos' : 'Gestão de Tamanhos',
      customers: isMobile ? 'Clientes' : 'Gestão de Clientes',
      rentals: isMobile ? 'Aluguéis' : 'Gestão de Aluguéis',
      calendar: isMobile ? 'Agenda' : 'Agenda de Aluguéis',
    };
    return titles[section as keyof typeof titles] || (isMobile ? 'Admin' : 'Painel Administrativo');
  };

  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/admin' || location.pathname === '/admin-local';

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  if (isMobile) {
    return (
      <header className="bg-asa-dark text-white">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between p-4">
          {/* Left Side - Back Button + Title */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {activeSection !== 'dashboard' && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onBack}
                className="text-white hover:bg-white/10 p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <h1 
              className={`text-lg font-serif truncate ${
                activeSection !== 'dashboard' ? 'cursor-pointer hover:text-white/80 transition-colors' : ''
              }`}
              onClick={activeSection !== 'dashboard' ? () => navigate(adminBasePath) : undefined}
            >
              {getSectionTitle(activeSection, true)}
            </h1>
          </div>
          
          {/* Right Side - User Menu */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="text-white hover:bg-white/10 p-2 ml-2"
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-xs font-medium">
              {getInitials(userEmail)}
            </div>
          </Button>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="bg-asa-dark/95 border-t border-white/10 p-4">
            <div className="space-y-3">
              <div className="text-sm text-white/80">
                Conectado como: <span className="text-white font-medium">{userEmail}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setShowMobileMenu(false);
                  onSignOut();
                }}
                className="w-full bg-transparent border-white text-white hover:bg-white hover:text-asa-dark"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        )}
      </header>
    );
  }

  // Desktop Layout (unchanged)
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
          <h1 
            className={`text-2xl font-serif ${
              activeSection !== 'dashboard' ? 'cursor-pointer hover:text-white/80 transition-colors' : ''
            }`}
            onClick={activeSection !== 'dashboard' ? () => navigate(adminBasePath) : undefined}
          >
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
