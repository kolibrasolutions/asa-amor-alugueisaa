import { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropProps {
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageBlob: Blob) => void;
  imageFile: File;
  aspectRatio?: number;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  // Forçar crop quadrado quando aspectRatio for 1
  if (aspect === 1) {
    const size = Math.min(mediaWidth, mediaHeight) * 0.9;
    return {
      unit: 'px' as const,
      x: (mediaWidth - size) / 2,
      y: (mediaHeight - size) / 2,
      width: size,
      height: size,
    };
  }
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export const ImageCrop = ({ isOpen, onClose, onCropComplete, imageFile, aspectRatio = 3/4 }: ImageCropProps) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageFile && isOpen) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '');
      });
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile, isOpen]);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspectRatio));
  }, [aspectRatio]);

  const cropImage = useCallback(async () => {
    if (!imgRef.current || !completedCrop) return;

    // Carregar a imagem original em alta resolução
    const originalImage = new window.Image();
    originalImage.src = imgSrc;
    await new Promise((resolve) => {
      if (originalImage.complete) return resolve(true);
      originalImage.onload = resolve;
    });

    // Usar as dimensões reais da imagem original
    const naturalWidth = originalImage.naturalWidth;
    const naturalHeight = originalImage.naturalHeight;

    // Calcular o crop em relação à imagem original
    const scaleX = naturalWidth / (imgRef.current.width || 1);
    const scaleY = naturalHeight / (imgRef.current.height || 1);

    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = cropWidth / aspectRatio;
    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(cropWidth);
    canvas.height = Math.round(cropHeight);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      originalImage,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        onCropComplete(blob);
      }
    }, 'image/png', 1);
  }, [completedCrop, onCropComplete, aspectRatio, imgSrc]);

  const getProportionText = () => {
    if (aspectRatio === 1) return "1:1";
    if (aspectRatio === 3/4) return "3:4";
    if (aspectRatio === 21/9) return "21:9";
    if (Math.abs(aspectRatio - 4/3) < 0.01) return "4:3";
    return `${aspectRatio.toFixed(2)}:1`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Recortar Imagem</DialogTitle>
          <p className="text-sm text-gray-600">
            Proporção: {getProportionText()}
          </p>
        </DialogHeader>
        <div className="space-y-4">
          {imgSrc && (
            <div 
              className="relative w-full mx-auto bg-gray-100 rounded-lg overflow-hidden"
              style={{ 
                aspectRatio: aspectRatio,
                maxWidth: '800px',
                maxHeight: '600px'
              }}
            >
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspectRatio}
                className="w-full h-full"
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  onLoad={onImageLoad}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain'
                  }}
                />
              </ReactCrop>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={cropImage}>
              Concluir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 