-- Erstelle Indizes für bessere Performance
CREATE INDEX IF NOT EXISTS idx_partners_status ON public.partners(status);
CREATE INDEX IF NOT EXISTS idx_partners_business_type ON public.partners(business_type);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_collections_partner ON public.collections(partner_id);
CREATE INDEX IF NOT EXISTS idx_collections_public ON public.collections(is_public) WHERE is_public = true;

CREATE INDEX IF NOT EXISTS idx_orders_partner ON public.orders(partner_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at);

CREATE INDEX IF NOT EXISTS idx_quotes_partner ON public.quotes(partner_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created ON public.quotes(created_at);

CREATE INDEX IF NOT EXISTS idx_microsites_partner ON public.microsites(partner_id);
CREATE INDEX IF NOT EXISTS idx_microsites_subdomain ON public.microsites(subdomain);
CREATE INDEX IF NOT EXISTS idx_microsites_published ON public.microsites(is_published) WHERE is_published = true;

CREATE INDEX IF NOT EXISTS idx_microsite_visits_site ON public.microsite_visits(microsite_id);
CREATE INDEX IF NOT EXISTS idx_microsite_visits_created ON public.microsite_visits(created_at);

-- Funktion für Volltext-Suche in Produkten
CREATE OR REPLACE FUNCTION search_products(search_term TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  base_price DECIMAL,
  images TEXT[],
  category_name TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.description,
    p.base_price,
    p.images,
    c.name as category_name,
    ts_rank(
      to_tsvector('german', p.name || ' ' || COALESCE(p.description, '') || ' ' || array_to_string(p.tags, ' ')),
      plainto_tsquery('german', search_term)
    ) as rank
  FROM public.products p
  LEFT JOIN public.categories c ON p.category_id = c.id
  WHERE 
    p.is_active = true
    AND (
      to_tsvector('german', p.name || ' ' || COALESCE(p.description, '') || ' ' || array_to_string(p.tags, ' '))
      @@ plainto_tsquery('german', search_term)
    )
  ORDER BY rank DESC, p.is_featured DESC, p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Funktion für Partner-Statistiken
CREATE OR REPLACE FUNCTION get_partner_stats(partner_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'collections_count', (
      SELECT COUNT(*) FROM public.collections WHERE partner_id = partner_uuid
    ),
    'orders_count', (
      SELECT COUNT(*) FROM public.orders WHERE partner_id = partner_uuid
    ),
    'quotes_count', (
      SELECT COUNT(*) FROM public.quotes WHERE partner_id = partner_uuid
    ),
    'microsites_count', (
      SELECT COUNT(*) FROM public.microsites WHERE partner_id = partner_uuid
    ),
    'total_revenue', (
      SELECT COALESCE(SUM(total_amount), 0) 
      FROM public.orders 
      WHERE partner_id = partner_uuid AND status = 'delivered'
    ),
    'pending_orders', (
      SELECT COUNT(*) 
      FROM public.orders 
      WHERE partner_id = partner_uuid AND status IN ('pending', 'confirmed', 'in_production')
    ),
    'active_quotes', (
      SELECT COUNT(*) 
      FROM public.quotes 
      WHERE partner_id = partner_uuid AND status IN ('sent', 'viewed')
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger für automatische Zeitstempel-Updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger für alle Tabellen mit updated_at
CREATE TRIGGER update_partners_updated_at 
  BEFORE UPDATE ON public.partners 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON public.products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at 
  BEFORE UPDATE ON public.collections 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON public.orders 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at 
  BEFORE UPDATE ON public.quotes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_microsites_updated_at 
  BEFORE UPDATE ON public.microsites 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_microsite_pages_updated_at 
  BEFORE UPDATE ON public.microsite_pages 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_kits_updated_at 
  BEFORE UPDATE ON public.brand_kits 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
