import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useBanners } from "@/hooks/useBanners";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Hero = () => {
  const navigate = useNavigate();
  const { data: banners = [], isLoading } = useBanners();

  if (isLoading) {
    return (
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="animate-pulse bg-gray-200 w-full h-full" />
      </section>
    );
  }

  // Se não houver banners, usa a imagem padrão
  if (banners.length === 0) {
    return (
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/casal-noivos.png')"
          }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative z-10 text-center text-white animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 tracking-wide">
            Noivas Cirlene
            <br />
            <span className="text-asa-primary">Aluguel de Roupas</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Realize seu sonho com nossos vestidos e ternos exclusivos para casamentos e eventos especiais
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/catalog")}
            className="bg-asa-primary hover:bg-asa-primary/90"
          >
            Ver Catálogo
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <Carousel className="w-full h-full">
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className="relative h-screen">
                <div 
                  className="absolute inset-0 overflow-hidden bg-gray-900"
                  style={{ paddingTop: '80px' }}
                >
                  <img 
                    src={banner.image_url}
                    alt={banner.title}
                    style={{
                      width: '100%',
                      height: 'calc(100vh - 80px)',
                      objectFit: 'cover',
                      objectPosition: 'center top'
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>

                <div className="relative z-10 h-full flex items-center justify-center">
                  <div className="text-center text-white animate-fade-in">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 tracking-wide">
                      {banner.title}
                      <br />
                      <span className="text-asa-primary">{banner.subtitle}</span>
                    </h1>
                    <Button
                      size="lg"
                      onClick={() => navigate("/catalogo")}
                      className="bg-asa-primary hover:bg-asa-primary/90 text-white px-8 py-6 text-lg md:text-xl font-medium rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg uppercase tracking-wider"
                    >
                      Ver Nosso Catálogo
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {banners.length > 1 && (
          <>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </>
        )}
      </Carousel>
    </section>
  );
};

export default Hero;
