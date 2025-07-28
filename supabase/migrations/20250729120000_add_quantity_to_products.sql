-- Adicionar campo quantity à tabela products
ALTER TABLE public.products
ADD COLUMN quantity INTEGER DEFAULT 1 NOT NULL;

-- Atualizar produtos existentes que não são variações para ter quantity 1
UPDATE public.products 
SET quantity = 1 
WHERE is_variant = false OR is_variant IS NULL;

-- Para produtos que são variações, manter quantity 1 também como padrão
UPDATE public.products 
SET quantity = 1 
WHERE is_variant = true;

-- Adicionar comentário para documentar o campo
COMMENT ON COLUMN public.products.quantity IS 'Quantidade disponível em estoque para este produto/variação'; 