import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';
import { useProductFilters } from '@/hooks/useProductFilters';
import CatalogHeader from '@/components/catalog/CatalogHeader';
import CatalogFilters from '@/components/catalog/CatalogFilters';
import ProductGrid from '@/components/catalog/ProductGrid';
import NoProductsFound from '@/components/catalog/NoProductsFound';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

const Catalog = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    filteredProducts,
    availableColors,
    availableSizes,
  } = useProductFilters(products);

  // Aplicar filtros da URL quando o componente carregar
  useEffect(() => {
    const categoryParam = searchParams.get('categoria') || searchParams.get('category');
    const colorParam = searchParams.get('color');
    const sizeParam = searchParams.get('size');
    const searchParam = searchParams.get('search');

    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
    if (colorParam && colorParam !== selectedColor) {
      setSelectedColor(colorParam);
    }
    if (sizeParam && sizeParam !== selectedSize) {
      setSelectedSize(sizeParam);
    }
    if (searchParam && searchParam !== searchTerm) {
      setSearchTerm(searchParam);
    }
  }, [searchParams, selectedCategory, selectedColor, selectedSize, searchTerm, setSelectedCategory, setSelectedColor, setSelectedSize, setSearchTerm]);

  const handleCopyId = (id: string, name: string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "Código copiado!",
      description: `O código do produto "${name}" foi copiado.`,
    });
  };

  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-asa-white">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <p className="text-center">Carregando catálogo...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-asa-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-20">
        <CatalogHeader />

        {/* Layout principal com sidebar */}
        <div className="flex gap-8">
          {/* Sidebar com filtros */}
          <aside className="flex-shrink-0">
            <CatalogFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              categories={categories}
              availableColors={availableColors}
              availableSizes={availableSizes}
            />
          </aside>

          {/* Área principal com produtos */}
          <main className="flex-1 min-w-0">
            {/* Cabeçalho da área de produtos */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-asa-dark">
                  Produtos Disponíveis
                </h2>
                <p className="text-asa-gray">
                  {filteredProducts?.length || 0} produto(s) encontrado(s)
                </p>
              </div>
              
              {/* Indicadores de filtros ativos em mobile */}
              <div className="lg:hidden">
                {(selectedCategory !== 'all' || selectedColor !== 'all' || selectedSize !== 'all' || searchTerm) && (
                  <div className="mb-4 p-3 bg-asa-blush/10 rounded-lg">
                    <p className="text-sm text-asa-dark mb-2">Filtros ativos:</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {searchTerm && (
                        <span className="bg-asa-blush/30 text-asa-dark px-2 py-1 rounded">
                          "{searchTerm}"
                        </span>
                      )}
                      {selectedCategory !== 'all' && (
                        <span className="bg-asa-blush/30 text-asa-dark px-2 py-1 rounded">
                          {categories?.find(c => c.id === selectedCategory)?.name}
                        </span>
                      )}
                      {selectedColor !== 'all' && (
                        <span className="bg-asa-blush/30 text-asa-dark px-2 py-1 rounded flex items-center gap-1">
                          <div 
                            className="w-3 h-3 rounded-full border border-gray-300"
                            style={{ backgroundColor: availableColors.find(c => c.value === selectedColor)?.hex_code }}
                          />
                          {availableColors.find(c => c.value === selectedColor)?.name}
                        </span>
                      )}
                      {selectedSize !== 'all' && (
                        <span className="bg-asa-blush/30 text-asa-dark px-2 py-1 rounded">
                          {availableSizes.find(s => s.value === selectedSize)?.name}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Grid de produtos ou mensagem de vazio */}
            {filteredProducts && filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} onCopyId={handleCopyId} />
            ) : (
              <NoProductsFound />
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Catalog;
