import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AvailabilityCheckParams {
  productIds: string[];
  startDate: string;
  endDate: string;
  excludeRentalId?: string; // Para excluir o aluguel atual ao editar
}

export const useProductAvailabilityByDate = (params: AvailabilityCheckParams) => {
  return useQuery({
    queryKey: ['product-availability', params.productIds, params.startDate, params.endDate, params.excludeRentalId],
    queryFn: async () => {
      if (!params.productIds.length || !params.startDate || !params.endDate) {
        return [];
      }

      // Buscar aluguéis que se sobrepõem com o período desejado
      // Para dois períodos se sobreporem: start1 <= end2 AND end1 >= start2
      let query = supabase
        .from('rentals')
        .select(`
          id,
          rental_start_date,
          rental_end_date,
          status,
          rental_items!inner(product_id)
        `)
        .in('rental_items.product_id', params.productIds)
        .in('status', ['pending', 'confirmed', 'in_progress'])
        .lte('rental_start_date', params.endDate)
        .gte('rental_end_date', params.startDate);

      // Excluir o aluguel atual se estiver editando
      if (params.excludeRentalId) {
        query = query.neq('id', params.excludeRentalId);
      }

      const { data: conflictingRentals, error } = await query;

      if (error) {
        console.error('Error checking availability:', error);
        throw error;
      }

      // Extrair os IDs dos produtos que estão indisponíveis
      const unavailableProductIds = new Set<string>();
      
      conflictingRentals?.forEach(rental => {
        rental.rental_items?.forEach(item => {
          unavailableProductIds.add(item.product_id);
        });
      });

      // Retornar quais produtos estão disponíveis
      return params.productIds.map(productId => ({
        productId,
        isAvailable: !unavailableProductIds.has(productId),
        conflictingRentals: conflictingRentals?.filter(rental => 
          rental.rental_items?.some(item => item.product_id === productId)
        ) || []
      }));
    },
    enabled: Boolean(params.productIds.length && params.startDate && params.endDate),
  });
};

// Hook para verificar se um produto específico está disponível
export const useCheckSingleProductAvailability = (
  productId: string,
  startDate: string,
  endDate: string,
  excludeRentalId?: string
) => {
  return useProductAvailabilityByDate({
    productIds: productId ? [productId] : [],
    startDate,
    endDate,
    excludeRentalId
  });
}; 