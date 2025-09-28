-- Check if the partner user exists in the database
SELECT 
    id,
    email,
    contact_person,
    company_name,
    status,
    created_at
FROM partners 
WHERE email = 'ilhanersan44@hotmail.de';
