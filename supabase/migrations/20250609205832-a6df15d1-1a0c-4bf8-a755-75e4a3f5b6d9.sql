
-- Verificar usuarios existentes
SELECT email, created_at FROM auth.users;

-- Verificar perfiles existentes
SELECT p.*, u.email 
FROM profiles p 
LEFT JOIN auth.users u ON p.id = u.id;

-- Método más simple: Actualizar un usuario existente para hacerlo admin
-- Si ya tienes un usuario registrado, ejecuta esto cambiando el email por el tuyo:
UPDATE profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'TU_EMAIL_AQUI@ejemplo.com'
);

-- Si no tienes ningún usuario, crear uno manualmente (método simple):
-- 1. Primero crear el usuario en auth
INSERT INTO auth.users (
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@test.com',
  '$2a$10$rMqbJCQJcxGCl1bVxPpJ2uF8D5.vH5ZW8LH2f9TaJ3wqOGZKxD.HO', -- password: "123456"
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{}'
);

-- 2. Luego crear el perfil
INSERT INTO profiles (
  id,
  first_name,
  last_name,
  role
) 
SELECT 
  id,
  'Admin',
  'Test',
  'admin'
FROM auth.users 
WHERE email = 'admin@test.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';
