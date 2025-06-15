
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateProduct, useUpdateProduct, Product } from '@/hooks/useProducts';
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
        size: product.size || '',
        category_id: product.category_id || '',
        status: (product.status as 'available' | 'rented' | 'maintenance') || 'available',
        images: product.images || [],
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
      images: [],
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
        const storageUrlPrefix = publicUrl; // This should be the bucket's root public url
        
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
              const newUrl = newUploadedUrls[newUrlIndex];
              if (newUrl) {
                  finalOrderedImageUrls.push(newUrl);
              }
              newUrlIndex++;
          }
      }

      const cleanData: Omit<Product, 'id' | 'created_at' | 'updated_at'> = {
        name: data.name,
        sku: data.sku || null,
        description: data.description || undefined,
        brand: data.brand || undefined,
        color: data.color || undefined,
        size: data.size || undefined,
        category_id: data.category_id || undefined,
        status: data.status,
        images: finalOrderedImageUrls,
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
