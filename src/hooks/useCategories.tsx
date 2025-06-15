
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  sort_order?: number;
  created_at?: string;
}

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as Category[];
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (category: Omit<Category, 'id' | 'created_at'>) => {
      console.log('Creating category with data:', category);
      
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category-stats'] });
      toast({
        title: "Categoria criada",
        description: "Categoria adicionada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error creating category:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar categoria: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...category }: Partial<Category> & { id: string }) => {
      console.log('Updating category with data:', { id, ...category });
      
      const { data, error } = await supabase
        .from('categories')
        .update(category)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category-stats'] });
      toast({
        title: "Categoria atualizada",
        description: "Categoria atualizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error updating category:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar categoria: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category-stats'] });
      toast({
        title: "Categoria excluída",
        description: "Categoria removida com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error deleting category:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir categoria: " + error.message,
        variant: "destructive",
      });
    },
  });
};
