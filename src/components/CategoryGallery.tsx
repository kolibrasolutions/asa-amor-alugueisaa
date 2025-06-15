
import { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useCategoryStats } from '@/hooks/useProductsByCategory';

const CategoryGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: categoryStats, isLoading } = useCategoryStats();

  // Fallback para categorias padrão enquanto não há dados
  const defaultCategories = [
    {
      id: 'default-1',
      name: "Vestido de Noiva",
      image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Modelos únicos para o seu grande dia",
      productCount: 0
    },
    {
      id: 'default-2',
      name: "Terno Masculino", 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Elegância e sofisticação",
      productCount: 0
    },
    {
      id: 'default-3',
      name: "Vestido de Festa",
      image: "https://images.unsplash.com/photo-1566479179817-65e64c5b8b13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
      description: "Para ocasiões especiais",
      productCount: 0
    },
    {
      id: 'default-4',
      name: "Vestido Leve",
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Conforto e estilo",
      productCount: 0
    },
    {
      id: 'default-5',
      name: "Traje Chinês",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Tradição oriental",
      productCount: 0
    },
    {
      id: 'default-6',
      name: "Vestido para Mães",
      image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Elegância para mães especiais",
      productCount: 0
    }
  ];

  const categories = categoryStats && categoryStats.length > 0 ? categoryStats : defaultCategories;

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  if (isLoading) {
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
          {selectedCategory && (
            <div className="mt-4">
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-asa-blush hover:text-asa-dark transition-colors"
              >
                ← Voltar para todas as categorias
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div 
              key={category.id}
              className={`group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 ${
                selectedCategory === category.id ? 'ring-2 ring-asa-blush' : ''
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={category.image || "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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
                <p className="text-asa-gray text-sm">
                  {category.description || 'Categoria sem descrição'}
                </p>
                {selectedCategory === category.id && (
                  <div className="mt-4 pt-4 border-t border-asa-gray-light">
                    <p className="text-sm text-asa-blush font-medium">
                      Clique para ver produtos desta categoria
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedCategory && (
          <div className="mt-16 p-8 bg-asa-gray-light rounded-2xl">
            <h3 className="text-2xl font-serif font-bold text-asa-dark mb-4 text-center">
              Produtos da Categoria Selecionada
            </h3>
            <p className="text-center text-asa-gray">
              Funcionalidade de exibição de produtos em desenvolvimento...
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryGallery;
