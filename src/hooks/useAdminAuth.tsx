
import { useAuth } from './useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  role: string;
  full_name?: string;
}

export const useAdminAuth = () => {
  const { user, loading: authLoading } = useAuth();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data as Profile;
    },
    enabled: !!user?.id,
  });

  const isAdmin = profile?.role === 'admin';
  const loading = authLoading || profileLoading;

  return {
    user,
    profile,
    isAdmin,
    loading,
  };
};
