
import { Card, CardContent } from '@/components/ui/card';
import { Package, Users, Calendar, Folder, ClipboardList } from 'lucide-react';

interface AdminQuickActionsProps {
  onSectionChange: (section: string) => void;
}

export const AdminQuickActions = ({ onSectionChange }: AdminQuickActionsProps) => {
  const actions = [
    {
      id: 'products',
      icon: Package,
      title: 'Gerenciar Produtos',
      description: 'Adicionar, editar e remover produtos'
    },
    {
      id: 'categories',
      icon: Folder,
      title: 'Gerenciar Categorias',
      description: 'Criar e organizar categorias'
    },
    {
      id: 'customers',
      icon: Users,
      title: 'Gerenciar Clientes',
      description: 'Cadastro e histórico de clientes'
    },
    {
      id: 'rentals',
      icon: ClipboardList,
      title: 'Gerenciar Aluguéis',
      description: 'Ver, criar e editar aluguéis'
    },
    {
      id: 'calendar',
      icon: Calendar,
      title: 'Agenda de Aluguéis',
      description: 'Visualizar aluguéis no calendário'
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => {
        const IconComponent = action.icon;
        return (
          <Card 
            key={action.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onSectionChange(action.id)}
          >
            <CardContent className="p-6 text-center">
              <IconComponent className="w-8 h-8 mx-auto mb-2 text-asa-blush" />
              <h3 className="font-semibold mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
