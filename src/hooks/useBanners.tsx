import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Banner {
  id: string;
  image_url: string;
  title: string;
  subtitle: string;
  active: boolean;
  sort_order: number;
}

export const useBanners = () => {
  return useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data as Banner[];
    }
  });
}; 