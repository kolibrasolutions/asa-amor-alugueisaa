-- Criar tabela de tamanhos
CREATE TABLE IF NOT EXISTS public.sizes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL UNIQUE,
    sort_order INTEGER DEFAULT 0,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Inserir tamanhos padrão
INSERT INTO public.sizes (name, value, sort_order, is_default) VALUES
    ('PP', 'pp', 1, true),
    ('P', 'p', 2, true),
    ('M', 'm', 3, true),
    ('G', 'g', 4, true),
    ('GG', 'gg', 5, true),
    ('XG', 'xg', 6, true),
    ('34', '34', 7, true),
    ('36', '36', 8, true),
    ('38', '38', 9, true),
    ('40', '40', 10, true),
    ('42', '42', 11, true),
    ('44', '44', 12, true),
    ('46', '46', 13, true),
    ('48', '48', 14, true),
    ('50', '50', 15, true),
    ('52', '52', 16, true),
    ('54', '54', 17, true),
    ('Único', 'unico', 18, true),
    ('Sob Medida', 'sob-medida', 19, true)
ON CONFLICT (value) DO NOTHING;

-- Habilitar RLS
ALTER TABLE public.sizes ENABLE ROW LEVEL SECURITY;

-- Políticas para sizes (todos podem visualizar, apenas admins podem gerenciar)
CREATE POLICY "Anyone can view sizes" ON public.sizes
FOR SELECT USING (true);

CREATE POLICY "Admins can manage sizes" ON public.sizes
FOR ALL USING (public.get_current_user_role() = 'admin');
