
import * as React from 'react';
import { Product } from '@/hooks/useProducts';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
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
      
      <CardContent className="py-4 px-4 flex-grow flex items-center justify-center">
        <div className="flex justify-center items-center text-center relative w-full">
          <CardTitle className="text-xl font-serif text-asa-dark line-clamp-2">
            {product.name}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 h-8 w-8 text-gray-400 hover:text-asa-dark opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onCopyId(product.sku || product.id, product.name);
            }}
            title="Copiar código do produto"
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copiar código do produto</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
