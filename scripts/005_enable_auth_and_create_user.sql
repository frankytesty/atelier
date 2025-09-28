-- Enable Supabase Auth and create test user
-- This script creates a user in the auth.users table

-- First, let's create a test user in the auth system
-- Note: In production, users would sign up through the UI
-- For testing, we'll insert directly into auth.users

-- Create a test user with email and password
-- Password: test123 (hashed)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token,
  aud,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'ilhanersan44@hotmail.de',
  crypt('test123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  '',
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Also create an entry in auth.identities for the user
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  created_at,
  updated_at
) 
SELECT 
  gen_random_uuid(),
  u.id,
  jsonb_build_object('sub', u.id::text, 'email', u.email),
  'email',
  now(),
  now()
FROM auth.users u 
WHERE u.email = 'ilhanersan44@hotmail.de'
ON CONFLICT DO NOTHING;

-- Link the auth user to a partner record
INSERT INTO partners (
  id,
  email,
  contact_person,
  company_name,
  status,
  created_at,
  updated_at
)
SELECT 
  u.id,
  u.email,
  'Test Partner',
  'Test Company',
  'approved',
  now(),
  now()
FROM auth.users u 
WHERE u.email = 'ilhanersan44@hotmail.de'
ON CONFLICT (email) DO NOTHING;
