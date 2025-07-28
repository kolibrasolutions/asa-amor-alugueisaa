
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  sku: z.string().optional(),
  description: z.string().optional(),
  brand: z.string().optional(),
  color: z.string().optional(),
  category_id: z.string().optional(),
  status: z.enum(['available', 'rented', 'maintenance']).default('available'),
  images: z.array(z.any()).optional().default([]),
  // Campos para variações (sempre habilitado)
  has_size_variants: z.boolean().default(true),
  size_variants: z.array(z.object({
    size: z.string().min(1, 'Tamanho é obrigatório'),
    quantity: z.number().min(1, 'Quantidade deve ser maior que 0').optional().default(1)
  })).min(1, 'Adicione pelo menos um tamanho').default([])
});

export type ProductFormData = z.infer<typeof productSchema>;
