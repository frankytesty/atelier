-- Erstelle Partner-Tabelle für B2B-Benutzer
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business_type TEXT CHECK (business_type IN ('wedding_planner', 'venue', 'event_manager', 'other')),
  website TEXT,
  instagram_handle TEXT,
  years_experience INTEGER,
  average_events_per_year INTEGER,
  typical_budget_range TEXT,
  specialties TEXT[],
  portfolio_images TEXT[],
  business_address JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aktiviere Row Level Security
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- RLS Policies für Partner
CREATE POLICY "partners_select_own"
  ON public.partners FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "partners_insert_own"
  ON public.partners FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "partners_update_own"
  ON public.partners FOR UPDATE
  USING (auth.uid() = id);

-- Erstelle Brand-Kits Tabelle für White-Label Anpassungen
CREATE TABLE IF NOT EXISTS public.brand_kits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  primary_color TEXT NOT NULL,
  secondary_color TEXT,
  accent_color TEXT,
  logo_url TEXT,
  font_primary TEXT DEFAULT 'Playfair Display',
  font_secondary TEXT DEFAULT 'Inter',
  custom_css TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.brand_kits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "brand_kits_select_own"
  ON public.brand_kits FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.partners WHERE id = brand_kits.partner_id));

CREATE POLICY "brand_kits_insert_own"
  ON public.brand_kits FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM public.partners WHERE id = brand_kits.partner_id));

CREATE POLICY "brand_kits_update_own"
  ON public.brand_kits FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM public.partners WHERE id = brand_kits.partner_id));

CREATE POLICY "brand_kits_delete_own"
  ON public.brand_kits FOR DELETE
  USING (auth.uid() IN (SELECT id FROM public.partners WHERE id = brand_kits.partner_id));

-- Trigger für automatische Partner-Profil-Erstellung
CREATE OR REPLACE FUNCTION public.handle_new_partner()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Erstelle nur Partner-Profil wenn Metadaten vorhanden sind
  IF NEW.raw_user_meta_data ? 'company_name' THEN
    INSERT INTO public.partners (
      id, 
      company_name, 
      contact_person, 
      email,
      business_type,
      phone,
      website
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'company_name', ''),
      COALESCE(NEW.raw_user_meta_data ->> 'contact_person', ''),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data ->> 'business_type', 'other'),
      COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
      COALESCE(NEW.raw_user_meta_data ->> 'website', '')
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_partner();
