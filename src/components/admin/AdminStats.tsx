
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, Calendar } from 'lucide-react';

interface AdminStatsProps {
  stats: {
    productsCount?: number;
    customersCount?: number;
    activeRentalsCount?: number;
  } | undefined;
}

export const AdminStats = ({ stats }: AdminStatsProps) => {
  return (
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
  );
};
