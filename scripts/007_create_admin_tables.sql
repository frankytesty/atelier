-- Erstelle Admin-Benutzer Tabelle
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),
  permissions TEXT[] DEFAULT ARRAY['partner_management', 'system_settings'],
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aktiviere Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies für Admin-Benutzer
CREATE POLICY "admin_users_select_all"
  ON public.admin_users FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.admin_users WHERE is_active = true));

CREATE POLICY "admin_users_insert_super_admin"
  ON public.admin_users FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM public.admin_users WHERE role = 'super_admin'));

CREATE POLICY "admin_users_update_super_admin"
  ON public.admin_users FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM public.admin_users WHERE role = 'super_admin'));

-- Erstelle Audit-Log Tabelle für Admin-Aktionen
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index für bessere Performance
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_id ON public.admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON public.admin_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_resource ON public.admin_audit_logs(resource_type, resource_id);

-- Aktiviere Row Level Security
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy für Audit-Logs
CREATE POLICY "admin_audit_logs_select_all"
  ON public.admin_audit_logs FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.admin_users WHERE is_active = true));

CREATE POLICY "admin_audit_logs_insert_admin"
  ON public.admin_audit_logs FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM public.admin_users WHERE is_active = true));

-- Erweitere Partner-Policies für Admin-Zugriff
CREATE POLICY "partners_select_admin"
  ON public.partners FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.admin_users WHERE is_active = true));

CREATE POLICY "partners_update_admin"
  ON public.partners FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM public.admin_users WHERE is_active = true));

-- Funktion zum Erstellen von Audit-Log-Einträgen
CREATE OR REPLACE FUNCTION public.create_audit_log(
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id UUID DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.admin_audit_logs (
    admin_id,
    action,
    resource_type,
    resource_id,
    old_values,
    new_values
  )
  VALUES (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id,
    p_old_values,
    p_new_values
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- Erstelle ersten Super-Admin (manuell über SQL oder Seed-Script)
-- INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at)
-- VALUES (gen_random_uuid(), 'admin@atelier-luminform.com', NOW(), NOW(), NOW());

-- INSERT INTO public.admin_users (id, email, full_name, role, permissions)
-- VALUES (
--   (SELECT id FROM auth.users WHERE email = 'admin@atelier-luminform.com'),
--   'admin@atelier-luminform.com',
--   'System Administrator',
--   'super_admin',
--   ARRAY['partner_management', 'system_settings', 'user_management', 'audit_logs']
-- );
