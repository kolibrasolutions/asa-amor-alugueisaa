-- Criar tabela de cores personalizadas
CREATE TABLE IF NOT EXISTS public.colors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL UNIQUE,
    hex_code TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Inserir cores padrão
INSERT INTO public.colors (name, value, hex_code, is_default) VALUES
    ('Branco', 'branco', '#FFFFFF', true),
    ('Off-White', 'off-white', '#F7F7F7', true),
    ('Marfim', 'marfim', '#FFFACD', true),
    ('Champagne', 'champagne', '#F7E7CE', true),
    ('Nude', 'nude', '#E8B4A0', true),
    ('Rosa Claro', 'rosa-claro', '#FFE4E1', true),
    ('Azul Claro', 'azul-claro', '#E6F3FF', true),
    ('Dourado', 'dourado', '#FFD700', true),
    ('Prateado', 'prateado', '#C0C0C0', true),
    ('Outro', 'outro', '#9CA3AF', true)
ON CONFLICT (value) DO NOTHING;

-- Habilitar RLS
ALTER TABLE public.colors ENABLE ROW LEVEL SECURITY;

-- Políticas para colors (todos podem visualizar, apenas admins podem gerenciar)
CREATE POLICY "Anyone can view colors" ON public.colors
FOR SELECT USING (true);

CREATE POLICY "Admins can manage colors" ON public.colors
FOR ALL USING (public.get_current_user_role() = 'admin');
