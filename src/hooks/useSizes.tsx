import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Size {
  id: string;
  name: string;
  value: string;
  sort_order: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSizeData {
  name: string;
  value: string;
  sort_order?: number;
}

export interface UpdateSizeData extends CreateSizeData {
  id: string;
}

// Hook para buscar todos os tamanhos
export const useSizes = () => {
  return useQuery({
    queryKey: ['sizes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sizes')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Erro ao buscar tamanhos:', error);
        throw error;
      }

      return data as Size[];
    },
  });
};

// Hook para criar novo tamanho
export const useCreateSize = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (sizeData: CreateSizeData) => {
      const { data, error } = await supabase
        .from('sizes')
        .insert([sizeData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar tamanho:', error);
        throw error;
      }

      return data as Size;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sizes'] });
      toast({
        title: "Sucesso!",
        description: "Tamanho criado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar tamanho",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });
};

// Hook para atualizar tamanho
export const useUpdateSize = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...sizeData }: UpdateSizeData) => {
      const { data, error } = await supabase
        .from('sizes')
        .update(sizeData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar tamanho:', error);
        throw error;
      }

      return data as Size;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sizes'] });
      toast({
        title: "Sucesso!",
        description: "Tamanho atualizado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar tamanho",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });
};

// Hook para deletar tamanho (apenas tamanhos não padrão)
export const useDeleteSize = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('sizes')
        .delete()
        .eq('id', id)
        .eq('is_default', false); // Só permite deletar tamanhos não padrão

      if (error) {
        console.error('Erro ao deletar tamanho:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sizes'] });
      toast({
        title: "Sucesso!",
        description: "Tamanho removido com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao remover tamanho",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });
}; 