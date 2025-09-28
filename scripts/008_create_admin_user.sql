-- Admin-Benutzer erstellen
-- Ersetze 'DEINE-EMAIL@example.com' mit deiner gewünschten Admin-E-Mail

-- 1. Zuerst einen normalen Benutzer in auth.users erstellen (falls noch nicht vorhanden)
-- Du musst das über die Supabase Auth UI machen oder über die Anmeldung

-- 2. Dann den Admin-Benutzer in admin_users erstellen
-- Ersetze 'DEINE-USER-ID' mit der tatsächlichen User-ID aus auth.users

INSERT INTO admin_users (
  id,
  email,
  full_name,
  role,
  permissions,
  is_active,
  created_at,
  updated_at
) VALUES (
  'DEINE-USER-ID', -- Ersetze mit der echten User-ID
  'DEINE-EMAIL@example.com', -- Ersetze mit deiner E-Mail
  'Admin Benutzer', -- Dein Name
  'super_admin', -- Rolle: super_admin, admin, oder moderator
  ARRAY['all'], -- Berechtigungen: ['all'] für Super Admin
  true, -- Aktiv
  NOW(),
  NOW()
);

-- 3. Prüfen ob der Admin-Benutzer erstellt wurde
SELECT * FROM admin_users WHERE email = 'DEINE-EMAIL@example.com';
