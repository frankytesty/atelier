-- Create a test user in Supabase Auth for testing login
-- This will create a user with email: ilhanersan44@hotmail.de
-- Password: test123

-- First, let's check if the user already exists
DO $$
DECLARE
    user_exists boolean;
BEGIN
    -- Check if user exists in auth.users
    SELECT EXISTS(
        SELECT 1 FROM auth.users 
        WHERE email = 'ilhanersan44@hotmail.de'
    ) INTO user_exists;
    
    IF NOT user_exists THEN
        -- Insert user directly into auth.users (for testing purposes)
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            confirmation_sent_at,
            confirmation_token,
            recovery_sent_at,
            recovery_token,
            email_change_sent_at,
            email_change,
            email_change_token_new,
            email_change_token_current,
            phone_change_sent_at,
            phone_change,
            phone_change_token,
            phone_confirmed_at,
            phone_change_confirmation_sent_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            last_sign_in_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'ilhanersan44@hotmail.de',
            crypt('test123', gen_salt('bf')), -- Hash the password
            NOW(),
            NOW(),
            '',
            NULL,
            '',
            NULL,
            '',
            '',
            '',
            NULL,
            '',
            '',
            NULL,
            NULL,
            NOW(),
            NOW(),
            '{"provider":"email","providers":["email"]}',
            '{}',
            FALSE,
            NULL
        );
        
        RAISE NOTICE 'Test user created successfully with email: ilhanersan44@hotmail.de';
    ELSE
        RAISE NOTICE 'User already exists with email: ilhanersan44@hotmail.de';
    END IF;
END $$;
