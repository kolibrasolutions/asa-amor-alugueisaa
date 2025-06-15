
-- Adicionar campos image_url e sort_order à tabela categories
ALTER TABLE public.categories 
ADD COLUMN image_url TEXT,
ADD COLUMN sort_order INTEGER DEFAULT 0;

-- Atualizar categorias existentes com ordem padrão baseada no nome usando subconsulta
WITH numbered_categories AS (
  SELECT id, row_number() OVER (ORDER BY name) as new_order
  FROM public.categories
)
UPDATE public.categories 
SET sort_order = numbered_categories.new_order
FROM numbered_categories
WHERE categories.id = numbered_categories.id;
