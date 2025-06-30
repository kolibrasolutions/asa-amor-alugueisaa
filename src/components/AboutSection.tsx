import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import { useNavigate } from "react-router-dom";

const AboutSection = () => {
  const { data: categories = [], isLoading } = useCategories();
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    navigate(`/catalogo?categoria=${categoryId}&nome=${encodeURIComponent(categoryName)}`);
  };

  if (isLoading) {
    return (
      <section id="sobre" className="pt-4 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-500">Carregando...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="sobre" className="pt-4 bg-white">
      <div className="container mx-auto px-4">
        {/* Título Principal */}
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-serif text-asa-dark mb-2">
            Lorem ipsum dolor sit amet
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
          </p>
        </div>

        {/* Grid de Categorias */}
        {categories.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            {categories.slice(0, 5).map((category) => (
              <div 
                key={category.id}
                className="space-y-1 cursor-pointer group transition-all duration-300 hover:scale-105"
                onClick={() => handleCategoryClick(category.id, category.name)}
              >
                <div className="relative overflow-hidden rounded">
                  <img 
                    src={category.image_url || "/noivos.jpg"} 
                    alt={category.name}
                    className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
                </div>
                <p className="text-center text-xs font-medium text-gray-700 group-hover:text-asa-primary transition-colors duration-300 uppercase">
                  {category.name}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Fallback se não houver categorias */}
        {categories.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Lorem ipsum dolor sit amet</p>
            <Button 
              onClick={() => navigate("/catalogo")}
              className="bg-asa-primary hover:bg-asa-primary/90 text-white px-6 py-2 rounded-full"
            >
              Ver Catálogo
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection; 