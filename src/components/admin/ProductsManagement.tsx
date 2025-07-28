import { useState } from 'react';
import { useProductsWithVariantsForInventory, useDeleteProduct, useUpdateProductQuantity, type Product } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ProductForm } from './ProductForm';
import { ProductStatusBadge } from './ProductStatusBadge';
import { Plus, Edit, Trash, Package, ChevronDown, ChevronRight, Minus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminBackButton } from './AdminHeader';
import { useIsMobile } from '@/hooks/use-mobile';

export const ProductsManagement = () => {
  const isMobile = useIsMobile();
  const { data: products, isLoading } = useProductsWithVariantsForInventory();
  const deleteProduct = useDeleteProduct();
  const updateQuantity = useUpdateProductQuantity();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (productId: string) => {
    deleteProduct.mutate(productId);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const toggleExpanded = (productId: string) => {
    setExpandedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity >= 0) {
      updateQuantity.mutate({ productId, quantity });
    }
  };

  if (showForm) {
    return (
      <ProductForm
        product={editingProduct}
        onClose={handleCloseForm}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="text-center">Carregando produtos...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* CSS específico para mobile - controles de quantidade */}
      {isMobile && (
        <style>{`
          .quantity-controls {
            max-width: 120px;
            overflow: visible;
          }
          .quantity-controls button {
            flex-shrink: 0;
            min-width: 32px;
            min-height: 32px;
          }
          .quantity-controls span {
            flex-shrink: 0;
            min-width: 24px;
          }
        `}</style>
      )}
      <AdminBackButton />
      
      {/* Header Section */}
      <div className={`${isMobile ? 'space-y-4' : 'flex justify-between items-center'}`}>
        <div>
          <h2 className={`font-semibold ${isMobile ? 'text-xl' : 'text-2xl'}`}>
            {isMobile ? 'Estoque' : 'Gestão de Estoque'}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Gerencie produtos e quantidades em estoque
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className={`${isMobile ? 'w-full' : ''}`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
        <Card>
          <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
            <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-green-600`}>
              {products?.length || 0}
            </div>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
              {isMobile ? 'Produtos' : 'Total de Produtos'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
            <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-blue-600`}>
              {products?.reduce((acc, p) => acc + (p.variants?.length || 0), 0) || 0}
            </div>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>Variações</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
            <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-purple-600`}>
              {products?.reduce((acc, p) => {
                const baseQty = p.quantity || 0;
                const variantsQty = p.variants?.reduce((vAcc, v) => vAcc + (v.quantity || 0), 0) || 0;
                return acc + baseQty + variantsQty;
              }, 0) || 0}
            </div>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
              {isMobile ? 'Unidades' : 'Total Unidades'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
            <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-orange-600`}>
              {products?.filter(p => {
                const hasLowStock = (p.quantity || 0) <= 1;
                const hasVariantsLowStock = p.variants?.some(v => (v.quantity || 0) <= 1);
                return hasLowStock || hasVariantsLowStock;
              }).length || 0}
            </div>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
              {isMobile ? 'Baixo Estoque' : 'Estoque Baixo'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      <Card>
        <CardHeader className={`${isMobile ? 'pb-3' : ''}`}>
          <div className={`${isMobile ? 'space-y-3' : 'flex justify-between items-center'}`}>
            <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'}`}>
              Produtos em Estoque
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className={`${isMobile ? 'p-4 pt-0' : 'p-6'}`}>
          {!products || products.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Nenhum produto cadastrado ainda.
            </p>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <Card key={product.id} className={`border ${isMobile ? 'overflow-hidden' : ''}`}>
                  <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
                    {/* Produto pai */}
                    <div className={`${isMobile ? 'space-y-3' : 'flex items-center justify-between'}`}>
                      <div className={`${isMobile ? 'space-y-2' : 'flex items-center gap-3'}`}>
                        <div className={`${isMobile ? 'flex items-center gap-2' : 'flex items-center gap-3'}`}>
                          {product.variants && product.variants.length > 0 ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpanded(product.id)}
                              className="h-8 w-8 p-0"
                            >
                              {expandedProducts.has(product.id) ? 
                                <ChevronDown className="h-4 w-4" /> : 
                                <ChevronRight className="h-4 w-4" />
                              }
                            </Button>
                          ) : (
                            /* Espaço em branco para alinhamento quando não há botão */
                            <div className="h-8 w-8" />
                          )}
                          <Package className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-blue-600`} />
                          <div className="flex-1">
                            <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>
                              {product.name}
                            </h3>
                            {!isMobile && (
                              <p className="text-sm text-gray-600">
                                SKU: {product.sku || 'N/A'} • 
                                {product.variants && product.variants.length > 0 
                                  ? ` ${product.variants.length} variações` 
                                  : ' Produto simples'
                                }
                              </p>
                            )}
                          </div>
                        </div>
                        {isMobile && (
                          <div className="text-xs text-gray-500 ml-12">
                            SKU: {product.sku || 'N/A'} • 
                            {product.variants && product.variants.length > 0 
                              ? `${product.variants.length} variações` 
                              : 'Produto simples'
                            }
                          </div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className={`${isMobile ? 'flex justify-end gap-2 pt-2 border-t' : 'flex items-center gap-2'}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          className={isMobile ? 'text-xs px-3 py-1' : ''}
                        >
                          <Edit className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4'}`} />
                          {isMobile && 'Editar'}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className={`text-red-600 ${isMobile ? 'text-xs px-3 py-1' : ''}`}
                            >
                              <Trash className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4'}`} />
                              {isMobile && 'Excluir'}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza de que deseja excluir "{product.name}" e todas as suas variações?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(product.id)}
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    {/* Variações (quando expandido) */}
                    {expandedProducts.has(product.id) && product.variants && product.variants.length > 0 && (
                      <div className={`mt-4 ${isMobile ? 'ml-4' : 'ml-8'} space-y-2`}>
                        <h4 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-700 mb-3`}>
                          {isMobile ? 'Tamanhos:' : 'Variações de Tamanho:'}
                        </h4>
                        <div className={`${isMobile ? 'grid grid-cols-1 gap-2' : 'space-y-2'}`}>
                          {product.variants.map((variant) => (
                            <div key={variant.id} className={`${isMobile ? 'p-3 bg-gray-50 rounded-lg' : 'flex items-center justify-between p-3 bg-gray-50 rounded-lg'}`}>
                              {isMobile ? (
                                /* Mobile: Layout em linha simples */
                                                                  <div className="flex items-center justify-between w-full">
                                    <span className="text-sm font-medium flex-shrink-0">Tamanho {variant.size}</span>
                                    <div className="flex items-center gap-1 flex-shrink-0 quantity-controls">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleQuantityChange(variant.id, (variant.quantity || 1) - 1)}
                                      disabled={!variant.quantity || variant.quantity <= 0}
                                      className="h-8 w-8 p-0 touch-manipulation flex-shrink-0"
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="text-sm font-medium min-w-[24px] text-center px-1">
                                      {variant.quantity || 0}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleQuantityChange(variant.id, (variant.quantity || 0) + 1)}
                                      className="h-8 w-8 p-0 touch-manipulation flex-shrink-0"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                /* Desktop: Layout completo */
                                <>
                                  <div className="flex items-center gap-3">
                                    <div className="text-sm">
                                      <span className="font-medium">Tamanho {variant.size}</span>
                                      <div className="flex items-center gap-2 mt-1">
                                        <ProductStatusBadge status={variant.status as 'available' | 'rented' | 'maintenance'} />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleQuantityChange(variant.id, (variant.quantity || 1) - 1)}
                                        disabled={!variant.quantity || variant.quantity <= 0}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Minus className="h-3 w-3" />
                                      </Button>
                                      <Input
                                        type="number"
                                        value={variant.quantity || 0}
                                        onChange={(e) => handleQuantityChange(variant.id, parseInt(e.target.value) || 0)}
                                        className="w-16 h-8 text-center"
                                        min="0"
                                      />
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleQuantityChange(variant.id, (variant.quantity || 0) + 1)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    <span className="text-sm text-gray-600 min-w-[60px]">
                                      {variant.quantity || 0} unid.
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Produto simples - mostrar quantidade direta */}
                    {(!product.variants || product.variants.length === 0) && (
                      <div className={`mt-3 ${isMobile ? 'ml-4' : 'ml-8'} ${isMobile ? 'p-3 bg-gray-50 rounded-lg' : 'flex items-center gap-2'}`}>
                        {isMobile ? (
                          /* Mobile: Layout compacto */
                                                      <div className="flex items-center justify-between w-full">
                              <span className="text-sm text-gray-600 flex-shrink-0">Quantidade:</span>
                              <div className="flex items-center gap-1 flex-shrink-0 quantity-controls">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuantityChange(product.id, (product.quantity || 1) - 1)}
                                  disabled={!product.quantity || product.quantity <= 0}
                                  className="h-8 w-8 p-0 touch-manipulation flex-shrink-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-sm font-medium min-w-[24px] text-center px-1">
                                  {product.quantity || 0}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuantityChange(product.id, (product.quantity || 0) + 1)}
                                  className="h-8 w-8 p-0 touch-manipulation flex-shrink-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                        ) : (
                          /* Desktop: Layout completo */
                          <>
                            <span className="text-sm text-gray-600">Quantidade:</span>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(product.id, (product.quantity || 1) - 1)}
                                disabled={!product.quantity || product.quantity <= 0}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                value={product.quantity || 0}
                                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)}
                                className="w-16 h-8 text-center"
                                min="0"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(product.id, (product.quantity || 0) + 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <span className="text-sm text-gray-600">
                              {product.quantity || 0} unid.
                            </span>
                            <ProductStatusBadge status={product.status as 'available' | 'rented' | 'maintenance'} />
                          </>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
