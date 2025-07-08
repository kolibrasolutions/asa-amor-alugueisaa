import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SectionImage } from '@/components/domains/section-images/types';

export const useSectionImages = (sectionId: string) => {
  return useQuery({
    queryKey: ['section-images', sectionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('section_images' as any)
        .select('*')
        .eq('section_id', sectionId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as SectionImage[];
    },
  });
};

// Hook para buscar imagens específicas de uma seção
export const useHeroSectionImages = () => useSectionImages('hero');
export const useClientGalleryImages = () => useSectionImages('client_gallery');
export const useWhatsAppSectionImages = () => useSectionImages('whatsapp_section');
export const useAboutSectionImages = () => useSectionImages('about_section');
export const useCategoriesSectionImages = () => useSectionImages('categories_section'); 