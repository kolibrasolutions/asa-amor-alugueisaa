import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { Category } from '@/hooks/useCategories';
import { Color } from '@/hooks/useColors';
import { Size } from '@/hooks/useSizes';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface CatalogFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedColor: string;
  setSelectedColor: (value: string) => void;
  selectedSize: string;
  setSelectedSize: (value: string) => void;
  categories: Category[] | undefined;
  availableColors: Color[];
  availableSizes: Size[];
}

const CatalogFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  categories,
  availableColors,
  availableSizes
}: CatalogFiltersProps) => {
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedColor('all');
    setSelectedSize('all');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedColor !== 'all' || selectedSize !== 'all' || searchTerm;

  const FilterContent = () => (
    <div className="space-y-4 lg:space-y-6">
      {/* Cabeçalho dos filtros - apenas para desktop */}
      <div className="hidden lg:flex items-center justify-between">
        <h3 className="text-lg font-semibold text-asa-dark">Filtros</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-asa-dark hover:bg-asa-blush/20"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      {/* Busca por texto */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block lg:block hidden">
          Buscar produtos
        </label>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5 lg:h-4 lg:w-4 lg:left-3" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 lg:pl-10 bg-white/50 focus:bg-white h-8 lg:h-10 text-sm"
          />
        </div>
      </div>

      {/* Filtro por categoria */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Categoria
        </label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma categoria" />
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
      </div>

      {/* Filtro por cor */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Cor
        </label>
        <Select value={selectedColor} onValueChange={setSelectedColor}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma cor">
              {selectedColor !== 'all' && (
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ 
                      backgroundColor: availableColors.find(c => c.value === selectedColor)?.hex_code || '#9CA3AF' 
                    }}
                  />
                  {availableColors.find(c => c.value === selectedColor)?.name}
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as cores</SelectItem>
            {availableColors.map((color) => (
              <SelectItem key={color.value} value={color.value}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.hex_code }}
                  />
                  {color.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
              </div>

        {/* Filtro por tamanho */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Tamanho
          </label>
          <Select value={selectedSize} onValueChange={setSelectedSize}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um tamanho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tamanhos</SelectItem>
              {availableSizes.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro visual de tamanhos */}
        {availableSizes.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Filtro rápido por tamanho
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedSize('all')}
                className={`px-2 py-2 text-xs rounded-lg border transition-all text-center ${
                  selectedSize === 'all'
                    ? 'bg-asa-dark text-white border-asa-dark'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-asa-dark'
                }`}
              >
                Todos
              </button>
              {availableSizes.slice(0, 8).map((size) => (
                <button
                  key={size.value}
                  onClick={() => setSelectedSize(size.value)}
                  className={`px-2 py-2 text-xs rounded-lg border transition-all text-center ${
                    selectedSize === size.value
                      ? 'bg-asa-dark text-white border-asa-dark'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-asa-dark'
                  }`}
                  title={size.name}
                >
                  {size.name}
                </button>
              ))}
              {availableSizes.length > 8 && (
                <div className="col-span-3 text-xs text-gray-500 text-center mt-1">
                  +{availableSizes.length - 8} outros tamanhos disponíveis no dropdown
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filtro visual de cores */}
      {availableColors.length > 0 && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Filtro rápido por cor
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedColor('all')}
              className={`px-3 py-2 text-xs rounded-lg border transition-all text-center ${
                selectedColor === 'all'
                  ? 'bg-asa-dark text-white border-asa-dark'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-asa-dark'
              }`}
            >
              Todas
            </button>
            {availableColors.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                className={`flex items-center gap-2 px-3 py-2 text-xs rounded-lg border transition-all ${
                  selectedColor === color.value
                    ? 'bg-asa-dark text-white border-asa-dark'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-asa-dark'
                }`}
                title={color.name}
              >
                <div 
                  className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: color.hex_code }}
                />
                <span className="truncate">{color.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Indicador de filtros ativos */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Filtros ativos:</p>
          <div className="space-y-1 text-xs">
            {searchTerm && (
              <div className="bg-asa-blush/20 text-asa-dark px-2 py-1 rounded">
                Busca: "{searchTerm}"
              </div>
            )}
            {selectedCategory !== 'all' && (
              <div className="bg-asa-blush/20 text-asa-dark px-2 py-1 rounded">
                Categoria: {categories?.find(c => c.id === selectedCategory)?.name}
              </div>
            )}
            {selectedColor !== 'all' && (
              <div className="bg-asa-blush/20 text-asa-dark px-2 py-1 rounded flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: availableColors.find(c => c.value === selectedColor)?.hex_code }}
                />
                {availableColors.find(c => c.value === selectedColor)?.name}
              </div>
            )}
            {selectedSize !== 'all' && (
              <div className="bg-asa-blush/20 text-asa-dark px-2 py-1 rounded">
                Tamanho: {availableSizes.find(s => s.value === selectedSize)?.name}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Sidebar para desktop */}
      <div className="hidden lg:block w-80 bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6">
        <FilterContent />
      </div>

      {/* Sheet para mobile */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full bg-white/95 backdrop-blur-sm shadow-sm border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>Filtrar</span>
              </div>
              {hasActiveFilters && (
                <span className="bg-asa-dark text-white text-xs px-2 py-0.5 rounded-full">
                  {[searchTerm, selectedCategory !== 'all', selectedColor !== 'all', selectedSize !== 'all'].filter(Boolean).length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px] lg:w-[400px] pt-0">
            <div className="sticky top-0 bg-white pt-4 pb-3 -mx-6 px-6 border-b">
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-base">Filtros</SheetTitle>
                  {hasActiveFilters && (
                    <Button 
                      onClick={clearFilters}
                      variant="outline"
                      size="sm"
                      className="text-xs text-asa-dark border-asa-dark/20 h-7 px-2"
                    >
                      Limpar
                    </Button>
                  )}
                </div>
              </SheetHeader>
            </div>
            <div className="mt-4 overflow-y-auto">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default CatalogFilters;
