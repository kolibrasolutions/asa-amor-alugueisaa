-- Adicionar campos para suporte a variações de produtos
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS parent_product_id UUID REFERENCES public.products(id) ON DELETE CASCADE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_variant BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS variant_type TEXT DEFAULT 'size';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS base_sku TEXT;

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_products_parent_product_id ON public.products(parent_product_id);
CREATE INDEX IF NOT EXISTS idx_products_is_variant ON public.products(is_variant);
CREATE INDEX IF NOT EXISTS idx_products_base_sku ON public.products(base_sku);

-- Função para gerar SKU de variação
CREATE OR REPLACE FUNCTION generate_variant_sku(base_sku_param TEXT, size_param TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN base_sku_param || '-' || LOWER(REPLACE(size_param, ' ', '_'));
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar SKU automaticamente para variações
CREATE OR REPLACE FUNCTION set_variant_sku()
RETURNS TRIGGER AS $$
BEGIN
  -- Se é uma variação e tem parent_product_id
  IF NEW.is_variant = true AND NEW.parent_product_id IS NOT NULL THEN
    -- Buscar o base_sku do produto pai
    IF NEW.base_sku IS NULL THEN
      SELECT base_sku INTO NEW.base_sku 
      FROM public.products 
      WHERE id = NEW.parent_product_id;
    END IF;
    
    -- Gerar SKU da variação se não foi fornecido
    IF NEW.sku IS NULL AND NEW.base_sku IS NOT NULL AND NEW.size IS NOT NULL THEN
      NEW.sku := generate_variant_sku(NEW.base_sku, NEW.size);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger
DROP TRIGGER IF EXISTS trigger_set_variant_sku ON public.products;
CREATE TRIGGER trigger_set_variant_sku
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION set_variant_sku();

-- Atualizar produtos existentes para ter base_sku igual ao sku atual
UPDATE public.products 
SET base_sku = sku, is_variant = false 
WHERE base_sku IS NULL AND sku IS NOT NULL;

-- Comentários para documentação
COMMENT ON COLUMN public.products.parent_product_id IS 'ID do produto pai para variações';
COMMENT ON COLUMN public.products.is_variant IS 'Indica se este produto é uma variação de outro';
COMMENT ON COLUMN public.products.variant_type IS 'Tipo de variação (size, color, etc)';
COMMENT ON COLUMN public.products.base_sku IS 'SKU base compartilhado entre variações do mesmo produto'; 