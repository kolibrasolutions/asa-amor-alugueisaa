
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Casal elegante em casamento */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white animate-fade-in">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 tracking-wide">
          Aluguel de Vestidos
          <br />
          <span className="text-asa-blush">e Ternos</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto font-light leading-relaxed">
          Para momentos únicos e inesquecíveis. Peças cuidadosamente selecionadas 
          para o seu dia especial.
        </p>
        <Button 
          size="lg" 
          className="bg-asa-blush hover:bg-asa-blush/90 text-asa-dark font-medium px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
        >
          VER COLEÇÃO
        </Button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="w-1 h-16 bg-white/50 rounded-full"></div>
      </div>
    </section>
  );
};

export default Hero;

