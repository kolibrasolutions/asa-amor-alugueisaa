import * as React from 'react';
import { Product, useProductVariants } from '@/hooks/useProducts';
import { useSizes } from '@/hooks/useSizes';
import { useColors } from '@/hooks/useColors';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, X } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onCopyId: (id: string, name: string) => void;
}

export const ProductDetailsModal = ({ 
  product, 
  isOpen, 
  onClose, 
  onCopyId 
}: ProductDetailsModalProps) => {
  const isMobile = useIsMobile();
  const { data: sizes } = useSizes();
  const { data: colors } = useColors();
  const { data: productVariants } = useProductVariants(product?.id || '');
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

  if (!product) return null;

  const hasMultipleImages = product.images && product.images.length > 1;
  
  // Encontrar nome da cor
  const productColor = colors?.find(color => color.value === product.color);
  const colorName = productColor?.name || product.color;

  // Encontrar nome do tamanho
  const productSize = sizes?.find(size => size.value === product.size);
  const sizeName = productSize?.name || product.size;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl max-h-[90vh] p-0 rounded-xl ${isMobile ? 'w-[95vw] h-[90vh]' : 'w-full overflow-hidden'} ${isMobile ? '' : ''}`} closeButton={false}>
        <div className={`${isMobile ? 'flex flex-col h-full' : 'grid grid-cols-2 min-h-[600px]'}`}>
          {/* Botão de Fechar */}
          <Button variant="ghost" className="absolute top-4 right-4 z-50 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white/100" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
          {/* Lado Esquerdo - Imagens */}
          <div className={`relative bg-gray-50 rounded-t-xl ${isMobile ? 'flex-shrink-0 h-[50vh] z-0 shadow-md overflow-hidden' : 'h-full'} flex items-center justify-center`}>
            {hasMultipleImages ? (
              <Carousel setApi={setApi} className="w-full h-full">
                <CarouselContent className="h-full">
                  {product.images!.map((image, index) => (
                    <CarouselItem key={index} className="h-full">
                      <div className={`w-full h-full flex items-center justify-center p-4`}>
                        <img
                          src={image}
                          alt={`${product.name} - imagem ${index + 1}`}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className={`absolute left-2 ${isMobile ? 'md:left-4' : 'left-4'} top-1/2 -translate-y-1/2 z-10 ${isMobile ? 'h-8 w-8' : 'h-10 w-10'} bg-white/90 backdrop-blur-sm border-0 shadow-lg`} />
                <CarouselNext className={`absolute right-2 ${isMobile ? 'md:right-4' : 'right-4'} top-1/2 -translate-y-1/2 z-10 ${isMobile ? 'h-8 w-8' : 'h-10 w-10'} bg-white/90 backdrop-blur-sm border-0 shadow-lg`} />

                {count > 1 && (
                  <div className={`absolute ${isMobile ? 'bottom-2' : 'bottom-4'} left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-white/90 backdrop-blur-sm ${isMobile ? 'p-1 px-2' : 'p-2 px-3'} rounded-full shadow-lg`}>
                    {Array.from({ length: count }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => api?.scrollTo(index)}
                        className={`${isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'} rounded-full transition-all duration-300 ${current === index + 1 ? 'bg-asa-dark scale-125' : 'bg-gray-300 hover:bg-gray-400'}`}
                        aria-label={`Ir para imagem ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </Carousel>
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${isMobile ? 'p-2' : 'p-6'}`}>
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className={`text-gray-400 font-light ${isMobile ? 'text-sm' : ''}`}>Sem imagem</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Lado Direito - Detalhes */}
          <div className={`${isMobile ? 'p-3 flex-1 overflow-y-auto relative z-10 bg-white' : 'p-4 md:p-6 overflow-y-auto'} flex flex-col ${isMobile ? 'space-y-3' : 'space-y-4 md:space-y-6'}`}>
            <DialogHeader className={`${isMobile ? 'space-y-2' : 'space-y-4'}`}>
              <DialogTitle className={`${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} font-light text-asa-dark tracking-wide leading-relaxed`}>
                {product.name}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Detalhes completos do produto {product.name}
              </DialogDescription>
              
              {(product.sku || product.brand) && (
                <div className={`flex flex-wrap gap-2 ${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
                  {product.sku && (
                    <span>Código: <strong>{product.sku}</strong></span>
                  )}
                  {product.brand && (
                    <span>Marca: <strong>{product.brand}</strong></span>
                  )}
                </div>
              )}
            </DialogHeader>

            <div className={`${isMobile ? 'space-y-3' : 'space-y-4'}`}>
              {/* Cor */}
              {colorName && (
                <div>
                  <h4 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-700 mb-2`}>Cor</h4>
                  <Badge variant="secondary" className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {colorName}
                  </Badge>
                </div>
              )}

              {/* Tamanhos Disponíveis */}
               {(productVariants && productVariants.length > 0) ? (
                 <div>
                   <h4 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-700 mb-2`}>Tamanhos Disponíveis</h4>
                   <div className={`flex flex-wrap ${isMobile ? 'gap-1' : 'gap-2'}`}>
                     {productVariants.map((variant) => (
                       <Badge key={variant.id} variant="outline" className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
                         {variant.size}
                       </Badge>
                     ))}
                   </div>
                 </div>
               ) : (product.size && sizeName && (
                 <div>
                   <h4 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-700 mb-2`}>Tamanho</h4>
                   <Badge variant="outline" className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
                     {sizeName}
                   </Badge>
                 </div>
               ))}

              {/* Botão Copiar Código */}
              <div className={`${isMobile ? 'pt-1 pb-1' : 'pt-1 pb-2'}`}>
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "sm"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopyId(product.sku || product.id, product.name);
                  }}
                  className={`w-full ${isMobile ? 'text-xs h-8' : 'sm:w-auto'}`}
                >
                  <Copy className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-3.5 w-3.5 mr-2'}`} />
                  Copiar Código
                </Button>
              </div>

              {/* Descrição */}
              {product.description && (
                <div>
                  <h4 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-700 mb-2`}>Descrição</h4>
                  <p className={`text-gray-600 leading-relaxed whitespace-pre-wrap ${isMobile ? 'text-xs' : ''}`}>
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* Informação adicional */}
            <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-500 ${isMobile ? 'pt-2' : 'pt-2 md:pt-4'} border-t`}>
              <p>Para mais informações ou para fazer uma reserva, entre em contato conosco.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};