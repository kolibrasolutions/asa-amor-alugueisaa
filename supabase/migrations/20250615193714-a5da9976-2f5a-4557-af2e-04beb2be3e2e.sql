
ALTER TABLE public.products
ADD COLUMN sku TEXT;

-- This index ensures that all non-null SKUs are unique,
-- but allows multiple products to have a null SKU.
-- This is useful for existing products that don't have a SKU yet.
CREATE UNIQUE INDEX products_sku_unique_non_null ON public.products (sku) WHERE sku IS NOT NULL;
