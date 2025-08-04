import * as React from 'react';
import { Product } from '@/hooks/useProducts';
import { Card, CardContent } from '@/components/ui/card';
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
import { ProductDetailsModal } from './ProductDetailsModal';

interface ProductCardProps {
  product: Product;
  onCopyId: (id: string, name: string) => void;
}

const ProductCard = ({ product, onCopyId }: ProductCardProps) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
    <>
      <Card className="group bg-white border-0 shadow-none hover:shadow-lg transition-all duration-500 ease-out overflow-hidden">
      <div className="aspect-[4/5] overflow-hidden relative bg-gray-50 rounded-t-lg">
        {hasMultipleImages ? (
          <Carousel setApi={setApi} className="w-full h-full">
            <CarouselContent>
              {product.images!.map((image, index) => (
                <CarouselItem key={index}>
                  <img
                    src={image}
                    alt={`${product.name} - imagem ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out cursor-pointer"
                    onClick={handleImageClick}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 bg-white/90 backdrop-blur-sm border-0 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 bg-white/90 backdrop-blur-sm border-0 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />

            {count > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-white/90 backdrop-blur-sm p-2 px-3 rounded-full shadow-lg">
                {Array.from({ length: count }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${current === index + 1 ? 'bg-asa-dark scale-125' : 'bg-gray-300 hover:bg-gray-400'}`}
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
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out cursor-pointer"
                  onClick={handleImageClick}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 font-light text-sm">Sem imagem</span>
                </div>
              )}
            </>
          )}
          
          {/* Botão de copy discreto */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg text-gray-600 hover:text-asa-dark hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              onCopyId(product.sku || product.id, product.name);
            }}
            title="Copiar código do produto"
          >
            <Copy className="h-3.5 w-3.5" />
            <span className="sr-only">Copiar código do produto</span>
          </Button>
        </div>
        
        <CardContent className="py-6 px-4 bg-white">
          <div className="text-center">
            <h3 className="text-lg font-light text-asa-dark tracking-wide leading-relaxed">
              {product.name}
            </h3>
          </div>
        </CardContent>
        </Card>

        <ProductDetailsModal
          product={product}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onCopyId={onCopyId}
        />
      </>
    );
};

export default ProductCard;
