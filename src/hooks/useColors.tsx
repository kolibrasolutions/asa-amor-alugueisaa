import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Color {
  id: string;
  name: string;
  value: string;
  hex_code: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateColorData {
  name: string;
  value: string;
  hex_code: string;
}

export interface UpdateColorData extends CreateColorData {
  id: string;
}

// Hook para buscar todas as cores
export const useColors = () => {
  return useQuery({
    queryKey: ['colors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('colors')
        .select('*')
        .order('is_default', { ascending: false })
        .order('name', { ascending: true });

      if (error) {
        console.error('Erro ao buscar cores:', error);
        throw error;
      }

      return data as Color[];
    },
  });
};

// Hook para criar nova cor
export const useCreateColor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (colorData: CreateColorData) => {
      const { data, error } = await supabase
        .from('colors')
        .insert([colorData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar cor:', error);
        throw error;
      }

      return data as Color;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
      toast({
        title: "Sucesso!",
        description: "Cor criada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar cor",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });
};

// Hook para atualizar cor
export const useUpdateColor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...colorData }: UpdateColorData) => {
      const { data, error } = await supabase
        .from('colors')
        .update(colorData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar cor:', error);
        throw error;
      }

      return data as Color;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
      toast({
        title: "Sucesso!",
        description: "Cor atualizada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar cor",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });
};

// Hook para deletar cor (apenas cores não padrão)
export const useDeleteColor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('colors')
        .delete()
        .eq('id', id)
        .eq('is_default', false); // Só permite deletar cores não padrão

      if (error) {
        console.error('Erro ao deletar cor:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
      toast({
        title: "Sucesso!",
        description: "Cor removida com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover cor",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });
}; 