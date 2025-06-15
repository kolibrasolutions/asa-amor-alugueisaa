
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

const Catalog = () => {
  const { toast } = useToast();

  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    priceRange,
    setPriceRange,
    filteredProducts,
  } = useProductFilters(products);

  const handleCopyId = (id: string, name:string) => {
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

        <CatalogFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          categories={categories}
        />

        <div className="mb-6">
          <p className="text-asa-gray">
            {filteredProducts?.length || 0} produto(s) encontrado(s)
          </p>
        </div>

        {filteredProducts && filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} onCopyId={handleCopyId} />
        ) : (
          <NoProductsFound />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Catalog;
