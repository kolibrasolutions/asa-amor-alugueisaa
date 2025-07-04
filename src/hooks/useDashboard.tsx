
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Buscar contagem de produtos
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Buscar contagem de clientes
      const { count: customersCount } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });

      // Buscar contagem de aluguéis ativos
      const { count: activeRentalsCount } = await supabase
        .from('rentals')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'confirmed', 'in_progress']);

      // Buscar atividade recente
      const { data: recentActivity } = await supabase
        .from('rentals')
        .select(`
          id,
          created_at,
          status,
          customers (nome)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      return {
        productsCount: productsCount || 0,
        customersCount: customersCount || 0,
        activeRentalsCount: activeRentalsCount || 0,
        recentActivity: recentActivity || [],
      };
    },
  });
};
