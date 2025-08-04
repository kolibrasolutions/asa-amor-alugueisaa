import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Product {
  id: string;
  name: string;
  description?: string;
  brand?: string;
  color?: string;
  size?: string;
  status?: 'available' | 'rented' | 'maintenance';
  category_id?: string;
  images?: string[];
  quantity?: number; // Quantidade em estoque
  created_at?: string;
  updated_at?: string;
  sku?: string | null;
  // Campos para variações
  parent_product_id?: string | null;
  is_variant?: boolean;
  variant_type?: string;
  base_sku?: string | null;
  has_size_variants?: boolean;
  // Campos computados
  variants?: Product[];
}

export interface ProductVariant {
  size: string;
  quantity?: number;
}

export interface ProductWithVariants extends Product {
  variants: Product[];
}

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Product[];
    },
  });
};

// Hook para produtos no catálogo (apenas variações + produtos sem variações)
export const useCatalogProducts = () => {
  return useQuery({
    queryKey: ['catalog-products'],
    queryFn: async () => {
      // Buscar todos os produtos
      const { data: allProducts, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Filtrar para mostrar:
      // 1. Todas as variações (is_variant = true)
      // 2. Produtos base que NÃO têm variações
      const productsWithVariants = allProducts.filter(p => p.is_variant === false);
      const baseProductsWithChildren = new Set(
        allProducts
          .filter(p => p.is_variant === true && p.parent_product_id)
          .map(p => p.parent_product_id)
      );
      
      const catalogProducts = allProducts.filter(product => {
        // Mostrar todas as variações
        if (product.is_variant === true) return true;
        
        // Mostrar produtos base apenas se não tiverem variações
        if (product.is_variant === false && !baseProductsWithChildren.has(product.id)) return true;
        
        return false;
      });
      
      return catalogProducts as Product[];
    },
  });
};

// Hook para buscar apenas produtos base (não variações)
export const useBaseProducts = () => {
  return useQuery({
    queryKey: ['base-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_variant', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Product[];
    },
  });
};

// Hook para buscar produtos base com suas variações para gestão de estoque
export const useProductsWithVariantsForInventory = () => {
  return useQuery({
    queryKey: ['products-inventory-hierarchy'],
    queryFn: async () => {
      // Buscar produtos base
      const { data: baseProducts, error: baseError } = await supabase
        .from('products')
        .select('*')
        .eq('is_variant', false)
        .order('name');
      
      if (baseError) throw baseError;

      // Para cada produto base, buscar suas variações
      const productsWithVariants = await Promise.all(
        baseProducts.map(async (baseProduct) => {
          const { data: variants, error: variantsError } = await supabase
            .from('products')
            .select('*')
            .eq('parent_product_id', baseProduct.id)
            .order('size');
          
          if (variantsError) throw variantsError;

          return {
            ...baseProduct,
            variants: variants || []
          };
        })
      );

      return productsWithVariants as (Product & { variants: Product[] })[];
    },
  });
};

// Hook para buscar produto com suas variações
export const useProductWithVariants = (productId: string) => {
  return useQuery({
    queryKey: ['product-with-variants', productId],
    queryFn: async () => {
      // Buscar produto principal
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      
      if (productError) throw productError;
      
      // Buscar variações
      const { data: variants, error: variantsError } = await supabase
        .from('products')
        .select('*')
        .eq('parent_product_id', productId)
        .order('size');
      
      if (variantsError) throw variantsError;
      
      return {
        ...product,
        variants: variants || []
      } as ProductWithVariants;
    },
    enabled: !!productId,
  });
};

// Hook para buscar variações de um produto
export const useProductVariants = (parentProductId: string) => {
  return useQuery({
    queryKey: ['product-variants', parentProductId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('parent_product_id', parentProductId)
        .order('size');
      
      if (error) throw error;
      return data as Product[];
    },
    enabled: !!parentProductId,
    staleTime: 0 // Sempre buscar dados frescos para variações
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
              onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['products'] });
       queryClient.invalidateQueries({ queryKey: ['base-products'] });
       queryClient.invalidateQueries({ queryKey: ['product-variants'] });
       queryClient.invalidateQueries({ queryKey: ['product-with-variants'] });
       // Força reload completo dos caches
       queryClient.refetchQueries({ queryKey: ['product-variants'] });
       toast({
         title: "Produto criado",
         description: "Produto adicionado com sucesso!",
       });
     },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message.includes('duplicate key value violates unique constraint')
          ? 'Este código (SKU) já está em uso. Por favor, utilize outro.'
          : "Erro ao criar produto: " + error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook para criar produto com variações de tamanho
export const useCreateProductWithVariants = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      baseProduct, 
      variants 
    }: { 
      baseProduct: Omit<Product, 'id' | 'created_at' | 'updated_at'>, 
      variants: ProductVariant[] 
    }) => {
      // Criar produto base (remover campos específicos de formulário)
      const { size_variants, ...cleanBaseProduct } = baseProduct;
      const { data: createdProduct, error: productError } = await supabase
        .from('products')
        .insert([{
          ...cleanBaseProduct,
          is_variant: false,
          base_sku: baseProduct.sku
        }])
        .select()
        .single();
      
      if (productError) throw productError;
      
      // Criar variações se fornecidas
      if (variants && variants.length > 0) {
        const variantProducts = variants.map(variant => ({
          ...cleanBaseProduct,
          size: variant.size,
          parent_product_id: createdProduct.id,
          is_variant: true,
          variant_type: 'size',
          base_sku: baseProduct.sku,
          sku: null, // O trigger irá gerar automaticamente
          has_size_variants: false, // Variações individuais não têm sub-variações
        }));
        
        const { error: variantsError } = await supabase
          .from('products')
          .insert(variantProducts);
        
        if (variantsError) throw variantsError;
      }
      
      return createdProduct;
    },
                             onSuccess: (createdProduct) => {
       queryClient.invalidateQueries({ queryKey: ['products'] });
       queryClient.invalidateQueries({ queryKey: ['base-products'] });
       queryClient.invalidateQueries({ queryKey: ['catalog-products'] });
       queryClient.invalidateQueries({ queryKey: ['product-variants'] });
       queryClient.invalidateQueries({ queryKey: ['product-with-variants'] });
       // Invalidar especificamente as variações do produto criado
       queryClient.invalidateQueries({ queryKey: ['product-variants', createdProduct.id] });
       // Força reload completo dos caches
       queryClient.refetchQueries({ queryKey: ['product-variants'] });
       toast({
         title: "Produto criado",
         description: "Produto e suas variações foram adicionados com sucesso!",
       });
     },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message.includes('duplicate key value violates unique constraint')
          ? 'Este código (SKU) já está em uso. Por favor, utilize outro.'
          : "Erro ao criar produto: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...product }: Partial<Product> & { id: string }) => {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['base-products'] });
      queryClient.invalidateQueries({ queryKey: ['product-with-variants'] });
      queryClient.invalidateQueries({ queryKey: ['product-variants'] });
      toast({
        title: "Produto atualizado",
        description: "Produto atualizado com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message.includes('duplicate key value violates unique constraint')
          ? 'Este código (SKU) já está em uso. Por favor, utilize outro.'
          : "Erro ao atualizar produto: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['base-products'] });
      queryClient.invalidateQueries({ queryKey: ['product-with-variants'] });
      queryClient.invalidateQueries({ queryKey: ['product-variants'] });
      queryClient.invalidateQueries({ queryKey: ['products-inventory-hierarchy'] });
      toast({
        title: "Produto excluído",
        description: "Produto removido com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao excluir produto: " + error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook para atualizar quantidade de um produto
export const useUpdateProductQuantity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string, quantity: number }) => {
      const { error } = await supabase
        .from('products')
        .update({ quantity })
        .eq('id', productId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products-inventory-hierarchy'] });
      queryClient.invalidateQueries({ queryKey: ['product-variants'] });
      toast({
        title: "Quantidade atualizada",
        description: "A quantidade do produto foi atualizada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar quantidade",
        description: "Ocorreu um erro ao atualizar a quantidade.",
        variant: "destructive",
      });
      console.error('Erro ao atualizar quantidade:', error);
    },
  });
};

