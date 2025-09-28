-- Erstelle Produktkategorien
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES public.categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Erstelle Produkte
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  images TEXT[] DEFAULT '{}',
  materials TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  personalization_options JSONB DEFAULT '{}',
  minimum_order_quantity INTEGER DEFAULT 1,
  lead_time_days INTEGER DEFAULT 14,
  is_customizable BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Erstelle Produktvarianten
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  color TEXT,
  size TEXT,
  material TEXT,
  additional_options JSONB DEFAULT '{}',
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Erstelle Kollektionen
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Erstelle Kollektion-Produkt Verknüpfungen
CREATE TABLE IF NOT EXISTS public.collection_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  personalization_data JSONB DEFAULT '{}',
  notes TEXT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collection_id, product_id)
);

-- RLS Policies
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_products ENABLE ROW LEVEL SECURITY;

-- Kategorien und Produkte sind für alle Partner sichtbar
CREATE POLICY "categories_select_all" ON public.categories FOR SELECT USING (true);
CREATE POLICY "products_select_all" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "product_variants_select_all" ON public.product_variants FOR SELECT USING (is_active = true);

-- Kollektionen nur für eigene Partner
CREATE POLICY "collections_select_own" ON public.collections FOR SELECT 
  USING (auth.uid() = partner_id OR is_public = true);
CREATE POLICY "collections_insert_own" ON public.collections FOR INSERT 
  WITH CHECK (auth.uid() = partner_id);
CREATE POLICY "collections_update_own" ON public.collections FOR UPDATE 
  USING (auth.uid() = partner_id);
CREATE POLICY "collections_delete_own" ON public.collections FOR DELETE 
  USING (auth.uid() = partner_id);

-- Kollektion-Produkte nur für Kollektionsbesitzer
CREATE POLICY "collection_products_select_own" ON public.collection_products FOR SELECT 
  USING (auth.uid() IN (SELECT partner_id FROM public.collections WHERE id = collection_id));
CREATE POLICY "collection_products_insert_own" ON public.collection_products FOR INSERT 
  WITH CHECK (auth.uid() IN (SELECT partner_id FROM public.collections WHERE id = collection_id));
CREATE POLICY "collection_products_update_own" ON public.collection_products FOR UPDATE 
  USING (auth.uid() IN (SELECT partner_id FROM public.collections WHERE id = collection_id));
CREATE POLICY "collection_products_delete_own" ON public.collection_products FOR DELETE 
  USING (auth.uid() IN (SELECT partner_id FROM public.collections WHERE id = collection_id));
