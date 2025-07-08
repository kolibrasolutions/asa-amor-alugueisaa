export interface HeroImage {
  id: string;
  image_url: string;
  title?: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroImageFormData {
  title?: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
}

export interface HeroImageCropData {
  x: number;
  y: number;
  width: number;
  height: number;
  unit: 'px' | '%';
}

export interface HeroImageUploadData {
  file: File;
  cropData: HeroImageCropData;
  formData: HeroImageFormData;
} 