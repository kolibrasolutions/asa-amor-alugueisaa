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
            <h2 className="text-4xl font-serif">
              Lorem Ipsum<br />
              Dolor Sit Amet<br />
              Consectetur<br />
              Adipiscing
            </h2>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
            </p>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 