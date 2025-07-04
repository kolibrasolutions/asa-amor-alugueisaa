import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface RentalItem {
  id: string;
  rental_id: string;
  product_id: string;
  quantity: number;
}

export interface RentalItemWithProduct extends RentalItem {
  unit_price: number;
  product: {
    id: string;
    name: string;
    description?: string;
    images?: string[];
    rental_price?: number;
    brand?: string;
    size?: string;
    color?: string;
  };
}

export const useRentalItems = (rentalId: string) => {
  return useQuery({
    queryKey: ['rental-items', rentalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rental_items')
        .select(`
          id,
          rental_id,
          product_id,
          quantity,
          unit_price,
          products(id, name, description, images, rental_price, brand, size, color)
        `)
        .eq('rental_id', rentalId);
      
      if (error) throw error;
      
      return data.map(item => ({
        ...item,
        product: item.products
      })) as RentalItemWithProduct[];
    },
    enabled: !!rentalId,
  });
};

export const useCreateRentalItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (item: Omit<RentalItem, 'id'>) => {
      const { data, error } = await supabase
        .from('rental_items')
        .insert([item])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rental-items', variables.rental_id] });
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      toast({
        title: "Item adicionado",
        description: "Item adicionado ao aluguel com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao adicionar item: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateRentalItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...item }: Partial<RentalItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('rental_items')
        .update(item)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-items'] });
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      toast({
        title: "Item atualizado",
        description: "Item atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar item: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteRentalItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rental_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-items'] });
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      toast({
        title: "Item removido",
        description: "Item removido do aluguel com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao remover item: " + error.message,
        variant: "destructive",
      });
    },
  });
};
