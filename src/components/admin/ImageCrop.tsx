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

// Usando proporção 4:5 para corresponder ao container do card
const ASPECT_RATIO = 4 / 5;

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
): Crop {
  const height = mediaHeight * 0.8; // 80% da altura
  const width = height * aspect; // Largura proporcional

  return {
    unit: '%',
    width: (width / mediaWidth) * 100,
    height: (height / mediaHeight) * 100,
    x: (mediaWidth - width) / 2 / mediaWidth * 100,
    y: (mediaHeight - height) / 2 / mediaHeight * 100
  } as Crop;
}

export const ImageCrop = ({ isOpen, onClose, onCropComplete, imageFile }: ImageCropProps) => {
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
    const crop = centerAspectCrop(width, height, ASPECT_RATIO);
    setCrop(crop);
  }, []);

  const cropImage = useCallback(async () => {
    if (!imgRef.current || !completedCrop) return;

    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Criar um canvas temporário com as dimensões exatas da imagem
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = image.naturalWidth;
    tempCanvas.height = image.naturalHeight;

    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // Desenhar a imagem original no canvas temporário
    tempCtx.drawImage(image, 0, 0);

    // Calcular as dimensões do crop em pixels
    const cropX = Math.round(completedCrop.x * scaleX);
    const cropY = Math.round(completedCrop.y * scaleY);
    const cropWidth = Math.round(completedCrop.width * scaleX);
    const cropHeight = Math.round(completedCrop.height * scaleY);

    // Criar o canvas final com as dimensões do crop
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = cropWidth;
    finalCanvas.height = cropHeight;

    const finalCtx = finalCanvas.getContext('2d');
    if (!finalCtx) return;

    // Copiar a área selecionada para o canvas final
    finalCtx.drawImage(
      tempCanvas,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    // Converter para blob
    finalCanvas.toBlob(
      (blob) => {
        if (blob) {
          onCropComplete(blob);
        }
      },
      'image/jpeg',
      1
    );
  }, [completedCrop, onCropComplete]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-auto overflow-y-auto max-h-[95vh]">
        <DialogHeader>
          <DialogTitle>Recortar Imagem</DialogTitle>
          <p className="text-sm text-gray-600">
            Proporção: 4:5 (formato retrato para produtos)
          </p>
        </DialogHeader>
        <div className="space-y-4">
          {imgSrc && (
            <div className="relative mx-auto bg-gray-100 rounded-lg overflow-hidden flex justify-center">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={ASPECT_RATIO}
                className="max-h-[70vh]"
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  onLoad={onImageLoad}
                  style={{ 
                    maxHeight: '70vh',
                    width: 'auto',
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
