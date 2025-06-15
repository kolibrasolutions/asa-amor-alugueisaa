
import { useState, useCallback, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ImageCrop } from '@/components/admin/ImageCrop';
import { UploadCloud, Trash2 } from 'lucide-react';
import { ProductFormData } from './productSchema';
import { useToast } from '@/hooks/use-toast';

export const ProductImageUpload = () => {
  const { watch, setValue } = useFormContext<ProductFormData>();
  const images = watch('images') || [];
  const { toast } = useToast();

  const [isCropOpen, setIsCropOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      if (images.length >= 5) {
        toast({ title: 'Limite de imagens atingido', description: 'Você pode adicionar no máximo 5 imagens.', variant: 'destructive' });
        return;
      }
      const file = event.target.files[0];
      setImageToCrop(file);
      setIsCropOpen(true);
      event.target.value = '';
    }
  };

  const onCropComplete = (croppedImageBlob: Blob) => {
    setValue('images', [...images, croppedImageBlob], { shouldDirty: true, shouldValidate: true });
    setIsCropOpen(false);
    setImageToCrop(null);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setValue('images', newImages, { shouldDirty: true });
  };
  
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const newImages = [...images];
      const draggedItemContent = newImages.splice(dragItem.current, 1)[0];
      newImages.splice(dragOverItem.current, 0, draggedItemContent);
      setValue('images', newImages, { shouldDirty: true });
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const getPreviewUrl = (image: string | Blob) => {
    return typeof image === 'string' ? image : URL.createObjectURL(image);
  };

  return (
    <div>
      <Label>Imagens do Produto (até 5, arraste para reordenar)</Label>
      <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group aspect-[3/4] border rounded-md cursor-grab"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
          >
            <img src={getPreviewUrl(image)} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md pointer-events-none" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                onClick={() => handleRemoveImage(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {images.length < 5 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[3/4] border-2 border-dashed rounded-md flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            <UploadCloud className="h-8 w-8" />
            <span className="mt-2 text-sm text-center">Adicionar Imagem</span>
          </button>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      {imageToCrop && (
        <ImageCrop
          isOpen={isCropOpen}
          onClose={() => {
            setIsCropOpen(false);
            setImageToCrop(null);
          }}
          onCropComplete={onCropComplete}
          imageFile={imageToCrop}
        />
      )}
    </div>
  );
};
