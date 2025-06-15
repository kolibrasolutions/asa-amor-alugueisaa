
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UploadedImage {
  url: string;
  path: string;
}

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File | Blob, folder: string = 'categories'): Promise<UploadedImage | null> => {
    try {
      setUploading(true);

      // Se for um File, validar tipo
      if (file instanceof File && !file.type.startsWith('image/')) {
        toast({
          title: "Erro de upload",
          description: "Por favor, selecione apenas arquivos de imagem.",
          variant: "destructive",
        });
        return null;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erro de upload",
          description: "A imagem deve ter no máximo 5MB.",
          variant: "destructive",
        });
        return null;
      }

      // Gerar nome único para o arquivo
      const fileExt = file instanceof File ? file.name.split('.').pop() : 'webp';
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      console.log('Uploading file:', fileName);

      // Upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from('category-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        toast({
          title: "Erro de upload",
          description: error.message || "Erro ao fazer upload da imagem.",
          variant: "destructive",
        });
        return null;
      }

      // Obter URL pública da imagem
      const { data: { publicUrl } } = supabase.storage
        .from('category-images')
        .getPublicUrl(data.path);

      console.log('Upload successful:', publicUrl);

      toast({
        title: "Upload realizado",
        description: "Imagem enviada com sucesso!",
      });

      return {
        url: publicUrl,
        path: data.path
      };

    } catch (error) {
      console.error('Unexpected upload error:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado durante o upload.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (path: string): Promise<boolean> => {
    try {
      console.log('Deleting image:', path);

      const { error } = await supabase.storage
        .from('category-images')
        .remove([path]);

      if (error) {
        console.error('Delete error:', error);
        return false;
      }

      console.log('Image deleted successfully');
      return true;
    } catch (error) {
      console.error('Unexpected delete error:', error);
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading
  };
};
