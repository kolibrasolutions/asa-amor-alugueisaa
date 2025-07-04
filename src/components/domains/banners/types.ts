export interface Banner {
  id: string;
  image_url: string;
  title: string;
  subtitle: string;
  active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface BannerFormData {
  title: string;
  subtitle: string;
  image_file?: File;
}

export interface BannerImageCropProps {
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageBlob: Blob) => void;
  imageFile: File;
}

export interface BannerListProps {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
  onReorder: (banners: Banner[]) => void;
}

export interface BannerFormProps {
  banner?: Banner;
  onSubmit: (data: BannerFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
} 