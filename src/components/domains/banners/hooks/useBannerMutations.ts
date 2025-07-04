import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Banner, BannerFormData } from '../types';

export const useBannerMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createBanner = useMutation({
    mutationFn: async (formData: BannerFormData) => {
      if (!formData.image_file) throw new Error('Imagem é obrigatória');

      // Upload image
      const fileName = `banner-${Date.now()}.png`;
      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(fileName, formData.image_file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(fileName);

      // Get current banners count for sort_order
      const { count } = await supabase
        .from('banners')
        .select('*', { count: 'exact', head: true });

      // Create banner record
      const { error } = await supabase
        .from('banners')
        .insert([{
          image_url: publicUrl,
          title: formData.title,
          subtitle: formData.subtitle,
          sort_order: count || 0
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast({
        title: "Banner criado",
        description: "O banner foi adicionado com sucesso!"
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar banner: " + error.message,
        variant: "destructive"
      });
    }
  });

  const updateBanner = useMutation({
    mutationFn: async ({ id, formData, currentImageUrl }: { 
      id: string; 
      formData: BannerFormData;
      currentImageUrl?: string;
    }) => {
      let publicUrl = currentImageUrl;

      if (formData.image_file) {
        // Upload new image
        const fileName = `banner-${Date.now()}.png`;
        const { error: uploadError } = await supabase.storage
          .from('banners')
          .upload(fileName, formData.image_file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl: newUrl } } = supabase.storage
          .from('banners')
          .getPublicUrl(fileName);

        publicUrl = newUrl;
      }

      // Update banner record
      const { error } = await supabase
        .from('banners')
        .update({
          image_url: publicUrl,
          title: formData.title,
          subtitle: formData.subtitle,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast({
        title: "Banner atualizado",
        description: "O banner foi atualizado com sucesso!"
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar banner: " + error.message,
        variant: "destructive"
      });
    }
  });

  const deleteBanner = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast({
        title: "Banner removido",
        description: "O banner foi removido com sucesso!"
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao remover banner: " + error.message,
        variant: "destructive"
      });
    }
  });

  const reorderBanners = useMutation({
    mutationFn: async (banners: Banner[]) => {
      const updates = banners.map((banner, index) => ({
        id: banner.id,
        image_url: banner.image_url,
        title: banner.title,
        subtitle: banner.subtitle,
        active: banner.active,
        sort_order: index
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('banners')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao reordenar banners: " + error.message,
        variant: "destructive"
      });
    }
  });

  return {
    createBanner,
    updateBanner,
    deleteBanner,
    reorderBanners
  };
}; 