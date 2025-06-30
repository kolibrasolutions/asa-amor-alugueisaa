-- Criar bucket para imagens de banners
INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Remover políticas existentes se necessário
DROP POLICY IF EXISTS "Admins can upload banner images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update banner images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete banner images" ON storage.objects;

-- Criar políticas para storage
CREATE POLICY "Admins can upload banner images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'banners' AND public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can update banner images" ON storage.objects 
FOR UPDATE USING (bucket_id = 'banners' AND public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can delete banner images" ON storage.objects 
FOR DELETE USING (bucket_id = 'banners' AND public.get_current_user_role() = 'admin'); 