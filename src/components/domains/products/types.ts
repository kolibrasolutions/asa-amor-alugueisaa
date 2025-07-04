export interface Product {
  id: string;
  name: string;
  description?: string;
  category_id: string;
  price: number;
  images: string[];
  colors: string[];
  sizes: string[];
  status: 'available' | 'rented' | 'maintenance';
  created_at?: string;
  updated_at?: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  category_id: string;
  price: number;
  images: (string | Blob)[];
  colors: string[];
  sizes: string[];
  status: 'available' | 'rented' | 'maintenance';
}

export interface ProductImageCropProps {
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageBlob: Blob) => void;
  imageFile: File;
}

export interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onView: (product: Product) => void;
}

export interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface ProductFilters {
  category?: string;
  status?: string;
  search?: string;
} 