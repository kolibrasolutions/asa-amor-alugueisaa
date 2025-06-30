import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const SustainableSection = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "5531999999999"; // Substitua pelo número real
    const message = "Olá! Gostaria de saber mais sobre os serviços sustentáveis.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Imagem Principal */}
          <div className="relative">
            <img 
              src="/casal-noivos.png" 
              alt="Casal de noivos" 
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            {/* Imagens menores sobrepostas */}
            <div className="absolute -bottom-6 -right-6 grid grid-cols-2 gap-2">
              <img 
                src="/noivos.jpg" 
                alt="Detalhe 1" 
                className="w-20 h-20 object-cover rounded-lg shadow-md"
              />
              <img 
                src="/casal-noivos.png" 
                alt="Detalhe 2" 
                className="w-20 h-20 object-cover rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* Conteúdo */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-serif text-asa-dark leading-tight">
              Lorem Ipsum<br />
              <span className="text-asa-primary">Dolor Sit Amet</span><br />
              Consectetur<br />
              Adipiscing
            </h2>
            
            <p className="text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
              nostrud exercitation.
            </p>

            <Button 
              onClick={handleWhatsAppClick}
              className="bg-asa-primary hover:bg-asa-primary/90 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105"
            >
              <MessageCircle size={20} />
              LOREM IPSUM
            </Button>

            <p className="text-sm text-gray-500">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SustainableSection; 