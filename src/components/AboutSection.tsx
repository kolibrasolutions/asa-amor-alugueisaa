import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import { useNavigate } from "react-router-dom";

const AboutSection = () => {
  const { data: categories = [], isLoading } = useCategories();
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    // Navegar para o catálogo com filtro da categoria
    navigate(`/catalogo?categoria=${categoryId}&nome=${encodeURIComponent(categoryName)}`);
  };

  if (isLoading) {
    return (
      <section id="sobre" className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-500">Carregando categorias...</p>
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
              src="/noivos.jpg" 
              alt="Detalhes do Casamento" 
              className="w-full rounded-lg"
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
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
            <h2 className="text-4xl font-serif">Seu Sonho,<br />Nossa Paixão</h2>
            <p className="text-gray-600">
              Desde 1989, transformando sonhos em realidade através de peças únicas e atendimento personalizado. São 35 anos de experiência cuidando dos momentos mais especiais da vida de nossos clientes. Nosso compromisso é fazer com que você se sinta radiante e confiante no seu grande dia.
            </p>
            <p className="text-gray-600">
              Trabalhamos com as melhores marcas do mercado e mantemos nosso catálogo sempre atualizado com as últimas tendências da moda nupcial. Cada casal que nos procura recebe atenção especial e dedicada.
            </p>
            <p className="text-gray-600">
              Entre em contato conosco e agende sua visita. Estamos prontos para tornar seu casamento ainda mais especial!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 