
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCategory, useUpdateCategory, Category } from '@/hooks/useCategories';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Crop } from 'lucide-react';
import { ImageCrop } from './ImageCrop';

const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  sort_order: z.number().min(0, 'Ordem deve ser positiva').optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category | null;
  onClose: () => void;
}

export const CategoryForm = ({ category, onClose }: CategoryFormProps) => {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const { uploadImage, deleteImage, uploading } = useImageUpload();
  const [imagePreview, setImagePreview] = useState<string | null>(category?.image_url || null);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCrop, setShowCrop] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category ? {
      name: category.name,
      description: category.description || '',
      sort_order: category.sort_order || 0,
    } : {
      name: '',
      description: '',
      sort_order: 0,
    },
  });

  const handleFileSelect = (file: File) => {
    console.log('File selected for crop:', file.name);
    setSelectedFile(file);
    setShowCrop(true);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    console.log('Crop completed, uploading image...');
    
    const result = await uploadImage(croppedBlob, 'categories');
    if (result) {
      setImagePreview(result.url);
      setImagePath(result.path);
      setSelectedFile(null);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const clearImage = async () => {
    if (imagePath) {
      await deleteImage(imagePath);
    }
    setImagePreview(null);
    setImagePath(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const cleanData: Omit<Category, 'id' | 'created_at'> = {
        name: data.name,
        description: data.description || undefined,
        image_url: imagePreview || undefined,
        sort_order: data.sort_order || 0,
      };

      if (category) {
        await updateCategory.mutateAsync({ id: category.id, ...cleanData });
      } else {
        await createCategory.mutateAsync(cleanData);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {category ? 'Editar Categoria' : 'Nova Categoria'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Nome *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Nome da categoria"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Descrição da categoria"
          />
        </div>

        <div>
          <Label htmlFor="sort_order">Ordem de Exibição</Label>
          <Input
            id="sort_order"
            type="number"
            {...register('sort_order', { valueAsNumber: true })}
            placeholder="0"
            min="0"
          />
          {errors.sort_order && (
            <p className="text-sm text-red-500">{errors.sort_order.message}</p>
          )}
        </div>

        <div>
          <Label>Imagem Principal (3:4)</Label>
          
          {!imagePreview ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                  <Crop className="h-8 w-8 text-gray-500" />
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Clique para selecionar</span> ou arraste uma imagem aqui
                </div>
                <div className="text-xs text-gray-500">
                  PNG, JPG, WebP até 5MB • Será ajustada para proporção 3:4
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInputChange}
                disabled={uploading}
              />
            </div>
          ) : (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-40 object-cover rounded-lg border"
                style={{ aspectRatio: '3/4' }}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={clearImage}
                disabled={uploading}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {uploading && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
              <Upload className="h-4 w-4 animate-spin" />
              <span>Processando imagem...</span>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={createCategory.isPending || updateCategory.isPending || uploading}
          >
            {(createCategory.isPending || updateCategory.isPending || uploading)
              ? 'Salvando...'
              : category ? 'Atualizar' : 'Criar'
            }
          </Button>
        </div>
      </form>

      {/* Modal de Crop */}
      {selectedFile && (
        <ImageCrop
          isOpen={showCrop}
          onClose={() => {
            setShowCrop(false);
            setSelectedFile(null);
          }}
          onCropComplete={handleCropComplete}
          imageFile={selectedFile}
        />
      )}
    </div>
  );
};
