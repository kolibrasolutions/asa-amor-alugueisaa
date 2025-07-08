import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Edit, Trash2, Eye, EyeOff, Plus } from 'lucide-react';
import { HeroImageCrop } from './HeroImageCrop';
import { useHeroImages } from '@/hooks/useHeroImages';
import { HeroImageFormData, HeroImageUploadData, HeroImageCropData, HeroImage } from '../types';

// Simulando as mutações por enquanto
const useHeroImageMutations = () => {
  const { toast } = useToast();
  
  return {
    uploadHeroImage: {
      mutate: (data: HeroImageUploadData) => {
        console.log('Upload hero image:', data);
        toast({
          title: 'Sucesso!',
          description: 'Imagem do hero adicionada com sucesso.',
        });
      },
      isPending: false,
    },
    updateHeroImage: {
      mutate: ({ id, data }: { id: string; data: HeroImageFormData }) => {
        console.log('Update hero image:', id, data);
        toast({
          title: 'Sucesso!',
          description: 'Imagem do hero atualizada com sucesso.',
        });
      },
      isPending: false,
    },
    deleteHeroImage: {
      mutate: (id: string) => {
        console.log('Delete hero image:', id);
        toast({
          title: 'Sucesso!',
          description: 'Imagem do hero removida com sucesso.',
        });
      },
      isPending: false,
    },
  };
};

export const HeroImagesManagement: React.FC = () => {
  const { data: heroImages = [], isLoading } = useHeroImages();
  const { uploadHeroImage, updateHeroImage, deleteHeroImage } = useHeroImageMutations();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingImage, setEditingImage] = useState<HeroImage | null>(null);
  const [formData, setFormData] = useState<HeroImageFormData>({
    title: '',
    description: '',
    sort_order: 0,
    is_active: true,
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsCropDialogOpen(true);
    }
  };

  const handleCropComplete = (cropData: HeroImageCropData, croppedFile: File) => {
    const uploadData: HeroImageUploadData = {
      file: croppedFile,
      cropData,
      formData,
    };
    
    uploadHeroImage.mutate(uploadData);
    setIsAddDialogOpen(false);
    setSelectedFile(null);
    setFormData({
      title: '',
      description: '',
      sort_order: 0,
      is_active: true,
    });
  };

  const handleEdit = (image: HeroImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title || '',
      description: image.description || '',
      sort_order: image.sort_order,
      is_active: image.is_active,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (editingImage) {
      updateHeroImage.mutate({
        id: editingImage.id,
        data: formData,
      });
      setIsEditDialogOpen(false);
      setEditingImage(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta imagem?')) {
      deleteHeroImage.mutate(id);
    }
  };

  const getImageUrl = (imagePath: string) => {
    // Por enquanto retornando placeholder
    return '/noivos.jpg';
  };

  if (isLoading) {
    return <div>Carregando imagens do hero...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Imagens do Hero</h3>
          <p className="text-sm text-gray-600">
            Gerencie as imagens que aparecem na seção principal do site
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Imagem
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Imagem do Hero</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="hero-image-file">Selecionar Imagem</Label>
                <Input
                  id="hero-image-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>
              
              <div>
                <Label htmlFor="hero-title">Título (opcional)</Label>
                <Input
                  id="hero-title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título da imagem"
                />
              </div>
              
              <div>
                <Label htmlFor="hero-description">Descrição (opcional)</Label>
                <Input
                  id="hero-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição da imagem"
                />
              </div>
              
              <div>
                <Label htmlFor="hero-order">Ordem de Exibição</Label>
                <Input
                  id="hero-order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="hero-active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="hero-active">Ativo</Label>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {heroImages.map((image) => (
          <Card key={image.id}>
            <CardHeader className="pb-2">
              <div className="aspect-video relative overflow-hidden rounded-md">
                <img
                  src={getImageUrl(image.image_url)}
                  alt={image.title || 'Hero image'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {image.is_active ? (
                    <Eye className="w-4 h-4 text-green-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <h4 className="font-medium">{image.title || 'Sem título'}</h4>
                  <p className="text-sm text-gray-600">
                    {image.description || 'Sem descrição'}
                  </p>
                  <p className="text-xs text-gray-500">Ordem: {image.sort_order}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(image)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(image.id)}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {heroImages.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>Nenhuma imagem do hero cadastrada</p>
          <p className="text-sm">Clique em "Adicionar Imagem" para começar</p>
        </div>
      )}

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Imagem do Hero</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-hero-title">Título (opcional)</Label>
              <Input
                id="edit-hero-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Título da imagem"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-hero-description">Descrição (opcional)</Label>
              <Input
                id="edit-hero-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição da imagem"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-hero-order">Ordem de Exibição</Label>
              <Input
                id="edit-hero-order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-hero-active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="edit-hero-active">Ativo</Label>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdate}>
                Salvar Alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Crop */}
      <HeroImageCrop
        isOpen={isCropDialogOpen}
        onClose={() => setIsCropDialogOpen(false)}
        onCropComplete={handleCropComplete}
        imageFile={selectedFile}
      />
    </div>
  );
}; 