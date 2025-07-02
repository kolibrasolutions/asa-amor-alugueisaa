import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const ClientGallery = () => {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const images = [
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

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif mb-4">Lorem Ipsum Dolor</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
              {images.map((image, index) => (
                <CarouselItem 
                  key={index} 
                  className="basis-1/4 transition-all duration-300"
                >
                  <div className="relative aspect-square p-1">
                    <img 
                      src={image}
                      alt={`Cliente ${index + 1}`}
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
          <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit?</p>
        </div>
      </div>
    </section>
  );
};

export default ClientGallery; 