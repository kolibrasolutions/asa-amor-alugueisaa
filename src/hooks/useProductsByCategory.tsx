
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from './useProducts';

export const useProductsByCategory = (categoryId?: string) => {
  return useQuery({
    queryKey: ['products-by-category', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Product[];
    },
    enabled: true,
  });
};

export const useCategoryStats = () => {
  return useQuery({
    queryKey: ['category-stats'],
    queryFn: async () => {
      const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (!categories) return [];

      const statsPromises = categories.map(async (category) => {
        const { count } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id);

        return {
          ...category,
          productCount: count || 0,
        };
      });

      return Promise.all(statsPromises);
    },
  });
};
