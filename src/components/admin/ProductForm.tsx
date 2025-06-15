import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateProduct, useUpdateProduct, Product } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { ProductStatusBadge } from './ProductStatusBadge';

const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  sku: z.string().optional(),
  description: z.string().optional(),
  brand: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  rental_price: z.number().min(0).optional(),
  purchase_price: z.number().min(0).optional(),
  category_id: z.string().optional(),
  status: z.enum(['available', 'rented', 'maintenance']).default('available'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

export const ProductForm = ({ product, onClose }: ProductFormProps) => {
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  // Create proper default values that match the form schema
  const getDefaultValues = (): ProductFormData => {
    if (product) {
      return {
        name: product.name,
        sku: product.sku || '',
        description: product.description || '',
        brand: product.brand || '',
        color: product.color || '',
        size: product.size || '',
        rental_price: product.rental_price || undefined,
        purchase_price: product.purchase_price || undefined,
        category_id: product.category_id || '',
        status: (product.status as 'available' | 'rented' | 'maintenance') || 'available',
      };
    }
    return {
      name: '',
      sku: '',
      description: '',
      brand: '',
      color: '',
      size: '',
      rental_price: undefined,
      purchase_price: undefined,
      category_id: '',
      status: 'available',
    };
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: getDefaultValues(),
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      // Ensure name is present and convert empty strings to undefined for optional fields
      const cleanData: Omit<Product, 'id' | 'created_at' | 'updated_at'> = {
        name: data.name,
        sku: data.sku || null,
        description: data.description || undefined,
        brand: data.brand || undefined,
        color: data.color || undefined,
        size: data.size || undefined,
        rental_price: data.rental_price || undefined,
        purchase_price: data.purchase_price || undefined,
        category_id: data.category_id || undefined,
        status: data.status,
      };

      if (product) {
        await updateProduct.mutateAsync({ id: product.id, ...cleanData });
      } else {
        await createProduct.mutateAsync(cleanData);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {product ? 'Editar Produto' : 'Novo Produto'}
        </h2>
        {product && (
          <ProductStatusBadge status={product.status as 'available' | 'rented' | 'maintenance'} />
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Nome do produto"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="sku">Código (SKU)</Label>
            <Input
              id="sku"
              {...register('sku')}
              placeholder="Opcional. Ex: VST-AZL-01"
            />
             {errors.sku && (
              <p className="text-sm text-red-500">{errors.sku.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
            <Label htmlFor="brand">Marca</Label>
            <Input
              id="brand"
              {...register('brand')}
              placeholder="Marca do produto"
            />
          </div>
          <div>
            <Label htmlFor="category_id">Categoria</Label>
            <Select
              value={watch('category_id')}
              onValueChange={(value) => setValue('category_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Descrição do produto"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="color">Cor</Label>
            <Input
              id="color"
              {...register('color')}
              placeholder="Cor"
            />
          </div>

          <div>
            <Label htmlFor="size">Tamanho</Label>
            <Input
              id="size"
              {...register('size')}
              placeholder="Tamanho"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={watch('status')}
              onValueChange={(value) => setValue('status', value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">
                  <div className="flex items-center space-x-2">
                    <ProductStatusBadge status="available" />
                    <span>Disponível</span>
                  </div>
                </SelectItem>
                <SelectItem value="rented">
                  <div className="flex items-center space-x-2">
                    <ProductStatusBadge status="rented" />
                    <span>Alugado</span>
                  </div>
                </SelectItem>
                <SelectItem value="maintenance">
                  <div className="flex items-center space-x-2">
                    <ProductStatusBadge status="maintenance" />
                    <span>Manutenção</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="rental_price">Preço de Aluguel</Label>
            <Input
              id="rental_price"
              type="number"
              step="0.01"
              {...register('rental_price', { valueAsNumber: true })}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="purchase_price">Preço de Compra</Label>
            <Input
              id="purchase_price"
              type="number"
              step="0.01"
              {...register('purchase_price', { valueAsNumber: true })}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={createProduct.isPending || updateProduct.isPending}
          >
            {createProduct.isPending || updateProduct.isPending
              ? 'Salvando...'
              : product ? 'Atualizar' : 'Criar'
            }
          </Button>
        </div>
      </form>
    </div>
  );
};
