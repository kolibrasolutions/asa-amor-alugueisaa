-- Criar tabela hero_images
CREATE TABLE hero_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar índices
CREATE INDEX idx_hero_images_active ON hero_images(is_active);
CREATE INDEX idx_hero_images_order ON hero_images(sort_order);

-- Criar bucket para hero_images no storage
INSERT INTO storage.buckets (id, name, public) VALUES ('hero_images', 'hero_images', true);

-- Políticas de acesso para hero_images
CREATE POLICY "Hero images são públicas para leitura" ON storage.objects
    FOR SELECT USING (bucket_id = 'hero_images');

CREATE POLICY "Usuários autenticados podem fazer upload de hero images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'hero_images' AND auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar hero images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'hero_images' AND auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar hero images" ON storage.objects
    FOR DELETE USING (bucket_id = 'hero_images' AND auth.role() = 'authenticated');

-- RLS para tabela hero_images
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hero images são públicas para leitura" ON hero_images
    FOR SELECT USING (true);

CREATE POLICY "Usuários autenticados podem inserir hero images" ON hero_images
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar hero images" ON hero_images
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar hero images" ON hero_images
    FOR DELETE USING (auth.role() = 'authenticated');

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_hero_images_updated_at BEFORE UPDATE ON hero_images
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 