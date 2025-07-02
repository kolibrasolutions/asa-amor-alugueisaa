import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useBanners } from "@/hooks/useBanners";

const Hero = () => {
  const navigate = useNavigate();
  const { data: banners = [], isLoading } = useBanners();
  const activeBanner = banners[0];

  if (isLoading) {
    return (
      <section className="relative w-full flex items-center justify-center">
        <div className="animate-pulse bg-gray-200 w-full h-[calc(100vh-13rem)] md:h-auto md:aspect-[16/9] lg:aspect-[21/9]" />
      </section>
    );
  }

  return (
    <section className="relative w-full flex items-center justify-center overflow-hidden">
      {/* Container fixo para altura no mobile */}
      <div className="w-full h-[calc(100vh-13rem)] md:h-auto md:aspect-[16/9] lg:aspect-[21/9]">
        <div className="relative w-full h-full">
          <img 
            src={activeBanner?.image_url || '/noivos.jpg'}
            alt="Banner"
            className="w-full h-full object-cover"
            style={{
              objectPosition: "center 30%"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50"></div>
        </div>
      </div>

      <div className="absolute z-10 text-center text-white px-4 md:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif mb-2 md:mb-4 leading-tight">
          {activeBanner?.title || "Noivas Cirlene"}
          <br />
          <span className="text-xl sm:text-2xl md:text-4xl lg:text-5xl block mt-1 md:mt-3">
            {activeBanner?.subtitle || "Vestidos & Ternos"}
          </span>
        </h1>
        <button
          onClick={() => navigate("/catalogo")}
          className="text-white/90 hover:text-white mt-4 md:mt-8 text-xs md:text-base font-light tracking-wider uppercase transition-colors duration-200 underline underline-offset-4 hover:underline-offset-8"
        >
          VER NOSSO CATÁLOGO
        </button>
      </div>
    </section>
  );
};

export default Hero;
