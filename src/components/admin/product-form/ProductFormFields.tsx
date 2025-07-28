import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useCategories } from '@/hooks/useCategories';
import { useColors } from '@/hooks/useColors';
import { useSizes } from '@/hooks/useSizes';
import { ProductImageUpload } from './ProductImageUpload';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

export const ProductFormFields = () => {
  const { control, setValue } = useFormContext();
  const { data: categories } = useCategories();
  const { data: colors } = useColors();
  const { data: sizes } = useSizes();
  const [newVariantSize, setNewVariantSize] = useState('');
  const [newVariantQuantity, setNewVariantQuantity] = useState(1);
  
  // Gerenciar array de variações
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'size_variants'
  });
  
  // Função para adicionar nova variação
  const addVariant = () => {
    if (newVariantSize && !fields.some((field: any) => field.size === newVariantSize)) {
      append({ size: newVariantSize, quantity: newVariantQuantity });
      setNewVariantSize('');
      setNewVariantQuantity(1);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Produto</FormLabel>
            <FormControl>
              <Input placeholder="Nome do produto" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="sku"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SKU (Código)</FormLabel>
            <FormControl>
              <Input placeholder="Ex: VN001" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="brand"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Marca</FormLabel>
            <FormControl>
              <Input placeholder="Marca do produto" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cor</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a cor">
                    {field.value && colors?.find(c => c.value === field.value) && (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: colors?.find(c => c.value === field.value)?.hex_code }}
                        />
                        {colors?.find(c => c.value === field.value)?.name || field.value}
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {colors?.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: color.hex_code }}
                        />
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="category_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categoria</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponível</SelectItem>
                  <SelectItem value="rented">Alugado</SelectItem>
                  <SelectItem value="maintenance">Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Informação sobre variações de tamanho */}
      <div className="md:col-span-2">
        <div className="rounded-md border p-4 bg-blue-50">
          <h3 className="font-medium text-blue-900 mb-2">
            🎯 Variações de Tamanho
          </h3>
          <p className="text-sm text-blue-700">
            Adicione os tamanhos disponíveis para este produto. Cada tamanho será tratado como um item separado no estoque.
          </p>
        </div>
      </div>

      {/* Campos de variações de tamanho */}
      <div className="md:col-span-2 space-y-4">
        <div className="border rounded-lg p-4 bg-blue-50">
          <h3 className="font-medium mb-4">Variações de Tamanho</h3>
          
          {/* Lista de variações adicionadas */}
          {fields.length > 0 && (
            <div className="space-y-2 mb-4">
              {fields.map((field: any, index: number) => (
                <div key={field.id} className="flex items-center gap-2 bg-white p-3 rounded border">
                  <Badge variant="secondary">Tamanho {field.size}</Badge>
                  <span className="text-sm text-gray-600">
                    Qtd: {field.quantity || 1}
                  </span>
                  <div className="flex items-center gap-1 ml-auto">
                    <Input
                      type="number"
                      value={field.quantity || 1}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value) || 1;
                        const updatedFields = [...fields];
                        updatedFields[index] = { ...field, quantity: newQuantity };
                        setValue('size_variants', updatedFields);
                      }}
                      className="w-16 h-8 text-center text-xs"
                      min="1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Adicionar nova variação */}
          <div className="flex gap-2">
            <Select value={newVariantSize} onValueChange={setNewVariantSize}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecione um tamanho" />
              </SelectTrigger>
              <SelectContent>
                {sizes?.map((size) => (
                  <SelectItem 
                    key={size.id} 
                    value={size.name}
                    disabled={fields.some((field: any) => field.size === size.name)}
                  >
                    {size.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1">
              <label className="text-sm text-gray-600 whitespace-nowrap">Qtd:</label>
              <Input
                type="number"
                value={newVariantQuantity}
                onChange={(e) => setNewVariantQuantity(parseInt(e.target.value) || 1)}
                className="w-16 h-10 text-center"
                min="1"
                placeholder="1"
              />
            </div>
            <Button
              type="button"
              onClick={addVariant}
              disabled={!newVariantSize}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>
          
          {fields.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Adicione pelo menos um tamanho para criar as variações do produto.
            </p>
          )}
        </div>
      </div>

      <div className="md:col-span-2">
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrição do produto"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="md:col-span-2">
        <FormField
          control={control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagens</FormLabel>
              <FormControl>
                <ProductImageUpload
                  images={field.value}
                  onImagesChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
