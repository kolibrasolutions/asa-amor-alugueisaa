import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Image as ImageIcon, Pencil } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  imageUrl?: string;
  onImageSelect: (file: File) => void;
  aspectRatio?: string;
  placeholder?: string;
}

export const ImageUploadField = ({ 
  label, 
  imageUrl, 
  onImageSelect, 
  aspectRatio = "16:9",
  placeholder = "Clique para selecionar"
}: ImageUploadFieldProps) => {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const triggerFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        onImageSelect(file);
      }
    });
    input.click();
  };

  return (
    <div>
      <Label htmlFor="image">{label} ({aspectRatio})</Label>
      <div className="mt-2">
        {imageUrl ? (
          <div className="relative aspect-video mb-4">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="bg-white"
                onClick={triggerFileSelect}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full aspect-video bg-muted rounded-lg">
            <button type="button" className="cursor-pointer" onClick={triggerFileSelect}>
              <div className="flex flex-col items-center">
                <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {placeholder}
                </span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 