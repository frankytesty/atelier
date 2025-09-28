-- Erstelle Bestellungen Tabelle
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  collection_id UUID REFERENCES public.collections(id),
  order_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'confirmed', 'in_production', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  client_name TEXT,
  client_email TEXT,
  client_phone TEXT,
  event_date DATE,
  delivery_address JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Erstelle Bestellpositionen
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  variant_id UUID REFERENCES public.product_variants(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  personalization_data JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Erstelle Angebote Tabelle
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  collection_id UUID REFERENCES public.collections(id),
  quote_number TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  event_date DATE,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired')),
  valid_until DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Bestellungen nur für eigene Partner
CREATE POLICY "orders_select_own" ON public.orders FOR SELECT 
  USING (auth.uid() = partner_id);
CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT 
  WITH CHECK (auth.uid() = partner_id);
CREATE POLICY "orders_update_own" ON public.orders FOR UPDATE 
  USING (auth.uid() = partner_id);
CREATE POLICY "orders_delete_own" ON public.orders FOR DELETE 
  USING (auth.uid() = partner_id);

-- Bestellpositionen nur für Bestellungsbesitzer
CREATE POLICY "order_items_select_own" ON public.order_items FOR SELECT 
  USING (auth.uid() IN (SELECT partner_id FROM public.orders WHERE id = order_id));
CREATE POLICY "order_items_insert_own" ON public.order_items FOR INSERT 
  WITH CHECK (auth.uid() IN (SELECT partner_id FROM public.orders WHERE id = order_id));
CREATE POLICY "order_items_update_own" ON public.order_items FOR UPDATE 
  USING (auth.uid() IN (SELECT partner_id FROM public.orders WHERE id = order_id));
CREATE POLICY "order_items_delete_own" ON public.order_items FOR DELETE 
  USING (auth.uid() IN (SELECT partner_id FROM public.orders WHERE id = order_id));

-- Angebote nur für eigene Partner
CREATE POLICY "quotes_select_own" ON public.quotes FOR SELECT 
  USING (auth.uid() = partner_id);
CREATE POLICY "quotes_insert_own" ON public.quotes FOR INSERT 
  WITH CHECK (auth.uid() = partner_id);
CREATE POLICY "quotes_update_own" ON public.quotes FOR UPDATE 
  USING (auth.uid() = partner_id);
CREATE POLICY "quotes_delete_own" ON public.quotes FOR DELETE 
  USING (auth.uid() = partner_id);

-- Funktion für automatische Bestellnummer-Generierung
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
BEGIN
  SELECT 'AL-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0') INTO new_number;
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Sequenz für Bestellnummern
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Funktion für automatische Angebotsnummer-Generierung
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
BEGIN
  SELECT 'ALQ-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('quote_number_seq')::TEXT, 6, '0') INTO new_number;
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Sequenz für Angebotsnummern
CREATE SEQUENCE IF NOT EXISTS quote_number_seq START 1;
