import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SectionImageCropData, SectionImageConfig } from '../types';

interface SectionImageCropProps {
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (cropData: SectionImageCropData, croppedFile: File) => void;
  imageFile: File | null;
  sectionConfig: SectionImageConfig;
}

export const SectionImageCrop: React.FC<SectionImageCropProps> = ({
  isOpen,
  onClose,
  onCropComplete,
  imageFile,
  sectionConfig,
}) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 10,
    y: 10,
    width: 80,
    height: 80 / sectionConfig.cropSettings.aspectRatio,
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
      }, 'image/jpeg', sectionConfig.cropSettings.quality || 0.9);
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

      const cropData: SectionImageCropData = {
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

  const getAspectRatioText = (ratio: number) => {
    if (ratio === 1) return '1:1 (Quadrado)';
    if (ratio === 16/9) return '16:9 (Widescreen)';
    if (ratio === 4/3) return '4:3 (Padrão)';
    return `${ratio.toFixed(2)}:1`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            Ajustar Imagem - {sectionConfig.name}
          </DialogTitle>
          <div className="text-sm text-gray-600">
            <p>{sectionConfig.description}</p>
            <p className="mt-1">
              <strong>Proporção:</strong> {getAspectRatioText(sectionConfig.cropSettings.aspectRatio)}
              {sectionConfig.cropSettings.minWidth && (
                <span className="ml-2">
                  <strong>Tamanho mínimo:</strong> {sectionConfig.cropSettings.minWidth}x{sectionConfig.cropSettings.minHeight}px
                </span>
              )}
            </p>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {imageSrc && (
            <div className="flex justify-center">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={sectionConfig.cropSettings.aspectRatio}
                minWidth={sectionConfig.cropSettings.minWidth}
                minHeight={sectionConfig.cropSettings.minHeight}
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