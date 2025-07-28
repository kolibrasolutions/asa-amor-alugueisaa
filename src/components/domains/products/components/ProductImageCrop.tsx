import { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import 'react-image-crop/dist/ReactCrop.css';
import { ProductImageCropProps } from '../types';

// Proporção 4:5 como usado no ProductCard
const PRODUCT_ASPECT_RATIO = 4/5;

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

export const ProductImageCrop = ({ isOpen, onClose, onCropComplete, imageFile }: ProductImageCropProps) => {
  const isMobile = useIsMobile();
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
    setCrop(centerAspectCrop(width, height, PRODUCT_ASPECT_RATIO));
  }, []);

  const cropImage = useCallback(async () => {
    if (!imgRef.current || !completedCrop) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = cropWidth / PRODUCT_ASPECT_RATIO;

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
  }, [completedCrop, onCropComplete]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isMobile ? 'max-w-[98vw] max-h-[95vh] w-[98vw] p-3' : 'max-w-[95vw] max-h-[95vh] w-auto'} overflow-hidden flex flex-col`}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className={isMobile ? 'text-base' : ''}>Recortar Imagem do Produto</DialogTitle>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
            Proporção: 4:5 (Produto)
          </p>
        </DialogHeader>
        <div className={`${isMobile ? 'space-y-2 flex-1 flex flex-col min-h-0' : 'space-y-4'}`}>
          {imgSrc && (
            <div 
              className={`relative w-full mx-auto bg-gray-100 rounded overflow-hidden flex items-center justify-center ${isMobile ? 'flex-1 min-h-0' : 'min-h-[400px]'}`}
            >
              <div className="w-full h-full flex items-center justify-center p-2">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={PRODUCT_ASPECT_RATIO}
                  className="max-w-full max-h-full"
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    onLoad={onImageLoad}
                    style={{ 
                      maxWidth: '100%',
                      maxHeight: '100%',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain'
                    }}
                  />
                </ReactCrop>
              </div>
            </div>
          )}
          <div className={`flex ${isMobile ? 'justify-center space-x-3 py-2' : 'justify-end space-x-2'} flex-shrink-0`}>
            <Button 
              variant="outline" 
              onClick={onClose}
              className={isMobile ? 'flex-1 max-w-[120px] h-10' : ''}
              size={isMobile ? 'sm' : 'default'}
            >
              Cancelar
            </Button>
            <Button 
              onClick={cropImage}
              className={isMobile ? 'flex-1 max-w-[120px] h-10' : ''}
              size={isMobile ? 'sm' : 'default'}
            >
              Concluir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 