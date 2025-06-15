
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from './useProducts';
import type { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/components/ui/use-toast';

export type RentalWithCustomer = Tables<'rentals'> & {
  customers: Pick<Tables<'customers'>, 'full_name'> | null;
};

export interface AvailabilityResult {
  product: Product | null;
  rental: RentalWithCustomer | null;
  isAvailable: boolean;
}

const checkProductAvailability = async (searchTerm: string): Promise<AvailabilityResult> => {
  if (!searchTerm.trim()) {
    throw new Error("Por favor, insira um ID ou SKU para buscar.");
  }

  // 1. Find the product by ID or SKU
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .or(`id.eq.${searchTerm},sku.eq.${searchTerm}`)
    .maybeSingle();

  if (productError) {
    console.error("Product search error:", productError);
    throw new Error("Erro ao buscar o produto.");
  }

  if (!product) {
    return { product: null, rental: null, isAvailable: false };
  }

  // 2. Check for the product in active rentals
  const { data: rentalItems, error: rentalItemsError } = await supabase
    .from('rental_items')
    .select(`
      rentals (
        *,
        customers (full_name)
      )
    `)
    .eq('product_id', product.id);

  if (rentalItemsError) {
    console.error("Rental items search error:", rentalItemsError);
    throw new Error("Erro ao verificar a disponibilidade do produto.");
  }
  
  const activeRental = rentalItems
    ?.map(item => item.rentals)
    .find(rental => rental && ['pending', 'confirmed', 'in_progress'].includes(rental.status || ''));

  if (activeRental) {
    return {
      product,
      rental: activeRental as RentalWithCustomer,
      isAvailable: false,
    };
  }

  return { product, rental: null, isAvailable: true };
};

export const useProductAvailabilityCheck = () => {
  const { toast } = useToast();
  return useMutation<AvailabilityResult, Error, string>({
    mutationFn: checkProductAvailability,
    onError: (error) => {
      toast({
        title: "Erro na Consulta",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};
