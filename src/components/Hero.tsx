import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useBanners } from "@/hooks/useBanners";

const Hero = () => {
  const navigate = useNavigate();
  const { data: banners = [], isLoading } = useBanners();
  const activeBanner = banners[0];

  if (isLoading) {
    return (
      <section className="relative w-full flex items-center justify-center pt-20">
        <div className="animate-pulse bg-gray-200 w-full aspect-[21/9]" />
      </section>
    );
  }

  return (
    <section className="relative w-full flex items-center justify-center overflow-hidden pt-20">
      <div className="w-full aspect-[21/9]">
        <div className="relative w-full h-full">
          <img 
            src={activeBanner?.image_url || '/noivos.jpg'}
            alt="Banner"
            className="w-full h-full object-cover"
            style={{
              objectPosition: "center 30%"
            }}
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      </div>

      <div className="absolute z-10 text-center text-white px-4">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif mb-4">
          {activeBanner?.title || "Noivas Cirlene"}
          <br />
          <span className="text-3xl md:text-4xl lg:text-5xl">{activeBanner?.subtitle || "Vestidos & Ternos"}</span>
        </h1>
        <Button
          size="lg"
          onClick={() => navigate("/catalogo")}
          className="bg-white text-black hover:bg-white/90 mt-8 text-lg px-8"
        >
          VER NOSSO CATÁLOGO
        </Button>
      </div>
    </section>
  );
};

export default Hero;
