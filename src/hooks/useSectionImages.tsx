import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SectionImage, SectionImageUploadData, SectionImageFormData } from '@/components/domains/section-images/types';

export const useSectionImages = (sectionId: string) => {
  return useQuery({
    queryKey: ['section-images', sectionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('section_images')
        .select('*')
        .eq('section_id', sectionId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as SectionImage[];
    },
  });
};

export const useSectionImageMutations = () => {
  const queryClient = useQueryClient();

  const uploadSectionImage = useMutation({
    mutationFn: async (data: SectionImageUploadData) => {
      const { file, sectionId, formData } = data;

      // 1. Upload da imagem para o storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${sectionId}/${crypto.randomUUID()}.${fileExt}`;

      // Converter para Blob se necessário
      const blob = file instanceof Blob ? file : new Blob([file], { type: 'image/jpeg' });

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('section-images')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw uploadError;
      }

      // 2. Criar registro no banco
      const { error: dbError, data: dbData } = await supabase
        .from('section_images')
        .insert({
          section_id: sectionId,
          image_url: fileName, // Usar apenas o path relativo
          title: formData.title,
          description: formData.description,
          sort_order: formData.sort_order,
          is_active: formData.is_active,
        })
        .select()
        .single();

      if (dbError) {
        console.error('Erro no banco:', dbError);
        // Se der erro no banco, tentar limpar a imagem do storage
        await supabase.storage
          .from('section-images')
          .remove([fileName]);
        throw dbError;
      }

      return dbData;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['section-images', variables.sectionId] });
    },
  });

  const updateSectionImage = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SectionImageFormData }) => {
      const { error, data: updatedData } = await supabase
        .from('section_images')
        .update({
          title: data.title,
          description: data.description,
          sort_order: data.sort_order,
          is_active: data.is_active,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section-images'] });
    },
  });

  const deleteSectionImage = useMutation({
    mutationFn: async (id: string) => {
      // 1. Buscar imagem para pegar o path
      const { data: image, error: fetchError } = await supabase
        .from('section_images')
        .select('image_url')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // 2. Deletar do storage
      if (image?.image_url) {
        const { error: storageError } = await supabase.storage
          .from('section-images')
          .remove([image.image_url]);

        if (storageError) throw storageError;
      }

      // 3. Deletar do banco
      const { error: dbError } = await supabase
        .from('section_images')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section-images'] });
    },
  });

  return {
    uploadSectionImage,
    updateSectionImage,
    deleteSectionImage,
  };
};

// Hook específicos por seção
export const useClientGalleryImages = () => useSectionImages('client_gallery');
export const useWhatsAppSectionImages = () => useSectionImages('whatsapp_section');
export const useAboutSectionImages = () => useSectionImages('about_section'); 