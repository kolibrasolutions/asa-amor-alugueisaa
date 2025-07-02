import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useBanners } from "@/hooks/useBanners";

const Hero = () => {
  const navigate = useNavigate();
  const { data: banners = [], isLoading } = useBanners();
  const activeBanner = banners[0];

  if (isLoading) {
    return (
      <section className="relative w-full flex items-center justify-center pt-16 md:pt-20">
        <div className="animate-pulse bg-gray-200 w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9]" />
      </section>
    );
  }

  return (
    <section className="relative w-full flex items-center justify-center overflow-hidden pt-16 md:pt-20">
      <div className="w-full aspect-[3/4] md:aspect-[16/9] lg:aspect-[21/9]">
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

      <div className="absolute z-10 text-center text-white px-4 md:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif mb-2 md:mb-4 leading-tight">
          {activeBanner?.title || "Noivas Cirlene"}
          <br />
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl block mt-1 md:mt-2">
            {activeBanner?.subtitle || "Vestidos & Ternos"}
          </span>
        </h1>
        <button
          onClick={() => navigate("/catalogo")}
          className="text-white/90 hover:text-white mt-4 md:mt-6 lg:mt-8 text-xs md:text-sm font-light tracking-wider uppercase transition-colors duration-200 underline underline-offset-4 hover:underline-offset-8"
        >
          VER NOSSO CATÁLOGO
        </button>
      </div>
    </section>
  );
};

export default Hero;
