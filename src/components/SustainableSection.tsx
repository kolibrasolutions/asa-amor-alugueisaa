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
    <section className="py-16 bg-gray-50">
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
              From Item to Headlook:<br />
              <span className="text-asa-primary">Sustainable Wedding Day</span><br />
              Accessories Made from Your<br />
              Dress
            </h2>
            
            <p className="text-gray-600 leading-relaxed">
              Oferecemos uma experiência única e sustentável para o seu grande dia. 
              Transformamos elementos do seu vestido em acessórios personalizados, 
              criando memórias que durarão para sempre.
            </p>

            <Button 
              onClick={handleWhatsAppClick}
              className="bg-asa-primary hover:bg-asa-primary/90 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105"
            >
              <MessageCircle size={20} />
              GET STARTED
            </Button>

            <p className="text-sm text-gray-500">
              Entre em contato conosco e descubra como podemos tornar seu dia ainda mais especial.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SustainableSection; 