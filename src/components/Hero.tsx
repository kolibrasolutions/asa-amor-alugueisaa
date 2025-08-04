import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useBanners } from "@/hooks/useBanners";

const Hero = () => {
  const navigate = useNavigate();
  const { data: banners = [], isLoading } = useBanners();
  
  const activeBanner = banners[0];
  
  // Adicionar parâmetros de qualidade à URL da imagem do Supabase
  const getHighQualityImageUrl = (url: string) => {
    if (!url || url.startsWith('/')) return url; // URL local, não modificar
    
    // Se for URL do Supabase, adicionar parâmetros de qualidade
    if (url.includes('supabase.co')) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}quality=100&format=original`;
    }
    
    return url;
  };
  
  const imageUrl = getHighQualityImageUrl(activeBanner?.image_url || '/noivos.jpg');
  const title = activeBanner?.title || "Noivas Cirlene";
  const subtitle = activeBanner?.subtitle || "Vestidos & Ternos";

  if (isLoading) {
    return (
      <section className="relative w-full flex items-center justify-center mt-16">
        <div className="animate-pulse bg-gray-200 w-full h-[calc(100vh-64px)]" />
      </section>
    );
  }

  return (
    <section className="relative w-full flex items-center justify-center overflow-hidden mt-16">
      {/* Container com altura total da viewport */}
      <div className="w-full h-[calc(100vh-64px)]"> {/* 64px é a altura do header */}
        <div className="relative w-full h-full">
          <img 
            src={imageUrl}
            alt="Hero"
            className="w-full h-full object-cover"
            style={{
              objectPosition: "center 30%",
              imageRendering: "high-quality"
            }}
            loading="eager"
            decoding="sync"
            fetchpriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50"></div>
        </div>
      </div>

      <div className="absolute z-10 text-center text-white px-4 md:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif mb-2 md:mb-4 leading-tight">
          {title}
          <br />
          <span className="text-xl sm:text-2xl md:text-4xl lg:text-5xl block mt-1 md:mt-3">
            {subtitle}
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
