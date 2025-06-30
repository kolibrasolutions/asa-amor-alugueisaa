-- Criar tabela banners
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Criar política para visualização pública
CREATE POLICY "Anyone can view banners" ON public.banners
FOR SELECT USING (true);

-- Criar política para administradores
CREATE POLICY "Admins can manage banners" ON public.banners
FOR ALL USING (public.get_current_user_role() = 'admin');

-- Inserir banner inicial
INSERT INTO public.banners (image_url, title, subtitle, sort_order)
VALUES ('/casal-noivos.png', 'Noivas Cirlene', 'Vestidos & Ternos', 0); 