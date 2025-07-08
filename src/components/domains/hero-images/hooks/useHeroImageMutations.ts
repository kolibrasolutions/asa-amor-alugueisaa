import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { HeroImageFormData, HeroImageUploadData } from '../types';

export const useHeroImageMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const uploadHeroImage = useMutation({
    mutationFn: async (data: HeroImageUploadData) => {
      const { file, cropData, formData } = data;
      
      // Upload da imagem
      const fileExt = file.name.split('.').pop();
      const fileName = `hero_${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('hero_images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Criar registro no banco
      const { data: heroImageData, error: dbError } = await supabase
        .from('hero_images' as any)
        .insert({
          image_url: uploadData.path,
          title: formData.title,
          description: formData.description,
          sort_order: formData.sort_order,
          is_active: formData.is_active,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return heroImageData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-images'] });
      toast({
        title: 'Sucesso!',
        description: 'Imagem do hero adicionada com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Erro ao adicionar imagem do hero:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar a imagem do hero.',
        variant: 'destructive',
      });
    },
  });

  const updateHeroImage = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: HeroImageFormData }) => {
      const { data: heroImageData, error } = await supabase
        .from('hero_images' as any)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return heroImageData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-images'] });
      toast({
        title: 'Sucesso!',
        description: 'Imagem do hero atualizada com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar imagem do hero:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a imagem do hero.',
        variant: 'destructive',
      });
    },
  });

  const deleteHeroImage = useMutation({
    mutationFn: async (id: string) => {
      // Primeiro buscar a imagem para deletar do storage
      const { data: heroImage, error: fetchError } = await supabase
        .from('hero_images' as any)
        .select('image_url')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Deletar do storage
      const { error: storageError } = await supabase.storage
        .from('hero_images')
        .remove([heroImage.image_url]);

      if (storageError) throw storageError;

      // Deletar do banco
      const { error: dbError } = await supabase
        .from('hero_images' as any)
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-images'] });
      toast({
        title: 'Sucesso!',
        description: 'Imagem do hero removida com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Erro ao remover imagem do hero:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover a imagem do hero.',
        variant: 'destructive',
      });
    },
  });

  return {
    uploadHeroImage,
    updateHeroImage,
    deleteHeroImage,
  };
}; 