
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

export const ImageCrop = ({ isOpen, onClose, onCropComplete, imageFile }: ImageCropProps) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const aspect = 3 / 4; // Proporção fixa 3:4

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
    setCrop(centerAspectCrop(width, height, aspect));
  }, []);

  const generateCroppedImage = useCallback(async () => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Definir dimensões finais (600x800 para 3:4)
    const targetWidth = 600;
    const targetHeight = 800;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      targetWidth,
      targetHeight,
    );

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/webp',
        0.85
      );
    });
  }, [completedCrop]);

  const handleCropConfirm = async () => {
    try {
      const croppedBlob = await generateCroppedImage();
      if (croppedBlob) {
        onCropComplete(croppedBlob);
        onClose();
      }
    } catch (error) {
      console.error('Error generating cropped image:', error);
    }
  };

  const handleClose = () => {
    setImgSrc('');
    setCrop(undefined);
    setCompletedCrop(undefined);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Ajustar Imagem da Categoria</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Ajuste a área da imagem que será exibida na galeria de categorias (proporção 3:4).
          </p>
          
          {imgSrc && (
            <div className="flex flex-col items-center space-y-4">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                className="max-w-full"
              >
                <img
                  ref={imgRef}
                  alt="Crop preview"
                  src={imgSrc}
                  style={{ maxHeight: '60vh', maxWidth: '100%' }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
              
              {/* Canvas oculto para gerar a imagem final */}
              <canvas
                ref={previewCanvasRef}
                style={{ display: 'none' }}
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCropConfirm}
              disabled={!completedCrop}
            >
              Confirmar Crop
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
