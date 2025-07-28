
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateProduct, useCreateProductWithVariants, useUpdateProduct, Product, ProductVariant } from '@/hooks/useProducts';
import { productSchema, ProductFormData } from './product-form/productSchema';
import { ProductFormHeader } from './product-form/ProductFormHeader';
import { ProductFormFields } from './product-form/ProductFormFields';
import { ProductFormActions } from './product-form/ProductFormActions';
import { useImageUpload } from '@/hooks/useImageUpload';
import { supabase } from '@/integrations/supabase/client';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

export const ProductForm = ({ product, onClose }: ProductFormProps) => {
  const createProduct = useCreateProduct();
  const createProductWithVariants = useCreateProductWithVariants();
  const updateProduct = useUpdateProduct();
  const { uploadImage, deleteImage } = useImageUpload();

  const getDefaultValues = (): ProductFormData => {
    if (product) {
      return {
        name: product.name,
        sku: product.sku || '',
        description: product.description || '',
        brand: product.brand || '',
        color: product.color || '',
        category_id: product.category_id || '',
        status: (product.status as 'available' | 'rented' | 'maintenance') || 'available',
        images: product.images || [],
        has_size_variants: true
      };
    }
    return {
      name: '',
      sku: '',
      description: '',
      brand: '',
      color: '',
      category_id: '',
      status: 'available',
      images: [],
      has_size_variants: true,
      size_variants: []
    };
  };

  const methods = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: getDefaultValues(),
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      const imageList = data.images || [];

      const existingImageUrls = imageList.filter((img): img is string => typeof img === 'string');
      const newImageFiles = imageList.filter((img): img is Blob => img instanceof Blob);

      const originalImageUrls = product?.images || [];
      const deletedImageUrls = originalImageUrls.filter(url => !existingImageUrls.includes(url));
      
      if (deletedImageUrls.length > 0) {
        const { data: { publicUrl } } = supabase.storage.from('category-images').getPublicUrl('');
        const storageUrlPrefix = publicUrl;
        
        const deletedImagePaths = deletedImageUrls.map(url => url.replace(storageUrlPrefix + '/', ''));
        const deletePromises = deletedImagePaths.map(path => deleteImage(path));
        await Promise.all(deletePromises);
      }

      const uploadPromises = newImageFiles.map(file => uploadImage(file, 'products'));
      const uploadResults = await Promise.all(uploadPromises);
      const newUploadedUrls = uploadResults.filter(Boolean).map(result => result!.url);

      const finalOrderedImageUrls: string[] = [];
      let newUrlIndex = 0;
      for (const item of imageList) {
          if (typeof item === 'string') {
              finalOrderedImageUrls.push(item);
          } else {
              if (newUrlIndex < newUploadedUrls.length) {
                  finalOrderedImageUrls.push(newUploadedUrls[newUrlIndex]);
                  newUrlIndex++;
              }
          }
      }

      // Remover campos que não devem ser salvos no banco
      const { size_variants, ...cleanFormData } = data;
      
      const cleanData = {
        ...cleanFormData,
        images: finalOrderedImageUrls,
        // Sempre usar variações, não enviar campo size individual
        size: undefined,
        // Garantir que campos obrigatórios estão presentes
        name: data.name || '',
        status: data.status || 'available'
      } as Omit<Product, 'id' | 'created_at' | 'updated_at'>;

      if (product) {
        // Para produtos existentes, ainda usar a lógica antiga por compatibilidade
        await updateProduct.mutateAsync({ id: product.id, ...cleanData });
      } else {
        // Para produtos novos, sempre criar com variações
        if (data.size_variants && data.size_variants.length > 0) {
          const variants = data.size_variants.map(variant => ({
            size: variant.size,
            quantity: variant.quantity || 1
          }));
          
          await createProductWithVariants.mutateAsync({
            baseProduct: cleanData,
            variants
          });
        } else {
          // Se não há variações, mostrar erro
          throw new Error('Adicione pelo menos um tamanho para o produto');
        }
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
            isSubmitting={createProductWithVariants.isPending || updateProduct.isPending}
            isEditing={!!product}
          />
        </form>
      </FormProvider>
    </div>
  );
};
