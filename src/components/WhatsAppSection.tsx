import { useWhatsAppSectionImages } from "@/hooks/useSectionImages";

const WhatsAppSection = () => {
  const { data: whatsappImages = [], isLoading } = useWhatsAppSectionImages();
  
  // Usar a primeira imagem configurada ou fallback
  const sectionImage = whatsappImages[0];
  const imageUrl = sectionImage?.image_url || '/noivos.jpg';

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-pulse bg-gray-200 w-full h-64 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img 
              src={imageUrl}
              alt={sectionImage?.title || "Casal de Noivos"}
              className="w-full rounded-lg"
            />
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl font-serif">
              Agende sua<br />
              Visita e Realize<br />
              seu Sonho
            </h2>
            <p className="text-gray-600">
              Estamos prontos para ajudar você a encontrar o vestido ou terno perfeito para o seu grande dia. Entre em contato conosco e agende uma visita personalizada.
            </p>
            <p className="text-gray-600">
              Nossa equipe especializada está à disposição para tirar todas as suas dúvidas e oferecer o melhor atendimento.
            </p>
            <a
              href="https://wa.me/5535991479232"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Fale Conosco pelo WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsAppSection; 