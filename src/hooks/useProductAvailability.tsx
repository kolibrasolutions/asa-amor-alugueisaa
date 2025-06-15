
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ productId, status }: { productId: string; status: 'available' | 'rented' | 'maintenance' }) => {
      const { data, error } = await supabase
        .from('products')
        .update({ status })
        .eq('id', productId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status do produto: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useBulkUpdateProductStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ productIds, status }: { productIds: string[]; status: 'available' | 'rented' | 'maintenance' }) => {
      const promises = productIds.map(productId =>
        supabase
          .from('products')
          .update({ status })
          .eq('id', productId)
      );
      
      const results = await Promise.all(promises);
      
      for (const result of results) {
        if (result.error) {
          throw result.error;
        }
      }
      
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status dos produtos: " + error.message,
        variant: "destructive",
      });
    },
  });
};
