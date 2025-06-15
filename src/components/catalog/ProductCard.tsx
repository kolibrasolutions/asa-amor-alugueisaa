
import { Product } from '@/hooks/useProducts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onCopyId: (id: string, name: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-800';
    case 'rented':
      return 'bg-yellow-100 text-yellow-800';
    case 'maintenance':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'available':
      return 'Disponível';
    case 'rented':
      return 'Alugado';
    case 'maintenance':
      return 'Manutenção';
    default:
      return status;
  }
};

const ProductCard = ({ product, onCopyId }: ProductCardProps) => {
  return (
    <Card className="group hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="aspect-[3/4] overflow-hidden rounded-t-lg">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Sem imagem</span>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-serif line-clamp-1">
            {product.name}
          </CardTitle>
          <Badge className={getStatusColor(product.status || 'available')}>
            {getStatusLabel(product.status || 'available')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 flex flex-col flex-grow">
        <div className="flex-grow">
          {product.description && (
            <p className="text-sm text-asa-gray mb-2 line-clamp-2">
              {product.description}
            </p>
          )}
          
          <div className="space-y-1 text-sm">
            {product.brand && (
              <p><span className="font-medium">Marca:</span> {product.brand}</p>
            )}
            {product.size && (
              <p><span className="font-medium">Tamanho:</span> {product.size}</p>
            )}
            {product.color && (
              <p><span className="font-medium">Cor:</span> {product.color}</p>
            )}
          </div>
        </div>

        <div className="mt-auto">
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <p className="text-asa-gray">Código do produto</p>
                <p className="font-mono text-xs text-gray-500" title={product.sku || product.id}>
                  {product.sku || `${product.id.substring(0, 8)}...`}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-600 hover:text-gray-900"
                onClick={() => onCopyId(product.sku || product.id, product.name)}
                title="Copiar código"
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copiar código</span>
              </Button>
            </div>

            {product.rental_price && (
              <div className="mt-2">
                <p className="text-lg font-bold text-asa-blush">
                  R$ {Number(product.rental_price).toFixed(2)}
                  <span className="text-sm font-normal text-asa-gray ml-1">
                    /aluguel
                  </span>
                </p>
              </div>
            )}
          </div>
          
          <Button className="w-full mt-4" variant="outline">
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
