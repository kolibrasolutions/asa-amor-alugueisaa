import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BannerFormProps, BannerFormData } from '../types';
import { ImageUploadField } from '@/components/shared/forms/ImageUploadField';
import { BannerImageCrop } from './BannerImageCrop';

export const BannerForm = ({ banner, onSubmit, onCancel, isLoading }: BannerFormProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setIsCropOpen(true);
  };

  const handleCropComplete = (croppedImage: Blob) => {
    const file = new File([croppedImage], 'banner.png', { type: 'image/png' });
    setImageFile(file);
    setIsCropOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData: BannerFormData = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      subtitle: (form.elements.namedItem('subtitle') as HTMLInputElement).value,
      image_file: imageFile || undefined
    };

    onSubmit(formData);
  };

  const imageUrl = imageFile ? URL.createObjectURL(imageFile) : banner?.image_url;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ImageUploadField
          label="Imagem"
          imageUrl={imageUrl}
          onImageSelect={handleImageSelect}
          aspectRatio="1.89:1"
        />
        
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            name="title"
            defaultValue={banner?.title}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="subtitle">Subtítulo</Label>
          <Input
            id="subtitle"
            name="subtitle"
            defaultValue={banner?.subtitle}
            required
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading
              ? 'Salvando...'
              : banner
              ? 'Atualizar'
              : 'Criar'}
          </Button>
        </div>
      </form>

      {imageFile && (
        <BannerImageCrop
          isOpen={isCropOpen}
          onClose={() => setIsCropOpen(false)}
          onCropComplete={handleCropComplete}
          imageFile={imageFile}
        />
      )}
    </>
  );
};