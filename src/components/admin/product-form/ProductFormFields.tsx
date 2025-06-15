import { useFormContext } from 'react-hook-form';
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
import { useCategories } from '@/hooks/useCategories';
import { ProductStatusBadge } from '../ProductStatusBadge';
import { ProductFormData } from './productSchema';

export const ProductFormFields = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ProductFormData>();
  const { data: categories } = useCategories();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome *</Label>
          <Input id="name" {...register('name')} placeholder="Nome do produto" />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="sku">Código (SKU)</Label>
          <Input id="sku" {...register('sku')} placeholder="Opcional. Ex: VST-AZL-01" />
          {errors.sku && <p className="text-sm text-red-500">{errors.sku.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="brand">Marca</Label>
          <Input id="brand" {...register('brand')} placeholder="Marca do produto" />
        </div>
        <div>
          <Label htmlFor="category_id">Categoria</Label>
          <Select value={watch('category_id') || ''} onValueChange={(value) => setValue('category_id', value)}>
            <SelectTrigger><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger>
            <SelectContent>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" {...register('description')} placeholder="Descrição do produto" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="color">Cor</Label>
          <Input id="color" {...register('color')} placeholder="Cor" />
        </div>
        <div>
          <Label htmlFor="size">Tamanho</Label>
          <Input id="size" {...register('size')} placeholder="Tamanho" />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={watch('status')} onValueChange={(value) => setValue('status', value as any)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
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
    </div>
  );
};
