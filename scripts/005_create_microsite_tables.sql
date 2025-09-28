-- Erstelle Microsites Tabelle
CREATE TABLE IF NOT EXISTS public.microsites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  collection_id UUID REFERENCES public.collections(id),
  brand_kit_id UUID REFERENCES public.brand_kits(id),
  subdomain TEXT UNIQUE NOT NULL,
  custom_domain TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  hero_image_url TEXT,
  logo_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  social_links JSONB DEFAULT '{}',
  seo_settings JSONB DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  is_password_protected BOOLEAN DEFAULT false,
  password_hash TEXT,
  analytics_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Erstelle Microsite Seiten
CREATE TABLE IF NOT EXISTS public.microsite_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  microsite_id UUID NOT NULL REFERENCES public.microsites(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(microsite_id, slug)
);

-- Erstelle Microsite Besucher-Tracking
CREATE TABLE IF NOT EXISTS public.microsite_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  microsite_id UUID NOT NULL REFERENCES public.microsites(id) ON DELETE CASCADE,
  visitor_ip TEXT,
  user_agent TEXT,
  referrer TEXT,
  page_path TEXT,
  visit_duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.microsites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.microsite_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.microsite_visits ENABLE ROW LEVEL SECURITY;

-- Microsites nur für eigene Partner
CREATE POLICY "microsites_select_own" ON public.microsites FOR SELECT 
  USING (auth.uid() = partner_id OR is_published = true);
CREATE POLICY "microsites_insert_own" ON public.microsites FOR INSERT 
  WITH CHECK (auth.uid() = partner_id);
CREATE POLICY "microsites_update_own" ON public.microsites FOR UPDATE 
  USING (auth.uid() = partner_id);
CREATE POLICY "microsites_delete_own" ON public.microsites FOR DELETE 
  USING (auth.uid() = partner_id);

-- Microsite Seiten nur für Microsite-Besitzer
CREATE POLICY "microsite_pages_select_own" ON public.microsite_pages FOR SELECT 
  USING (auth.uid() IN (SELECT partner_id FROM public.microsites WHERE id = microsite_id) OR 
         microsite_id IN (SELECT id FROM public.microsites WHERE is_published = true));
CREATE POLICY "microsite_pages_insert_own" ON public.microsite_pages FOR INSERT 
  WITH CHECK (auth.uid() IN (SELECT partner_id FROM public.microsites WHERE id = microsite_id));
CREATE POLICY "microsite_pages_update_own" ON public.microsite_pages FOR UPDATE 
  USING (auth.uid() IN (SELECT partner_id FROM public.microsites WHERE id = microsite_id));
CREATE POLICY "microsite_pages_delete_own" ON public.microsite_pages FOR DELETE 
  USING (auth.uid() IN (SELECT partner_id FROM public.microsites WHERE id = microsite_id));

-- Besucher-Tracking nur für Microsite-Besitzer
CREATE POLICY "microsite_visits_select_own" ON public.microsite_visits FOR SELECT 
  USING (auth.uid() IN (SELECT partner_id FROM public.microsites WHERE id = microsite_id));
CREATE POLICY "microsite_visits_insert_all" ON public.microsite_visits FOR INSERT 
  WITH CHECK (true); -- Jeder kann Besuche tracken

-- Funktion für Subdomain-Generierung
CREATE OR REPLACE FUNCTION generate_subdomain(company_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_subdomain TEXT;
  final_subdomain TEXT;
  counter INTEGER := 1;
BEGIN
  -- Erstelle Basis-Subdomain aus Firmenname
  base_subdomain := LOWER(REGEXP_REPLACE(company_name, '[^a-zA-Z0-9]', '-', 'g'));
  base_subdomain := REGEXP_REPLACE(base_subdomain, '-+', '-', 'g');
  base_subdomain := TRIM(BOTH '-' FROM base_subdomain);
  
  -- Stelle sicher, dass Subdomain eindeutig ist
  final_subdomain := base_subdomain;
  WHILE EXISTS (SELECT 1 FROM public.microsites WHERE subdomain = final_subdomain) LOOP
    final_subdomain := base_subdomain || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_subdomain;
END;
$$ LANGUAGE plpgsql;
