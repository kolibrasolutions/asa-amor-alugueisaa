import { Product } from '@/hooks/useProducts';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onCopyId: (id: string, name: string) => void;
}

const ProductGrid = ({ products, onCopyId }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onCopyId={onCopyId} />
      ))}
    </div>
  );
};

export default ProductGrid;
