import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Copy } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const { toast } = useToast();

  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const handleCopyId = (id: string, name:string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "Código copiado!",
      description: `O código do produto "${name}" foi copiado.`,
    });
  };

  const filteredProducts = products?.filter(product => {
    // Filtro por busca
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por categoria
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;

    // Filtro por status
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;

    // Filtro por preço
    let matchesPrice = true;
    if (priceRange !== 'all' && product.rental_price) {
      const price = Number(product.rental_price);
      switch (priceRange) {
        case 'low':
          matchesPrice = price < 100;
          break;
        case 'medium':
          matchesPrice = price >= 100 && price < 300;
          break;
        case 'high':
          matchesPrice = price >= 300;
          break;
      }
    }

    return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'rented':
        return 'bg-yellow-100 text-yellow-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponível';
      case 'rented':
        return 'Alugado';
      case 'maintenance':
        return 'Manutenção';
      default:
        return status;
    }
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-asa-dark mb-4">
            Catálogo de Produtos
          </h1>
          <p className="text-lg text-asa-gray max-w-2xl mx-auto">
            Explore nossa coleção completa de vestidos e trajes para ocasiões especiais
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="available">Disponível</SelectItem>
                <SelectItem value="rented">Alugado</SelectItem>
                <SelectItem value="maintenance">Manutenção</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Preço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os preços</SelectItem>
                <SelectItem value="low">Até R$ 100</SelectItem>
                <SelectItem value="medium">R$ 100 - R$ 300</SelectItem>
                <SelectItem value="high">Acima de R$ 300</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-6">
          <p className="text-asa-gray">
            {filteredProducts?.length || 0} produto(s) encontrado(s)
          </p>
        </div>

        {/* Grid de produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts?.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div className="aspect-[3/4] overflow-hidden rounded-t-lg">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Sem imagem</span>
                  </div>
                )}
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-serif line-clamp-1">
                    {product.name}
                  </CardTitle>
                  <Badge className={getStatusColor(product.status || 'available')}>
                    {getStatusLabel(product.status || 'available')}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 flex flex-col flex-grow">
                <div className="flex-grow">
                  {product.description && (
                    <p className="text-sm text-asa-gray mb-2 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="space-y-1 text-sm">
                    {product.brand && (
                      <p><span className="font-medium">Marca:</span> {product.brand}</p>
                    )}
                    {product.size && (
                      <p><span className="font-medium">Tamanho:</span> {product.size}</p>
                    )}
                    {product.color && (
                      <p><span className="font-medium">Cor:</span> {product.color}</p>
                    )}
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <p className="text-asa-gray">Código do produto</p>
                        <p className="font-mono text-xs text-gray-500" title={product.sku || product.id}>
                          {product.sku || `${product.id.substring(0, 8)}...`}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-600 hover:text-gray-900"
                        onClick={() => handleCopyId(product.sku || product.id, product.name)}
                        title="Copiar código"
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copiar código</span>
                      </Button>
                    </div>

                    {product.rental_price && (
                      <div className="mt-2">
                        <p className="text-lg font-bold text-asa-blush">
                          R$ {Number(product.rental_price).toFixed(2)}
                          <span className="text-sm font-normal text-asa-gray ml-1">
                            /aluguel
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <Button className="w-full mt-4" variant="outline">
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts?.length === 0 && (
          <div className="text-center py-12">
            <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-500">
              Tente ajustar os filtros para encontrar o que procura.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Catalog;
