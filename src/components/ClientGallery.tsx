import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import { useClientGalleryImages } from "@/hooks/useSectionImages";
import { supabase } from "@/integrations/supabase/client";

const ClientGallery = () => {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const { data: clientImages = [], isLoading } = useClientGalleryImages();

  // Obter a URL pública do bucket de armazenamento
  const { data: publicUrlData } = supabase.storage
    .from('section-images')
    .getPublicUrl('');

  const storageBaseUrl = publicUrlData?.publicUrl || '';

  // Fallback para imagens estáticas se não houver imagens configuradas
  const fallbackImages = [
    "/noivos.jpg",
    "/noivos.jpg",
    "/noivos.jpg",
    "/noivos.jpg",
    "/noivos.jpg",
    "/noivos.jpg",
    "/noivos.jpg",
    "/noivos.jpg",
    "/noivos.jpg",
    "/noivos.jpg",
    "/noivos.jpg",
    "/noivos.jpg",
  ];

  const imagesToShow = clientImages.length > 0 ? clientImages : fallbackImages.map((img, index) => ({
    id: `fallback-${index}`,
    image_url: img,
    title: `Casal Feliz ${index + 1}`,
    description: '',
    section_id: 'client_gallery',
    sort_order: index,
    is_active: true,
    created_at: '',
    updated_at: '',
  }));

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="animate-pulse">
              <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-4"></div>
              <div className="h-4 w-64 bg-gray-200 rounded mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif mb-4">Nossos Casais Felizes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Veja alguns dos momentos especiais que ajudamos a tornar ainda mais memoráveis. Cada casal, uma história única de amor.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[plugin.current]}
            className="w-full"
          >
            <CarouselContent>
              {imagesToShow.map((image, index) => (
                <CarouselItem 
                  key={image.id} 
                  className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                >
                  <div className="relative aspect-square p-1">
                    <img 
                      src={clientImages.length > 0 ? `${storageBaseUrl}/${image.image_url}` : image.image_url}
                      alt={image.title || `Casal Feliz ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-8 mt-8">
              <CarouselPrevious className="relative inset-0 translate-y-0" />
              <CarouselNext className="relative inset-0 translate-y-0" />
            </div>
          </Carousel>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">Junte-se a nossa história de sucesso e deixe-nos fazer parte do seu momento especial.</p>
        </div>
      </div>
    </section>
  );
};

export default ClientGallery; 