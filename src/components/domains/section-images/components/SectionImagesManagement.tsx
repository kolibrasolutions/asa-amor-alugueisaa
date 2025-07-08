import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Edit, Trash2, Eye, EyeOff, Plus, Image as ImageIcon } from 'lucide-react';
import { SectionImageCrop } from './SectionImageCrop';
import { 
  SectionImageFormData, 
  SectionImageUploadData, 
  SectionImageCropData, 
  SectionImage,
  SectionImageConfig,
  SECTION_CONFIGS 
} from '../types';

// Hook simulado para buscar imagens por seção
const useSectionImages = (sectionId: string) => {
  return {
    data: [] as SectionImage[],
    isLoading: false,
  };
};

// Hook simulado para mutações
const useSectionImageMutations = () => {
  const { toast } = useToast();
  
  return {
    uploadSectionImage: {
      mutate: (data: SectionImageUploadData) => {
        console.log('Upload section image:', data);
        toast({
          title: 'Sucesso!',
          description: 'Imagem adicionada com sucesso.',
        });
      },
      isPending: false,
    },
    updateSectionImage: {
      mutate: ({ id, data }: { id: string; data: SectionImageFormData }) => {
        console.log('Update section image:', id, data);
        toast({
          title: 'Sucesso!',
          description: 'Imagem atualizada com sucesso.',
        });
      },
      isPending: false,
    },
    deleteSectionImage: {
      mutate: (id: string) => {
        console.log('Delete section image:', id);
        toast({
          title: 'Sucesso!',
          description: 'Imagem removida com sucesso.',
        });
      },
      isPending: false,
    },
  };
};

interface SectionImagesManagementProps {
  sectionId: string;
}

export const SectionImagesManagement: React.FC<SectionImagesManagementProps> = ({ sectionId }) => {
  const sectionConfig = SECTION_CONFIGS[sectionId];
  const { data: sectionImages = [], isLoading } = useSectionImages(sectionId);
  const { uploadSectionImage, updateSectionImage, deleteSectionImage } = useSectionImageMutations();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingImage, setEditingImage] = useState<SectionImage | null>(null);
  const [formData, setFormData] = useState<SectionImageFormData>({
    title: '',
    description: '',
    sort_order: 0,
    is_active: true,
  });

  if (!sectionConfig) {
    return <div>Configuração de seção não encontrada</div>;
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsCropDialogOpen(true);
    }
  };

  const handleCropComplete = (cropData: SectionImageCropData, croppedFile: File) => {
    const uploadData: SectionImageUploadData = {
      file: croppedFile,
      sectionId,
      cropData,
      formData,
    };
    
    uploadSectionImage.mutate(uploadData);
    setIsAddDialogOpen(false);
    setSelectedFile(null);
    setFormData({
      title: '',
      description: '',
      sort_order: 0,
      is_active: true,
    });
  };

  const handleEdit = (image: SectionImage) => {
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
      updateSectionImage.mutate({
        id: editingImage.id,
        data: formData,
      });
      setIsEditDialogOpen(false);
      setEditingImage(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta imagem?')) {
      deleteSectionImage.mutate(id);
    }
  };

  const getImageUrl = (imagePath: string) => {
    // Por enquanto retornando placeholder
    return '/noivos.jpg';
  };

  const canAddMore = sectionImages.length < sectionConfig.maxImages;

  if (isLoading) {
    return <div>Carregando imagens...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            {sectionConfig.name}
          </h3>
          <p className="text-sm text-gray-600">
            {sectionConfig.description}
          </p>
          <div className="text-xs text-gray-500 mt-1">
            Máximo: {sectionConfig.maxImages} imagens • 
            Proporção: {sectionConfig.cropSettings.aspectRatio === 1 ? '1:1' : 
                       sectionConfig.cropSettings.aspectRatio === 16/9 ? '16:9' : 
                       sectionConfig.cropSettings.aspectRatio === 4/3 ? '4:3' : 
                       `${sectionConfig.cropSettings.aspectRatio.toFixed(2)}:1`}
          </div>
        </div>
        
        {canAddMore && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Adicionar Imagem
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Imagem - {sectionConfig.name}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="section-image-file">Selecionar Imagem</Label>
                  <Input
                    id="section-image-file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recomendado: {sectionConfig.cropSettings.minWidth}x{sectionConfig.cropSettings.minHeight}px ou maior
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="section-title">Título (opcional)</Label>
                  <Input
                    id="section-title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Título da imagem"
                  />
                </div>
                
                <div>
                  <Label htmlFor="section-description">Descrição (opcional)</Label>
                  <Input
                    id="section-description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição da imagem"
                  />
                </div>
                
                <div>
                  <Label htmlFor="section-order">Ordem de Exibição</Label>
                  <Input
                    id="section-order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="section-active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="section-active">Ativo</Label>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sectionImages.map((image) => (
          <Card key={image.id}>
            <CardHeader className="pb-2">
              <div 
                className="relative overflow-hidden rounded-md"
                style={{ 
                  aspectRatio: sectionConfig.aspectRatio,
                  minHeight: '150px'
                }}
              >
                <img
                  src={getImageUrl(image.image_url)}
                  alt={image.title || 'Section image'}
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

      {sectionImages.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>Nenhuma imagem cadastrada para esta seção</p>
          <p className="text-sm">Clique em "Adicionar Imagem" para começar</p>
        </div>
      )}

      {!canAddMore && (
        <div className="text-center py-4 text-amber-600 bg-amber-50 rounded-lg">
          <p className="text-sm">
            Limite máximo de {sectionConfig.maxImages} imagens atingido para esta seção
          </p>
        </div>
      )}

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Imagem - {sectionConfig.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-section-title">Título (opcional)</Label>
              <Input
                id="edit-section-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Título da imagem"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-section-description">Descrição (opcional)</Label>
              <Input
                id="edit-section-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição da imagem"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-section-order">Ordem de Exibição</Label>
              <Input
                id="edit-section-order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-section-active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="edit-section-active">Ativo</Label>
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
      <SectionImageCrop
        isOpen={isCropDialogOpen}
        onClose={() => setIsCropDialogOpen(false)}
        onCropComplete={handleCropComplete}
        imageFile={selectedFile}
        sectionConfig={sectionConfig}
      />
    </div>
  );
}; 