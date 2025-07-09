import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
  const isClientGallery = sectionConfig.id === 'client_gallery';
  
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });
  
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imageSrc, setImageSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        // Reset crop when new image is loaded
        setCrop({
          unit: '%',
          x: 10,
          y: 10,
          width: 80,
          height: isClientGallery ? 80 : 80 / sectionConfig.cropSettings.aspectRatio,
        });
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile, isClientGallery, sectionConfig.cropSettings.aspectRatio]);

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

    // Define o tamanho do canvas com base na resolução real da imagem original
    // para preservar a qualidade máxima.
    const canvasWidth = crop.width * scaleX;
    const canvasHeight = crop.height * scaleY;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      canvasWidth,
      canvasHeight,
      0,
      0,
      canvasWidth,
      canvasHeight
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], fileName, { type: 'image/jpeg' });
          resolve(file);
        }
      }, 'image/jpeg', sectionConfig.cropSettings.quality || 0.95);
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
    } catch (error) {
      console.error('Erro ao fazer crop da imagem:', error);
    }
  };

  const getAspectRatioText = () => {
    if (isClientGallery) return '1:1 (Quadrado)';
    return `${sectionConfig.cropSettings.aspectRatio}:1`;
  };

  const getMinSizeText = () => {
    if (!sectionConfig.cropSettings.minWidth) return '';
    return `${sectionConfig.cropSettings.minWidth}x${sectionConfig.cropSettings.minHeight}px`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            Ajustar Imagem - {sectionConfig.name}
          </DialogTitle>
          <DialogDescription>
            {sectionConfig.description}
          </DialogDescription>
          <div className="mt-1 text-sm text-muted-foreground">
            <strong>Proporção:</strong> {getAspectRatioText()}
            {sectionConfig.cropSettings.minWidth && (
              <span className="ml-2">
                <strong>Tamanho mínimo:</strong> {getMinSizeText()}
              </span>
            )}
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {imageSrc && (
            <div className="flex justify-center">
              <div className="border border-gray-200 p-4 rounded-lg">
                <ReactCrop
                  crop={crop}
                  onChange={setCrop}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={isClientGallery ? 1 : sectionConfig.cropSettings.aspectRatio}
                  minWidth={100}
                  minHeight={isClientGallery ? 100 : 100 / sectionConfig.cropSettings.aspectRatio}
                  ruleOfThirds={true}
                  keepSelection={true}
                >
                  <img
                    ref={imgRef}
                    src={imageSrc}
                    alt="Prévia do recorte da imagem"
                    style={{ 
                      maxWidth: '600px', 
                      maxHeight: '400px', 
                      width: 'auto', 
                      height: 'auto'
                    }}
                  />
                </ReactCrop>
              </div>
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