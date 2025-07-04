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

      console.log('🔍 === VERIFICAÇÃO DE DISPONIBILIDADE ===');
      console.log('📅 Período solicitado:', params.startDate, 'até', params.endDate);
      console.log('📦 Produtos:', params.productIds);
      console.log('🚫 Excluir aluguel:', params.excludeRentalId);

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
        console.error('❌ Error checking availability:', error);
        throw error;
      }

      console.log('🔍 Aluguéis encontrados que podem conflitar:', conflictingRentals?.length || 0);
      
      conflictingRentals?.forEach((rental, index) => {
        console.log(`📋 Aluguel ${index + 1}:`, {
          id: rental.id,
          start: rental.rental_start_date,
          end: rental.rental_end_date,
          status: rental.status,
          produtos: rental.rental_items?.map(item => item.product_id)
        });
        
        // Verificar sobreposição manualmente
        const rentalStart = new Date(rental.rental_start_date);
        const rentalEnd = new Date(rental.rental_end_date);
        const requestStart = new Date(params.startDate);
        const requestEnd = new Date(params.endDate);
        
        const overlaps = rentalStart <= requestEnd && rentalEnd >= requestStart;
        console.log(`🔄 Sobreposição detectada:`, overlaps);
        console.log(`   - Aluguel: ${rental.rental_start_date} até ${rental.rental_end_date}`);
        console.log(`   - Solicitado: ${params.startDate} até ${params.endDate}`);
      });

      // Extrair os IDs dos produtos que estão indisponíveis
      const unavailableProductIds = new Set<string>();
      
      conflictingRentals?.forEach(rental => {
        rental.rental_items?.forEach(item => {
          unavailableProductIds.add(item.product_id);
          console.log(`🚫 Produto ${item.product_id} marcado como indisponível`);
        });
      });

      console.log('📊 Produtos indisponíveis:', Array.from(unavailableProductIds));

      // Retornar quais produtos estão disponíveis
      const result = params.productIds.map(productId => {
        const isAvailable = !unavailableProductIds.has(productId);
        console.log(`📦 Produto ${productId}: ${isAvailable ? 'DISPONÍVEL ✅' : 'INDISPONÍVEL ❌'}`);
        
        return {
          productId,
          isAvailable,
          conflictingRentals: conflictingRentals?.filter(rental => 
            rental.rental_items?.some(item => item.product_id === productId)
          ) || []
        };
      });

      console.log('🏁 Resultado final:', result);
      console.log('================================');
      
      return result;
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