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

export const ImageCrop = ({ isOpen, onClose, onCropComplete, imageFile, aspectRatio = 21/9 }: ImageCropProps) => {
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

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Usar as dimensões naturais da imagem
    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Calcular as dimensões do crop mantendo a proporção
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = cropWidth / aspectRatio; // Forçar a proporção correta

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    ctx.imageSmoothingQuality = 'high';

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    canvas.toBlob((blob) => {
      if (blob) {
        onCropComplete(blob);
      }
    }, 'image/png', 1);
  }, [completedCrop, onCropComplete, aspectRatio]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto overflow-hidden">
        <DialogHeader>
          <DialogTitle>Recortar Imagem</DialogTitle>
          <p className="text-sm text-gray-600">
            Proporção: {aspectRatio.toFixed(2)}:1 (Banner)
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
