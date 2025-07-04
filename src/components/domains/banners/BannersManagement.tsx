import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/shared/layout/PageHeader';
import { BannerList } from './components/BannerList';
import { BannerForm } from './components/BannerForm';
import { useBannerMutations } from './hooks/useBannerMutations';
import { Banner, BannerFormData } from './types';

export const BannersManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);

  const { createBanner, updateBanner, deleteBanner, reorderBanners } = useBannerMutations();

  // Fetch banners
  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('sort_order');
      
      if (error) throw error;
      return data as Banner[];
    }
  });

  const handleCreateNew = () => {
    setSelectedBanner(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = (formData: BannerFormData) => {
    if (selectedBanner) {
      updateBanner.mutate({ 
        id: selectedBanner.id, 
        formData,
        currentImageUrl: selectedBanner.image_url
      }, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setSelectedBanner(null);
        }
      });
    } else {
      createBanner.mutate(formData, {
        onSuccess: () => {
          setIsDialogOpen(false);
        }
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteBanner.mutate(id);
  };

  const handleReorder = (reorderedBanners: Banner[]) => {
    reorderBanners.mutate(reorderedBanners);
  };

  const isFormLoading = createBanner.isPending || updateBanner.isPending;

  if (isLoading) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Gerenciar Banners"
        subtitle="Gerencie os banners da página inicial"
        action={{
          label: "Novo Banner",
          onClick: handleCreateNew,
          icon: <Plus className="w-4 h-4" />
        }}
      />

      <BannerList
        banners={banners}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReorder={handleReorder}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedBanner ? 'Editar Banner' : 'Novo Banner'}
            </DialogTitle>
          </DialogHeader>
          <BannerForm
            banner={selectedBanner}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
            isLoading={isFormLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}; 