// Hook para criar nova variação de um produto existente
export const useCreateProductVariant = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ parentProductId, variant }: { parentProductId: string, variant: ProductVariant }) => {
      // Buscar produto base para obter dados
      const { data: baseProduct, error: baseError } = await supabase
        .from('products')
        .select('*')
        .eq('id', parentProductId)
        .single();
      
      if (baseError) throw baseError;
      
      // Criar nova variação
      const { id, created_at, updated_at, ...baseProductData } = baseProduct;
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...baseProductData,
          size: variant.size,
          quantity: variant.quantity || 1,
          parent_product_id: parentProductId,
          is_variant: true,
          variant_type: 'size',
          sku: null, // O trigger irá gerar automaticamente
          has_size_variants: false
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-variants', variables.parentProductId] });
      queryClient.invalidateQueries({ queryKey: ['product-with-variants'] });
      queryClient.invalidateQueries({ queryKey: ['products-inventory-hierarchy'] });
      toast({
        title: "Variação criada",
        description: "Nova variação adicionada com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: "Erro ao criar variação: " + error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook para deletar variação de produto
export const useDeleteProductVariant = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (variantId: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', variantId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-variants'] });
      queryClient.invalidateQueries({ queryKey: ['product-with-variants'] });
      queryClient.invalidateQueries({ queryKey: ['products-inventory-hierarchy'] });
      toast({
        title: "Variação removida",
        description: "Variação removida com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao remover variação: " + error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook para atualizar produto com suas variações
export const useUpdateProductWithVariants = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createVariant = useCreateProductVariant();
  const deleteVariant = useDeleteProductVariant();

  return useMutation({
    mutationFn: async ({ 
      productId, 
      productData, 
      newVariants, 
      existingVariants 
    }: { 
      productId: string, 
      productData: Partial<Product>, 
      newVariants: ProductVariant[], 
      existingVariants: Product[] 
    }) => {
      // Atualizar produto base
      const { data: updatedProduct, error: updateError } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productId)
        .select()
        .single();
      
      if (updateError) throw updateError;
      
      // Criar novas variações
      for (const variant of newVariants) {
        await createVariant.mutateAsync({ parentProductId: productId, variant });
      }
      
      return updatedProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-variants'] });
      queryClient.invalidateQueries({ queryKey: ['product-with-variants'] });
      queryClient.invalidateQueries({ queryKey: ['products-inventory-hierarchy'] });
      toast({
        title: "Produto atualizado",
        description: "Produto e variações atualizados com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar produto: " + error.message,
        variant: "destructive",
      });
    },
  });
};
