import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HeroImageCropData } from '../types';

interface HeroImageCropProps {
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (cropData: HeroImageCropData, croppedFile: File) => void;
  imageFile: File | null;
}

export const HeroImageCrop: React.FC<HeroImageCropProps> = ({
  isOpen,
  onClose,
  onCropComplete,
  imageFile,
}) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 10,
    y: 10,
    width: 80,
    height: 60,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imageSrc, setImageSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const getCroppedImg = async (
    image: HTMLImageElement,
    crop: PixelCrop,
    fileName: string
  ): Promise<File> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], fileName, { type: 'image/jpeg' });
          resolve(file);
        }
      }, 'image/jpeg', 0.9);
    });
  };

  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current || !imageFile) return;

    try {
      const croppedFile = await getCroppedImg(
        imgRef.current,
        completedCrop,
        imageFile.name
      );

      const cropData: HeroImageCropData = {
        x: completedCrop.x,
        y: completedCrop.y,
        width: completedCrop.width,
        height: completedCrop.height,
        unit: 'px',
      };

      onCropComplete(cropData, croppedFile);
      onClose();
    } catch (error) {
      console.error('Erro ao fazer crop da imagem:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Ajustar Imagem do Hero</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {imageSrc && (
            <div className="flex justify-center">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={16 / 9} // Proporção típica para hero images
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Crop preview"
                  style={{ maxHeight: '400px' }}
                />
              </ReactCrop>
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleCropComplete}>
              Aplicar Crop
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 