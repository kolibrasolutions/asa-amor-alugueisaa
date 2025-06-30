import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  Calendar, 
  Users, 
  Grid2x2, 
  Palette,
  Ruler,
  Image
} from "lucide-react";

export const AdminQuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Produtos",
      description: "Gerenciar produtos do catálogo",
      icon: <ShoppingBag className="w-6 h-6" />,
      onClick: () => navigate("/admin/products"),
    },
    {
      title: "Aluguéis",
      description: "Gerenciar aluguéis e reservas",
      icon: <Calendar className="w-6 h-6" />,
      onClick: () => navigate("/admin/rentals"),
    },
    {
      title: "Clientes",
      description: "Gerenciar cadastro de clientes",
      icon: <Users className="w-6 h-6" />,
      onClick: () => navigate("/admin/customers"),
    },
    {
      title: "Categorias",
      description: "Gerenciar categorias de produtos",
      icon: <Grid2x2 className="w-6 h-6" />,
      onClick: () => navigate("/admin/categories"),
    },
    {
      title: "Cores",
      description: "Gerenciar cores disponíveis",
      icon: <Palette className="w-6 h-6" />,
      onClick: () => navigate("/admin/colors"),
    },
    {
      title: "Tamanhos",
      description: "Gerenciar tamanhos disponíveis",
      icon: <Ruler className="w-6 h-6" />,
      onClick: () => navigate("/admin/sizes"),
    },
    {
      title: "Banners",
      description: "Gerenciar banners do site",
      icon: <Image className="w-6 h-6" />,
      onClick: () => navigate("/admin/banners"),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {actions.map((action) => (
        <Button
          key={action.title}
          variant="outline"
          className="h-auto p-6 flex flex-col items-center justify-center gap-4 hover:bg-muted/50"
          onClick={action.onClick}
        >
          {action.icon}
          <div className="text-center">
            <h3 className="font-semibold">{action.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {action.description}
            </p>
          </div>
        </Button>
      ))}
    </div>
  );
};
