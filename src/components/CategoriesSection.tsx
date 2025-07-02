import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useCategories } from "@/hooks/useCategories";

const CategoriesSection = () => {
  const { data: dbCategories = [], isLoading } = useCategories();

  // Filtra apenas as categorias principais que queremos mostrar
  const categories = dbCategories.filter(cat => 
    cat.name.toLowerCase().includes('vestido') || 
    cat.name.toLowerCase().includes('terno')
  );

  if (isLoading) {
    return (
      <div className="py-4 md:py-8 text-center bg-white/80 md:bg-white">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mx-auto"></div>
          <div className="h-4 w-64 bg-gray-200 rounded mx-auto mt-2"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="py-4 md:py-8 text-center bg-white/80 md:bg-white">
        <h2 className="text-lg md:text-3xl font-serif text-gray-800/90 md:text-gray-800">Vestidos & Ternos</h2>
        <p className="text-gray-600/80 md:text-gray-600 text-sm md:text-base mt-1 md:mt-2 max-w-2xl mx-auto px-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>

      <section className="pb-8 container mx-auto px-4">
        <Carousel className="w-full">
          <CarouselContent className="-ml-4">
            {categories.map((category) => (
              <CarouselItem key={category.id} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                <Link 
                  to={`/catalogo?category=${category.id}`}
                  onClick={() => window.scrollTo(0, 0)}
                  className="relative group block overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <img 
                    src={category.image_url || "/noivos.jpg"}
                    alt={category.name}
                    className="w-full h-40 md:h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex items-end">
                    <div className="p-3 w-full">
                      <h3 className="text-white text-xs md:text-sm font-serif font-medium text-center leading-tight">
                        {category.name.toUpperCase()}
                      </h3>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
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