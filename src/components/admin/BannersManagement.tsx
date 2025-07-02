import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageCrop } from './ImageCrop';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Pencil, Trash2, GripVertical, Plus, Image as ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Banner {
  id: string;
  image_url: string;
  title: string;
  subtitle: string;
  active: boolean;
  sort_order: number;
}

interface BannerFormData {
  title: string;
  subtitle: string;
  image_file?: File;
}

export const BannersManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  // Create banner
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

      // Create banner record
      const { error } = await supabase
        .from('banners')
        .insert([{
          image_url: publicUrl,
          title: formData.title,
          subtitle: formData.subtitle,
          sort_order: banners.length
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast({
        title: "Banner criado",
        description: "O banner foi adicionado com sucesso!"
      });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar banner: " + error.message,
        variant: "destructive"
      });
    }
  });

  // Update banner
  const updateBanner = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: BannerFormData }) => {
      let publicUrl = selectedBanner?.image_url;

      if (formData.image_file) {
        try {
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
          console.log("Nova imagem uploaded:", publicUrl);
        } catch (error) {
          console.error("Erro no upload da imagem:", error);
          throw error;
        }
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
      setIsDialogOpen(false);
      setSelectedBanner(null);
      setImageFile(null);
    },
    onError: (error) => {
      console.error("Erro ao atualizar banner:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar banner: " + error.message,
        variant: "destructive"
      });
    }
  });

  // Delete banner
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

  // Reorder banners
  const reorderBanners = useMutation({
    mutationFn: async (items: Banner[]) => {
      const updates = items.map((item, index) => ({
        id: item.id,
        sort_order: index
      }));

      const { error } = await supabase
        .from('banners')
        .upsert(updates);

      if (error) throw error;
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

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(banners);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    reorderBanners.mutate(items);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Imagem selecionada:", file.name);
      setImageFile(file);
      setIsCropOpen(true);
    }
  };

  const handleCropComplete = (croppedImage: Blob) => {
    console.log("Imagem cortada recebida");
    const file = new File([croppedImage], 'banner.png', { type: 'image/png' });
    setImageFile(file);
    setIsCropOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData: BannerFormData = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      subtitle: (form.elements.namedItem('subtitle') as HTMLInputElement).value,
      image_file: imageFile || undefined
    };

    if (selectedBanner) {
      console.log("Atualizando banner com dados:", formData);
      updateBanner.mutate({ id: selectedBanner.id, formData });
    } else {
      createBanner.mutate(formData);
    }
  };

  const handleEdit = (banner: Banner) => {
    console.log("Editando banner:", banner);
    setSelectedBanner(banner);
    setImageFile(null);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Banners</h2>
        <Button onClick={() => {
          setSelectedBanner(null);
          setImageFile(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Banner
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="banners">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {banners.map((banner, index) => (
                <Draggable key={banner.id} draggableId={banner.id} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-white"
                    >
                      <CardContent className="flex items-center p-4">
                        <div {...provided.dragHandleProps} className="mr-4">
                          <GripVertical className="text-gray-400" />
                        </div>
                        <img
                          src={banner.image_url}
                          alt={banner.title}
                          className="w-32 h-16 object-cover rounded mr-4"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{banner.title}</h3>
                          <p className="text-sm text-gray-500">{banner.subtitle}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(banner)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => deleteBanner.mutate(banner.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedBanner ? 'Editar Banner' : 'Novo Banner'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="image">Imagem (16:9)</Label>
              <div className="mt-2">
                {imageFile || selectedBanner?.image_url ? (
                  <div className="relative aspect-video mb-4">
                    <img
                      src={imageFile ? URL.createObjectURL(imageFile) : selectedBanner?.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="bg-white"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e) => handleImageSelect(e as React.ChangeEvent<HTMLInputElement>);
                          input.click();
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full aspect-video bg-muted rounded-lg">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageSelect}
                      />
                      <div className="flex flex-col items-center">
                        <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          Clique para selecionar
                        </span>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                defaultValue={selectedBanner?.title}
                required
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtítulo</Label>
              <Input
                id="subtitle"
                name="subtitle"
                defaultValue={selectedBanner?.subtitle}
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createBanner.isPending || updateBanner.isPending}
              >
                {createBanner.isPending || updateBanner.isPending
                  ? 'Salvando...'
                  : selectedBanner
                  ? 'Atualizar'
                  : 'Criar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {imageFile && (
        <ImageCrop
          isOpen={isCropOpen}
          onClose={() => setIsCropOpen(false)}
          onCropComplete={handleCropComplete}
          imageFile={imageFile}
          aspectRatio={21/9}
        />
      )}
    </div>
  );
}; 