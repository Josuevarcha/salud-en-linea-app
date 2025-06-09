
-- Primero, eliminar todas las políticas RLS existentes en la tabla profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON profiles;

-- Deshabilitar RLS temporalmente
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Volver a habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS simples y seguras
CREATE POLICY "Allow users to read their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Allow authenticated users to insert their profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Política especial para admins (pueden ver todos los perfiles)
CREATE POLICY "Allow admins to read all profiles" 
ON profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
