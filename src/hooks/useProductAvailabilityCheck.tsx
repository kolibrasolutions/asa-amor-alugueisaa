
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from './useProducts';
import type { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/components/ui/use-toast';

export type RentalWithCustomer = any;

export interface AvailabilityResult {
  product: Product | null;
  rental: RentalWithCustomer | null;
  isAvailable: boolean;
}

const isUuid = (value: string) => {
  const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return regex.test(value);
};

const checkProductAvailability = async (searchTerm: string): Promise<AvailabilityResult> => {
  if (!searchTerm.trim()) {
    throw new Error("Por favor, insira um ID ou SKU para buscar.");
  }

  // 1. Find the product by ID or SKU conditionally
  let productQuery;
  const trimmedSearchTerm = searchTerm.trim();

  if (isUuid(trimmedSearchTerm)) {
    productQuery = supabase.from('products').select('*').eq('id', trimmedSearchTerm);
  } else {
    productQuery = supabase.from('products').select('*').eq('sku', trimmedSearchTerm);
  }

  const { data: product, error: productError } = await productQuery.maybeSingle();


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
        customers (nome)
      )
    `)
    .eq('product_id', product.id);

  if (rentalItemsError) {
    console.error("Rental items search error:", rentalItemsError);
    throw new Error("Erro ao verificar a disponibilidade do produto.");
  }
  
  const activeRental = rentalItems
    ?.map((item: any) => item.rentals)
    .filter((rental: any) => rental && ['pending', 'confirmed', 'in_progress'].includes(rental.status || ''))
    .sort((a: any, b: any) => new Date(b!.rental_end_date).getTime() - new Date(a!.rental_end_date).getTime())[0] || null;


  if (activeRental) {
    return {
      product: product as Product,
      rental: activeRental as RentalWithCustomer,
      isAvailable: false,
    };
  }

  return { product: product as Product, rental: null, isAvailable: true };
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
