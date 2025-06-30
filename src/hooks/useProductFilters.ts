import { useState, useMemo } from 'react';
import { Product } from '@/hooks/useProducts';
import { useColors } from '@/hooks/useColors';
import { useSizes } from '@/hooks/useSizes';

export const useProductFilters = (products: Product[] | undefined) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  
  const { data: colors } = useColors();
  const { data: sizes } = useSizes();

  // Obter cores disponíveis dos produtos
  const availableColors = useMemo(() => {
    if (!products || !colors) return [];
    
    const colorsInProducts = products
      .map(product => product.color)
      .filter(Boolean)
      .filter((color, index, array) => array.indexOf(color) === index);
    
    return colors.filter(color => 
      colorsInProducts.includes(color.value)
    );
  }, [products, colors]);

  // Obter tamanhos disponíveis dos produtos
  const availableSizes = useMemo(() => {
    if (!products || !sizes) return [];
    
    const sizesInProducts = products
      .map(product => product.size)
      .filter(Boolean)
      .filter((size, index, array) => array.indexOf(size) === index);
    
    return sizes.filter(size => 
      sizesInProducts.includes(size.value)
    );
  }, [products, sizes]);

  const filteredProducts = useMemo(() => {
    return products?.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
      
      const matchesColor = selectedColor === 'all' || product.color === selectedColor;
      
      const matchesSize = selectedSize === 'all' || product.size === selectedSize;

      return matchesSearch && matchesCategory && matchesColor && matchesSize;
    });
  }, [products, searchTerm, selectedCategory, selectedColor, selectedSize]);

  return {
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
  };
};
