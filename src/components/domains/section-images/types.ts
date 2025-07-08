export interface SectionImageConfig {
  id: string;
  name: string;
  description: string;
  aspectRatio: number; // width/height
  maxImages: number;
  allowMultiple: boolean;
  cropSettings: {
    aspectRatio: number;
    minWidth?: number;
    minHeight?: number;
    quality?: number;
  };
}

export interface SectionImage {
  id: string;
  section_id: string;
  image_url: string;
  title?: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SectionImageFormData {
  title?: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
}

export interface SectionImageCropData {
  x: number;
  y: number;
  width: number;
  height: number;
  unit: 'px' | '%';
}

export interface SectionImageUploadData {
  file: File;
  sectionId: string;
  cropData: SectionImageCropData;
  formData: SectionImageFormData;
}

// Configurações das seções do site
export const SECTION_CONFIGS: Record<string, SectionImageConfig> = {
  hero: {
    id: 'hero',
    name: 'Hero Principal',
    description: 'Imagem principal da página inicial',
    aspectRatio: 16 / 9,
    maxImages: 5,
    allowMultiple: true,
    cropSettings: {
      aspectRatio: 16 / 9,
      minWidth: 1920,
      minHeight: 1080,
      quality: 0.9,
    },
  },
  client_gallery: {
    id: 'client_gallery',
    name: 'Galeria de Clientes',
    description: 'Fotos dos casais que usaram nossos serviços',
    aspectRatio: 1, // quadrado
    maxImages: 20,
    allowMultiple: true,
    cropSettings: {
      aspectRatio: 1,
      minWidth: 500,
      minHeight: 500,
      quality: 0.8,
    },
  },
  whatsapp_section: {
    id: 'whatsapp_section',
    name: 'Seção WhatsApp',
    description: 'Imagem que aparece ao lado do botão do WhatsApp',
    aspectRatio: 4 / 3,
    maxImages: 1,
    allowMultiple: false,
    cropSettings: {
      aspectRatio: 4 / 3,
      minWidth: 800,
      minHeight: 600,
      quality: 0.9,
    },
  },
  about_section: {
    id: 'about_section',
    name: 'Seção Sobre',
    description: 'Imagens das seções "Sobre" e informativas',
    aspectRatio: 4 / 3,
    maxImages: 3,
    allowMultiple: true,
    cropSettings: {
      aspectRatio: 4 / 3,
      minWidth: 800,
      minHeight: 600,
      quality: 0.9,
    },
  },
  categories_section: {
    id: 'categories_section',
    name: 'Seção Categorias',
    description: 'Imagens de apoio para a seção de categorias',
    aspectRatio: 4 / 3,
    maxImages: 2,
    allowMultiple: true,
    cropSettings: {
      aspectRatio: 4 / 3,
      minWidth: 800,
      minHeight: 600,
      quality: 0.9,
    },
  },
}; 