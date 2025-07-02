import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const CategoriesSection = () => {
  const categories = [
    {
      id: "vestidos",
      name: "VESTIDOS DE NOIVAS",
      image: "/vestidos-noivas.jpg"
    },
    {
      id: "ternos",
      name: "TERNOS PARA NOIVOS",
      image: "/ternos-noivos.jpg"
    },
    // Mais categorias podem ser adicionadas aqui
  ];

  return (
    <>
      <div className="py-8 text-center bg-white">
        <h2 className="text-xl font-serif">Vestidos & Ternos</h2>
        <p className="text-gray-600 mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>

      <section className="pb-8 container mx-auto px-4">
        <Carousel className="w-full">
          <CarouselContent className="-ml-4">
            {categories.map((category) => (
              <CarouselItem key={category.id} className="pl-4 basis-1/2 md:basis-1/4 lg:basis-1/5">
                <Link 
                  to={`/catalogo?categoria=${category.id}`}
                  className="relative group block overflow-hidden rounded-lg"
                >
                  <img 
                    src={category.image}
                    alt={category.name}
                    className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h3 className="text-white text-sm font-serif text-center px-2">{category.name}</h3>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-4 mt-4">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="/noivos.jpg" 
                alt="Casal de Noivos" 
                className="w-full rounded-lg"
              />
              <div className="absolute -bottom-4 -right-4 flex gap-2">
                <img 
                  src="/noivos.jpg" 
                  alt="Miniatura 1" 
                  className="w-16 h-16 object-cover rounded"
                />
                <img 
                  src="/noivos.jpg" 
                  alt="Miniatura 2" 
                  className="w-16 h-16 object-cover rounded"
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-4xl font-serif">
                Lorem Ipsum<br />
                Dolor Sit Amet<br />
                Consectetur<br />
                Adipiscing
              </h2>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
              </p>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CategoriesSection; 