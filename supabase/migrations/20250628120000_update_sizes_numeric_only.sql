-- Atualizar tamanhos para ter apenas números
-- Remover tamanhos em letras e adicionar 56 e 58

-- Primeiro, remover os tamanhos em letras
DELETE FROM public.sizes WHERE value IN ('pp', 'p', 'm', 'g', 'gg', 'xg');

-- Adicionar os novos tamanhos 56 e 58
INSERT INTO public.sizes (name, value, sort_order, is_default) VALUES
    ('56', '56', 18, true),
    ('58', '58', 19, true)
ON CONFLICT (value) DO NOTHING;

-- Atualizar a ordem dos tamanhos existentes para ficar em sequência
UPDATE public.sizes SET sort_order = 1 WHERE value = '34';
UPDATE public.sizes SET sort_order = 2 WHERE value = '36';
UPDATE public.sizes SET sort_order = 3 WHERE value = '38';
UPDATE public.sizes SET sort_order = 4 WHERE value = '40';
UPDATE public.sizes SET sort_order = 5 WHERE value = '42';
UPDATE public.sizes SET sort_order = 6 WHERE value = '44';
UPDATE public.sizes SET sort_order = 7 WHERE value = '46';
UPDATE public.sizes SET sort_order = 8 WHERE value = '48';
UPDATE public.sizes SET sort_order = 9 WHERE value = '50';
UPDATE public.sizes SET sort_order = 10 WHERE value = '52';
UPDATE public.sizes SET sort_order = 11 WHERE value = '54';
UPDATE public.sizes SET sort_order = 12 WHERE value = '56';
UPDATE public.sizes SET sort_order = 13 WHERE value = '58';
UPDATE public.sizes SET sort_order = 14 WHERE value = 'unico';
UPDATE public.sizes SET sort_order = 15 WHERE value = 'sob-medida'; 