
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Rental {
  id: string;
  customer_id: string;
  rental_start_date: string;
  rental_end_date: string;
  event_date: string;
  total_amount: number;
  deposit_amount?: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RentalWithDetails extends Rental {
  customer: {
    id: string;
    full_name: string;
    email?: string;
    phone?: string;
  };
  rental_items: Array<{
    id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    product: {
      id: string;
      name: string;
      images?: string[];
    };
  }>;
}

export const useRentals = () => {
  return useQuery({
    queryKey: ['rentals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rentals')
        .select(`
          *,
          customers!inner(id, full_name, email, phone),
          rental_items(
            id,
            product_id,
            quantity,
            unit_price,
            products(id, name, images)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(rental => ({
        ...rental,
        customer: rental.customers,
        rental_items: rental.rental_items || []
      })) as RentalWithDetails[];
    },
  });
};

export const useRental = (id: string) => {
  return useQuery({
    queryKey: ['rental', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rentals')
        .select(`
          *,
          customers!inner(id, full_name, email, phone, address, document_number),
          rental_items(
            id,
            product_id,
            quantity,
            unit_price,
            products(id, name, description, images, brand, size, color)
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        customer: data.customers,
        rental_items: data.rental_items || []
      } as RentalWithDetails;
    },
    enabled: !!id,
  });
};

export const useCreateRental = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (rental: Omit<Rental, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('rentals')
        .insert([rental])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      toast({
        title: "Aluguel criado",
        description: "Aluguel criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar aluguel: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateRental = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...rental }: Partial<Rental> & { id: string }) => {
      const { data, error } = await supabase
        .from('rentals')
        .update(rental)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      toast({
        title: "Aluguel atualizado",
        description: "Aluguel atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar aluguel: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteRental = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rentals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      toast({
        title: "Aluguel excluído",
        description: "Aluguel removido com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao excluir aluguel: " + error.message,
        variant: "destructive",
      });
    },
  });
};
