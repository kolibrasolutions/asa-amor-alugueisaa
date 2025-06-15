
-- Criar bucket para imagens de categorias
INSERT INTO storage.buckets (id, name, public)
VALUES ('category-images', 'category-images', true);

-- Permitir que todos possam ver as imagens (público)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'category-images');

-- Permitir que usuários autenticados possam fazer upload
CREATE POLICY "Authenticated users can upload category images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'category-images' AND auth.role() = 'authenticated');

-- Permitir que usuários autenticados possam atualizar suas imagens
CREATE POLICY "Authenticated users can update category images" ON storage.objects FOR UPDATE USING (bucket_id = 'category-images' AND auth.role() = 'authenticated');

-- Permitir que usuários autenticados possam deletar imagens
CREATE POLICY "Authenticated users can delete category images" ON storage.objects FOR DELETE USING (bucket_id = 'category-images' AND auth.role() = 'authenticated');
