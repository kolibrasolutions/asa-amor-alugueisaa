
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCategory, useUpdateCategory, Category } from '@/hooks/useCategories';
import { useState } from 'react';
import { Upload, X } from 'lucide-react';

const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  image_url: z.string().url('URL de imagem inválida').optional().or(z.literal('')),
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
  const [imagePreview, setImagePreview] = useState<string | null>(category?.image_url || null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category ? {
      name: category.name,
      description: category.description || '',
      image_url: category.image_url || '',
      sort_order: category.sort_order || 0,
    } : {
      name: '',
      description: '',
      image_url: '',
      sort_order: 0,
    },
  });

  const imageUrl = watch('image_url');

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const cleanData: Omit<Category, 'id' | 'created_at'> = {
        name: data.name,
        description: data.description || undefined,
        image_url: data.image_url || undefined,
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

  const handleImageUrlChange = (url: string) => {
    setValue('image_url', url);
    setImagePreview(url);
  };

  const clearImage = () => {
    setValue('image_url', '');
    setImagePreview(null);
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
          <Label htmlFor="image_url">URL da Imagem Principal</Label>
          <div className="space-y-2">
            <Input
              id="image_url"
              {...register('image_url')}
              placeholder="https://exemplo.com/imagem.jpg"
              onChange={(e) => handleImageUrlChange(e.target.value)}
            />
            {errors.image_url && (
              <p className="text-sm text-red-500">{errors.image_url.message}</p>
            )}
          </div>
          
          {imagePreview && (
            <div className="mt-2 relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={clearImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={createCategory.isPending || updateCategory.isPending}
          >
            {(createCategory.isPending || updateCategory.isPending)
              ? 'Salvando...'
              : category ? 'Atualizar' : 'Criar'
            }
          </Button>
        </div>
      </form>
    </div>
  );
};
