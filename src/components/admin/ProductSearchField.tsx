import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Package, X, AlertCircle } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useIsMobile } from '@/hooks/use-mobile';
import { ProductStatusBadge } from './ProductStatusBadge';

interface Product {
  id: string;
  name: string;
  sku?: string | null;
  status: string;
  images?: string[];
  description?: string;
  brand?: string;
  color?: string;
  size?: string;
  isFullyAvailable?: boolean;
  hasAvailableStatus?: boolean;
  isAvailableOnDate?: boolean;
  isAlreadyInCurrentRental?: boolean;
}

interface ProductSearchFieldProps {
  value?: string;
  onChange: (productId: string) => void;
  placeholder?: string;
  className?: string;
  availableProducts?: Product[];
  showAvailabilityOnly?: boolean;
}

export const ProductSearchField = ({
  value,
  onChange,
  placeholder = "Buscar produto por nome ou SKU...",
  className = "",
  availableProducts,
  showAvailabilityOnly = false
}: ProductSearchFieldProps) => {
  const isMobile = useIsMobile();
  const { data: allProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Usar produtos disponíveis se fornecidos, senão usar todos
  const products = availableProducts || allProducts || [];

  // Atualizar produto selecionado quando o value mudar externamente
  useEffect(() => {
    if (value && products.length > 0) {
      const product = products.find(p => p.id === value);
      setSelectedProduct(product || null);
      if (product) {
        setSearchTerm(product.name);
      }
    } else {
      setSelectedProduct(null);
      setSearchTerm('');
    }
  }, [value, products]);

  // Filtrar produtos conforme o usuário digita
  useEffect(() => {
    if (!searchTerm.trim() || products.length === 0) {
      setFilteredProducts([]);
      setShowSuggestions(false);
      return;
    }

    const searchLower = searchTerm.toLowerCase().trim();
         let filtered = products.filter(product => {
       const nameMatch = product.name.toLowerCase().includes(searchLower);
       const skuMatch = product.sku && product.sku.toLowerCase().includes(searchLower);
       return nameMatch || skuMatch;
     });

    // Se showAvailabilityOnly for true, mostrar apenas produtos disponíveis primeiro
    if (showAvailabilityOnly) {
      const available = filtered.filter(p => p.isFullyAvailable);
      const unavailable = filtered.filter(p => !p.isFullyAvailable);
      filtered = [...available, ...unavailable];
    }

    setFilteredProducts(filtered.slice(0, 10)); // Limitar a 10 resultados
    setShowSuggestions(filtered.length > 0 && searchTerm.length > 1);
  }, [searchTerm, products, showAvailabilityOnly]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Se limpar o campo, resetar seleção
    if (!term.trim()) {
      setSelectedProduct(null);
      onChange('');
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSearchTerm(product.name);
    setShowSuggestions(false);
    onChange(product.id);
  };

  const handleClearSelection = () => {
    setSelectedProduct(null);
    setSearchTerm('');
    setShowSuggestions(false);
    onChange('');
  };

  const getAvailabilityInfo = (product: Product) => {
    if (!product.isFullyAvailable) {
      if (!product.hasAvailableStatus) {
        return { text: 'Status indisponível', color: 'text-red-600' };
      } else if (!product.isAvailableOnDate) {
        return { text: 'Ocupado na data selecionada', color: 'text-orange-600' };
      }
      return { text: 'Indisponível', color: 'text-red-600' };
    }
    return { text: 'Disponível', color: 'text-green-600' };
  };

  return (
    <div className={`relative ${className}`}>
      {/* Campo de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`pl-10 ${selectedProduct ? 'pr-10' : ''}`}
          onFocus={() => {
            if (filteredProducts.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            // Delay para permitir clique nos resultados
            setTimeout(() => setShowSuggestions(false), 200);
          }}
        />
        {selectedProduct && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={handleClearSelection}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Produto selecionado */}
      {selectedProduct && (
        <Card className={`mt-2 ${selectedProduct.isFullyAvailable ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
          <CardContent className={`${isMobile ? 'p-2' : 'p-3'}`}>
            <div className={`flex items-start ${isMobile ? 'space-x-2' : 'space-x-3'}`}>
              {/* Imagem do produto (se houver) */}
              {selectedProduct.images && selectedProduct.images.length > 0 ? (
                <div className="flex-shrink-0">
                  <img
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.name}
                    className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} object-cover rounded border`}
                  />
                </div>
              ) : (
                <div className="flex-shrink-0">
                  <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-gray-100 rounded flex items-center justify-center`}>
                    <Package className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-gray-400`} />
                  </div>
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <p className={`${isMobile ? 'text-sm' : 'text-base'} font-medium ${selectedProduct.isFullyAvailable ? 'text-green-900' : 'text-orange-900'}`}>
                  {selectedProduct.name}
                </p>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} ${selectedProduct.isFullyAvailable ? 'text-green-700' : 'text-orange-700'} space-y-1`}>
                                     <p>SKU: {selectedProduct.sku || 'N/A'}</p>
                  {selectedProduct.brand && <p>Marca: {selectedProduct.brand}</p>}
                  {selectedProduct.size && <p>Tamanho: {selectedProduct.size}</p>}
                  {selectedProduct.color && <p>Cor: {selectedProduct.color}</p>}
                  
                  <div className="flex items-center gap-2 mt-2">
                    <ProductStatusBadge status={selectedProduct.status as 'available' | 'rented' | 'maintenance'} />
                    {showAvailabilityOnly && (
                      <span className={`text-xs font-medium ${getAvailabilityInfo(selectedProduct).color}`}>
                        {getAvailabilityInfo(selectedProduct).text}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de sugestões */}
      {showSuggestions && filteredProducts.length > 0 && (
        <Card className={`absolute top-full left-0 right-0 z-50 mt-1 ${isMobile ? 'max-h-60' : 'max-h-80'} overflow-y-auto border shadow-lg`}>
          <CardContent className="p-0">
            {filteredProducts.map((product) => {
              const isUnavailable = showAvailabilityOnly && !product.isFullyAvailable;
              const availabilityInfo = showAvailabilityOnly ? getAvailabilityInfo(product) : null;
              
              return (
                <button
                  key={product.id}
                  type="button"
                  className={`w-full text-left ${isMobile ? 'p-2' : 'p-3'} hover:bg-muted border-b last:border-b-0 transition-colors touch-manipulation ${isUnavailable ? 'opacity-60' : ''}`}
                  onClick={() => handleProductSelect(product)}
                >
                  <div className={`flex items-start ${isMobile ? 'space-x-2' : 'space-x-3'}`}>
                    {/* Imagem do produto */}
                    {product.images && product.images.length > 0 ? (
                      <div className="flex-shrink-0">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} object-cover rounded border`}
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0">
                        <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} bg-blue-100 rounded flex items-center justify-center`}>
                          <Package className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-blue-600`} />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-900 ${isUnavailable ? 'line-through' : ''}`}>
                        {product.name}
                      </p>
                      <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-500 ${isMobile ? 'space-y-0' : 'space-y-1'}`}>
                                                 <p>SKU: {product.sku || 'N/A'}</p>
                        {!isMobile && product.brand && <p>Marca: {product.brand}</p>}
                        
                        <div className="flex items-center gap-2 mt-1">
                          <ProductStatusBadge status={product.status as 'available' | 'rented' | 'maintenance'} />
                          {availabilityInfo && (
                            <span className={`text-xs font-medium ${availabilityInfo.color}`}>
                              {availabilityInfo.text}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Mensagem quando não encontrar resultados */}
      {showSuggestions && filteredProducts.length === 0 && searchTerm.length > 2 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 border shadow-lg">
          <CardContent className={`${isMobile ? 'p-3' : 'p-4'} text-center ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>Nenhum produto encontrado com "{searchTerm}"</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 