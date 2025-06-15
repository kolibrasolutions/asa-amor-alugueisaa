
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  sku: z.string().optional(),
  description: z.string().optional(),
  brand: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  category_id: z.string().optional(),
  status: z.enum(['available', 'rented', 'maintenance']).default('available'),
  images: z.array(z.any()).optional().default([]),
});

export type ProductFormData = z.infer<typeof productSchema>;
