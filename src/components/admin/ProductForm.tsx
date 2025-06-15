import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateProduct, useUpdateProduct, Product } from '@/hooks/useProducts';
import { productSchema, ProductFormData } from './product-form/productSchema';
import { ProductFormHeader } from './product-form/ProductFormHeader';
import { ProductFormFields } from './product-form/ProductFormFields';
import { ProductFormActions } from './product-form/ProductFormActions';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

export const ProductForm = ({ product, onClose }: ProductFormProps) => {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const getDefaultValues = (): ProductFormData => {
    if (product) {
      return {
        name: product.name,
        sku: product.sku || '',
        description: product.description || '',
        brand: product.brand || '',
        color: product.color || '',
        size: product.size || '',
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
      category_id: '',
      status: 'available',
    };
  };

  const methods = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: getDefaultValues(),
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      const cleanData: Omit<Product, 'id' | 'created_at' | 'updated_at'> = {
        name: data.name,
        sku: data.sku || null,
        description: data.description || undefined,
        brand: data.brand || undefined,
        color: data.color || undefined,
        size: data.size || undefined,
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
      <ProductFormHeader product={product} />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <ProductFormFields />
          <ProductFormActions 
            onClose={onClose}
            isSubmitting={createProduct.isPending || updateProduct.isPending}
            isEditing={!!product}
          />
        </form>
      </FormProvider>
    </div>
  );
};
