import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { HeroImage } from '@/components/domains/hero-images/types';

export const useHeroImages = () => {
  return useQuery({
    queryKey: ['hero-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_images' as any)
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as HeroImage[];
    },
  });
}; 