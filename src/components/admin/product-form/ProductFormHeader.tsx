
import { Product } from '@/hooks/useProducts';
import { ProductStatusBadge } from '../ProductStatusBadge';

interface ProductFormHeaderProps {
  product?: Product | null;
}

export const ProductFormHeader = ({ product }: ProductFormHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">
        {product ? 'Editar Produto' : 'Novo Produto'}
      </h2>
      {product && (
        <ProductStatusBadge status={product.status as 'available' | 'rented' | 'maintenance'} />
      )}
    </div>
  );
};
