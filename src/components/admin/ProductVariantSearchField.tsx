import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Package, X, AlertCircle, ArrowRight } from 'lucide-react';
import { useBaseProducts, useProductVariants, type Product } from '@/hooks/useProducts';
import { useIsMobile } from '@/hooks/use-mobile';
import { ProductStatusBadge } from './ProductStatusBadge';
import { Badge } from '@/components/ui/badge';

interface ProductVariantSearchFieldProps {
  value?: string;
  onChange: (productVariantId: string) => void;
  placeholder?: string;
  className?: string;
  availableProducts?: Product[]; // Produtos base (sem variações)
  allAvailableProducts?: Product[]; // Array completo incluindo variações para verificação
  showAvailabilityOnly?: boolean;
}

export const ProductVariantSearchField = ({
  value,
  onChange,
  placeholder = "Buscar produto por nome ou SKU...",
  className = "",
  availableProducts,
  allAvailableProducts,
  showAvailabilityOnly = false
}: ProductVariantSearchFieldProps) => {
  const isMobile = useIsMobile();
  const { data: allBaseProducts } = useBaseProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBaseProduct, setSelectedBaseProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Product | null>(null);
  const [showBaseSuggestions, setShowBaseSuggestions] = useState(false);
  const [showVariantSelection, setShowVariantSelection] = useState(false);
  const [filteredBaseProducts, setFilteredBaseProducts] = useState<Product[]>([]);
  
  // Ref para evitar loops infinitos
  const isUpdatingFromExternal = useRef(false);

  // Usar produtos base disponíveis se fornecidos, senão usar todos
  const baseProducts = availableProducts?.filter(p => !p.is_variant) || allBaseProducts || [];
  
  // Buscar variações do produto selecionado
  const { data: variants } = useProductVariants(selectedBaseProduct?.id || '');

  // Filtrar variações disponíveis
  const availableVariants = variants?.filter(variant => {
    if (!showAvailabilityOnly) return true;
    
    // Verificar se a variação está disponível no array completo
    const variantInAvailable = (allAvailableProducts || availableProducts)?.find(p => p.id === variant.id);
    return variantInAvailable?.isFullyAvailable !== false;
  }) || [];



  // Efeito para decidir se mostra seleção de variantes após carregar
  useEffect(() => {
    if (selectedBaseProduct && variants !== undefined) {
      if (!variants || variants.length === 0) {
        // Produto simples - selecionar diretamente
        setSelectedVariant(selectedBaseProduct);
        setShowVariantSelection(false);
        onChange(selectedBaseProduct.id);
      } else {
        // Produto com variações - mostrar seleção APENAS se não há variação selecionada
        if (!selectedVariant) {
          setShowVariantSelection(true);
        }
      }
    }
  }, [selectedBaseProduct, variants, onChange, selectedVariant]);

  // Atualizar seleção quando o value mudar externamente
  useEffect(() => {
    if (isUpdatingFromExternal.current) return;
    
    isUpdatingFromExternal.current = true;
    
    if (value && availableProducts) {
      const selectedProduct = availableProducts.find(p => p.id === value);
      if (selectedProduct) {
        setSelectedVariant(selectedProduct);
        if (selectedProduct.parent_product_id) {
          const baseProduct = availableProducts.find(p => p.id === selectedProduct.parent_product_id);
          setSelectedBaseProduct(baseProduct || null);
          const newSearchTerm = baseProduct?.name || '';
          if (searchTerm !== newSearchTerm) {
            setSearchTerm(newSearchTerm);
          }
        } else {
          setSelectedBaseProduct(selectedProduct);
          const newSearchTerm = selectedProduct.name;
          if (searchTerm !== newSearchTerm) {
            setSearchTerm(newSearchTerm);
          }
        }
      }
    } else if (!value) {
      // Reset completo quando value é limpo
      setSelectedVariant(null);
      setSelectedBaseProduct(null);
      setShowVariantSelection(false);
      setShowBaseSuggestions(false);
      setFilteredBaseProducts([]);
      if (searchTerm !== '') {
        setSearchTerm('');
      }
    }
    
    // Resetar flag após um tick
    setTimeout(() => {
      isUpdatingFromExternal.current = false;
    }, 0);
  }, [value, availableProducts]);

  // Filtrar produtos base conforme o usuário digita
  useEffect(() => {
    if (isUpdatingFromExternal.current) return;
    
    if (!searchTerm.trim() || baseProducts.length === 0) {
      setFilteredBaseProducts(prev => prev.length > 0 ? [] : prev);
      setShowBaseSuggestions(prev => prev ? false : prev);
      return;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    let filtered = baseProducts.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(searchLower);
      const skuMatch = product.sku && product.sku.toLowerCase().includes(searchLower);
      const baseSkuMatch = product.base_sku && product.base_sku.toLowerCase().includes(searchLower);
      return nameMatch || skuMatch || baseSkuMatch;
    });

    const newFiltered = filtered.slice(0, 10);
    const newShowSuggestions = filtered.length > 0 && searchTerm.length > 1;
    
    setFilteredBaseProducts(prev => 
      JSON.stringify(prev) !== JSON.stringify(newFiltered) ? newFiltered : prev
    );
    setShowBaseSuggestions(prev => prev !== newShowSuggestions ? newShowSuggestions : prev);
  }, [searchTerm, baseProducts]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    
    if (term !== searchTerm) {
      setSearchTerm(term);
      
      // Resetar seleções se limpar o campo
      if (!term.trim()) {
        setSelectedBaseProduct(null);
        setSelectedVariant(null);
        setShowVariantSelection(false);
        onChange('');
      }
    }
  };

  const handleBaseProductSelect = (product: Product) => {
    setSelectedBaseProduct(product);
    setSearchTerm(product.name);
    setShowBaseSuggestions(false);
    
    // Resetar estado de variação enquanto carrega as novas
    setShowVariantSelection(false);
    setSelectedVariant(null);
  };

  const handleVariantSelect = (variant: Product) => {
    setSelectedVariant(variant);
    setShowVariantSelection(false);
    onChange(variant.id);
  };

  const handleClearSelection = () => {
    setSelectedBaseProduct(null);
    setSelectedVariant(null);
    setSearchTerm('');
    setShowBaseSuggestions(false);
    setShowVariantSelection(false);
    setFilteredBaseProducts([]);
    onChange('');
  };

  const getAvailabilityInfo = (product: Product) => {
    if (!showAvailabilityOnly) return null;
    
    const availableProduct = (allAvailableProducts || availableProducts)?.find(p => p.id === product.id);
    if (!availableProduct?.isFullyAvailable) {
      if (availableProduct?.isOverdue) {
        return { text: 'Em atraso', color: 'text-red-600' };
      } else if (!availableProduct?.hasAvailableStatus) {
        return { text: 'Status indisponível', color: 'text-red-600' };
      } else if (!availableProduct?.isAvailableOnDate) {
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
          className={`pl-10 ${selectedVariant ? 'pr-10' : ''}`}
          onFocus={() => {
            if (filteredBaseProducts.length > 0) {
              setShowBaseSuggestions(true);
            }
          }}
          onBlur={() => {
            setTimeout(() => setShowBaseSuggestions(false), 200);
          }}
        />
        {selectedVariant && (
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

      {/* Produto base selecionado */}
      {selectedBaseProduct && (!showVariantSelection || selectedVariant) && (
        <Card className={`mt-2 ${selectedVariant ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}`}>
          <CardContent className={`${isMobile ? 'p-2' : 'p-3'}`}>
            <div className={`flex items-start ${isMobile ? 'space-x-2' : 'space-x-3'}`}>
              {/* Imagem do produto */}
              {selectedBaseProduct.images && selectedBaseProduct.images.length > 0 ? (
                <div className="flex-shrink-0">
                  <img
                    src={selectedBaseProduct.images[0]}
                    alt={selectedBaseProduct.name}
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
                <p className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-gray-900`}>
                  {selectedBaseProduct.name}
                </p>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 space-y-1`}>
                  <p>SKU Base: {selectedBaseProduct.base_sku || selectedBaseProduct.sku || 'N/A'}</p>
                  {selectedBaseProduct.brand && <p>Marca: {selectedBaseProduct.brand}</p>}
                  
                  {selectedVariant && (
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">Tamanho: {selectedVariant.size}</Badge>
                      <ProductStatusBadge status={selectedVariant.status as 'available' | 'rented' | 'maintenance'} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seleção de variantes */}
      {/* Seleção de variantes */}
      {showVariantSelection && selectedBaseProduct && (
        <Card className="mt-2 border-blue-200 bg-blue-50">
          <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-blue-600" />
                <p className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-blue-900`}>
                  {isMobile ? `👆 Toque no tamanho para "${selectedBaseProduct.name}"` : `Selecione o tamanho para "${selectedBaseProduct.name}"`}
                </p>
              </div>
              
              {availableVariants.length === 0 ? (
                <p className="text-sm text-gray-600">
                  Nenhuma variação disponível para este produto.
                </p>
              ) : (
                <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'}`}>
                  {availableVariants.map((variant) => {
                    const availabilityInfo = getAvailabilityInfo(variant);
                    const isUnavailable = availabilityInfo && availabilityInfo.text !== 'Disponível';
                    
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleVariantSelect(variant);
                    }}
                        disabled={isUnavailable}
                        className={`${isMobile ? 'p-4 min-h-[60px]' : 'p-3'} border rounded-lg text-left transition-colors hover:bg-white ${
                          isUnavailable ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-300 active:bg-blue-50'
                        } ${isMobile ? 'touch-manipulation' : ''}`}
                      >
                        <div className="space-y-1">
                          <p className={`font-medium ${isMobile ? 'text-lg' : 'text-sm'} text-center`}>
                            Tamanho {variant.size}
                          </p>
                          <div className="flex items-center gap-1">
                            <ProductStatusBadge status={variant.status as 'available' | 'rented' | 'maintenance'} />
                          </div>
                          {availabilityInfo && (
                            <p className={`text-xs ${availabilityInfo.color}`}>
                              {availabilityInfo.text}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de sugestões de produtos base */}
      {showBaseSuggestions && filteredBaseProducts.length > 0 && (
        <Card className={`absolute top-full left-0 right-0 z-50 mt-1 ${isMobile ? 'max-h-60' : 'max-h-80'} overflow-y-auto border shadow-lg`}>
          <CardContent className="p-0">
            {filteredBaseProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                className={`w-full text-left ${isMobile ? 'p-2' : 'p-3'} hover:bg-muted border-b last:border-b-0 transition-colors touch-manipulation`}
                onClick={() => handleBaseProductSelect(product)}
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
                    <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-900`}>
                      {product.name}
                    </p>
                    <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-500 ${isMobile ? 'space-y-0' : 'space-y-1'}`}>
                      <p>SKU: {product.base_sku || product.sku || 'N/A'}</p>
                      {!isMobile && product.brand && <p>Marca: {product.brand}</p>}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Mensagem quando não encontrar resultados */}
      {showBaseSuggestions && filteredBaseProducts.length === 0 && searchTerm.length > 2 && (
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