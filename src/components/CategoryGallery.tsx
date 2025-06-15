
import { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useCategoryStats } from '@/hooks/useProductsByCategory';
import { useNavigate } from 'react-router-dom';

const CategoryGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: categoryStats, isLoading: statsLoading } = useCategoryStats();
  const navigate = useNavigate();

  // Fallback para categorias padrão enquanto não há dados
  const defaultCategories = [
    {
      id: 'default-1',
      name: "Vestido de Noiva",
      image_url: "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Noiva elegante
      description: "Modelos únicos para o seu grande dia",
      productCount: 0,
      sort_order: 1
    },
    {
      id: 'default-2',
      name: "Terno Masculino", 
      image_url: "https://images.unsplash.com/photo-1464983953574-0892a716854b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Terno clássico
      description: "Elegância e sofisticação",
      productCount: 0,
      sort_order: 2
    },
    {
      id: 'default-3',
      name: "Vestido de Festa",
      image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Festa glamourosa
      description: "Para ocasiões especiais",
      productCount: 0,
      sort_order: 3
    },
    {
      id: 'default-4',
      name: "Vestido Leve",
      image_url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Vestido casual elegante
      description: "Conforto e estilo",
      productCount: 0,
      sort_order: 4
    },
    {
      id: 'default-5',
      name: "Traje Chinês",
      image_url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Traje oriental tradicional
      description: "Tradição oriental",
      productCount: 0,
      sort_order: 5
    },
    {
      id: 'default-6',
      name: "Vestido para Mães",
      image_url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Vestido elegante maduro
      description: "Elegância para mães especiais",
      productCount: 0,
      sort_order: 6
    }
  ];

  // Combinar dados reais com estatísticas, ordenados por sort_order
  const displayCategories = categories && categories.length > 0 
    ? categoryStats?.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)) || []
    : defaultCategories;

  const handleCategoryClick = (categoryId: string) => {
    // Navegar para o catálogo com filtro da categoria
    navigate(`/catalogo?category=${categoryId}`);
  };

  const handleViewAllProducts = () => {
    navigate('/catalogo');
  };

  if (categoriesLoading || statsLoading) {
    return (
      <section id="categorias" className="py-20 bg-asa-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-asa-dark mb-4">
              Nossa Coleção
            </h2>
            <p className="text-lg text-asa-gray max-w-2xl mx-auto">
              Carregando categorias...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categorias" className="py-20 bg-asa-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-asa-dark mb-4">
            Nossa Coleção
          </h2>
          <p className="text-lg text-asa-gray max-w-2xl mx-auto">
            Descubra nossa seleção exclusiva de peças para cada ocasião especial
          </p>
          
          <div className="mt-8">
            <button
              onClick={handleViewAllProducts}
              className="bg-asa-blush text-white px-8 py-3 rounded-full font-medium hover:bg-asa-dark transition-colors"
            >
              Ver Todos os Produtos
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCategories.map((category) => (
            <div 
              key={category.id}
              className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={category.image_url || "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                  }}
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-serif font-semibold text-asa-dark">
                    {category.name}
                  </h3>
                  {category.productCount > 0 && (
                    <span className="bg-asa-blush text-white text-xs px-2 py-1 rounded-full">
                      {category.productCount}
                    </span>
                  )}
                </div>
                <p className="text-asa-gray text-sm mb-4">
                  {category.description || 'Categoria sem descrição'}
                </p>
                <div className="text-asa-blush font-medium text-sm group-hover:text-asa-dark transition-colors">
                  Ver produtos desta categoria →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGallery;
