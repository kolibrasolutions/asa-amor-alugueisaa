import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Calendar,
  CalendarClock,
  Users,
  ClipboardList,
  Settings,
  ShoppingBag,
  LayoutGrid,
  RefreshCw
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useForceSyncProducts } from "@/hooks/useRentals";

export const AdminQuickActions = () => {
  const navigate = useNavigate();
  const isDevelopment = import.meta.env.DEV;
  const adminBasePath = isDevelopment ? '/admin-local' : '/admin';
  const forceSync = useForceSyncProducts();

  const mainActions = [
    {
      title: "Aluguéis",
      description: "Gerenciar aluguéis e reservas",
      icon: <Calendar className="w-8 h-8" />,
      onClick: () => navigate(`${adminBasePath}/rentals`),
      primary: true
    },
    {
      title: "Calendário",
      description: "Visualizar agenda de provas e eventos",
      icon: <CalendarClock className="w-8 h-8" />,
      onClick: () => navigate(`${adminBasePath}/calendar`),
      primary: true
    },
    {
      title: "Clientes",
      description: "Gerenciar cadastro de clientes",
      icon: <Users className="w-8 h-8" />,
      onClick: () => navigate(`${adminBasePath}/customers`),
      primary: true
    }
  ];

  const catalogActions = [
    {
      title: "Estoque",
      description: "Gerenciar estoque de produtos",
      icon: <ShoppingBag className="w-6 h-6" />,
      onClick: () => navigate(`${adminBasePath}/products`),
    },
    {
      title: "Configurações",
      description: "Cores, tamanhos, banners e categorias",
      icon: <Settings className="w-6 h-6" />,
      onClick: () => navigate(`${adminBasePath}/settings`),
    },
    {
      title: "Sincronizar",
      description: "Forçar sincronização de produtos",
      icon: <RefreshCw className="w-6 h-6" />,
      onClick: () => forceSync.mutate(),
      danger: true
    }
  ];

  return (
    <div className="space-y-8">
      {/* Ações Principais - Foco em Aluguéis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mainActions.map((action) => (
          <Button
            key={action.title}
            variant={action.primary ? "default" : "outline"}
            className="h-auto p-8 flex flex-col items-center justify-center gap-4 hover:scale-[1.02] transition-all"
            onClick={action.onClick}
          >
            {action.icon}
            <div className="text-center">
              <h3 className="font-semibold text-lg">{action.title}</h3>
              <p className={`text-sm mt-1 ${action.primary ? "text-white/80" : "text-muted-foreground"}`}>
                {action.description}
              </p>
            </div>
          </Button>
        ))}
      </div>

      {/* Seção de Catálogo */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Catálogo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {catalogActions.map((action) => (
            <Button
              key={action.title}
              variant={action.danger ? "destructive" : "outline"}
              className="h-auto p-6 flex flex-col items-center justify-center gap-4 hover:bg-muted/50"
              onClick={action.onClick}
              disabled={action.title === "Sincronizar" && forceSync.isPending}
            >
              {action.title === "Sincronizar" && forceSync.isPending ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                action.icon
              )}
              <div className="text-center">
                <h3 className="font-semibold">{action.title}</h3>
                <p className={`text-sm mt-1 ${action.danger ? "text-white/80" : "text-muted-foreground"}`}>
                  {action.title === "Sincronizar" && forceSync.isPending 
                    ? "Sincronizando..." 
                    : action.description}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};
