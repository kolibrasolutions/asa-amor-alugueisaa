import * as React from 'react';
import { Product } from '@/hooks/useProducts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

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
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  
  const hasMultipleImages = product.images && product.images.length > 1;

  return (
    <Card className="group hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden rounded-lg">
      <div className="aspect-[3/4] overflow-hidden relative">
        {hasMultipleImages ? (
          <Carousel setApi={setApi} className="w-full h-full">
            <CarouselContent>
              {product.images!.map((image, index) => (
                <CarouselItem key={index}>
                  <img
                    src={image}
                    alt={`${product.name} - imagem ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" />

            {count > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 bg-black/30 backdrop-blur-sm p-1 px-2 rounded-full">
                {Array.from({ length: count }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${current === index + 1 ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}
                    aria-label={`Ir para imagem ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </Carousel>
        ) : (
          <>
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
          </>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-serif line-clamp-2 flex-1">
            {product.name}
          </CardTitle>
          <Badge className={`${getStatusColor(product.status || 'available')} flex-shrink-0`}>
            {getStatusLabel(product.status || 'available')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 flex flex-col flex-grow">
        <div className="mt-auto">
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-end items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-600 hover:text-gray-900"
                onClick={() => onCopyId(product.sku || product.id, product.name)}
                title="Copiar código do produto"
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copiar código do produto</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
