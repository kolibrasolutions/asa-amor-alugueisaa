import { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import 'react-image-crop/dist/ReactCrop.css';
import { BannerImageCropProps } from '../types';

// Calculando a proporção baseada no viewport menos o header (1080px - 64px = 1016px altura)
// Para uma largura típica de 1920px, temos 1920:1016 ≈ 1.89:1
const BANNER_ASPECT_RATIO = 1920/1016;

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

export const BannerImageCrop = ({ isOpen, onClose, onCropComplete, imageFile }: BannerImageCropProps) => {
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
    setCrop(centerAspectCrop(width, height, BANNER_ASPECT_RATIO));
  }, []);

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
    const cropHeight = cropWidth / BANNER_ASPECT_RATIO;
    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;

    // Estratégia final: usar alta resolução com suavização de qualidade máxima
    // Garantir que a imagem final tenha pelo menos 1920px de largura para banners
    const minWidth = 1920;
    const aspectRatio = BANNER_ASPECT_RATIO;
    
    // Calcular dimensões finais mantendo qualidade
    const exactCropWidth = Math.round(cropWidth);
    const exactCropHeight = Math.round(cropHeight);
    
    // Se a área cropada for menor que o mínimo, escalar proporcionalmente
    let finalWidth = exactCropWidth;
    let finalHeight = exactCropHeight;
    
    if (exactCropWidth < minWidth) {
      finalWidth = minWidth;
      finalHeight = Math.round(minWidth / aspectRatio);
    }
    
    // Criar canvas com alta resolução
    const canvas = document.createElement('canvas');
    canvas.width = finalWidth;
    canvas.height = finalHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Configurações de máxima qualidade para suavização
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.globalCompositeOperation = 'source-over';
    
    // Aplicar transformações para melhor qualidade
    ctx.save();
    
    // Desenhar a imagem com alta qualidade
    ctx.drawImage(
      originalImage,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      finalWidth,
      finalHeight
    );
    
    ctx.restore();

    // Usar PNG com qualidade máxima
    canvas.toBlob((blob) => {
      if (blob) {
        console.log(`Crop finalizado: ${finalWidth}x${finalHeight}px, tamanho: ${(blob.size / 1024 / 1024).toFixed(2)}MB`);
        onCropComplete(blob);
      }
    }, 'image/png', 1.0);
  }, [completedCrop, onCropComplete, imgSrc]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto overflow-hidden">
        <DialogHeader>
          <DialogTitle>Recortar Banner</DialogTitle>
          <p className="text-sm text-gray-600">
            Proporção: {Math.round(BANNER_ASPECT_RATIO * 100) / 100}:1 (Banner)
          </p>
        </DialogHeader>
        <div className="space-y-4">
          {imgSrc && (
            <div 
              className="relative w-full mx-auto bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center"
              style={{ 
                maxWidth: '90vw',
                maxHeight: '70vh'
              }}
            >
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={BANNER_ASPECT_RATIO}
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