
import { useState, useMemo } from 'react';
import { Product } from '@/hooks/useProducts';

export const useProductFilters = (products: Product[] | undefined) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    return products?.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;

      const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;

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
  }, [products, searchTerm, selectedCategory, selectedStatus, priceRange]);

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    priceRange,
    setPriceRange,
    filteredProducts,
  };
};
