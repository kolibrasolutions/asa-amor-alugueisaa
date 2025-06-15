
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

const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product || {},
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (product) {
        await updateProduct.mutateAsync({ id: product.id, ...data });
      } else {
        await createProduct.mutateAsync(data);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {product ? 'Editar Produto' : 'Novo Produto'}
      </h2>

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
            <Label htmlFor="brand">Marca</Label>
            <Input
              id="brand"
              {...register('brand')}
              placeholder="Marca do produto"
            />
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
                <SelectItem value="available">Disponível</SelectItem>
                <SelectItem value="rented">Alugado</SelectItem>
                <SelectItem value="maintenance">Manutenção</SelectItem>
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
