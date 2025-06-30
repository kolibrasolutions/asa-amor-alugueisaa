import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type UseEmblaCarouselType } from "embla-carousel-react";

const ClientGallery = () => {
  const [api, setApi] = useState<UseEmblaCarouselType[1]>(null);
  const [current, setCurrent] = useState(0);

  const clientImages = [
    {
      src: "/noivos.jpg",
      alt: "Cliente 1",
      category: "Vestido de Noiva"
    },
    {
      src: "/casal-noivos.png",
      alt: "Cliente 2", 
      category: "Terno Masculino"
    },
    {
      src: "/noivos.jpg",
      alt: "Cliente 3",
      category: "Vestido de Festa"
    },
    {
      src: "/casal-noivos.png",
      alt: "Cliente 4",
      category: "Look Completo"
    },
    {
      src: "/noivos.jpg",
      alt: "Cliente 5",
      category: "Vestido de Noiva"
    },
    {
      src: "/casal-noivos.png",
      alt: "Cliente 6",
      category: "Terno Masculino"
    }
  ];

  useEffect(() => {
    if (!api) return;

    // Configurar o autoplay
    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000); // Troca a cada 3 segundos

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-asa-dark mb-4">
            Lorem Ipsum Dolor
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* Carrossel de Imagens */}
        <div className="relative">
          <Carousel
            setApi={setApi}
            className="w-full max-w-5xl mx-auto"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {clientImages.map((image, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 h-80">
                    <img 
                      src={image.src}
                      alt={`Lorem ipsum ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-6 text-white">
                        <h3 className="text-xl font-semibold mb-2">Lorem ipsum {index + 1}</h3>
                        <p className="text-sm opacity-90">Dolor sit amet</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit?
          </p>
          <a 
            href="#contato"
            className="inline-block bg-asa-primary hover:bg-asa-primary/90 text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
          >
            Lorem Ipsum
          </a>
        </div>
      </div>
    </section>
  );
};

export default ClientGallery; 